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
          }
        }
      }
    }).then((data)=>data.map((curr)=>{
      return {
        id: curr.id,
        courseCode: curr.courseCode,
        student_year: curr.student_year,
        school_year: curr.school_year,
        semester: curr.semester,
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
          }
        },
        CurriculumSubjects :{
          include : {
            InstructorOnSubject :true
          }
        },
      }
    }).then((curr)=>{
      if(curr){
        return {
          id: curr.id,
          courseCode: curr.courseCode,
          student_year: curr.student_year,
          school_year: curr.school_year,
          semester: curr.semester,
          subjectCount : curr._count.CurriculumSubjects,
          subjects : curr.CurriculumSubjects,
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
      subjects : z.array(z.object({subjectId:z.number(), instructorIds:z.array(z.number())}))
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
                subjectId : sub.subjectId,
              }))
            }
          }
        },
        include : {
          CurriculumSubjects : true
        }
      }).then(async(data)=>{
        if(data){
          const { CurriculumSubjects } = data
          const instructors = await Promise.all(
            CurriculumSubjects.map((currSubj)=>{
              const instructorIds = subjects.find((sub)=>sub.subjectId===currSubj.subjectId)?.instructorIds || []
              return ctx.db.instructorOnSubject.createMany({
                data : instructorIds.map((instructorId)=>{
                  return {
                    curriculumSubjectId : currSubj.id,
                    instructorId
                  }
                })
              })
            })
          )
          return {...data, ...instructors}
        } else {
        return data
      }
      })
    }),
});
