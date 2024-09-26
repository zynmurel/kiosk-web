'use client'
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../_components/loading";
import { Badge } from "@/components/ui/badge";
import { semesters, studentYear } from "@/lib/helpers/selections";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Page = () => {
    const { params } = useParams()
    const { user } = useStore()
    const router = useRouter()
    const subjectCode = params?.[0]
    const subjectTitle = params?.[1]?.replace(/%20/g," ")
    const subjectType = params?.[2]
    const instructorOnSubjectId = params?.[3]
    const { data: curriculumSubjects, isPending: curriculumSubjectsIsPending } = api.instructor.subject.getInstructorsSubject.useQuery({
        subjectCode : (subjectCode ||""),
        instructorId: user?.id || 0
    }, {
        enabled: !!user?.id && !!subjectCode
    })

    const onAddSection = (idParams:string) => router.push("/instructor/sections/add-section/"+idParams)

    return (<div className=" w-full bg-primary-foreground rounded-md border shadow-md">
        <div className=" bg-muted p-3 px-5  h-12">
            <p className="font-semibold">Sections On Subject</p>
        </div>
        <div className=" flex h-full w-full py-2 px-2 min-h-[200px] relative">
            {(curriculumSubjectsIsPending) &&
                <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <Loading />
                </div>}
            {
                curriculumSubjects &&
                <div className=" w-full">
                    <div className=" flex flex-row justify-between w-full px-2">
                        <div>
                            <p className=" font-bold flex flex-row items-center gap-1">{subjectCode}<Badge variant={subjectType === "MINOR" ? "secondary" : "default"} className=" text-xs px-2 inline">{subjectType}</Badge></p>
                            <p className=" text-sm">{subjectTitle}</p>
                        </div>
                    </div>
                    <div className=" py-1 text-base">

                        <div className=" border rounded overflow-hidden">
                            <div className=" w-full bg-muted p-2 py-2 font-bold border-b text-center">SECTIONS</div>
                            {!!curriculumSubjects.length ?
                                curriculumSubjects.map((section) => {
                                    const studentyear = studentYear.find((sy)=>sy.value === section.curriculum.curriculum.student_year)
                                    const semester = semesters.find(sem=>sem.value === section.curriculum.curriculum.semester)
                                    return <div key={section.id} className=" flex flex-row items-center justify-between border-b p-2 cursor-pointer">
                                        <div>
                                            <p className=" font-bold">{section.section_name}</p>
                                            <p className=" text-xs flex flex-row gap-2"><span>{studentyear?.value}</span> - <span>{semester?.value}</span></p>
                                        </div>
                                        <div className=" w-20 text-center">
                                            <p className=" text-xs font-semibold border rounded-full p-1 bg-muted hover:bg-background">View</p>
                                        </div>
                                    </div>
                                }) : <div className=" flex justify-center items-center py-5 text-muted-foreground text-sm">No Section Found</div>
                            }
                        </div>
                            <div className=" flex flex-row justify-end pt-2">
                            <Button onClick={()=>onAddSection(`${instructorOnSubjectId}`)} size={"sm"} variant={"outline"} className=" flex flex-row gap-1 items-center"><Plus size={18}/>Add Section</Button>
                            </div>
                    </div>
                </div>
            }
        </div>
    </div>);
}

export default Page;