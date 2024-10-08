const Layout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    return ( 
        <>
            <div className=" flex flex-row justify-between items-end">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Guide
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Guide and information on the computation of grades and the points system.
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