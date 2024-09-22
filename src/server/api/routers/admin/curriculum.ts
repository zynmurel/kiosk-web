import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminCurriculumRouter = createTRPCRouter({
  getCurriculums :publicProcedure
  .input(z.object({
    departmenCode: z.string(),
    courseCode: z.string(),
    schoolYear: z.string(),
    studentYear: z.number(),
    semester: z.number(),
}))
  .query(async({ input : {
    departmenCode,
    courseCode,
    schoolYear,
    studentYear,
    semester,
  } , ctx }) => {
    const whereStudentYear = studentYear === 0 ? {} : {student_year:studentYear}
    const whereSemester = semester === 0 ? {} : {semester}
    return await ctx.db.curriculum.findMany({
      where :{
        departmenCode,
        courseCode,
        school_year :schoolYear,
        ...whereStudentYear,
        ...whereSemester
      },
      include : {
        _count : {
          select:{
            CurriculumSubjects:true,
            CurriculumSection:true,}
        }
      }
    }).then((data)=>data.map((curr)=>{
      return {
        id: curr.id,
        courseCode: curr.courseCode,
        student_year: curr.student_year,
        school_year: curr.school_year,
        semester: curr.semester,
        sectionCount : curr._count.CurriculumSection,
        subjectCount : curr._count.CurriculumSubjects
      }
    }))
  }),
  getCurriculum :publicProcedure
  .input(z.object({
    departmenCode: z.string(),
    courseCode: z.string(),
    schoolYear: z.string(),
    studentYear: z.number(),
    semester: z.number(),
}))
  .query(async({ input : {
    departmenCode,
    courseCode,
    schoolYear,
    studentYear,
    semester,
  } , ctx }) => {
    return await ctx.db.curriculum.findFirst({
      where :{
        departmenCode,
        courseCode,
        school_year :schoolYear,
        student_year :studentYear,
        semester
      },
      include : {
        _count : {
          select:{
            CurriculumSubjects:true,
            CurriculumSection:true,}
        },
        CurriculumSubjects :true,
        CurriculumSection : {
          include:{
            _count:{
              select:{
                StudentBatch:true
              }
            }
          }
        }
      }
    }).then((curr)=>{
      if(curr){
        return {
          id: curr.id,
          courseCode: curr.courseCode,
          student_year: curr.student_year,
          school_year: curr.school_year,
          semester: curr.semester,
          sectionCount : curr._count.CurriculumSection,
          subjectCount : curr._count.CurriculumSubjects,
          subjects : curr.CurriculumSubjects,
          sections : curr.CurriculumSection
        }
      }else return undefined
    })
  }),
  createCurriculum: publicProcedure
    .input(z.object({
      departmenCode: z.string(),
      courseCode: z.string(),
      schoolYear: z.string(),
      studentYear: z.number(),
      semester: z.number(),
      subjects : z.array(z.object({subjectId:z.number(), instructorId:z.number()}))
  }))
    .mutation(async({ input : {
      departmenCode,
      courseCode,
      schoolYear,
      studentYear,
      semester,
      subjects
    } , ctx }) => {
      return await ctx.db.curriculum.create({
        data :{
          departmenCode,
          courseCode,
          student_year : studentYear,
          school_year :schoolYear,
          semester,
          CurriculumSubjects : {
            createMany : {
              data : subjects.map((sub)=>({
                ...sub
              }))
            }
          }
        }
      })
    }),
});
