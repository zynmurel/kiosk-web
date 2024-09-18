import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
import { type SubjectType } from "../types/admin/subject";

interface SubjectContextType { 
    isEdit: boolean;
    setIsEdit : Dispatch<SetStateAction<boolean>>,
    searchText: string;
    setSearchText : Dispatch<SetStateAction<string>>,
    subjectType : SubjectType;
    setSubjectType :Dispatch<SetStateAction<SubjectType>>,
}

export const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const useSubjectContext = () => useContext(SubjectContext);