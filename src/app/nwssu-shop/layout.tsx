import { getSessionForStudent } from "@/lib/session";
import { useStore } from "@/lib/store/app";
import { redirect } from "next/navigation";

const AuthenticatedLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = getSessionForStudent();
  if (session) {
    redirect("/student/nwssu-shop");
  }

  return <div>{children}</div>;
};

export default AuthenticatedLayout;
