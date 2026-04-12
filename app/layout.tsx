import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import Storeprovide from "./redux/Storeprovide";
import Usegetme from "./hook/Usegetme";
import { Inituser } from "./Inituser";
import CartLoader from "./Cartloader";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickBasket",
  description: "A modern grocery delivery application built with Next.js, MongoDB, and NextAuth for seamless user authentication and management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-full min-h-screen bg-linear-to-br">
        
        <Storeprovide>
        <Provider>
         <Inituser />
          <CartLoader />
        {children}
        </Provider>
        </Storeprovide>
        
        </body>
    </html>
  );
}
