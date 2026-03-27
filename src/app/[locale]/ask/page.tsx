"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AIChatInterface } from "@/components/AIChatInterface";

export default function AskPage() {
  return (
    <>
      <Header />
      <main className="container-main py-8">
        <AIChatInterface />
      </main>
      <Footer />
    </>
  );
}
