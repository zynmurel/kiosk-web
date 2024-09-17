import { Separator } from "@/components/ui/separator";
import CreateCourseForm from "./_components/create-form";

const Page = () => {
    return ( 
    <div className=" w-full">
        <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Add Course</p>
        </div>
        <div className=" px-5 xl:px-10">
        <CreateCourseForm/>
        </div>
    </div> );
}
 
export default Page;