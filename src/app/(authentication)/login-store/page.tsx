import { ModeToggle } from "@/app/_components/theme-mode";
import { LoginCard } from "./_components/login-card";
import { BookMarked } from "lucide-react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="relative grid min-h-screen overflow-hidden lg:grid-cols-2">
      <ModeToggle className="absolute right-5 top-5 z-10" />
      <div className="flex items-center justify-center bg-emerald-900 bg-opacity-5">
        <LoginCard />
      </div>
      <Image
        width={50}
        height={50}
        src="/images/logo.png"
        alt="logo"
        className="absolute -bottom-40 -right-40 w-[800px] opacity-5"
      />
      <div className="absolute bottom-3 left-3 flex flex-row items-center gap-3">
        <Image src="/images/logo.png" alt="logo" width={50} height={50} />{" "}
        <span className="text-slate-700 dark:text-slate-300">
          Northwest Samar State University
        </span>
      </div>
      <div className="hidden items-center justify-center bg-emerald-600 text-white dark:bg-emerald-900 dark:bg-opacity-50 lg:flex">
        <div className="w-2/3">
          <p className="flex flex-row items-center gap-2 text-6xl font-bold">
            <BookMarked size={48} strokeWidth={2.5} />
            LEarn
          </p>
          <p className="text-xltext-center mt-5">
            Welcome to the official LEarn login portal, designed exclusively for
            Super Admins and Admins managing the LEarn system. This portal
            provides secure access to administrative tools and resources,
            ensuring the smooth operation of the platform. Please use your
            credentials to log in and manage the system efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
