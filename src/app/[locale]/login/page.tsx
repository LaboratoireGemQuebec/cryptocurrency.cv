import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: "Sign In — Crypto Vision",
    description:
      "Sign in to your Crypto Vision account with a magic link. No password needed.",
    path: "/login",
    locale,
    tags: ["login", "sign in", "account", "magic link"],
  });
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="container-main py-16">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
