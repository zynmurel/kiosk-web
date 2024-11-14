import { format } from "date-fns";

export const studentYear = [
  {
    label: "1st Year",
    value: 1,
  },
  {
    label: "2nd Year",
    value: 2,
  },
  {
    label: "3rd Year",
    value: 3,
  },
  {
    label: "4th Year",
    value: 4,
  },
  {
    label: "5th Year",
    value: 5,
  },
];

export const semesters = [
  {
    label: "1st Semester",
    value: 1,
  },
  {
    label: "2nd Semester",
    value: 2,
  },
];

export const yearNow = Number(format(new Date(), "yyyy"));

export const schoolYear = (startYear = 2023) => {
  const availableYears = [];

  for (startYear; startYear <= yearNow + 1; startYear++) {
    availableYears.push({
      label: `${startYear}-${startYear + 1}`,
      value: `${startYear}-${startYear + 1}`,
    });
  }

  return availableYears;
};

export const activityTypes = [
  {
    value: "ALL",
    label: "ALL",
  },
  {
    value: "EXAM",
    label: "EXAM",
  },
  {
    value: "QUIZ",
    label: "QUIZ",
  },
  {
    value: "ASSIGNMENT",
    label: "ASSIGNMENT",
  },
  {
    value: "PROJECT",
    label: "PROJECT",
  },
  {
    value: "OTHERS",
    label: "OTHERS",
  },
  {
    value: "MAJOR_EXAM",
    label: "MAJOR EXAM",
  },
  {
    value: "MAJOR_COURSE_OUTPUT",
    label: "MAJOR COURSE OUTPUT",
  },
];
export const category = [
  {
    value: "A",
    label:
      "Category A - Major Course Output 50%, Major Examination 30%, Class Standing 20%",
  },
  {
    value: "B",
    label:
      "Category B - Major Course Output 40%, Major Examination 30%, Class Standing 30%",
  },
  {
    value: "C",
    label:
      "Category C - Major Course Output 60%, Major Examination 20%, Class Standing 20%",
  },
];

export const terms = [
  {
    value: "MIDTERM",
    label: "Midterm",
  },
  {
    value: "FINAL_TERM",
    label: "Final Term",
  },
];
