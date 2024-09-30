'use client'
import { useParams, useRouter } from "next/navigation";
import Loading from "../_components/loading";
import { useStore } from "@/lib/store/app";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { schoolYear, semesters, studentYear } from "@/lib/helpers/selections";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import CurriculumsTable from "./_components/table";

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

    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
        departmenCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    const { data: curriculums, isPending: curriculumsIsLoading } = api.admin.curriculum.getCurriculums.useQuery({
        departmenCode: user?.department || "",
        courseCode: curriculum?.[0] || "",
        schoolYear: curriculum?.[1] || "",
        studentYear: (curriculum?.[2] ? Number(curriculum[2]) : 0),
        semester: (curriculum?.[3] ? Number(curriculum[3]) : 0)
    }, {
        enabled: !!user?.department && !!curriculum
    })

    useEffect(() => {
        const { courseCode, schoolYear, studentYear, semester } = filter
        router.push(`/admin/curriculums/${courseCode}/${schoolYear}/${studentYear}/${semester}`)
    }, [filter, router])

    return (<div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
        <div className=" bg-muted p-3 px-5  h-12">
            <p className="font-semibold">Filtered Currirculums</p>
        </div>
        <div className=" flex flex-col gap-5 py-0 p-5 relative h-full">
            {(curriculumsIsLoading) &&
                <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <Loading />
                </div>}
            <div className="space-y-6">
                <div className=" flex flex-col xl:flex-row gap-5">
                    <div className="flex-1">
                        <p className=" text-sm pb-1">Course</p>
                        <Select disabled={selectableCoursesIsLoading} onValueChange={(e) => setFilter(prev => ({ ...prev, courseCode: e }))} defaultValue={filter.courseCode}>
                            <SelectTrigger className="flex-1 w-[420px]">
                                <SelectValue placeholder={selectableCoursesIsLoading ? "Loading ..." : "Select a course"} />
                            </SelectTrigger>
                            <SelectContent className=" w-[420px]">
                                {
                                    selectableCourses?.map((course) => <SelectItem key={course.value} value={course.value}><span className="text-start text-nowrap">{course.label}</span></SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className=" grid grid-cols-2 md:grid-cols-3 gap-5 flex-1">

                        <div className="flex-1">
                            <p className=" text-sm pb-1">School Year</p>
                            <Select disabled={selectableCoursesIsLoading} onValueChange={(e) => setFilter(prev => ({ ...prev, schoolYear: e }))} defaultValue={filter.schoolYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a school year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        schoolYear().map((sy) => {
                                            return <SelectItem value={sy.value} key={sy.value}>{sy.label}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <p className=" text-sm pb-1">Student Year</p>
                            <Select disabled={selectableCoursesIsLoading} onValueChange={(e) => setFilter(prev => ({ ...prev, studentYear: Number(e) }))} defaultValue={filter.studentYear.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a student year level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        [{ label: "All", value: 0 }, ...studentYear].map((sy) => {
                                            return <SelectItem key={sy.value} value={sy.value.toString()}>{sy.label}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <p className=" text-sm pb-1">Semester</p>
                            <Select disabled={selectableCoursesIsLoading} onValueChange={(e) => setFilter(prev => ({ ...prev, semester: Number(e)}))} defaultValue={filter.semester.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        [{ label: "All", value: 0 }, ...semesters].map((sy) => {
                                            return <SelectItem key={sy.value} value={sy.value.toString()}>{sy.label}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <CurriculumsTable curriculums={curriculums} curriculumsIsLoading={curriculumsIsLoading}/>
            </div>
        </div>
    </div>);
}

export default Page;