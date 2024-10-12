import { Toaster } from "@/components/ui/toaster";
import { useStore } from "@/lib/store/app";

const AuthenticatedLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default AuthenticatedLayout;
