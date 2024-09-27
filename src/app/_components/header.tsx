import { Facebook, Phone } from "lucide-react";

const MostHeader = () => {
  return (
    <div className="flex flex-row justify-between bg-emerald-500 p-2 text-sm font-extralight tracking-widest text-slate-100 dark:bg-emerald-900 sm:px-5">
      <p className="flex flex-col sm:flex-row sm:gap-1">
        <span className="font-semibold">LEARN AND EARN</span>
        <span className="hidden sm:grid">|</span>
        <span className="text-xs sm:text-sm">
          {/* Northwest Samar State University */}
        </span>
      </p>
      <div className="flex flex-row items-center gap-2 text-xs">
        <p className="flex cursor-pointer flex-row items-center gap-1 rounded px-1">
          <Facebook size={15} />
          <span className="hidden md:flex">Facebook</span>
        </p>
        <span>|</span>
        <p className="flex cursor-pointer flex-row items-center gap-1 rounded px-1">
          <Phone size={15} />
          <span className="hidden md:flex">Contact</span>
        </p>
      </div>
    </div>
  );
};

export default MostHeader;
