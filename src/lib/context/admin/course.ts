import { createContext, type Dispatch, type SetStateAction, useContext } from "react";

interface CourseContextType { 
    isEdit: boolean;
    setIsEdit : Dispatch<SetStateAction<boolean>>
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = () => useContext(CourseContext);