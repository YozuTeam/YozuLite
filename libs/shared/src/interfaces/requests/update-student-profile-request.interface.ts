export interface IUpdateStudentProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  school?: string | null;
  skills?: string[];
}
