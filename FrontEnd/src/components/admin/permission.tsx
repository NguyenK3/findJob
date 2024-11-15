"use client"
import PermissionTable from "../components/permission/app.admin.permissionTable";
import Layout from "./layout";

const PermissionAdmin = () => {
    return (
        <Layout>
            <PermissionTable />
        </Layout>
    );
}

export default PermissionAdmin;