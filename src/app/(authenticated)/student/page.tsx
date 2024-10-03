"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";

import {
  schoolYear,
  semesters,
  studentYear,
  yearNow,
} from "@/lib/helpers/selections";
import { SelectItemText } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [search, setSearch] = React.useState<string>("");

  // New state for selected semester and school year
  const [selectedSemester, setSelectedSemester] = React.useState<number>(0);
  const [schoolYearLevel, setSchoolYearLevel] = React.useState<number>(0);
  const [selectedSchoolYearFrom, setSelectedSchoolYearFrom] =
    React.useState<string>("");

  const router = useRouter();
  const { user } = useStore();
  const { data, isLoading, refetch } =
    api.student.students.getStudentsCourse.useQuery({
      id: user?.user_id,
      studentId: String(user?.username),
      semester: selectedSemester,
      schoolYearLevel: schoolYearLevel,
      schoolYear: selectedSchoolYearFrom,
    });

  const filteredData = data?.filter((subject) => {
    const subjectTitle = subject.section.curriculum.subject.title.toLowerCase();
    return subjectTitle.includes(search.toLowerCase());
  });

  const handleSchoolyearLevelChange = (value: string) => {
    const numericValue = Number(value);
    setSchoolYearLevel(numericValue);
    refetch();
  };
  const handleSemesterChange = (value: string) => {
    const numericValue = Number(value);
    setSelectedSemester(numericValue);
    refetch();
  };

  const handleSchoolYearFrom = (value: string) => {
    setSelectedSchoolYearFrom(value);
    console.log("Selected School Year From:", value);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedSemester(0);
    setSchoolYearLevel(0);
    setSelectedSchoolYearFrom("");
    // Optionally refetch data to reflect the reset
    refetch();
  };

  console.log(data);

  return (
    <div className="w-full">
      <Label className="text-3xl text-teal-700">List of Courses</Label>
      <div className="mb-20 mt-20 flex flex-col items-end gap-4 sm:flex-row sm:justify-start sm:gap-4">
        <Input
          placeholder="Filter subject name.."
          className="my-1 w-full max-w-xs sm:max-w-sm md:max-w-md"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="w-full sm:w-[300px]">
          <Select onValueChange={handleSchoolyearLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select  StudentYear" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a SchoolYear</SelectLabel>
                {studentYear.map((year) => (
                  <SelectItem key={year.value} value={String(year.value)}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[300px]">
          <Select onValueChange={handleSemesterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Semester</SelectLabel>
                {semesters.map((semester) => (
                  <SelectItem
                    key={semester.value}
                    value={String(semester.value)}
                  >
                    {semester.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col sm:w-[300px]">
          <Select onValueChange={handleSchoolYearFrom}>
            <SelectTrigger>
              <SelectValue placeholder="Select School Year From" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>School Year From</SelectLabel>
                {schoolYear().map((year) => (
                  <SelectItem key={year.value} value={String(year.value)}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={resetFilters}>Reset Filter</Button>
        </div>
      </div>

      <div className="grid cursor-pointer grid-cols-1 gap-6 px-5 py-5 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="flex animate-pulse flex-col items-center justify-center rounded-sm bg-gray-200 shadow-md drop-shadow-md"
            >
              <div className="mb-2 h-4 w-full rounded bg-gray-300" />
              <div className="mb-2 h-6 w-full rounded bg-gray-300" />
              <div className="h-4 w-full rounded bg-gray-300" />
            </Card>
          ))
        ) : filteredData && filteredData.length > 0 ? (
          filteredData.map((subject) => (
            <Card
              onClick={() =>
                router.push(`/student/subject/${subject.section.id}`)
              }
              key={subject.id}
              className="flex flex-col items-center justify-center rounded-sm shadow-md drop-shadow-md"
            >
              <div className="w-full bg-teal-700 p-2 text-xs font-semibold text-white underline">
                {subject.section.curriculum.subject.code}
              </div>
              <div className="px-4 py-6 font-semibold text-teal-700">
                {subject.section.curriculum.subject.title}
              </div>
              <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIk9h0AXxp8pbclIKLQxrKlwnpHXRMd6mmxg&s"
                  width={20}
                />
                <Label className="text-xs font-extralight">
                  {subject.section.instructor?.instructor.firstName}{" "}
                  {subject.section.instructor?.instructor.lastName}
                </Label>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No subjects found
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
