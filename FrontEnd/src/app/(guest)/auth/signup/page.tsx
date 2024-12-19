import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Register from "@/components/auth/register/auth.register";
import authOptions from "@/app/api/auth/options";

const Auth = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }
    return (
        <>
            <Register />
        </>
    );
};

export default Auth;
