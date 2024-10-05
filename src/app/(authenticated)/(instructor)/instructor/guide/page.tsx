// pages/computation-of-grades.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  return (
    <div className="container mx-auto py-2">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Computation of Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To pass a course, a particular student must accumulate at least 75 points through the course requirements. (BOR Resolution No. 21, S. 2020)
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h1 >Major Course Output (50%) : Major Course Output consists of activities categorized as Major Course Output.</h1>
            </div>
            <div>
              <h1 >Major Exams (30%) : Major Exams consists of activities categorized as Major Exam.</h1>
            </div>
            <div>
              <h1 >Class Standing (20%) : Class Standing consists of Attendances and activities categorized as Exam, Quiz, Assignment, Projects and Others.</h1>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explanation of Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h1 >Major Course Output:</h1>
              <p>
                Refers to the requirements reflected in the course syllabus that lead to the attainment of the required minimum set of learning outcomes specified in every course/subject.
              </p>
            </div>
            <div>
              <h1 >Major Exams:</h1>
              <p>
                Includes the written and/or oral exams as scheduled in the learning plan.
              </p>
            </div>
            <div>
              <h1 >Class Standing:</h1>
              <p>
                Covers the quizzes, recitation, homework, and reports, among others.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page