"use client";
import React from "react";
import CompanyList from "../components/company/app.admin.companyList";
import { SnackbarProvider } from "notistack";
import { Slide } from "@mui/material";

export default function Company() {
  return (
    <div>
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
        // sx={{
        //   "& .MuiSnackbarContent-root": {
        //     backgroundColor: "primary.main", // Màu nền cho các snackbar
        //     color: "white", // Màu chữ
        //     borderRadius: "8px", // Bo tròn góc
        //     boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng
        //     transition: "all 0.3s ease-in-out", // Hiệu ứng chuyển động khi snackbar xuất hiện/biến mất
        //     "&:hover": {
        //       transform: "scale(1.05)", // Hiệu ứng phóng to khi di chuột
        //     },
        //   },
        // }}
      >
        <CompanyList />
      </SnackbarProvider>
    </div>
  );
}
