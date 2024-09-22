"use client";
import { useStore } from "@/lib/store/app";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { schoolYear, semesters, studentYear } from "@/lib/helpers/selections";
import { useEffect, useState } from "react";
import Loading from "../../_components/loading";
import SubjectContents from "./_components/subjects-content";
import SectionContent from "./_components/section-content";

export type SubjectsSelectedType = {
  subjectId: number;
  instructorId: number;
};

export type SectionsSelectedType = {
  section_name: string;
  id: number;
  studentCount: number;
};

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

  const [subjectsSelected, setSubjectsSelected] =
    useState<SubjectsSelectedType[]>();

  const [sectionsSelected, setSectionsSelected] =
    useState<SectionsSelectedType[]>();

  api.admin.global.getSelectableInstructors.useQuery(
    {
      departmentCode: user?.department || "",
    },
    {
      enabled: !!user?.department,
    },
  );

  api.admin.global.getSelectableSubjects.useQuery(
    {
      departmentCode: user?.department || "",
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

  const onAddSection = () => {
    const { courseCode, schoolYear, studentYear, semester } = filter;
    router.push(
      `/admin/curriculums/selected/add-section/${courseCode}/${schoolYear}/${studentYear}/${semester}`,
    );
  };

  useEffect(() => {
    if (selectedCurriculum) {
      setSubjectsSelected(
        selectedCurriculum.subjects.map((sub) => ({
          subjectId: sub.subjectId,
          instructorId: sub.instructorId,
        })),
      );
      setSectionsSelected(
        selectedCurriculum.sections.map((sec) => ({
          id: sec.id,
          section_name: sec.section_name,
          studentCount: sec._count.StudentBatch,
        })),
      );
    }
  }, [selectedCurriculum]);

  useEffect(() => {
    if (curriculum) {
      setFilter({
        courseCode: curriculum[0] || "",
        schoolYear: curriculum[1] || "",
        studentYear: curriculum[2] ? Number(curriculum[2]) : 0,
        semester: curriculum[3] ? Number(curriculum[3]) : 0,
      });
    }
  }, [curriculum]);

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden rounded border bg-background shadow-md">
      <div className="flex flex-row items-center justify-between bg-muted p-1 px-5">
        <p className="font-semibold">Curriculum</p>
        <Button
          disabled={selectedCurriculumIsLoading}
          className="gap-1"
          type="button"
          variant={"outline"}
          onClick={onAddSection}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Section
          </span>
        </Button>
      </div>
      <div className="relative flex flex-col gap-5 p-5 xl:px-10">
        {selectedCurriculumIsLoading && (
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background opacity-50">
            <Loading />
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className="flex-1">
            <p className="pb-1 text-sm">Course</p>
            <div className="text-2xl font-bold md:text-4xl">
              {selectableCoursesIsLoading
                ? "Loading ..."
                : selectableCourses?.find(
                    (course) => course.value === filter.courseCode,
                  )?.label}
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-5 md:grid-cols-3">
            <div className="flex-1">
              <p className="pb-1 text-sm">School Year</p>
              <div className="rounded-md text-sm font-bold md:text-xl">
                {
                  schoolYear()?.find((sy) => sy.value === filter.schoolYear)
                    ?.label
                }
              </div>
            </div>
            <div className="flex-1">
              <p className="pb-1 text-sm">Student Year</p>
              <div className="rounded-md text-sm font-bold md:text-xl">
                {
                  studentYear?.find((sy) => sy.value === filter.studentYear)
                    ?.label
                }
              </div>
            </div>
            <div className="flex-1">
              <p className="pb-1 text-sm">Semester</p>
              <div className="rounded-md text-sm font-bold md:text-xl">
                {semesters?.find((sy) => sy.value === filter.semester)?.label}
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SubjectContents subjectsSelected={subjectsSelected} />
          </div>
          <div>
            <SectionContent
              sectionsSelected={sectionsSelected}
              onAddSection={onAddSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
