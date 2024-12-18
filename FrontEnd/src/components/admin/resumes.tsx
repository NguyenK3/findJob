
import { useSession } from "next-auth/react";
import ResumeTable from "../components/resume/app.admin.resumeTable";
import ResumeTableByCompanyId from "../components/resume/app.admin.resumeTableByCompanyId";
import Layout from "./layout";

const ResumesAdmin = () => {
    const { data: session } = useSession();
    return (
        <Layout>
            {/* {console.log("session", session)} */}
            {session?.user?.role?.name === "Company" || session?.user?.role?.name === "HR"
                ? (
                    console.log("session", session),
                    <ResumeTableByCompanyId />
                ) : (
                    <ResumeTable />
                )}
        </Layout>
    );
}

export default ResumesAdmin;