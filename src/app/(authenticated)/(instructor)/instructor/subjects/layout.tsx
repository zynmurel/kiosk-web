'use client'
import { api } from "@/trpc/react";
import SubjectLayout from "./_components/_layout"
import { useStore } from "@/lib/store/app";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { schoolYear, yearNow } from "@/lib/helpers/selections";
import SubjectTable from "./_components/table";
const subject_type = [{
    value: "ALL",
    label: "All"
}, {
    value: "MINOR",
    label: "Minor"
}, {
    value: "MAJOR",
    label: "Major"
}]
const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useStore()
    const [courseCode, setCourseCode] = useState<string>("ALL")
    const [school_year, setSchoolYear] = useState<string>(`${yearNow}-${yearNow+1}`)
    const [subjectType, setSubjectType] = useState<"ALL" | "MINOR" | "MAJOR">("ALL")

    const { data: selectableCourseCode, isLoading: selectableCourseCodeIsLoading } = api.instructor.subject.getSelectableCourseCode.useQuery({
        id: user?.id || 0
    }, {
        enabled: !!user?.id
    })

    const { data: subjects, isLoading:subjectsIsLoading } = api.instructor.subject.getInstructorsSubjects.useQuery({
        id: user?.id || 0,
        courseCode: courseCode,
        school_year: "2024-2025",
        subjectType:subjectType,
        
    }, {
        enabled: !!user?.id && !!courseCode
    })

    console.log(selectableCourseCode)

    return (
        <SubjectLayout>
            <div className=" w-full space-y-5 flex flex-col">
                <div className=" grid xl:grid-cols-3 xl:h-full gap-5">
                    <div className=" w-full xl:col-span-2 overflow-hidden">
                        <div className="">
                            <div className=" flex flex-col md:flex-row justify-between gap-3 py-5 md:items-end">
                                <div>
                                   <p className=" text-xl font-bold"> Filter Subjects</p>
                                </div>
                                <div className=" flex flex-row gap-3">
                                    <div className=" flex flex-col gap-1 flex-1 md:flex-none">
                                        <p className=" text-xs">Course Code</p>
                                        <Select disabled={selectableCourseCodeIsLoading} value={courseCode} onValueChange={(e)=>setCourseCode(e)}>
                                            <SelectTrigger className="md:w-[130px]">
                                                <SelectValue placeholder="Loading ..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    [{courseCode:"ALL"}, ...(selectableCourseCode||[])]?.map((sy)=>(
                                                        <SelectItem key={sy.courseCode} value={sy.courseCode}>{sy.courseCode}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className=" flex flex-col gap-1 flex-1 md:flex-none">
                                        <p className=" text-xs">Type</p>
                                        <Select onValueChange={(e) => setSubjectType(e as "ALL" | "MINOR" | "MAJOR")} value={subjectType}>
                                            <SelectTrigger className="md:w-[130px]">
                                                <SelectValue placeholder="Select subject type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    subject_type.map((type) => <SelectItem className="py-4" key={type.value} value={type.value}>{type.label}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className=" flex flex-col gap-1 flex-1 md:flex-none">
                                        <p className=" text-xs">School Year</p>
                                        <Select value={school_year} onValueChange={(e)=>setSchoolYear(e)}>
                                            <SelectTrigger className="md:w-[130px]">
                                                <SelectValue placeholder="School year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    schoolYear().map((sy)=>(
                                                        <SelectItem key={sy.value} value={sy.value}>{sy.label}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <SubjectTable subjects={subjects} subjectsIsLoading={subjectsIsLoading}/>
                        </div>
                    </div>
                    <div className=" w-full shadow-md">
                        {children}
                    </div>
                </div>
            </div>
        </SubjectLayout>
    );
}

export default Layout;