import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionsSelectedType } from "../page";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
const SectionContent = ({
  sectionsSelected,
  onAddSection,
}: {
  sectionsSelected: SectionsSelectedType[] | undefined;
  onAddSection: () => void;
}) => {
  return (
    <div>
      <p className="pb-1 font-semibold">Sections</p>
      <div className="flex flex-col space-y-2 rounded-lg border bg-muted">
        <Table className="rounded-md bg-background">
          <TableHeader className="">
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead className="w-[100px] text-center">Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectionsSelected?.map((sec) => {
              return (
                <TableRow key={sec.id}>
                  <TableCell>{sec.section_name}</TableCell>
                  <TableCell>{sec.studentCount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!sectionsSelected?.length && (
          <div className="flex flex-col items-center justify-center p-5 text-muted-foreground">
            <p>No Sections</p>
            <Button onClick={onAddSection} variant={"ghost"} size={"icon"}>
              <PlusCircle size={30} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionContent;
