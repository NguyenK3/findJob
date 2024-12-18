import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import NextAuthProvider from "../lib/next.auth.providers";
import Header from "@/components/header/app.header";
import Footer from "@/components/footer/app.footer";

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {props.children}
            <Footer />
        </>
    );
}