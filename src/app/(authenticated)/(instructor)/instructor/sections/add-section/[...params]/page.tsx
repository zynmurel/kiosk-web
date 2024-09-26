'use client'
import { useParams } from "next/navigation";

const Page = () => {
    const { params } = useParams()
    const instructorOnSubjectId = params?.[0]
    return ( <>{params?.toString()}</> );
}
 
export default Page;