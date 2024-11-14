"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { addDays, format, isWithinInterval } from "date-fns";
import { Activity, Calendar as CalendarIcon, HandMetal } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SkeletalLoading from "@/app/_components/skelal";
import { useStore } from "@/lib/store/app";
import { useToast } from "@/hooks/use-toast";

enum ActivityType {
  ALL = "ALL",
  MAJOR_EXAM = "MAJOR_EXAM",
  MAJOR_COURSE_OUTPUT = "MAJOR_COURSE_OUTPUT",
  QUIZ = "QUIZ",
  ASSIGNMENT = "ASSIGNMENT",
  OTHERS = "OTHERS",
}

export default function Page() {
  const { toast } = useToast();
  const { user } = useStore();
  const router = useRouter();
  const { id } = useParams();
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [activeTab, setActiveTab] = useState("attendance");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ActivityType>(ActivityType.ALL);

  const { data, isLoading, refetch } =
    api.student.students.getStudentSection.useQuery(
      {
        id: Number(id),
        ActivityTypeEnum: filterType,
      },
      {
        enabled: !Number.isNaN(Number(id)),
      },
    );

  console.log("DATA", data);
  const { data: points, refetch: refetchPoints2 } =
    api.student.points.getTotalPointsOfStudents.useQuery({
      studentId: String(user?.username),
    });
  const { data: settingsPoints, refetch: refetchPoints } =
    api.student.students.getSettingsPoints.useQuery();

  const getPoints = api.student.students.redeemPoints.useMutation({
    onSuccess: async () => {
      refetchPoints2();
      toast({
        title: "Successfully get points  reward",
      });
      await refetch();
      await refetchPoints();
    },
  });

  const resetDate = () => {
    setDate(undefined);
  };

  const filteredAttendance = data?.data?.AttedanceScore.filter(
    (attendance: any) => {
      if (!date || !attendance.attendance.date) return true;
      const attendanceDate = new Date(attendance.attendance.date);
      return isWithinInterval(attendanceDate, {
        start: date.from as Date,
        end: date.to as Date,
      });
    },
  );

  const filteredActivities = data?.data?.ActivityScores.filter(
    (activity: any) => {
      return activity.activity.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    },
  );

  const handlePointsReward = async (points: any) => {
    console.log(points);

    await getPoints.mutateAsync({
      userId: points.userId,
      points: points.points,
      activityType: points.ActivityType,
      activityId: points.id,
    });
  };
  const classRecordData = filteredAttendance?.map((attendance: any) => {
    const activityOnSameDay = filteredActivities?.find(
      (activity: any) => activity.activity.date === attendance.attendance.date,
    );

    return {
      date: attendance.attendance.date,
      attendance: attendance.present ? "Present" : "Absent",
      quiz:
        activityOnSameDay?.activity.activity_type === "QUIZ"
          ? activityOnSameDay.score
          : "-",
      assignment:
        activityOnSameDay?.activity.activity_type === "ASSIGNMENT"
          ? activityOnSameDay.score
          : "-",
      others:
        activityOnSameDay?.activity.activity_type === "OTHERS"
          ? activityOnSameDay.score
          : "-",
      examGrade:
        activityOnSameDay?.activity.activity_type === "MAJOR_EXAM"
          ? activityOnSameDay.score
          : "-",
      mcoGrade:
        activityOnSameDay?.activity.activity_type === "MAJOR_COURSE_OUTPUT"
          ? activityOnSameDay.score
          : "-",
    };
  });
  const finalGrade = (
    (data?.mco || 0) * 0.5 +
    (data?.exam || 0) * 0.3 +
    (data?.classStanding || 0) * 0.2
  ).toFixed(2);

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletalLoading />
            <SkeletalLoading />
            <SkeletalLoading />
          </>
        ) : (
          <>
            <Card key={1} className="border-[1px] border-teal-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-teal-700">
                  MAJOR COURSE OUTPUT (50 %)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-bold">
                  {`${data?.mco.toFixed(2)}% out of 100%`} Total:{" "}
                  {((data?.mco || 0) * 0.5).toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card key={2} className="border-[1px] border-teal-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-teal-700">
                  MAJOR EXAM (30 %)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-bold">
                  {`${data?.exam.toFixed(2)}% out of 100%`} Total:{" "}
                  {((data?.exam || 0) * 0.3).toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card key={3} className="border-[1px] border-teal-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-teal-700">
                  CLASS STANDING (20 %)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="clear-start text-xs font-bold">
                  {`${data?.classStanding.toFixed(2)} % out of 100%`} Total:{" "}
                  {((data?.classStanding || 0) * 0.2).toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card key={4} className="border-[1px] border-teal-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-teal-700">
                  FINAL GRADE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-bold">Total: {finalGrade}%</div>
                <div className="mt-2 text-sm">
                  <span className="font-semibold">Breakdown:</span>
                  <ul className="list-inside list-disc">
                    <li>MCO: {((data?.mco || 0) * 0.5).toFixed(2)}%</li>
                    <li>Exam: {((data?.exam || 0) * 0.3).toFixed(2)}%</li>
                    <li>
                      Class Standing:{" "}
                      {((data?.classStanding || 0) * 0.2).toFixed(2)}%
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="classRecord">Class Record</TabsTrigger>
        </TabsList>
        <div className={`mt-4 flex space-x-4`}>
          <Input
            placeholder="Search by activity name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={` ${activeTab !== "activity" ? "hidden" : ""} max-w-sm`}
          />
          <div
            className={`${activeTab !== "attendance" ? "hidden" : ""} grid gap-2`}
          >
            <p className="my-4 text-xs">Select date range:</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from && date?.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {date && (
              <Button variant="outline" onClick={resetDate}>
                Revert to Default
              </Button>
            )}
          </div>

          <div className={`${activeTab !== "activity" ? "hidden" : ""}`}>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as ActivityType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ActivityType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="attendance">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>date</TableHead>
                <TableHead>status</TableHead>
                <TableHead>Points to claim</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance?.map((attendance: any) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.attendance.date}</TableCell>
                  <TableCell>
                    {attendance.present ? (
                      <p className="text-xs text-green-500">PRESENT</p>
                    ) : (
                      <p className="text-xs text-red-500">ABSENT</p>
                    )}
                  </TableCell>
                  <TableCell>{attendance.attendance.date}</TableCell>
                  <TableCell>
                    <Button
                      disabled={attendance?.redeemed || getPoints.isPending}
                      onClick={() => {
                        const points = {
                          id: attendance.id,
                          ActivityType: "attendance",
                          userId: user?.username,
                          points: settingsPoints?.defaultAttendancePoints,
                        };
                        handlePointsReward(points);
                      }}
                      className={`${attendance.present ? "" : "hidden"}`}
                    >
                      {settingsPoints?.defaultAttendancePoints} points{" "}
                      <span
                        className={`mx-1 ${attendance?.redeemed ? "" : "hidden"} `}
                      >
                        {" "}
                        claimed
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="activity">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Score Percentage</TableHead>
                <TableHead>points to Redeem </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities?.map((activity: any) => {
                console.log("Activity:", activity); // Log each activity object

                const activityPoints =
                  activity.settedRedeemablePoints ||
                  activity.activity.activity_type === "MAJOR_EXAM"
                    ? settingsPoints?.defaultMajorExamPoints
                    : activity.activity.activity_type === "MAJOR_COURSE_OUTPUT"
                      ? settingsPoints?.defaultMCOPoints
                      : settingsPoints?.defaultClassStandingPoints;

                // Calculate score percentage
                const scorePercentage = (
                  (activity.score / activity.activity.totalPossibleScore) *
                  100
                ).toFixed(2);

                return (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.activity.title}</TableCell>
                    <TableCell>
                      {activity.score} out of{" "}
                      {activity.activity.totalPossibleScore}
                    </TableCell>
                    <TableCell>{scorePercentage}%</TableCell>

                    <TableCell>
                      <Button
                        disabled={
                          activity.redeemed ||
                          getPoints.isPending ||
                          Number(scorePercentage) < 75
                        }
                        onClick={() => {
                          const points = {
                            id: activity.id,
                            ActivityType: "activity",
                            userId: user?.username,
                            points: activityPoints,
                          };
                          handlePointsReward(points);
                        }}
                      >
                        <div>
                          {Number(scorePercentage) < 75 ? (
                            " failure to redeem not passed"
                          ) : (
                            <div>
                              {activityPoints}
                              <span className="ml-1">points</span>
                            </div>
                          )}
                        </div>

                        <span
                          className={`mx-1 ${activity?.redeemed ? "" : "hidden"} `}
                        >
                          {" "}
                          claimed
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="classRecord">
          <h2 className="mb-4 text-2xl font-bold">Class Record</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Others</TableHead>
                <TableHead>Exam Grade</TableHead>
                <TableHead>MCO Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classRecordData?.map((record: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.attendance}</TableCell>
                  <TableCell>{record.quiz}</TableCell>
                  <TableCell>{record.assignment}</TableCell>
                  <TableCell>{record.others}</TableCell>
                  <TableCell>{record.examGrade}</TableCell>
                  <TableCell>{record.mcoGrade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
