import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "360 Platform Matrix",
  description: "Organizational Structure & Role Definitions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b1320" }}>{children}</body>
    </html>
  );
}
