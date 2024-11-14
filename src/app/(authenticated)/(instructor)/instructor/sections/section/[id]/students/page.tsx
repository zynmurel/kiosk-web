"use client";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { category, terms } from "@/lib/helpers/selections";
import { Badge } from "@/components/ui/badge";

const Attendance = () => {
  const { id } = useParams();
  const { user } = useStore();
  const [activeTerm, setActiveTerm] = useState<
    "MIDTERM" | "FINAL_TERM" | "BOTH"
  >("MIDTERM");

  const { data: section, isLoading } =
    api.instructor.section.getSection.useQuery(
      {
        id: Number(id),
        instructorId: Number(user?.id),
      },
      {
        enabled: false,
      },
    );
  const { data: record, isLoading: recordIsLoading } =
    api.instructor.section.getClassRecord.useQuery({
      sectionId: Number(id),
      grading_term: activeTerm,
    });
  const onChangeTerm = async (value: "MIDTERM" | "FINAL_TERM" | "BOTH") => {
    setActiveTerm(value);
  };
  console.log(record);
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-20">Loading...</div>
      ) : (
        <div className="flex flex-col pb-5">
          <div className="flex flex-row items-center gap-5 px-5 pt-5">
            <p className="text-xl font-bold">Term :</p>
            <Select
              disabled={recordIsLoading || isLoading}
              onValueChange={onChangeTerm}
              value={activeTerm}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={
                    recordIsLoading || isLoading ? "Loading ..." : "Select term"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-[120px]">
                {[...terms, { value: "BOTH", label: "Overall" }]?.map(
                  (course) => (
                    <SelectItem key={course.value} value={course.value}>
                      <span className="text-nowrap text-start">
                        {course.label}
                      </span>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col p-2 px-5">
            <div className="text-base font-bold">{section?.section_name}</div>
            <div className="flex flex-row gap-2 text-xl font-bold">
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
            <div>
              {
                category.find(
                  (cat) =>
                    cat.value ===
                    section?.curriculum.subject.gradingSystemCategory,
                )?.label
              }
            </div>
          </div>
          {/* class record */}
          {record && (
            <div className="w-full overflow-auto text-sm">
              <div className="flex flex-row border-r border-t">
                {/* names */}
                <div className="flex flex-col border-l">
                  {/* header */}
                  <div className="flex h-52 min-w-52 items-center justify-center border-b">
                    Student Name
                  </div>
                  {record.data.map((student, index) => {
                    return (
                      <div
                        key={index}
                        className="flex h-10 items-center border-b px-2"
                      >
                        {student.student}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  {/* header */}
                  <div className="flex h-52 min-w-52 flex-col items-center justify-center border-b">
                    <div className="flex h-full w-full items-center justify-center border-b border-l p-5">
                      Class Standing {record.grading.classStanding}%
                    </div>
                    <div className="flex h-full flex-row">
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center justify-center border-b border-l p-5">
                          Attendance
                        </div>
                        <div className="flex w-full flex-row">
                          <div className="flex h-10 w-20 flex-1 items-center justify-center border-l text-center">
                            No. of days Present
                          </div>
                          <div className="flex h-10 w-20 flex-1 items-center justify-center border-l text-center">
                            No. of Meetings
                          </div>
                          <div className="flex h-10 w-20 flex-1 items-center justify-center border-l text-center">
                            AVG (%)
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full flex-1 flex-col">
                        <div className="flex items-center justify-center border-b border-l p-5">
                          Quizzes
                        </div>
                        <div className="flex h-full w-full flex-row">
                          {record.header.quizzes.map((quiz, index) => (
                            <div
                              key={index}
                              className="flex h-10 w-20 flex-1 flex-col items-center justify-center border-l text-center"
                            >
                              <p>{quiz.code}</p>
                              <p>({quiz.total})</p>
                            </div>
                          ))}
                          <div className="flex h-10 w-20 flex-1 items-center justify-center border-l text-center">
                            AVG (%)
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full flex-1 flex-col">
                        <div className="flex items-center justify-center border-b border-l p-5">
                          Assignment
                        </div>
                        <div className="flex h-full w-full flex-row">
                          {record.header.assignment.map((quiz, index) => (
                            <div
                              key={index}
                              className="flex h-10 w-20 flex-1 flex-col items-center justify-center border-l text-center"
                            >
                              <p>{quiz.code}</p>
                              <p>({quiz.total})</p>
                            </div>
                          ))}
                          <div className="flex h-10 w-20 flex-1 items-center justify-center border-l text-center">
                            AVG (%)
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full flex-1 flex-col">
                        <div className="flex items-center justify-center border-b border-l p-5">
                          Others
                        </div>
                        <div className="flex h-full w-full flex-row">
                          {record.header.others.map((quiz, index) => (
                            <div
                              key={index}
                              className="flex h-10 w-20 flex-1 flex-col items-center justify-center border-l text-center"
                            >
                              <p>{quiz.code}</p>
                              <p>({quiz.total})</p>
                            </div>
                          ))}
                          <div className="flex h-10 w-20 flex-1 items-center justify-center border-l text-center">
                            AVG (%)
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-amber-100 p-5 text-center">
                        TOTAL (%)
                      </div>
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-amber-200 p-5 text-center">
                        FINAL CS
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-1 flex-col">
                      {record.data.map((student, index) => {
                        return (
                          <div key={index} className="flex w-full flex-row">
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l px-2 text-center">
                              {student.classStanding.attendance.present}
                            </div>
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l px-2 text-center">
                              {student.classStanding.attendance.noOfMeeting}
                            </div>
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l px-2 text-center">
                              {student.classStanding.attendance.average.toFixed(
                                1,
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            {rec.classStanding.quizzes.list.map((quiz, ind) => (
                              <div
                                key={ind}
                                className="flex h-10 w-20 flex-1 flex-col items-center justify-center border-b border-l text-center"
                              >
                                {quiz.score}
                              </div>
                            ))}
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center">
                              {rec.classStanding.quizzes.average.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            {rec.classStanding.assignment.list.map(
                              (quiz, ind) => (
                                <div
                                  key={ind}
                                  className="flex h-10 w-20 flex-1 flex-col items-center justify-center border-b border-l text-center"
                                >
                                  {quiz.score}
                                </div>
                              ),
                            )}
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center">
                              {rec.classStanding.assignment.average.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            {rec.classStanding.others.list.map(
                              (quiz, index) => (
                                <div
                                  key={index}
                                  className="flex h-10 w-20 flex-1 flex-col items-center justify-center border-b border-l text-center"
                                >
                                  {quiz.score}
                                </div>
                              ),
                            )}
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center">
                              {rec.classStanding.others.average.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex h-full flex-1 flex-col bg-amber-100">
                      {record.data.map((rec, index) => {
                        const average =
                          ((rec.classStanding.quizzes.average +
                            rec.classStanding.assignment.average +
                            rec.classStanding.others.average) /
                            300) *
                          100;
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center">
                              {average.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex h-full flex-1 flex-col bg-amber-200">
                      {record.data.map((rec, index) => {
                        const average =
                          ((rec.classStanding.quizzes.average +
                            rec.classStanding.assignment.average +
                            rec.classStanding.others.average) /
                            300) *
                          100;
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center">
                              {(
                                average *
                                (record.grading.classStanding / 100)
                              ).toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  {/* header */}
                  <div className="flex h-52 min-w-52 flex-col items-center justify-center border-b">
                    <div className="flex h-full w-full items-center justify-center border-b border-l p-5">
                      Major Exam {record.grading.majorExamination}%
                    </div>
                    <div className="flex h-full w-full flex-row">
                      {record.header.major_exam.map((ex, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l p-5 text-center"
                          >
                            {`${ex.code} (${ex.total})`}
                          </div>
                        );
                      })}
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-red-100 p-5 text-center">
                        AVG (%)
                      </div>
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-red-200 p-5 text-center">
                        FINAL ME
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            {rec.majorExam.exam.list.map((data, index) => (
                              <div
                                key={index}
                                className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center"
                              >
                                {data.score}
                              </div>
                            ))}
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l bg-red-100 text-center">
                              {rec.majorExam.totalAverage.toFixed(1)}
                            </div>
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l bg-red-200 text-center">
                              {(
                                rec.majorExam.totalAverage *
                                (record.grading.majorExamination / 100)
                              ).toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  {/* header */}
                  <div className="flex h-52 min-w-52 flex-col items-center justify-center border-b">
                    <div className="flex h-full w-full items-center justify-center border-b border-l p-5">
                      Major Course Output {record.grading.majorCourseOutput}%
                    </div>
                    <div className="flex h-full w-full flex-row">
                      {record.header.major_course_output.map((ex, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l p-5 text-center"
                          >
                            {`${ex.code} (${ex.total})`}
                          </div>
                        );
                      })}
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-green-100 p-5 text-center">
                        AVG (%)
                      </div>
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-green-200 p-5 text-center">
                        FINAL MCO
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            {rec.majorCourseOutput.output.list.map(
                              (data, index) => (
                                <div
                                  key={index}
                                  className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l text-center"
                                >
                                  {data.score}
                                </div>
                              ),
                            )}
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l bg-green-100 text-center">
                              {rec.majorCourseOutput.totalAverage.toFixed(1)}
                            </div>
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l bg-green-200 text-center">
                              {(
                                rec.majorCourseOutput.totalAverage *
                                (record.grading.majorCourseOutput / 100)
                              ).toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  {/* header */}
                  <div className="flex h-52 min-w-52 flex-col items-center justify-center border-b">
                    <div className="flex h-full w-full min-w-32 items-center justify-center border-b border-l p-5">
                      {`Final ${activeTerm === "BOTH" ? "Grade" : activeTerm === "FINAL_TERM" ? "Final Term Grade" : activeTerm === "MIDTERM" ? " Midterm Grade" : ""}`}
                    </div>
                    <div className="flex h-full w-full flex-row">
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-blue-100 p-5 text-center">
                        {/* AVG (%) */}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l bg-blue-100 text-center">
                              {rec.finalGrade.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  {/* header */}
                  <div className="flex h-52 min-w-52 flex-col items-center justify-center border-b">
                    <div className="flex h-full w-full min-w-32 items-center justify-center border-b border-l p-5">
                      STATUS
                    </div>
                    <div className="flex h-full w-full flex-row">
                      <div className="flex h-full w-20 flex-1 flex-col items-center justify-center border-l bg-blue-100 p-5 text-center">
                        {/* AVG (%) */}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex h-full flex-1 flex-col">
                      {record.data.map((rec, index) => {
                        return (
                          <div
                            key={index}
                            className="flex h-full w-full flex-row"
                          >
                            <div className="flex h-10 w-20 flex-1 items-center justify-center border-b border-l bg-blue-100 text-center">
                              {rec.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
