export interface IStudentProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  school: string | null;
  skills: string[];
}
