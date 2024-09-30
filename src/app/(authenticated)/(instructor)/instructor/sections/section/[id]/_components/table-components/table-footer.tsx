import { type PaginationType } from "@/lib/types/pagination";
import Loading from "./loading"
import NoFound from "./no-found"
import { DataPagination } from "./pagination";

interface TableStateAndPagination {
    isLoading:boolean;
    data:any[];
    pagination : PaginationType;
    setPagination : (updater: (prev: PaginationType) => PaginationType) => void;
}

const TableStateAndPagination = ({data, isLoading, pagination, setPagination }:TableStateAndPagination ) => {
    const Display = () => {
        if(isLoading){
            return <Loading/>
        } else if (!isLoading && !data.length) {
            return <NoFound/>
        } else {
            return <></>
        }
    }
    return (
        <>
            <Display/>
            <div className=" flex flex-row justify-between items-center">
            <p className=" flex-1 text-nowrap flex flex-row">Students  : {data.length}</p>
            <DataPagination count={data?.length || 0} filter={pagination} setFilter={setPagination}/>
            </div>
        </>
    )
}
 
export default TableStateAndPagination;