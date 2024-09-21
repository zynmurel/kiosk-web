'use client'
import { useStore } from "@/lib/store/app";
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { schoolYear, semesters, studentYear } from "@/lib/helpers/selections";
import { useEffect, useState } from "react";
import Loading from "../../_components/loading";
import SubjectContents from "./_components/subjects-content";

export type SubjectsSelectedType = {
    subjectId: number;
    instructorId: number;
}

const Page = () => {
    const { user } = useStore()
    const router = useRouter()
    const { curriculum } = useParams()
    const [filter, setFilter] = useState<{
        courseCode: string;
        schoolYear: string;
        studentYear: number;
        semester: number;
    }>({
        courseCode: curriculum?.[0] || "",
        schoolYear: curriculum?.[1] || "",
        studentYear: (curriculum?.[2] ? Number(curriculum[2]) : 0),
        semester: (curriculum?.[3] ? Number(curriculum[3]) : 0)
    })
    
    api.admin.global.getSelectableInstructors.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    api.admin.global.getSelectableSubjects.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    const [subjectsSelected, setSubjectsSelected] = useState<SubjectsSelectedType[]>()

    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
        departmenCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })
    const { data: selectedCurriculum, isLoading: selectedCurriculumIsLoading } = api.admin.curriculum.getCurriculum.useQuery({
        departmenCode: user?.department || "", ...filter
    }, {
        enabled: !!user?.department
    })

    useEffect(()=>{
        if(selectedCurriculum){
            setSubjectsSelected(selectedCurriculum.subjects.map((sub)=>({
                subjectId: sub.subjectId,
                instructorId: sub.instructorId,
            })))
        }
    },[selectedCurriculum])

    useEffect(()=>{
        if(curriculum){
            setFilter({
                courseCode: curriculum[0] || "",
                schoolYear: curriculum[1] || "",
                studentYear: (curriculum[2] ? Number(curriculum[2]) : 0),
                semester: (curriculum[3] ? Number(curriculum[3]) : 0)
            })
        }
    },[curriculum])

    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
            <div className=" bg-muted p-1 px-5 items-center flex flex-row justify-between">
                <p className="font-semibold">Curriculum</p>
                <Button disabled={selectedCurriculumIsLoading} className="gap-1" type="button" variant={"outline"} onClick={() => router.push("/admin/curriculums/selected/add-section/"+selectedCurriculum?.id)}>
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Section
                    </span>
                </Button>
            </div>
            <div className=" flex flex-col gap-5 xl:px-10 p-5 relative">
                {(selectedCurriculumIsLoading) &&
                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <Loading />
                    </div>}
                
                    <div className=" flex flex-col gap-5">
                    <div className="flex-1">
                        <p className=" text-sm pb-1">Course</p>
                        <div className=" text-2xl md:text-4xl font-bold">{selectableCoursesIsLoading ? "Loading ..." : selectableCourses?.find(course=>course.value===filter.courseCode)?.label}</div>
                    </div>
                    <div className=" grid grid-cols-2 md:grid-cols-3 gap-5 flex-1">

                        <div className="flex-1">
                            <p className=" text-sm pb-1">School Year</p>
                            <div className=" text-sm md:text-xl font-bold rounded-md">{ schoolYear()?.find(sy=>sy.value===filter.schoolYear)?.label}</div>
                        </div>
                        <div className="flex-1">
                            <p className=" text-sm pb-1">Student Year</p>
                            <div className=" text-sm md:text-xl font-bold rounded-md">{ studentYear?.find(sy=>sy.value===filter.studentYear)?.label}</div>
                        </div>
                        <div className="flex-1">
                            <p className=" text-sm pb-1">Semester</p>
                            <div className=" text-sm md:text-xl font-bold rounded-md">{ semesters?.find(sy=>sy.value===filter.semester)?.label}</div>
                        </div>
                    </div>
                </div>
                <div className=" grid xl:grid-cols-3 gap-5">
                    <div className=" xl:col-span-2">
                        <SubjectContents subjectsSelected={subjectsSelected}/>
                    </div>
                    <div>
                        <SubjectContents subjectsSelected={subjectsSelected}/>
                    </div>
                </div>
            </div>
        </div>);
}

export default Page;