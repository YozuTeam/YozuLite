export declare class CreateStudentProfileDto {
    firstName: string;
    lastName: string;
    bio?: string | null;
    school?: string | null;
    skills?: string[];
}
export declare class UpdateStudentProfileDto {
    firstName?: string;
    lastName?: string;
    bio?: string | null;
    school?: string | null;
    skills?: string[];
}
