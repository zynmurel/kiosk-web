"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divide, Trash } from "lucide-react";
import { type AvailableStudentsType } from "@/lib/types/instructor/section";
import TableStateAndPagination from "./_components/table-components/table-footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type PaginationType } from "@/lib/types/pagination";
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
import { category, schoolYear, semesters } from "@/lib/helpers/selections";

const terms = [
  {
    value: "MIDTERM",
    label: "Midterm",
  },
  {
    value: "FINAL_TERM",
    label: "Final Term",
  },
];

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
  console.log(section?.grading_term);
  const onChangeTerm = async (value: "MIDTERM" | "FINAL_TERM") => {
    console.log(value);
    await mutateAsync({
      sectionId: Number(id),
      grading_term: value,
    });
  };
  console.log(section?.curriculum.subject.type);
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-10">Loading...</div>
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
            <div className="flex flex-1 flex-col rounded border border-green-50 bg-green-50 p-5 shadow shadow-green-200">
              <div className="text-green-700">Total Students</div>
              <div className="flex flex-col items-center justify-center p-5 text-5xl text-green-900">
                {section?.Batch.length || 0}
                <span className="text-xl">Student/s</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col rounded border border-orange-50 bg-orange-50 p-5 shadow shadow-orange-200">
              <div className="text-orange-700">Total Activities</div>
              <div className="flex flex-col items-center justify-center p-5 text-5xl text-orange-900">
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
