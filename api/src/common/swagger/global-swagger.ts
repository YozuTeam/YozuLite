import type { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type {
  OpenAPIObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/* =========================
 * Schémas réutilisables
 * ========================= */

const isoDateSchema: SchemaObject = {
  type: 'string',
  format: 'date-time',
  example: '2025-08-13T12:34:56.000Z',
};

const OkResponseSchema: SchemaObject = {
  type: 'object',
  properties: { ok: { type: 'boolean', example: true } },
  required: ['ok'],
};

const DeletedCounterResponseSchema: SchemaObject = {
  type: 'object',
  properties: { deleted: { type: 'number', example: 1, minimum: 0 } },
  required: ['deleted'],
};

/* =========================
 * Schémas d’erreurs standardisés
 * ========================= */

const UnauthorizedResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Requête non authentifiée ou access token absent/illégal.',
  properties: {
    statusCode: { type: 'integer', example: 401 },
    error: { type: 'string', example: 'Unauthorized' },
    message: {
      type: 'string',
      example: 'missing or invalid access token',
    },
  },
  required: ['statusCode', 'error', 'message'],
};

const ForbiddenResponseSchema: SchemaObject = {
  type: 'object',
  description:
    "Accès refusé pour l'utilisateur courant (ex: rôle inadapté, ressource non détenue).",
  properties: {
    statusCode: { type: 'integer', example: 403 },
    error: { type: 'string', example: 'Forbidden' },
    message: {
      type: 'string',
      example: 'action not allowed for current role',
    },
  },
  required: ['statusCode', 'error', 'message'],
};

const NotFoundResponseSchema: SchemaObject = {
  type: 'object',
  description: 'La ressource ciblée est introuvable.',
  properties: {
    statusCode: { type: 'integer', example: 404 },
    error: { type: 'string', example: 'Not Found' },
    message: {
      type: 'string',
      example: 'resource not found',
    },
  },
  required: ['statusCode', 'error', 'message'],
};

const ConflictResponseSchema: SchemaObject = {
  type: 'object',
  description:
    'La requête entre en conflit avec l’état courant (déjà créé, doublon, etc.).',
  properties: {
    statusCode: { type: 'integer', example: 409 },
    error: { type: 'string', example: 'Conflict' },
    message: {
      type: 'string',
      example: 'already exists',
    },
  },
  required: ['statusCode', 'error', 'message'],
};

const InternalServerErrorResponseSchema: SchemaObject = {
  type: 'object',
  description: 'Erreur inattendue côté API.',
  properties: {
    statusCode: { type: 'integer', example: 500 },
    error: { type: 'string', example: 'Internal Server Error' },
    message: {
      oneOf: [
        { type: 'string', example: 'unexpected error' },
        {
          type: 'array',
          items: { type: 'string' },
          example: ['debug info A', 'debug info B'],
        },
      ],
    },
  },
  required: ['statusCode', 'error', 'message'],
};

/* =========================
 * Schémas Users/Auth minimalistes
 * ========================= */

const RegisterRequestSchema: SchemaObject = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'john@doe.com' },
    password: { type: 'string', minLength: 8, example: 'Secret123!' },
    phoneNumber: { type: 'string', example: '+33600000000' },
    role: {
      type: 'string',
      enum: ['STUDENT', 'COMPANY', 'ADMIN'],
      example: 'STUDENT',
    },
  },
  required: ['email', 'password', 'phoneNumber'],
};

const LoginRequestSchema: SchemaObject = {
  type: 'object',
  properties: {
    emailOrPhone: { type: 'string', example: 'john@doe.com' },
    password: { type: 'string', example: 'Secret123!' },
  },
  required: ['emailOrPhone', 'password'],
};

const RefreshRequestSchema: SchemaObject = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string', example: 'eyJhbGciOi...' },
  },
  required: ['refreshToken'],
};

const UserModelSchema: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20' },
    email: { type: 'string', example: 'john@doe.com' },
    role: { type: 'string', example: 'STUDENT' },
    phoneNumber: { type: 'string', example: '+33600000000' },
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
  },
  required: ['id', 'email', 'role', 'phoneNumber', 'createdAt', 'updatedAt'],
};

const AuthResponseSchema: SchemaObject = {
  type: 'object',
  properties: {
    user: UserModelSchema,
    accessToken: { type: 'string', example: 'eyJhbGciOi...' },
    refreshToken: { type: 'string', example: 'eyJhbGciOi...' },
    expiresIn: { type: 'integer', example: 900, description: 'seconds' },
    refreshExpiresIn: {
      type: 'integer',
      example: 604800,
      description: 'seconds',
    },
  },
  required: [
    'user',
    'accessToken',
    'refreshToken',
    'expiresIn',
    'refreshExpiresIn',
  ],
};

