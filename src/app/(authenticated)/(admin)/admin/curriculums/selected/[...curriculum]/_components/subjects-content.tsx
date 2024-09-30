import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SubjectsSelectedType } from "../page";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const SubjectContents = ({
  subjectsSelected,
}: {
  subjectsSelected: SubjectsSelectedType[] | undefined;
}) => {
  const { user } = useStore();
  const { data: instructors } =
    api.admin.global.getSelectableInstructors.useQuery(
      {
        departmentCode: user?.department || "",
      },
      {
        enabled: false,
      },
    );

  const { data: subjects } = api.admin.global.getSelectableSubjects.useQuery(
    {
      departmentCode: user?.department || "",
    },
    {
      enabled: false,
    },
  );

  const totalUnits = subjectsSelected?.reduce((acc, curr) => {
    const unit = subjects?.find((subj) => subj.id === curr.subjectId)?.units;
    return acc + (unit || 0);
  }, 0);
  return (
    <div>
      <p className="pb-1 font-semibold">Subjects on this Curriculum</p>
      <div className="flex flex-col space-y-2 rounded-lg border bg-muted">
        <Table className="rounded-md bg-background">
          <TableHeader className="">
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead className="w-[100px] text-center">Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjectsSelected?.map((sub) => {
              const subject = subjects?.find(
                (subj) => subj.id === sub.subjectId,
              );
              const assignInstructors = instructors?.filter(
                (subj) =>  sub.instructorIds.includes(subj.id),
              );
              return (
                <TableRow key={sub.subjectId}>
                  <TableCell>
                    <p className="text-lg font-bold">{subject?.code}</p>
                    <p>{subject?.title}</p>
                  </TableCell>
                  <TableCell>
                  <Popover>
                    <PopoverTrigger>{assignInstructors?.length || 0} Instructor/s</PopoverTrigger>
                    <PopoverContent>
                      <div className=" text-sm">
                        { assignInstructors?.length ?
                          assignInstructors.map((instructor)=>{
                            return <div key={instructor.id}>{`${instructor.employeeID} - ${instructor.firstName} ${instructor.middleName} ${instructor.lastName}`}</div>
                          }) : <div className=" text-center text-muted-foreground">No Instructor Assigned</div>
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                  </TableCell>
                  <TableHead className="text-center">
                    {subject?.units}
                  </TableHead>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Units</TableCell>
              <TableCell className="text-center">{totalUnits}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default SubjectContents;
