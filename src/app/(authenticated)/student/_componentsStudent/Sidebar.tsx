"use client";

import React from "react";
import {
  BarChart2Icon,
  FolderClosedIcon,
  Handshake,
  Home,
  Notebook,
  Shirt,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
const links = [
  {
    icon: BarChart2Icon,
    title: "academics",
    to: "/student",
  },

  {
    icon: Shirt,
    title: "Mydesign",
    to: "/client/myDesign",
  },
  {
    icon: Handshake,
    title: "Editor",
    to: "/client/Editor",
  },
];

const SideBarStudent = () => {
  const pathname = usePathname();
  return (
    <div className="top-0 hidden h-full bg-white lg:fixed lg:block lg:w-[280px]">
      <div className="flex h-full max-h-screen flex-col">
        <div className="text-gray-500lg:h-[60px] flex h-14 bg-teal-800">
          <Link href={"/"} className="flex items-center gap-2 font-semibold">
            <img src="/logo.png " width={100} height={100} />
            <Label className="font-md whitespace-nowrap text-lg text-white">
              LEARN APP
            </Label>
          </Link>
        </div>
        <Card className="b flex-1 pt-10">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {links.map(({ icon: Icon, title, to }) => {
              return (
                <Link
                  key={to}
                  href={to}
                  className={cn(
                    "hover:text-primary flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all",
                    pathname === to && "bg-muted text-primary",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {title}
                  </div>
                </Link>
              );
            })}
          </nav>
        </Card>
      </div>
    </div>
  );
};

export default SideBarStudent;
