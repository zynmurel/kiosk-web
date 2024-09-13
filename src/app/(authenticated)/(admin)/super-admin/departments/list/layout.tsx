import DepartmentLayout from "./_components/_layout";
import DepartmentTable from "./_components/table";

const Layout = ({ children }: { children: React.ReactElement }) => {
    return (
        <DepartmentLayout>
            <div className="w-full grid lg:grid-cols-5 gap-5">
                <div className=" lg:col-span-3">
                    <DepartmentTable />
                </div>
                <div className=" lg:col-span-2">
                    {children}
                </div>
            </div>
        </DepartmentLayout>
    );
}

export default Layout;