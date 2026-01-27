export interface IStudentProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  contractType: string[];
  skills: string[];
}
