
const Layout = ({ children }: { children: React.ReactElement }) => {
    return (
            <div className=" flex flex-row h-full w-full items-center justify-between">
                {children}
            </div>
    );
}

export default Layout;