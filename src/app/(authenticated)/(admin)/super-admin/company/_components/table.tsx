'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LoaderCircle, MoreHorizontal, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import TableStateAndPagination from "./table-components/table-footer";
import { type PaginationType } from "@/lib/types/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast"

const DeansTable = () => {
    const router = useRouter()
    const {toast} = useToast()
    const [idLoading, setIdLoading] = useState<number | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })
    const { data: company, isLoading: companyIsLoading } = api.super.company.getAllCompanies.useQuery()

    const { mutateAsync : resetPassword } = api.super.company.resetPassword.useMutation({
        onSuccess:async () => {
            console.log("sucess")
            toast({
              title: "Success!",
              description: "Password reset to the default password."
            })
          },
          onError: (e) => {
            toast({
              variant: "destructive",
              title: "Creating dean failed",
              description: e.message
            })
          },
          onSettled:()=>setIdLoading(undefined)
    })

    const navigateToAddDean = (path: string | number) => () => router.push("/super-admin/company/upsert/" + path)

    return (
        <Card className=" w-full">
            <CardContent className=" p-4 flex flex-col">
                <div className=" flex justify-between flex-row px-3 items-center">
                    <p className=" font-semibold text-lg">List of Companies</p>
                    <Button size="sm" className="gap-1" variant={"outline"} onClick={navigateToAddDean("new")}>
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Company
                        </span>
                    </Button>
                </div>
                <Separator className="my-3" />
                <div className=" border rounded overflow-hidden">
                    <Table className="">
                        <TableHeader className=" bg-secondary">
                            <TableRow>
                                <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Username</TableHead>
                                <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Company</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {company?.slice(pagination.skip, pagination.skip+pagination.take).map((bussiness) => (
                                <TableRow
                                    key={bussiness.id}
                                >
                                    <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">{bussiness.username}</TableCell>
                                    <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">{bussiness.title}</TableCell>
                                    <TableCell>{bussiness.contact}</TableCell>
                                    <TableCell>{bussiness.email}</TableCell>
                                    <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    {idLoading===bussiness.id ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <MoreHorizontal className="w-4 h-4" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={navigateToAddDean(bussiness.id)}
                                                >Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={async ()=> {
                                                    setIdLoading(bussiness.id)
                                                    await resetPassword({id:bussiness.id})
                                                    }}>Reset Password</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <TableStateAndPagination
                    isLoading={companyIsLoading}
                    data={company || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </CardContent>
        </Card>);
}

export default DeansTable;