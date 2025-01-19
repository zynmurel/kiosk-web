'use client'

import { SecretaryContext, type UpsertSecretaryType } from "@/lib/context/admin/secretary";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useState } from "react";
const Layout = ({ children }: { children: React.ReactElement }) => {
    const { user } = useStore()
    const [ upsertSecretary, setUpsertSecretary] = useState<UpsertSecretaryType>(undefined)
    const [searchText, setSearchText] = useState("")

    const { refetch } = api.admin.secretary.getSecretariesInDepartment.useQuery({
        departmentCode : user?.department || "",
    }, {
        enabled : !!user?.department
    })

    const refetchSecretarys = async () => {
        await refetch()
    }
    
    return (
        <SecretaryContext.Provider value={{ upsertSecretary, setUpsertSecretary, searchText, setSearchText, refetchSecretarys }}>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Secretaries
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all secretaries in this Department.
                    </p>
                </div>
            </div>
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
                {children}
            </div>
        </SecretaryContext.Provider>
    );
}

export default Layout;