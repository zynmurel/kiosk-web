'use client'
import { useParams } from "next/navigation";

const Page = () => {
    const { curriculum } = useParams()

    return ( <>{curriculum?.toString()}</> );
}
 
export default Page;