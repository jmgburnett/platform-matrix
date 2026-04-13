"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";
import { ConvexClientProvider } from "@/components/convex-provider";

const theme = createTheme({
  primaryColor: "teal",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: { fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" },
  colors: {
    stabilize: ["#fff4e6","#ffe8cc","#ffd8a8","#ffc078","#ffa94d","#ff922b","#fd7e14","#e8590c","#d9480f","#c92a2a"],
    modernize: ["#f3f0ff","#e5dbff","#d0bfff","#b197fc","#9775fa","#845ef7","#7950f2","#7048e8","#6741d9","#5f3dc4"],
    productize:["#ebfbee","#d3f9d8","#b2f2bb","#8ce99a","#69db7c","#51cf66","#40c057","#37b24d","#2f9e44","#2b8a3e"],
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <ModalsProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
