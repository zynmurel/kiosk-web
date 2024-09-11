-- CreateEnum
CREATE TYPE "student_year" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH');

-- CreateEnum
CREATE TYPE "semester" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "purchase_status" AS ENUM ('PURCHASED', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "employeeID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "employeeID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "departmentCode" TEXT NOT NULL,
    "employeeID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "redeemedPoints" DOUBLE PRECISION NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "studentID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Businness" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Businness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "departmenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "code" TEXT NOT NULL,
    "departmenId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "student_year" "student_year" NOT NULL,
    "semester" "semester" NOT NULL,
    "school_year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectsOnCurriculum" (
    "id" SERIAL NOT NULL,
    "curriculumId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "subjectCode" TEXT NOT NULL,

    CONSTRAINT "SubjectsOnCurriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBatch" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "subjectOnCurriculumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttendance" (
    "id" SERIAL NOT NULL,
    "studentBatchId" INTEGER NOT NULL,
    "redeemed" BOOLEAN NOT NULL,
    "present" BOOLEAN NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "StudentAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTest" (
    "id" SERIAL NOT NULL,
    "studentBatchId" INTEGER NOT NULL,
    "testTitle" TEXT NOT NULL,
    "redeemed" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "totalPossibleScore" INTEGER NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "StudentTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConvertedPointsToGrade" (
    "id" SERIAL NOT NULL,
    "studentBatchId" INTEGER NOT NULL,
    "testTitle" TEXT NOT NULL,
    "redeemed" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "totalPossibleScore" INTEGER NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "ConvertedPointsToGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinnessProduct" (
    "id" SERIAL NOT NULL,
    "bussinessId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "BusinnessProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchasedProduct" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "purchase_status" "purchase_status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchasedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_employeeID_key" ON "SuperAdmin"("employeeID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_employeeID_key" ON "Admin"("employeeID");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_employeeID_key" ON "Instructor"("employeeID");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentID_key" ON "Student"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "Businness_username_key" ON "Businness"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_school_year_student_year_courseId_semester_key" ON "Curriculum"("school_year", "student_year", "courseId", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectsOnCurriculum_subjectCode_curriculumId_key" ON "SubjectsOnCurriculum"("subjectCode", "curriculumId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_departmentCode_fkey" FOREIGN KEY ("departmentCode") REFERENCES "Department"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_departmentCode_fkey" FOREIGN KEY ("departmentCode") REFERENCES "Department"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmenId_fkey" FOREIGN KEY ("departmenId") REFERENCES "Department"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_departmenId_fkey" FOREIGN KEY ("departmenId") REFERENCES "Department"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectsOnCurriculum" ADD CONSTRAINT "SubjectsOnCurriculum_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectsOnCurriculum" ADD CONSTRAINT "SubjectsOnCurriculum_subjectCode_fkey" FOREIGN KEY ("subjectCode") REFERENCES "Subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectsOnCurriculum" ADD CONSTRAINT "SubjectsOnCurriculum_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_subjectOnCurriculumId_fkey" FOREIGN KEY ("subjectOnCurriculumId") REFERENCES "SubjectsOnCurriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_studentBatchId_fkey" FOREIGN KEY ("studentBatchId") REFERENCES "StudentBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTest" ADD CONSTRAINT "StudentTest_studentBatchId_fkey" FOREIGN KEY ("studentBatchId") REFERENCES "StudentBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConvertedPointsToGrade" ADD CONSTRAINT "ConvertedPointsToGrade_studentBatchId_fkey" FOREIGN KEY ("studentBatchId") REFERENCES "StudentBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinnessProduct" ADD CONSTRAINT "BusinnessProduct_bussinessId_fkey" FOREIGN KEY ("bussinessId") REFERENCES "Businness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedProduct" ADD CONSTRAINT "PurchasedProduct_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedProduct" ADD CONSTRAINT "PurchasedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BusinnessProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
