import "./globals.css";

export const metadata = {
  title: "Open me Cindy",
  description: "A little surprise for you.",
  openGraph: {
    title: "Open me Cindy",
    description: "A little surprise for you.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open me Cindy",
    description: "A little surprise for you.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

