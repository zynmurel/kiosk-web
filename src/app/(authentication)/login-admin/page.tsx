import { ModeToggle } from "@/app/_components/theme-mode";
import { LoginCard } from "./_components/login-card";
import { BookMarked } from "lucide-react";

const Page = () => {
    // const session = getSession()
    // if(session?.role) {
    //   redirect(`/${session?.role}`)
    // }
    return (
        <div className=" grid lg:grid-cols-2 min-h-screen relative overflow-hidden">
            <ModeToggle className=" absolute top-5 right-5 z-10"/>
            <div className=" flex items-center justify-center bg-opacity-5 bg-emerald-900">
                <LoginCard/>
            </div>
            <img src="/images/logo.png" alt="logo" className=" w-[800px] -right-40 -bottom-40 absolute opacity-5" />
                <div className=" absolute flex flex-row gap-3 items-center bottom-3 left-3">
                <img src="/images/logo.png" alt="logo" className=" w-[40px]" /> <span className=" dark:text-slate-300 text-slate-700">Northwest Samar State University</span>
                </div>
            <div className=" dark:bg-emerald-900  dark:bg-opacity-50 lg:flex items-center justify-center bg-emerald-600 text-white  hidden">
                <div className=" w-2/3">

                <p className=" text-6xl font-bold flex flex-row items-center gap-2"><BookMarked size={48} strokeWidth={2.5} />LearnIt</p>
                <p className=" mt-5 text-xltext-center">
                Welcome to the official LearnIt login portal, designed exclusively for Super Admins and Admins managing the LearnIt system. This portal provides secure access to administrative tools and resources, ensuring the smooth operation of the platform. Please use your credentials to log in and manage the system efficiently.
                </p>
                </div>
            </div>
        </div>
    );
}
 
export default Page;