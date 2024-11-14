import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {props.children}
    </>
  );
}