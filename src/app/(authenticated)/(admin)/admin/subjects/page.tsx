import CreateSubjectForm from "./_components/upsert-form";

const Page = () => {
    return ( 
    <div className=" w-full">
        <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Add Course</p>
        </div>
        <div className=" px-5 xl:px-10">
        <CreateSubjectForm/>
        </div>
    </div> );
}
 
export default Page;