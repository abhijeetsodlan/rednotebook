import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <section className="px-4 py-16">
      <h1 className="mb-8 text-center font-display text-5xl uppercase">Admin Login</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
