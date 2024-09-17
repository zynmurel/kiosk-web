import { Separator } from "@/components/ui/separator";
import CreateCourseForm from "./_components/create-form";

const Page = () => {
    return ( 
    <div className=" w-full xl:py-10">
        <p className=" text-2xl font-bold">Create Course</p>
        <Separator className=" mb-3 mt-2"/>
        <CreateCourseForm/>
    </div> );
}
 
export default Page;