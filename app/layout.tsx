import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Circus",
  description: "Where all clowns belong.",
};

/**
 * @description
 * Root layout component for the Next.js application.
 * It wraps the application in a consistent layout and applies global styles.
 *
 * @param param0  - The children prop containing the main content of the application.
 * @param param0.children - The main content of the application.
 * @returns {JSX.Element} The root layout component.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
