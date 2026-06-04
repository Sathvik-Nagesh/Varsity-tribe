import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GlobalToaster } from "@/components/providers/GlobalToaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Varsity Tribe — Learn. Invest. Grow.",
    template: "%s | Varsity Tribe",
  },
  description:
    "Your financial education superapp. Master the stock market with structured courses, real-time practice, and a community of learners.",
  keywords: [
    "finance",
    "stock market",
    "investing",
    "education",
    "trading",
    "Varsity Tribe",
    "Zerodha",
    "financial literacy",
    "personal finance",
    "stock market",
    "fintech learning",
    "wealth building",
  ],
  authors: [{ name: "Varsity Tribe" }],
  creator: "Varsity Tribe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://varsitytribe.com",
    title: "Varsity Tribe — Financial Mastery Ecosystem",
    description:
      "Your premium financial education ecosystem. Master personal finance and investing.",
    siteName: "Varsity Tribe",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Varsity Tribe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varsity Tribe — Learn. Invest. Grow.",
    description:
      "Your financial education superapp. Master the stock market with structured courses, real-time practice, and a community of learners.",
    images: ["/logo.png"],
    creator: "@VarsityTribe",
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "theme-color": "#387ED1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-text-primary">
        <ThemeProvider>
          {children}
          <GlobalToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
