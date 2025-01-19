'use client'

import { useParams } from "next/navigation";
import UpsertDepartmentForm from "./_components/form";

const Page = () => {
    const { dept_id } = useParams()
    const isCreate = Number.isNaN(Number(dept_id))
    return (
        <div className=" w-full h-full flex justify-center">
            <div className=" w-full flex justify-center">
            <div className="flex  flex-col items-start lg:px-20 p-5 w-full lg:w-[800px]">
                <h3 className="text-2xl font-bold tracking-tight">
                    {isCreate ? "Create" : "Update"} College
                </h3>
                <p className="text-sm text-muted-foreground">
                    {isCreate ? "Create a department that exists in your university." : "Update department information and details."}
                </p>
                <UpsertDepartmentForm/>
            </div>
            </div>
        </div>
    )
}

export default Page;