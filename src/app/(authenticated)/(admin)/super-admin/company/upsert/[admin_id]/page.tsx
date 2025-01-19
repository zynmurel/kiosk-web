'use client'

import { useParams } from "next/navigation";
import UpsertDeanForm from "./_components/form";

const Page = () => {
    const { admin_id } = useParams()
    const isCreate = Number.isNaN(Number(admin_id))
    return (
        <div className=" w-full h-full flex justify-center">
            <div className=" w-full flex justify-center">
            <div className="flex  flex-col items-start lg:px-20 p-5 w-full lg:w-[800px]">
                <h3 className="text-2xl font-bold tracking-tight">
                    {isCreate ? "Add" : "Update"} Shop
                </h3>
                <p className="text-sm text-muted-foreground">
                    {isCreate ? "Add a company." : "Update shop's information."}
                </p>
                <UpsertDeanForm/>
            </div>
            </div>
        </div>
    )
}

export default Page;