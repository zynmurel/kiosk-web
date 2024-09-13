"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NotepadText } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const cards = [
    { title: "Quizzes", count: 5 },
    { title: "Exam", count: 3 },
    { title: "Attendance", count: 7 },
    { title: "Other activities", count: 3 },
  ];

  return (
    <div className="bg-blue-50 p-20">
      <div className="grid grid-cols-2 gap-4 hover:brightness-150">
        {cards.map((card, index) => (
          <div className="rounded-t-md bg-[#fefefe] pt-4" key={index}>
            <Card
              className="relative flex h-56 cursor-pointer items-center justify-center gap-4 rounded-md bg-teal-700 font-bold text-white"
              onClick={() => router.push("/student/grading/1")}
            >
              <NotepadText size={50} />
              <Label className="text-3xl font-semibold">{card.title}</Label>
              <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-400 text-xl text-white">
                {card.count}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
