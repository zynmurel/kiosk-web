'use client'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import AttendanceNow from "./_components/attendance";
import AttendanceRecord from "./_components/record";
import { Separator } from "@/components/ui/separator";

const Attendance = () => {
    return ( 
        <Tabs defaultValue="now" className="w-full">
        <TabsList className=" flex flex-row justify-start gap-5 items-start bg-transparent md:w-[400px]">
          <TabsTrigger value="now" className=" px-0">Attendance Now</TabsTrigger>
          <TabsTrigger value="record" className=" px-0">Attendance Record</TabsTrigger>
        </TabsList>
        <Separator/>
        <TabsContent value="now">
          <AttendanceNow/>
        </TabsContent>
        <TabsContent value="record">
          <AttendanceRecord/>
        </TabsContent>
      </Tabs> );
}
 
export default Attendance;