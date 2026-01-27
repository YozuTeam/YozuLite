import { ICreateStudentProfileRequest } from "../../interfaces/requests/create-student-profile-request.interface";
export declare class CreateStudentProfileRequest implements ICreateStudentProfileRequest {
    firstName: string;
    lastName: string;
    bio?: string | null;
    school?: string | null;
    skills?: string[];
}
