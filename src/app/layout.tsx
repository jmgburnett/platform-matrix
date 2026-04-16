"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";
import { ConvexClientProvider } from "@/components/convex-provider";
import { Outfit, Atkinson_Hyperlegible } from "next/font/google";
import { cn } from "@/lib/utils";

const atkinsonHyperlegibleAtkinson = Atkinson_Hyperlegible({subsets:['latin'],weight:['400','700'],variable:'--font-atkinson'});

const outfitOutfit = Outfit({subsets:['latin'],weight:['300','400','500','600','700'],variable:'--font-outfit'});

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  radius: { sm: "8px", md: "12px", lg: "16px" },
  defaultRadius: "md",
  components: {
    Button: { defaultProps: { radius: "md" } },
    Paper: { defaultProps: { radius: "md" } },
    Modal: { defaultProps: { radius: "lg" } },
    Badge: { defaultProps: { radius: "sm" } },
    Card: { defaultProps: { radius: "lg" } },
  },
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(outfitOutfit.variable, atkinsonHyperlegibleAtkinson.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: "#f8f9fc", minHeight: "100vh" }}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <ModalsProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
