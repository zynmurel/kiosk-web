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
            To pass a course, a particular student must accumulate at least 75
            points through the course requirements. (BOR Resolution No. 21, S.
            2020)
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grading System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
          <div>
        <h2 className="font-bold">Grading Computation Methods</h2>
        <div className="space-y-4">
          <div>
            <h1 className="font-bold">Zero-Based Grading</h1>
            <p>
              <strong>Formula:</strong> Final Grade = (Raw Score / Total Items) x 100
            </p>
            <p>
              This method calculates the final grade based on the proportion of the raw score
to the total items and converts it into a percentage.
            </p>
          </div>
          <div>
            <h1 className="font-bold">Transmuted Grading</h1>
            <p>
              <strong>Formula:</strong> Final Grade = (Raw Score / Total Items) x 50 + 50
            </p>
            <p>
              This method adjusts the grading scale by transmuting scores to ensure a minimum grade of 50% for zero raw scores.
            </p>
          </div>
        </div>
      </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h2 className="font-bold">
                Category A - Major Course Output 50%, Major Examination 30%,
                Class Standing 20%
              </h2>
              <div className="space-y-4">
                <div>
                  <h1>
                    Major Course Output (50%): This category consists of
                    activities categorized as Major Course Output.
                  </h1>
                </div>
                <div>
                  <h1>
                    Major Examination (30%): This includes activities
                    categorized as Major Exam.
                  </h1>
                </div>
                <div>
                  <h1>
                    Class Standing (20%): Class Standing includes attendances
                    and activities categorized as Exam, Quiz, Assignment,
                    Projects, and Others.
                  </h1>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-bold">
                Category B - Major Course Output 40%, Major Examination 30%,
                Class Standing 30%
              </h2>
              <div className="space-y-4">
                <div>
                  <h1>
                    Major Course Output (40%): This category consists of
                    activities categorized as Major Course Output.
                  </h1>
                </div>
                <div>
                  <h1>
                    Major Examination (30%): This includes activities
                    categorized as Major Exam.
                  </h1>
                </div>
                <div>
                  <h1>
                    Class Standing (30%): Class Standing includes attendances
                    and activities categorized as Exam, Quiz, Assignment,
                    Projects, and Others.
                  </h1>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-bold">
                Category C - Major Course Output 60%, Major Examination 20%,
                Class Standing 20%
              </h2>
              <div className="space-y-4">
                <div>
                  <h1>
                    Major Course Output (60%): This category consists of
                    activities categorized as Major Course Output.
                  </h1>
                </div>
                <div>
                  <h1>
                    Major Examination (20%): This includes activities
                    categorized as Major Exam.
                  </h1>
                </div>
                <div>
                  <h1>
                    Class Standing (20%): Class Standing includes attendances
                    and activities categorized as Exam, Quiz, Assignment,
                    Projects, and Others.
                  </h1>
                </div>
              </div>
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
              <h1>Major Course Output:</h1>
              <p>
                Refers to the requirements reflected in the course syllabus that
                lead to the attainment of the required minimum set of learning
                outcomes specified in every course/subject.
              </p>
            </div>
            <div>
              <h1>Major Exams:</h1>
              <p>
                Includes the written and/or oral exams as scheduled in the
                learning plan.
              </p>
            </div>
            <div>
              <h1>Class Standing:</h1>
              <p>
                Covers the quizzes, recitation, homework, and reports, among
                others.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
