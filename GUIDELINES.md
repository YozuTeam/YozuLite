# Project Guidelines & Architecture

This document serves as the source of truth for the project's architecture and coding standards, particularly for testing.

## 1. Project Architecture

The project is a monorepo containing:

- **`api/`**: NestJS backend with Prisma ORM.
- **`yozu-lite/`**: Next.js frontend (App Router) using Material UI.
- **`libs/`**: Shared TypeScript libraries (contracts, DTOs, interfaces).

- **No Comments**: Never add comments to the code (no `// ...` or `/* ... */`). The code must be self-explanatory.
- **No Any**: NEVER use `as any` or the `any` type. Everything must be strictly typed using interfaces or types.
- **API Interfaces**: All backend communication (requests and responses) MUST use interfaces defined in `@yozu/contracts`.
- **Atomic Design**: Always follow the Atomic Design methodology. Components are organized into Atoms, Molecules, Organisms, and Templates.
- **Regression Testing**: Every new feature MUST include unit tests covering all behaviors to prevent regressions.
- **Frontend Organization (`yozu-lite/src`)**

- **`auth/`**: Centralized authentication logic.
  - `components/`: UI-related auth guards.
  - `contexts/`: React contexts for auth state.
  - `providers/`: Context providers.
  - `services/`: Business logic and API calls (e.g., `authService`).
  - `storage/`: Token persistence.
- **`app/`**: Next.js pages and layouts.
- **`design-system/`**: Atomic design components (Atoms, Molecules, Organisms, Templates).
- **`theme/`**: Theme configuration (`constant.ts`) and hooks (`useColorTheme.tsx`).

---

## 2. Design System & Theme

### Atomic Design Hierarchy

- **Atoms**: Basic building blocks (e.g., `Text`, `Button`, `TextField`).
- **Molecules**: Groups of atoms working together (e.g., `EmailField`, `Selector`, `FormField`).
- **Organisms**: Complex components composed of molecules and atoms (e.g., `Card`, `Picker`).
- **Templates**: Page-level layouts that arrange organisms (e.g., `OnboardingForm`).
  - **Rule**: Templates must NEVER hardcode labels, button names, or placeholder strings. These must be received via a `labels` prop from the calling page to ensure maximum reusability.

### Theme Management (`NAV_THEME`)

The project uses a custom theme system defined in `src/theme/constant.ts`.

- **Two Schemes**: Support for `light` and `dark` modes via `useColorTheme`.
- **Prop Inheritance**: Most components accept a `colors` prop of type `ThemeColors`.
- **Strict Usage**: NEVER use hardcoded hex/rgb colors. Always use values from the `colors` object extracted from `NAV_THEME`.
- **Heritage**: Templates and Organisms should pass their `colors` down to the Molecules and Atoms they contain to ensure visual consistency.

---

## 3. Testing Standards

### General Principles

- **No Global Mocks at the Top**: Avoid using `jest.mock()` at the top level of a file for modules you want to spy on. It makes it harder to reset state between tests and reduces visibility into what is being mocked.
- **Use Spies**: Prefer `jest.spyOn(object, 'method')` and `mockRestore()` in `afterEach` to maintain a clean slate.
- **Backend Mocking**: Always mock backend service calls (e.g., methods in `authService`) to ensure tests are unit-focused and fast.

### Test Structure Template

Always follow this structure for Component/Page tests:

```typescript
import { authService } from "@/auth";
import * as navigation from "next/navigation";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Spies and Mocks
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

describe("ComponentName", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let serviceSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    // Setup Router Spy
    (navigation.useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    // Setup Business Logic Spy
    serviceSpy = jest.spyOn(authService, 'someMethod');
  });

  afterEach(() => {
    serviceSpy.mockRestore(); // Critical to prevent side effects
  });

  describe("Rendering", () => {
    it("should render essential elements", () => {
      render(<ComponentName />);
      expect(screen.getByText("Expected Text")).toBeInTheDocument();
    });
  });

  describe("Logic / Backend Interactions", () => {
    it("should handle success and redirect", async () => {
      serviceSpy.mockResolvedValue({ success: true });
      render(<ComponentName />);

      // Simulate interactions
      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(serviceSpy).toHaveBeenCalled();
        expect(mockReplace).toHaveBeenCalledWith("/dashboard");
      });
    });
  });
});
```

### Mocking Guidelines

1. **Material UI / Icons**: Generally safe to let render, but if icons cause performance issues, mock the SVG or the specific Icon component.
2. **Next.js Hooks**: Always mock `useRouter`, `usePathname`, etc., as they rely on the Next.js server context.
3. **Data Fetching**: Use `jest.spyOn` on the service methods rather than mocking `axios` globally. This targets the business logic layer.
