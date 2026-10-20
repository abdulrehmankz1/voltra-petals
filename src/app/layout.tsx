import type { Metadata, Viewport } from "next";
import "./globals.css";

// The original's inline SVG favicon: the two petals of the mark on an ink tile.
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-14 -16 124 112'%3E%3Crect x='-14' y='-16' width='124' height='112' rx='28' fill='%230C0D12'/%3E%3ClinearGradient id='f0' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='46.256' y2='80.115'%3E%3Cstop offset='0' stop-color='%238EAEFF'/%3E%3Cstop offset='1' stop-color='%231C40DA'/%3E%3C/linearGradient%3E%3ClinearGradient id='f1' gradientUnits='userSpaceOnUse' x1='46.256' y1='0' x2='0' y2='80.115'%3E%3Cstop offset='0' stop-color='%23E3EBFF'/%3E%3Cstop offset='1' stop-color='%232F6BFF'/%3E%3C/linearGradient%3E%3Cpath transform='translate(0 0)' fill='url(%23f0)' d='M 46.256 80.115 C 17.632 63.592 0 33.052 0 0 C 28.624 16.526 46.256 47.066 46.256 80.115 Z'/%3E%3Cpath transform='translate(49.744 0)' fill='url(%23f1)' d='M 0 80.115 C 0 47.066 17.633 16.526 46.256 0 C 46.256 33.052 28.624 63.592 0 80.115 Z'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "Voltra · Wealth that grows with you",
  description:
    "Voltra is the AI-powered crypto wallet that watches every chain, price and key you hold, then helps your portfolio grow at a pace you can live with.",
  icons: { icon: FAVICON },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050608",
  colorScheme: "dark",
};

// MOTION-DEV OWNS THIS STRING: the pre-paint root script (js / js-ready classes and the fallback if the motion
// bundle never boots, as on Facet). Left empty until the motion port fills it in; any future CSP must allow it by
// its hash.
const rootScript = "";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: rootScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Loaded exactly as the original: the canvas and SVG artwork reference the "Urbanist" family by name */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
