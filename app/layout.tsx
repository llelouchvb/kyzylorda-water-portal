import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Қызылорда су жүйесі | Қызылорда", description: "Қызылорда су жүйесі: тарифтер, хабарландырулар және тұтынушыларға ақпарат.", icons: { icon: "/company-logo.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="kk" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"document.documentElement.lang=location.pathname.startsWith('/ru')?'ru':'kk'"}} /></head><body>{children}</body></html>; }
