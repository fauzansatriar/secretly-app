import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Secretly — Password Manager",
  description: "Simple, secure password manager with Face ID verification. Store all your app passwords safely.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Secretly",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#070d1f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen safe-top`}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}

/** Inline script to apply theme before paint (no flash) */
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var s=JSON.parse(localStorage.getItem('secretly_settings')||'{}');document.documentElement.classList.toggle('dark',s.dark_mode!==false)}catch(e){document.documentElement.classList.add('dark')}})()`,
      }}
    />
  );
}
