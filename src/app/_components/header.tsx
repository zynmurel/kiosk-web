import { Facebook, Phone } from "lucide-react";

const MostHeader = () => {
    return ( 
        <div className=" bg-emerald-500 p-2 dark:bg-emerald-900 px-5 font-extralight text-slate-100 flex tracking-widest text-sm flex-row justify-between">
          <p><span className=" font-bold">LEARN IT </span> 
          | Northwest Samar State University
          </p>
          <div className=" flex-row flex gap-2 text-xs">
          <p className=" flex flex-row items-center gap-1 px-1 cursor-pointer rounded"><Facebook size={15} /><span className="hidden md:flex">Facebook</span></p>|
          <p className=" flex flex-row items-center gap-1 px-1 cursor-pointer rounded"><Phone size={15} /><span className="hidden md:flex">Contact</span></p>
          </div>
        </div> );
}
 
export default MostHeader;