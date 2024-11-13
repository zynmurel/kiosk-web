"use client";
import { InstructorSectionContext } from "@/lib/context/instructor/section";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StudentsDrawer from "./_components/students-drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "./_components/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { semesters, studentYear } from "@/lib/helpers/selections";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { CreateSectionSchema } from "../_components/form-schema";

const Page = () => {
  const { instructorOnSubjectId } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [showStudents, setShowStudents] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState<
    string | undefined
  >(undefined);
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<
    AvailableStudentsType[]
  >([]);
  const [pagination, setPagination] = useState<PaginationType>({
    take: 10,
    skip: 0,
  });

  const form = useForm<z.infer<typeof CreateSectionSchema>>({
    resolver: zodResolver(CreateSectionSchema),
  });
  const { data: instructorOnSubject, isLoading: instructorOnSubjectIsLoading } =
    api.instructor.section.getInstructorOnSubject.useQuery(
      {
        id: Number(instructorOnSubjectId),
      },
      {
        enabled: !Number.isNaN(Number(instructorOnSubjectId)),
      },
    );

  api.instructor.subject.getSelectableCourseCode.useQuery(
    {
      id: user?.id || 0,
    },
    {
      enabled: !!user?.id,
    },
  );

  api.instructor.section.getAvailableStudents.useQuery(
    {
      courseCode: selectedCourseCode || "",
    },
    {
      enabled: !!selectedCourseCode,
    },
  );
  const { refetch } = api.instructor.subject.getInstructorsSubject.useQuery(
    {
      curriculumId: Number(instructorOnSubject?.CurriculumSubjects.id),
      instructorId: user?.id || 0,
    },
    {
      enabled: false,
    },
  );

  const { mutateAsync: createSection, isPending: createSectionIsPending } =
    api.instructor.section.createSection.useMutation({
      onSuccess: async (data) => {
        toast({
          title: "Success!",
          description: "Section Created.",
        });
        await refetch();
        const { code, title, type } = data.curriculum.subject;
        router.push(
          `/instructor/subjects/${data.curriculumSubjectId}/${data.instructorId}/${code}/${title}/${type}/${data.curriculum.curriculum.courseCode}`,
        );
      },
      onError: (e) => {
        if (e.message.includes("Unique constraint failed on the fields")) {
          toast({
            variant: "destructive",
            title: "Duplicate Section",
            description:
              "This Course and Subject already has this section name",
          });
          form.setError("section_name", { message: "Already exist" });
        } else {
          toast({
            variant: "destructive",
            title: "Failed",
            description: e.message,
          });
        }
      },
    });

  async function onSubmit(data: z.infer<typeof CreateSectionSchema>) {
    try {
      if (instructorOnSubject) {
        const {
          id,
          instructorId,
          curriculumSubjectId,
          CurriculumSubjects: {
            curriculum: { courseCode, student_year },
          },
        } = instructorOnSubject;
        await createSection({
          instructorId: id,
          curriculumSubjectId,
          section_name: `${courseCode}-${student_year} ${data.section_name}`,
          studentIDs: selectedStudents.map((stud) => ({
            studentId: stud.id,
          })),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (instructorOnSubject?.CurriculumSubjects.curriculum.courseCode)
      setSelectedCourseCode(
        instructorOnSubject?.CurriculumSubjects.curriculum.courseCode,
      );
  }, [instructorOnSubject]);

  return (
    <InstructorSectionContext.Provider
      value={{ showStudents, setShowStudents }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="grid w-full gap-5 xl:grid-cols-3">
            <div>
              <Card x-chunk="dashboard-04-chunk-1" className="relative w-full">
                {instructorOnSubjectIsLoading && (
                  <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background">
                    <Loading />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="md:text-4xl">
                    {
                      instructorOnSubject?.CurriculumSubjects.curriculum
                        .courseCode
                    }
                  </CardTitle>
                  <CardDescription className="md:text-base">
                    {
                      instructorOnSubject?.CurriculumSubjects.curriculum.course
                        .title
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="-mt-3 flex flex-row gap-2">
                    <p className="text-base font-bold">School Year : </p>
                    <p>
                      {
                        instructorOnSubject?.CurriculumSubjects.curriculum
                          .school_year
                      }
                    </p>
                  </div>
                  <div className="mt-2 flex flex-row gap-2">
                    <p className="text-base font-bold">Student Year : </p>
                    <p>
                      {
                        studentYear.find(
                          (sy) =>
                            sy.value ===
                            instructorOnSubject?.CurriculumSubjects.curriculum
                              .student_year,
                        )?.label
                      }
                    </p>
                  </div>
                  <div className="mt-2 flex flex-row gap-2">
                    <p className="text-base font-bold">Semester : </p>
                    <p>
                      {
                        semesters.find(
                          (sem) =>
                            sem.value ===
                            instructorOnSubject?.CurriculumSubjects.curriculum
                              .semester,
                        )?.label
                      }
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-lg font-bold">Subject</p>
                  <div className="mt-2 flex flex-col gap-1">
                    <p className="text-base font-bold">
                      {instructorOnSubject?.CurriculumSubjects.subject.code}
                    </p>
                    <p>
                      {instructorOnSubject?.CurriculumSubjects.subject.title}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="mb-4 flex items-end gap-4 xl:flex-row">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="section_name"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel>Section Name</FormLabel>
                            <FormControl>
                              <div className="flex flex-row items-center gap-5">
                                <p className="text-2xl font-bold">
                                  {(instructorOnSubject?.CurriculumSubjects
                                    .curriculum.courseCode || "") +
                                    " - " +
                                    (instructorOnSubject?.CurriculumSubjects
                                      .curriculum.student_year || "")}
                                </p>
                                <Input
                                  className="max-w-32 text-xl font-semibold uppercase"
                                  placeholder="Ex. A"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              This is the letter code of your section.
                            </FormDescription>
                            <FormMessage className="absolute -bottom-5" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="xl:col-span-2">
              <Card
                x-chunk="dashboard-04-chunk-1"
                className="relative w-full p-0"
              >
                <CardHeader className="flex flex-row items-center justify-between bg-muted px-5 py-1 font-semibold">
                  Students
                  <StudentsDrawer
                    isLoading={instructorOnSubjectIsLoading}
                    courseCode={selectedCourseCode}
                    setCourseCode={setSelectedCourseCode}
                    searchText={searchStudent}
                    setSearchText={setSearchStudent}
                    selectedStudents={selectedStudents}
                    setSelectedStudents={setSelectedStudents}
                  />
                </CardHeader>
                <CardContent className="flex flex-col px-5 py-2 font-semibold">
                  {!selectedStudents.length ? (
                    <div
                      onClick={() => setShowStudents(true)}
                      className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed p-10 text-sm font-normal text-muted-foreground hover:bg-muted"
                    >
                      <Plus size={20} />
                      Add Students
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedStudents
                            .sort((studA, studB) =>
                              studA.name.localeCompare(studB.name),
                            )
                            ?.slice(
                              pagination.skip,
                              pagination.skip + pagination.take,
                            )
                            .map((student) => (
                              <TableRow key={student.id}>
                                <TableCell className="w-[100px] py-2">
                                  {student.studentID}
                                </TableCell>
                                <TableCell className="py-2">
                                  {student.name}
                                </TableCell>
                                <TableCell className="w-[100px] py-2">
                                  <Button
                                    onClick={() =>
                                      setSelectedStudents((prev) =>
                                        prev.filter((p) => p.id !== student.id),
                                      )
                                    }
                                    type="button"
                                    variant={"destructive"}
                                    size={"sm"}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      <TableStateAndPagination
                        isLoading={false}
                        data={selectedStudents || []}
                        pagination={pagination}
                        setPagination={setPagination}
                      />
                    </>
                  )}

                  <div className="my-2 flex w-full justify-end">
                    <Button
                      disabled={
                        !selectedStudents.length ||
                        !instructorOnSubject ||
                        createSectionIsPending
                      }
                    >
                      Create Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </InstructorSectionContext.Provider>
  );
};

export default Page;
