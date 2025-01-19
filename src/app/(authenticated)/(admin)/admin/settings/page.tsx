'use client'



const SettingsPage = () => {
    return (
        <div className="grid gap-6">
        {/* <Card x-chunk="dashboard-04-chunk-1" className=" xl:w-4/5 relative">
            {(isPending) &&
            <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ opacity:.5}}>
                <Loading/>
            </div>}
            <CardHeader>
                <CardTitle>Grading Base</CardTitle>
                <CardDescription>
                    This is the base of grading in all subject in this department.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className=" flex flex-col lg:flex-row items-center gap-4">
                    <div className=" flex-1">
                        <div className=" text-sm">Grade base</div>
                        <Input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} placeholder="Default grade base." />
                    </div>

                </div>

            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end">
                <Button disabled={updateGradeBaseIsPending} onClick={() => updateGradeBase({
                    code:department?.code||"",
                    gradeBase:base
                })}>Save</Button>
            </CardFooter>
        </Card> */}
        </div>
    );
}

export default SettingsPage;