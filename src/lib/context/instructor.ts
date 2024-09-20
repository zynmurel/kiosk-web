import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
export type InstructorUpsert = {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    contact: string | undefined; 
    email: string | undefined;
    employeeID: string;
}
export type UpsertInstructorType = InstructorUpsert | undefined | "create";
interface InstructorContextType {
    upsertInstructor : UpsertInstructorType;
    setUpsertInstructor : Dispatch<SetStateAction<UpsertInstructorType>>
    searchText: string;
    setSearchText : Dispatch<SetStateAction<string>>,
    refetchInstructors: () => Promise<void>

}

export const InstructorContext = createContext<InstructorContextType | undefined>(undefined);

export const useInstructorContext = () => useContext(InstructorContext);