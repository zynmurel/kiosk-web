"use client";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../_components/loading";
import { Badge } from "@/components/ui/badge";
import { semesters, studentYear } from "@/lib/helpers/selections";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const { params } = useParams();
  const { user } = useStore();
  const router = useRouter();
  const curriculumSubjectId = params?.[0]?.replace(/%20/g, " ");
  const instructorOnSubjectId = params?.[1]?.replace(/%20/g, " ");
  const subjectCode = params?.[2]?.replace(/%20/g, " ");
  const subjectTitle = params?.[3]?.replace(/%20/g, " ");
  const subjectType = params?.[4]?.replace(/%20/g, " ");
  const courseCode = params?.[5]?.replace(/%20/g, " ");

  const { data: curriculumSubjects, isPending: curriculumSubjectsIsPending } =
    api.instructor.subject.getInstructorsSubject.useQuery(
      {
        curriculumId: Number(curriculumSubjectId),
        instructorId: user?.id || 0,
      },
      {
        enabled: !!user?.id && !Number.isNaN(Number(curriculumSubjectId)),
      },
    );

  const onAddSection = (idParams: string) =>
    router.push("/instructor/sections/add-section/" + idParams);

  return (
    <div className="w-full rounded-md border bg-primary-foreground shadow-md">
      <div className="h-12 border-b bg-muted p-3 px-3">
        <p className="font-semibold">Sections</p>
      </div>
      <div className="relative flex h-full min-h-[200px] w-full py-2 pb-0">
        {curriculumSubjectsIsPending && (
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background opacity-50">
            <Loading />
          </div>
        )}
        {curriculumSubjects && (
          <div className="w-full">
            <div className="flex w-full flex-row justify-between px-2">
              <div className="">
                <p className="font-bold">{courseCode}</p>
                <p className="flex flex-row items-center gap-1 text-2xl font-bold">
                  {subjectCode}
                  <Badge
                    variant={subjectType === "MINOR" ? "secondary" : "default"}
                    className="inline px-2 text-xs"
                  >
                    {subjectType}
                  </Badge>
                </p>
                <p className="text-sm">{subjectTitle}</p>
              </div>
            </div>
            <div className="py-1 pb-0 text-base">
              <div className="overflow-hidden rounded">
                <Separator className="my-2 mb-1" />
                {!!curriculumSubjects.length ? (
                  curriculumSubjects.map((section) => {
                    const studentyear = studentYear.find(
                      (sy) =>
                        sy.value === section.curriculum.curriculum.student_year,
                    );
                    const semester = semesters.find(
                      (sem) =>
                        sem.value === section.curriculum.curriculum.semester,
                    );
                    return (
                      <div
                        key={section.id}
                        className="flex cursor-pointer flex-row items-center justify-between border-b p-2"
                      >
                        <div>
                          <p className="font-bold">{section.section_name}</p>
                          <p className="flex flex-row gap-2 text-xs">
                            <span>{studentyear?.label}</span> -{" "}
                            <span>{semester?.label}</span>
                          </p>
                        </div>
                        <div
                          className="w-20 text-center"
                          onClick={() =>
                            router.push(
                              `/instructor/sections/section/${section.id}`,
                            )
                          }
                        >
                          <p className="rounded-full border bg-muted p-1 text-xs font-semibold hover:bg-background">
                            View
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center py-5 text-sm text-muted-foreground">
                    No Section Found
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-end px-2 pb-2 pt-2">
                <Button
                  onClick={() => onAddSection(`${instructorOnSubjectId}`)}
                  size={"sm"}
                  variant={"outline"}
                  className="flex flex-row items-center gap-1"
                >
                  <Plus size={18} />
                  Add Section
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
