"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { User2, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useStore } from "@/lib/store/app";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutStudent } from "@/lib/api-helper/auth";

const HeaderStudent = () => {
  const { user } = useStore();
  const router = useRouter();
  const { data, isLoading } =
    api.student.points.getTotalPointsOfStudents.useQuery({
      studentId: String(user?.username),
    });

  const handleLogout = () => {
    logoutStudent();
  };

  const handleSettings = () => {
    // Implement settings navigation here
    console.log("Settings clicked");
  };

  return (
    <>
      {isLoading ? (
        <div className="my-2 flex h-full w-full items-center justify-end">
          <div className="mr-20 h-8 w-72 animate-pulse rounded bg-gray-300" />
        </div>
      ) : (
        <div className="mb-4 w-full">
          <div className="flex h-[60px] items-center justify-end bg-gray-200 pr-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-teal-800">
                <span className="mr-2">Points:</span>
                <div className="flex cursor-pointer gap-2 rounded-md bg-teal-700 p-2">
                  <Label className="text-xs font-bold text-white">
                    {data?.redeemedPoints}
                  </Label>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex cursor-pointer gap-2 rounded-md bg-teal-700 p-2"
                  >
                    <User2
                      size={15}
                      className="rounded-lg font-bold text-white"
                    />
                    <Label className="font-bold text-white">
                      {user?.fullName}
                    </Label>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderStudent;
