"use client";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  category,
  schoolYear,
  semesters,
  terms,
} from "@/lib/helpers/selections";

const Page = () => {
  const { id } = useParams();
  const { user } = useStore();

  const {
    data: section,
    isLoading,
    refetch,
  } = api.instructor.section.getSection.useQuery(
    {
      id: Number(id),
      instructorId: Number(user?.id),
    },
    {
      enabled: false,
    },
  );

  const { mutateAsync, isPending } =
    api.instructor.section.updateGradingTerm.useMutation({
      onSuccess: async (data) => {
        toast({
          title: "Success!",
          description: `Current Term Updated to ${data.grading_term.replace("_", " ").toLowerCase()} `,
        });
        await refetch();
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: "Failed",
          description: e.message,
        });
      },
    });

  const onChangeTerm = async (value: "MIDTERM" | "FINAL_TERM") => {
    console.log(value);
    await mutateAsync({
      sectionId: Number(id),
      grading_term: value,
    });
  };
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-20">Loading...</div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-5 px-5 pt-5">
            <p className="text-2xl font-bold">Current Term :</p>
            <Select
              disabled={isPending || isLoading}
              onValueChange={onChangeTerm}
              value={section?.grading_term || "MIDTERM"}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={
                    isPending || isLoading ? "Loading ..." : "Select term"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-[120px]">
                {terms?.map((course) => (
                  <SelectItem key={course.value} value={course.value}>
                    <span className="text-nowrap text-start">
                      {isPending || isLoading ? "Loading ..." : course.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col p-2 px-5">
            <div className="flex flex-row gap-2 text-2xl font-bold">
              {section?.curriculum.subject.code} -{" "}
              {section?.curriculum.subject.title}{" "}
              <Badge
                variant={
                  section?.curriculum.subject.type === "MINOR"
                    ? "secondary"
                    : "default"
                }
                className="flex items-center justify-center px-2 text-xs"
              >
                {section?.curriculum.subject.type}
              </Badge>
            </div>
            <div className="text-xl font-bold">{section?.section_name}</div>
            <div>
              {
                category.find(
                  (cat) =>
                    cat.value ===
                    section?.curriculum.subject.gradingSystemCategory,
                )?.label
              }
            </div>
            <div className="text-base font-medium">
              {
                semesters.find(
                  (sem) =>
                    sem.value === section?.curriculum.curriculum.semester,
                )?.label
              }{" "}
              (
              {
                schoolYear().find(
                  (sem) =>
                    sem.value === section?.curriculum.curriculum.school_year,
                )?.label
              }
              )
            </div>
          </div>
          <div></div>
          <div className="flex w-full flex-row gap-5 p-5">
            <div className="flex flex-1 flex-col rounded bg-green-50 p-5 dark:bg-green-900">
              <div className="text-green-700 dark:text-green-100">
                Total Students
              </div>
              <div className="flex flex-col items-center justify-center p-5 text-5xl text-green-900 dark:text-green-50">
                {section?.Batch.length || 0}
                <span className="text-xl">Student/s</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col rounded bg-orange-50 p-5 dark:bg-orange-900">
              <div className="text-orange-700 dark:text-orange-100">
                Total Activities
              </div>
              <div className="flex flex-col items-center justify-center p-5 text-5xl text-orange-900 dark:text-orange-50">
                {section?.Activities.length || 0}
                <span className="text-xl">Activities/s</span>
              </div>
            </div>
          </div>
          <div className="px-5 pb-5 font-light text-orange-500">
            <span>Note:</span> Please update the current term to reflect either
            &quot;Midterm&quot; or &quot;Final Term,&quot; depending on the
            active term. All activities and attendance records will depend on
            this active term.
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
