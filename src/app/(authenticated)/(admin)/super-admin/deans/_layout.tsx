const DeanLayout = ({ children }: { children: React.ReactElement }) => {
    return (
        <>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Deans
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    List of all deans and their respective departments.
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

export default DeanLayout;