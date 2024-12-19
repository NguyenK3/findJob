import React from "react";
import CompanyList from "../components/company/app.admin.companyList";
import { SnackbarProvider } from "notistack";
import { Slide } from "@mui/material";
import { useSession } from "next-auth/react";
import CompanyInfo from "../components/company/app.admin.companyInfo";
import Layout from "./layout";

const CompanyAdmin = () => {
  const { data: session } = useSession();
  return (
    <SnackbarProvider
      maxSnack={3} // Số lượng snackbar tối đa có thể hiển thị cùng lúc
      anchorOrigin={{
        vertical: "bottom", // Vị trí hiển thị ở dưới cùng
        horizontal: "right", // Hiển thị ở góc phải
      }}
      autoHideDuration={3000} // Thời gian hiển thị snackbar (3 giây)
      TransitionComponent={Slide} // Hiệu ứng chuyển đổi khi snackbar xuất hiện
      preventDuplicate // Ngăn chặn việc hiển thị cùng một thông báo nhiều lần
      dense // Giảm kích thước của snackbar
      iconVariant={{
        success: "✅", // Icon tùy chỉnh cho trạng thái thành công
        error: "❌", // Icon tùy chỉnh cho trạng thái lỗi
        warning: "⚠️", // Icon tùy chỉnh cho trạng thái cảnh báo
        info: "ℹ️", // Icon tùy chỉnh cho trạng thái thông tin
      }}
    >
      <Layout>
        {session?.user?.role?.name === "Company" ? (
          <CompanyInfo />
        ) : (
          <CompanyList />
        )}
      </Layout>

    </SnackbarProvider>
  );
}

export default CompanyAdmin;