import { IUpdateStudentProfileRequest } from "../../interfaces/requests/update-student-profile-request.interface";
export declare class UpdateStudentProfileRequest implements IUpdateStudentProfileRequest {
    firstName?: string;
    lastName?: string;
    bio?: string | null;
    school?: string | null;
    skills?: string[];
}
