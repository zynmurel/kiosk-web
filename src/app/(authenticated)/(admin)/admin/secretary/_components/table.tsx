'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TableStateAndPagination from "./table-components/table-footer";
import { type PaginationType } from "@/lib/types/pagination";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { useSecretaryContext } from "@/lib/context/admin/secretary";
type Secretaries = {
    id: number;
    fullName: string;
    contact: string | null;
    email: string | null;
    departmentCode: string;
    employeeID: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
const SecretariesTable = ({ secretaries, secretariesIsLoading }: {
    secretaries: Secretaries[] | null | undefined;
    secretariesIsLoading: boolean;
}) => {
    const state = useSecretaryContext()
    const [idLoading, setIdLoading] = useState<number | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    const onEditSecretary = (secretary:Secretaries) => {
        state?.setUpsertSecretary({
            id: secretary.id,
            fullName:secretary.fullName,
            contact:secretary.contact || undefined,
            email:secretary.email || undefined,
            employeeID:secretary.employeeID,
        })
    }

    const { mutateAsync : resetPassword } = api.admin.secretary.resetPassword.useMutation({
        onSuccess:async () => {
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
    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden xl:col-span-3 gap-2 xl:px-5 px-2">
            
            <div className=" rounded overflow-hidden h-full flex flex-col justify-between pt-0">
                <Table className=" border-b">
                    <TableHeader className=" bg-secondary">
                        <TableRow>
                            <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Employee ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden xl:table-cell">Email</TableHead>
                            <TableHead className="hidden xl:table-cell">Phone</TableHead>
                            <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader> 
                    <TableBody>
                        {secretaries?.slice(pagination.skip, pagination.skip + pagination.take).map((secretary) => (
                            <TableRow
                                key={secretary.id}
                                className={`cursor-pointer`}
                            >
                                <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">{secretary.employeeID}</TableCell>
                                <TableCell>{`${secretary.fullName}`}</TableCell>
                                <TableCell className="hidden xl:table-cell">{secretary.email ? secretary.email : <span className=" text-muted-foreground">None</span>}</TableCell>
                                <TableCell className="hidden xl:table-cell">{secretary.contact ? secretary.contact : <span className=" text-muted-foreground">None</span>}</TableCell>
                                    <TableCell className="w-[100px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    {idLoading===secretary.id  ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <MoreHorizontal className="w-4 h-4" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={()=>onEditSecretary(secretary)}
                                                >Edit</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                onClick={async ()=> {
                                                    setIdLoading(secretary.id)
                                                    await resetPassword({id:secretary.id})
                                                    }}
                                                    >Reset Password</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableStateAndPagination
                    isLoading={secretariesIsLoading}
                    data={secretaries || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>);
}

export default SecretariesTable;