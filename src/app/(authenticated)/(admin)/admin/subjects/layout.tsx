const Layout = ({ children }: { children: React.ReactElement }) => {
    return (
        <>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Subjects
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all subjects in this Department.
                    </p>
                </div>
                
            </div>
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
                {children}
            </div>
        </>
    );
}

export default Layout;