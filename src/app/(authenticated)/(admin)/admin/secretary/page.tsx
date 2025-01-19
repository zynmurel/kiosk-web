'use client'
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import SecretariesTable from "./_components/table";
import UpsertSecretaryDrawer from "./_components/drawer-secretay";
import { useSecretaryContext } from "@/lib/context/admin/secretary";

const Page = () => {
  const state = useSecretaryContext()
  const { user } = useStore()
  const { data: secretaries, isLoading: secretariesIsLoading } = api.admin.secretary.getSecretariesInDepartment.useQuery({
    departmentCode: user?.department || "",
  }, {
    enabled: !!user?.department
  })
  
  return (
    <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
      <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Secretary of {user?.department?.toUpperCase()}</p>
      </div>
      <div className=" flex flex-row justify-between gap-5 xl:px-5 px-2">
        <div className=" flex flex-row items-center gap-2">
          <Search className=" bg-muted h-full p-2 rounded w-10" />
          <Input value={state?.searchText} onChange={(e) => state?.setSearchText(e.target.value)} className=" xl:w-80" placeholder="Search Employee ID" />
        </div>
        <div className=" flex flex-row items-center gap-2">
          <UpsertSecretaryDrawer />
        </div>
      </div>
      <SecretariesTable secretaries={secretaries?.filter((secretarie)=>secretarie.employeeID.includes(state?.searchText || ""))} secretariesIsLoading={secretariesIsLoading}/>
    </div>
  );
}

export default Page;