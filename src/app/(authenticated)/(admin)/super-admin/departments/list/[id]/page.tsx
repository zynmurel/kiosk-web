'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { Book, GraduationCap, Pencil, UserRound, UsersRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Loading from "./_components/loading";
import NoFound from "./_components/no-found";
import { Button } from "@/components/ui/button";

const Page = () => {
    const { id } = useParams()
    const { data: department, isLoading: departmentIsLoading } = api.super.department.getDepartment.useQuery({
        id: Number(id)
    }, {
        enabled: !Number.isNaN(Number(id))
    })
    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className=" bg-secondary font-semibold text-lg py-4">
                College
            </CardHeader>
            <CardContent className=" p-5 flex flex-col justify-center">
                <Display department={department} departmentIsLoading={departmentIsLoading} />
            </CardContent>

        </Card>);
}


const Display = ({ department, departmentIsLoading }: {
    department: {
        id: number;
        code: string;
        title: string;
        description: string;
        admin: string | null;
        counts: {
            Instructor: number;
            Course: number;
            Subject: number;
        };
    } | undefined; departmentIsLoading: boolean;
}) => {
    const router = useRouter()
    if(departmentIsLoading){
        return <Loading/>
    }

    if(!department && !departmentIsLoading){
        return <NoFound/>
    }

    return department &&  (
        <div>
            <div className=" flex flex-row justify-between items-center">
                <div className="font-semibold text-3xl">{department.code}</div>
                <Button onClick={()=>router.push("/super-admin/departments/upsert/" + department.id)} size={"sm"} variant={"ghost"}>
                    <Pencil strokeWidth={2.5} size={20} />
                </Button>
            </div>
            <Separator className=" my-2" />
            <div className="grid">
                <div className=" text-sm text-muted-foreground">Title</div>
                <div className="font-medium">{department.title}</div>
            </div>
            <div className="grid mt-2">
                <div className=" text-sm text-muted-foreground">Description</div>
                <div className=" font-light text-sm">{department.description}</div>
            </div>
            <div className="font-semibold mt-5 flex flex-row items-center gap-1">
                <UserRound size={18} strokeWidth={3} /><p>Dean</p>
            </div>
            {department.admin ? <div className="">{department.admin}</div> : <div className="text-muted-foreground">No dean assigned</div>}
            <div className=" mt-5 flex flex-row gap-5 w-full">
                <div className=" flex-1 border rounded flex items-center flex-col justify-center py-5 bg-secondary">
                    <div className=" text-2xl">{department.counts.Instructor}</div>
                    <div className=" flex flex-row items-center text-xs gap-1">
                        <UsersRound strokeWidth={2.5} size={16} />
                        <div>
                            Instructors
                        </div>
                    </div>
                </div>
                <div className=" flex-1 border rounded flex items-center flex-col justify-center py-5 bg-secondary">
                    <div className=" text-2xl">{department.counts.Course}</div>
                    <div className=" flex flex-row items-center text-xs gap-1">
                        <GraduationCap strokeWidth={2.5} size={16} />
                        <div>
                            Courses
                        </div>
                    </div>
                </div>
                <div className=" flex-1 border rounded flex items-center flex-col justify-center py-5 bg-secondary">
                    <div className=" text-2xl">{department.counts.Subject}</div>
                    <div className=" flex flex-row items-center text-xs gap-1">
                        <Book strokeWidth={2.5} size={16} />
                        <div>
                            Subjects
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Page;