import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
import { type SubjectType } from "../../types/admin/subject";

interface InstructorSectionContextType { 
    showStudents: boolean;
    setShowStudents : Dispatch<SetStateAction<boolean>>,
}

export const InstructorSectionContext = createContext<InstructorSectionContextType | undefined>(undefined);

export const useInstructorSectionContext = () => useContext(InstructorSectionContext);