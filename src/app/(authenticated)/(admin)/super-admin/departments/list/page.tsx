import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MousePointer2 } from "lucide-react";

const Page = () => {
    return ( 
        <Card className="w-full overflow-hidden">
            <CardHeader className=" bg-secondary font-semibold text-lg py-4">
                Select a Department
            </CardHeader>
            <CardContent className=" p-5 py-20 flex items-center flex-col gap-1 justify-center text-gray-500">
            <MousePointer2 size={40} />
                <p className="">Select a department on the table.</p>
            </CardContent>

        </Card> );
}
 
export default Page;