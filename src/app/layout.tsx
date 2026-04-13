import type { Metadata } from "next";
import { Geist, Outfit, Atkinson_Hyperlegible } from "next/font/google";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/components/convex-provider";

const atkinsonHyperlegibleAtkinson = Atkinson_Hyperlegible({subsets:['latin'],weight:['400','700'],variable:'--font-atkinson'});

const outfitOutfit = Outfit({subsets:['latin'],weight:['300','400','500','600','700'],variable:'--font-outfit'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn( geist.variable, outfitOutfit.variable, atkinsonHyperlegibleAtkinson.variable)}>
      <body style={{ margin: 0, background: "#0b1320" }}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
