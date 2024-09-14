"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

type HeaderProps = {
  cartItemsLength?: number;
  orderedItemsLength?: number;
};

const HeaderStudent = () => {
  return (
    <div className="mb-4 w-full">
      {/* header */}
      <div className="flex h-[60px] items-center justify-end bg-gray-200 pr-20">
        <div className="flex items-center gap-4">
          <Label className="text-teal-800">10000.00 points</Label>

          <div className="flex cursor-pointer gap-2 rounded-md bg-teal-700 p-2">
            <User2 size={15} className="rounded-lg font-bold text-white" />
            <Label className="font-bold text-white">User123</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStudent;
