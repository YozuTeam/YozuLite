export interface ICreateStudentProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string | null;
  contractType?: string[];
  skills?: string[];
}
