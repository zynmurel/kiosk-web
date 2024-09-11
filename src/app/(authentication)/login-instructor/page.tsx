import { ModeToggle } from "@/app/_components/theme-mode";
import { LoginCard } from "./_components/login-card";

const Page = () => {
    return (
        <div className=" grid lg:grid-cols-2 min-h-screen relative">
            <ModeToggle className=" absolute top-5 right-5"/>
            <div className=" flex items-center justify-center">
                <LoginCard/>
            </div>
        </div>
    );
}
 
export default Page;