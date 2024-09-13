"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectLabel } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-full">
      <Input
        placeholder="filter  subject name.."
        className="my-1 ml-10 flex w-72"
      />

      <div className="grid cursor-pointer grid-cols-4 gap-10 px-10 py-5 pb-10">
        {Array.from({ length: 16 }).map((_, index) => (
          <Card
            onClick={() => router.push("/student/subject/1")}
            key={index}
            className="flex flex-col items-center justify-center rounded-sm shadow-md drop-shadow-md"
          >
            <div className="w-full bg-teal-700 p-2 text-xs font-semibold text-white underline">
              ITE 103
            </div>
            <div className="px-4 py-6 font-semibold text-teal-700">
              FILIPINO
            </div>
            <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIk9h0AXxp8pbclIKLQxrKlwnpHXRMd6mmxg&s"
                width={20}
              />
              <Label className="text-xs font-extralight">MR. JUDE PAEL</Label>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
