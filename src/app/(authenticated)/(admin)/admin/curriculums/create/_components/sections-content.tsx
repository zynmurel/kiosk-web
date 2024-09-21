import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SectionAddedType } from "../page";
import { Plus, Trash } from "lucide-react";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
const SectionsContents = ({ sectionAdded, onRemoveSection, setIsAddSection}: {
    sectionAdded: SectionAddedType[] | undefined;
    onRemoveSection: (id: string) => void;
    setIsAddSection: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <div>
            <p className="pb-1">Sections on this Curriculum</p>
            <div className=" p-2 border rounded-lg bg-muted flex flex-col space-y-2">
                {
                    !sectionAdded?.length ?
                        <div className=" bg-muted text-muted-foreground flex items-center justify-center flex-col w-full p-10 border border-muted-foreground opacity-60 rounded border-dashed">
                            <Plus size={36} />
                            <p className=" text-center">Add sections to your new curriculum</p>
                        </div> :
                        <Table className=" bg-background rounded-md">
                            <TableHeader className="">
                                <TableRow>
                                    <TableCell className="w-[50px] text-center"></TableCell>
                                    <TableHead>Section Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sectionAdded.map((sub, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Button onClick={() => onRemoveSection(sub.sectionName)} type="button" variant={"destructive"} size={"sm"}>
                                                    <Trash size={16} />
                                                </Button>
                                            </TableCell>
                                            <TableCell><p className=" text-lg font-bold">{sub.sectionName}</p></TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                }
                <Button onClick={() => setIsAddSection(true)} type="button" variant={"outline"} className="flex self-end flex-row px-5 items-center gap-1">
                    <Plus strokeWidth={2.5} size={16} /> <span>Add Section</span>
                </Button>
            </div>
        </div>);
}

export default SectionsContents;