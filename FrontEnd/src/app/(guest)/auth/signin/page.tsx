import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from "@/components/auth/login/auth.login";
import authOptions from "@/app/api/auth/options";

const Auth = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <>
      <Login />
    </>
  );
};

export default Auth;
