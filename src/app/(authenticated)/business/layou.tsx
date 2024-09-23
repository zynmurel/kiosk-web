import { getSessionForBusinness } from "@/lib/session";
import { redirect } from "next/navigation";

const AuthenticatedLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = getSessionForBusinness();
  if (!session) {
    redirect("/login-store");
  }
  return <div>{children}</div>;
};

export default AuthenticatedLayout;
