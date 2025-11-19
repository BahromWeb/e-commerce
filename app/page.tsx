import { Header } from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="page-container">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="section-title">Welcome to E-Commerce</h1>
          <p className="text-text-secondary text-lg mb-8">
            Optimal organization meets exquisite design. Manage your products and orders with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
