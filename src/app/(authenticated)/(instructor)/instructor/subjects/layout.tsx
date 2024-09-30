'use client'
import { api } from "@/trpc/react";
import SubjectLayout from "./_components/_layout"
import { useStore } from "@/lib/store/app";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { schoolYear, semesters, yearNow } from "@/lib/helpers/selections";
import SubjectTable from "./_components/table";
const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useStore()
    const [courseCode, setCourseCode] = useState<string>("All")
    const [school_year, setSchoolYear] = useState<string>(`${yearNow}-${yearNow+1}`)
    const [semester, setSemester] = useState<number>(0)

    const { data: selectableCourseCode, isLoading: selectableCourseCodeIsLoading } = api.instructor.subject.getSelectableCourseCode.useQuery({
        id: user?.id || 0
    }, {
        enabled: !!user?.id
    })

    const { data: subjects, isLoading:subjectsIsLoading } = api.instructor.subject.getInstructorsSubjects.useQuery({
        id: user?.id || 0,
        courseCode: courseCode,
        school_year,
        semester:semester,
        
    }, {
        enabled: !!user?.id && !!courseCode
    })


    return (
        <SubjectLayout>
            <div className=" w-full space-y-5 flex flex-col">
                <div className=" grid lg:grid-cols-2 xl:grid-cols-3 xl:h-full gap-5">
                    <div className=" w-full xl:col-span-2">
                        <div className="">
                            <div className=" flex flex-col xl:flex-row justify-between gap-3 pb-5 xl:items-end">
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
                                                    [{courseCode:"All"}, ...(selectableCourseCode||[])]?.map((sy)=>(
                                                        <SelectItem key={sy.courseCode} value={sy.courseCode}>{sy.courseCode}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className=" flex flex-col gap-1 flex-1 md:flex-none">
                                        <p className=" text-xs">Semester</p>
                                        <Select onValueChange={(e) => setSemester(Number(e))} value={semester.toString()}>
                                            <SelectTrigger className="md:w-[130px]">
                                                <SelectValue placeholder="Select subject type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    [{ value: 0, label : "All"},...(semesters||[])].map((type) => <SelectItem key={type.value} value={type.value.toString()}><span className="text-start text-nowrap">{type.label}</span></SelectItem>)
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
                    <div className=" w-full lg:mt-5">
                        {children}
                    </div>
                </div>
            </div>
        </SubjectLayout>
    );
}

export default Layout;