/* =========================
 * Schémas Profiles minimalistes
 * ========================= */

const CreateStudentProfileSchema: SchemaObject = {
  type: 'object',
  properties: {
    firstName: { type: 'string', example: 'Jane' },
    lastName: { type: 'string', example: 'Doe' },
    bio: { type: 'string', nullable: true },
    school: { type: 'string', nullable: true },
    skills: {
      type: 'array',
      items: { type: 'string' },
      example: ['Node.js', 'TS'],
    },
  },
  required: ['userId', 'firstName', 'lastName', 'skills'],
};

const UpdateStudentProfileSchema: SchemaObject = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    bio: { type: 'string', nullable: true },
    school: { type: 'string', nullable: true },
    skills: { type: 'array', items: { type: 'string' } },
  },
};

const CreateCompanyProfileSchema: SchemaObject = {
  type: 'object',
  properties: {
    companyName: { type: 'string', example: 'Acme Corp' },
    description: { type: 'string', nullable: true },
    industry: { type: 'string', nullable: true },
    techStack: {
      type: 'array',
      items: { type: 'string' },
      example: ['NestJS', 'Kafka'],
    },
  },
  required: ['userId', 'companyName'],
};

const UpdateCompanyProfileSchema: SchemaObject = {
  type: 'object',
  properties: {
    companyName: { type: 'string' },
    description: { type: 'string', nullable: true },
    industry: { type: 'string', nullable: true },
    techStack: { type: 'array', items: { type: 'string' } },
  },
};

/* =========================
 * Setup Swagger Global
 * ========================= */

