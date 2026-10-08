import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Syne } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ÀRÈWÀ · Bespoke English Suits, Streetwear, Denim & Royal Senators",
  description: "Luxury menswear atelier showcasing bespoke English suits, peak-lapel tuxedos, Japanese selvedge denim, heavy streetwear, and royal Nigerian Senators with interactive 3D showroom rail.",
  keywords: ["English bespoke suits", "Tuxedo", "Japanese selvedge denim", "Luxury streetwear", "Nigerian Senator wear", "Lagos atelier fashion"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: "/favicon.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
