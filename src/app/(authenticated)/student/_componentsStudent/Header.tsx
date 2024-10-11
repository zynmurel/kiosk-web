"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { User2, Settings, LogOut } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useStore } from "@/lib/store/app";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutStudent, logoutStudentFromShop } from "@/lib/api-helper/auth";

const HeaderStudent = () => {
  const { user } = useStore();
  const router = useRouter();

  const { data, isLoading, refetch } =
    api.student.points.getTotalPointsOfStudents.useQuery(
      {
        studentId: String(user?.username),
      },
      {
        enabled: !!user?.username,
      },
    );

  const setRefetchProducts = useStore((state) => state.setRefetchProducts);

  console.log("hello,");

  const path = usePathname();
  const handleLogout = () => {
    if (path === "/student") logoutStudent();
    else {
      logoutStudentFromShop();
    }
  };

  const handleSettings = () => {
    // Implement settings navigation here
    console.log("Settings clicked");
  };

  useEffect(() => {
    setRefetchProducts(() => refetch);
  }, [refetch, setRefetchProducts]);

  return (
    <>
      {isLoading ? (
        <div className="my-2 flex h-full w-full items-center justify-end">
          <div className="mr-20 h-8 w-72 animate-pulse bg-gray-300" />
        </div>
      ) : (
        <div className="mb-4 w-full">
          <div className="flex h-[60px] items-center justify-end bg-gray-200 pr-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-teal-800">
                <span className="mr-2">Points:</span>
                <div className="flex cursor-pointer gap-2 rounded-sm bg-teal-700 p-2 px-3">
                  <Label className="text-xs font-bold tracking-widest text-white">
                    {data?.redeemedPoints}
                  </Label>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer gap-2 rounded-sm bg-teal-700 p-2 hover:bg-teal-600">
                    <User2 size={15} className="font-bold text-white" />
                    <Label className="font-bold text-white">
                      {user?.fullName}
                    </Label>
                  </div>
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
