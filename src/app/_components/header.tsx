import { Facebook, Phone } from "lucide-react";

const MostHeader = () => {
  return (
    <div className=" bg-emerald-500 p-2 dark:bg-emerald-900 sm:px-5 font-extralight text-slate-100 flex tracking-widest text-sm flex-row justify-between">
      <p className=" sm:flex-row flex-col flex sm:gap-1">
        <span className=" font-bold">LEARN IT </span>
        <span className=" hidden sm:grid">|</span>
        <span className=" text-xs sm:text-sm">Northwest Samar State University</span>
      </p>
      <div className=" flex-row flex gap-2 text-xs items-center">
        <p className=" flex flex-row items-center gap-1 px-1 cursor-pointer rounded"><Facebook size={15} /><span className="hidden md:flex">Facebook</span></p><span>|</span>
        <p className=" flex flex-row items-center gap-1 px-1 cursor-pointer rounded"><Phone size={15} /><span className="hidden md:flex">Contact</span></p>
      </div>
    </div>);
}

export default MostHeader;