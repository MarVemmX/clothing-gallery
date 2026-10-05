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

export const metadata = {
  title: "ÀRÈWÀ SENATORIAL · Bespoke Nigerian Haute Couture",
  description: "Exclusive Nigerian Senator collection. Handcrafted Italian cashmere tunics with geometric embroidery, interactive visual size preview, and bespoke tailoring.",
  keywords: ["Nigerian Senator outfit", "Senator wear", "Bespoke menswear Nigeria", "Agbada", "Lagos atelier fashion"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
