"use client";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "../../../_components/loading";
import { schoolYear, semesters, studentYear } from "@/lib/helpers/selections";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const { user } = useStore();
  const router = useRouter();
  const { curriculum } = useParams();
  const [filter, setFilter] = useState<{
    courseCode: string;
    schoolYear: string;
    studentYear: number;
    semester: number;
  }>({
    courseCode: curriculum?.[0] || "",
    schoolYear: curriculum?.[1] || "",
    studentYear: curriculum?.[2] ? Number(curriculum[2]) : 0,
    semester: curriculum?.[3] ? Number(curriculum[3]) : 0,
  });
  const { data: selectedCurriculum, isLoading: selectedCurriculumIsLoading } =
    api.admin.curriculum.getCurriculum.useQuery(
      {
        departmenCode: user?.department || "",
        ...filter,
      },
      {
        enabled: !!user?.department,
      },
    );

  const { data: selectableCourses, isLoading: selectableCoursesIsLoading } =
    api.admin.global.getSelectableCourse.useQuery(
      {
        departmenCode: user?.department || "",
      },
      {
        enabled: !!user?.department,
      },
    );

  return (
    <div className="grid w-full lg:grid-cols-2">
      <div className="col-span-1 flex h-full w-full flex-col gap-2 overflow-hidden rounded border bg-background shadow-md">
        <div className="flex h-12 flex-row items-center justify-between bg-muted p-1 px-5">
          <p className="font-semibold">Section</p>
        </div>
        <div className="relative flex flex-col gap-5 p-2 px-5 xl:px-5">
          {selectedCurriculumIsLoading && (
            <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background opacity-50">
              <Loading />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <div className="text-lg font-bold md:text-2xl">
                {selectableCoursesIsLoading
                  ? "Loading ..."
                  : selectableCourses?.find(
                      (course) => course.value === filter.courseCode,
                    )?.label}
              </div>
            </div>
            <div className="grid w-full flex-1 grid-cols-3 gap-5">
              <div className="flex-1">
                <p className="pb-1 text-xs">School Year</p>
                <div className="rounded-md text-xs font-bold md:text-base">
                  {
                    schoolYear()?.find((sy) => sy.value === filter.schoolYear)
                      ?.label
                  }
                </div>
              </div>
              <div className="flex-1">
                <p className="pb-1 text-xs">Student Year</p>
                <div className="rounded-md text-xs font-bold md:text-base">
                  {
                    studentYear?.find((sy) => sy.value === filter.studentYear)
                      ?.label
                  }
                </div>
              </div>
              <div className="flex-1">
                <p className="pb-1 text-xs">Semester</p>
                <div className="rounded-md text-xs font-bold md:text-base">
                  {semesters?.find((sy) => sy.value === filter.semester)?.label}
                </div>
              </div>
            </div>
          </div>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default Page;
