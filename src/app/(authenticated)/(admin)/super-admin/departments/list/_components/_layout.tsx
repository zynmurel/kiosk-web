const Layout = ({ children }: { children: React.ReactElement }) => {
    return (
        <>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Colleges
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all Colleges created and details.
                    </p>
                </div>
            </div>
            <div>
                {children}
            </div>
        </>
    );
}

export default Layout;