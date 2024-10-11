"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { User2, Settings, DollarSign, LogOut } from "lucide-react";
import { useStore } from "@/lib/store/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logoutStore, logoutStudent } from "@/lib/api-helper/auth";

export default function HeaderStudent() {
  const { user } = useStore();

  const handleLogout = async () => {
    try {
      await logoutStore();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="mb-4 w-full">
      <div className="flex h-[60px] items-center justify-end bg-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-md bg-primary bg-teal-700 p-2 text-primary-foreground hover:bg-primary/90 hover:bg-teal-600"
              >
                <User2 size={15} className="rounded-lg" />
                <span className="font-bold">{user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Sales</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
