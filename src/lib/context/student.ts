import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
export type StudentUpsert = {
    id: number;
    courseCode: string;
    firstName: string;
    middleName: string | undefined | null;
    lastName: string;
    contact: string | undefined | null;
    email: string | undefined | null;
    studentID: string;
}
export type UpsertStudentType = StudentUpsert | undefined | "create";
interface StudentContextType {
    upsertStudent : UpsertStudentType;
    setUpsertStudent : Dispatch<SetStateAction<UpsertStudentType>>
    searchText: string;
    setSearchText : Dispatch<SetStateAction<string>>,
    courseCode: string;
    setCourseCode : Dispatch<SetStateAction<string>>,
    refetchStudents: () => Promise<void>

}

export const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => useContext(StudentContext);