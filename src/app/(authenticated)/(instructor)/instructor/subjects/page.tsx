const Page = () => {
    return ( 
    <div className=" w-full bg-primary-foreground rounded-md border shadow-md">
        <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Sections On Subject</p>
        </div>
        <div className=" flex items-center justify-center h-full w-full p-5 py-40">
            <p className=" text-muted-foreground">Select subject to view sections</p>
        </div>
    </div> );
}
 
export default Page;