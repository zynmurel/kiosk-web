import { useRouter } from "next/navigation";

const CurriculumLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <>
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold tracking-tight">Create Section</h3>
          <p className="text-sm text-muted-foreground">
            Create section for the selected curriculum.
          </p>
        </div>
      </div>
      <div className="flex flex-1" x-chunk="dashboard-02-chunk-1">
        {children}
      </div>
    </>
  );
};

export default CurriculumLayout;