export function setupGlobalSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Yozu API – Global Docs')
    .setDescription('Endpoints: Users/Auth + Profiles (Students/Companies)')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token (Authorization: Bearer <access-token>)',
      },
      'bearerAuth',
    )
    .build();

  // Laisse Swagger scanner les décorateurs Nest sur tes contrôleurs
  const base = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  // Injecte composants + chemins additionnels (exemples et erreurs standardisées)
  const document: OpenAPIObject = {
    ...base,
    security: [{ bearerAuth: [] }],
    components: {
      ...(base.components ?? {}),
      securitySchemes: {
        ...(base.components?.securitySchemes ?? {}),
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Access token (Authorization: Bearer <access-token>)',
        },
      },
      schemas: {
        ...(base.components?.schemas ?? {}),
        // génériques
        OkResponse: OkResponseSchema,
        DeletedCounterResponse: DeletedCounterResponseSchema,
        // erreurs
        UnauthorizedResponse: UnauthorizedResponseSchema,
        ForbiddenResponse: ForbiddenResponseSchema,
        NotFoundResponse: NotFoundResponseSchema,
        ConflictResponse: ConflictResponseSchema,
        InternalServerErrorResponse: InternalServerErrorResponseSchema,
        // auth/users
        RegisterRequest: RegisterRequestSchema,
        LoginRequest: LoginRequestSchema,
        RefreshRequest: RefreshRequestSchema,
        UserModel: UserModelSchema,
        AuthResponse: AuthResponseSchema,
        // profiles
        CreateStudentProfile: CreateStudentProfileSchema,
        UpdateStudentProfile: UpdateStudentProfileSchema,
        CreateCompanyProfile: CreateCompanyProfileSchema,
        UpdateCompanyProfile: UpdateCompanyProfileSchema,
      },
    },
    paths: {
      ...(base.paths ?? {}),

      /* =====================
       * Users / Auth
       * ===================== */
      '/users/register': {
        post: {
          tags: ['Users/Auth'],
          summary: 'Register',
          description:
            'Créer un utilisateur et renvoyer tokens (access/refresh).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            '409': {
              description: 'Conflict — Email/Phone déjà utilisé',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ConflictResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/InternalServerErrorResponse',
                  },
                },
              },
            },
          },
        },
      },

      '/users/login': {
        post: {
          tags: ['Users/Auth'],
          summary: 'Login',
          description: 'Connecter un utilisateur et renvoyer tokens.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized — Credentials invalides',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
          },
        },
      },

      '/users/refresh': {
        post: {
          tags: ['Users/Auth'],
          summary: 'Refresh tokens',
          description:
            'Rafraîchir access/refresh tokens à partir du refresh token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RefreshRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized — Refresh token invalide/expiré',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
          },
        },
      },

      '/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Mon profil (User)',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserModel' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Mettre à jour mon User',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', additionalProperties: true },
              },
            },
          },
          responses: {
            '200': { description: 'OK' },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Supprimer mon User',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OkResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
          },
        },
      },

      /* =====================
       * Profiles: Students
       * ===================== */
      '/profiles/students/me': {
        post: {
          tags: ['Profiles – Students'],
          summary: 'Créer mon StudentProfile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateStudentProfile' },
              },
            },
          },
          responses: {
            '201': { description: 'Created' },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ForbiddenResponse' },
                },
              },
            },
            '409': {
              description: 'Conflict',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ConflictResponse' },
                },
              },
            },
          },
        },
        get: {
          tags: ['Profiles – Students'],
          summary: 'Mon StudentProfile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK' },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
            '404': {
              description: 'Not Found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundResponse' },
                },
              },
            },
          },
        },
        patch: {
          tags: ['Profiles – Students'],
          summary: 'Mettre à jour mon StudentProfile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateStudentProfile' },
              },
            },
          },
          responses: {
            '200': { description: 'OK' },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
            '404': {
              description: 'Not Found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Profiles – Students'],
          summary: 'Supprimer mon StudentProfile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DeletedCounterResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
          },
        },
      },

      '/profiles/students': {
        get: {
          tags: ['Profiles – Students (Admin)'],
          summary: 'Lister les StudentProfiles (ADMIN)',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK' },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ForbiddenResponse' },
                },
              },
            },
          },
        },
      },

      '/profiles/students/{id}': {
        get: {
          tags: ['Profiles – Students (Admin)'],
          summary: 'Récupérer un StudentProfile (ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'OK' },
            '404': { description: 'Not Found' },
          },
        },
        patch: {
          tags: ['Profiles – Students (Admin)'],
          summary: 'Mettre à jour un StudentProfile (ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateStudentProfile' },
              },
            },
          },
          responses: {
            '200': { description: 'OK' },
            '404': { description: 'Not Found' },
          },
        },
        delete: {
          tags: ['Profiles – Students (Admin)'],
          summary: 'Supprimer un StudentProfile (ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DeletedCounterResponse',
                  },
                },
              },
            },
          },
        },
      },

      /* =====================
       * Profiles: Companies
       * ===================== */
      '/profiles/companies/me': {
        post: {
          tags: ['Profiles – Companies'],
          summary: 'Créer mon CompanyProfile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateCompanyProfile' },
              },
            },
          },
          responses: {
            '201': { description: 'Created' },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
                },
              },
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ForbiddenResponse' },
                },
              },
            },
            '409': {
              description: 'Conflict',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ConflictResponse' },
                },
              },
            },
          },
        },
        get: {
          tags: ['Profiles – Companies'],
          summary: 'Mon CompanyProfile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Not Found' },
          },
        },
        patch: {
          tags: ['Profiles – Companies'],
          summary: 'Mettre à jour mon CompanyProfile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCompanyProfile' },
              },
            },
          },
          responses: {
            '200': { description: 'OK' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Not Found' },
          },
        },
        delete: {
          tags: ['Profiles – Companies'],
          summary: 'Supprimer mon CompanyProfile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DeletedCounterResponse',
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
          },
        },
      },

      '/profiles/companies': {
        get: {
          tags: ['Profiles – Companies (Admin)'],
          summary: 'Lister les CompanyProfiles (ADMIN)',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Forbidden' },
          },
        },
      },

      '/profiles/companies/{id}': {
        get: {
          tags: ['Profiles – Companies (Admin)'],
          summary: 'Récupérer un CompanyProfile (ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'OK' },
            '404': { description: 'Not Found' },
          },
        },
        patch: {
          tags: ['Profiles – Companies (Admin)'],
          summary: 'Mettre à jour un CompanyProfile (ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCompanyProfile' },
              },
            },
          },
          responses: {
            '200': { description: 'OK' },
            '404': { description: 'Not Found' },
          },
        },
        delete: {
          tags: ['Profiles – Companies (Admin)'],
          summary: 'Supprimer un CompanyProfile (ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DeletedCounterResponse',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Users/Auth' },
      { name: 'Users' },
      { name: 'Profiles – Students' },
      { name: 'Profiles – Students (Admin)' },
      { name: 'Profiles – Companies' },
      { name: 'Profiles – Companies (Admin)' },
    ],
  };

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Yozu API – Global Docs',
  });
}
