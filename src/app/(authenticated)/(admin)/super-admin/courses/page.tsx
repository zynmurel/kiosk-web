'use client'
import { api } from "@/trpc/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CourseTable from "./_components/table";

const Page = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined)
    const { data: selectableDepartments, isLoading: selectableDepartmentsIsLoading } = api.super.course.getSelectableDepartment.useQuery()

    const onChangeSelectedDepartment = (val: string) => {
        setSelectedDepartment(val)
    }

    useEffect(()=>{
        if(!!selectableDepartments?.[0]){
            setSelectedDepartment(selectableDepartments[0].value)
        }
    },[selectableDepartments])
    return (
        <Card className=" w-full space-y-5 flex flex-col">
            <CardHeader className=" pb-0">
                <div className=" w-full flex flex-col">
                    <div className=" font-medium mb-2 text-base">Filter by Department</div>
                    <Select onValueChange={(e) => onChangeSelectedDepartment(e)} value={selectedDepartment}>
                        <SelectTrigger className=" md:w-[400px]">
                            <SelectValue placeholder={`${selectableDepartmentsIsLoading ? "Loading ...":"Select a Department"}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                selectableDepartments?.map((department) => <SelectItem className="py-4" key={department.value} value={department.value}>{department.label}</SelectItem>)
                            }
                            {selectableDepartmentsIsLoading && <div className=" text-sm w-full text-center py-3 border rounded my-1 text-muted-foreground bg-muted">Loading ...</div>}
                            {!selectableDepartments?.length && !selectableDepartmentsIsLoading && <div className=" text-sm w-full text-center py-3 border rounded my-1 text-muted-foreground bg-muted">No available department to assign.</div>}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <CourseTable selectedDepartment={selectedDepartment} isLoading={selectableDepartmentsIsLoading}/>
            </CardContent>
        </Card>
    );
}

export default Page;