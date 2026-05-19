"use client";

import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Redirect to main page which handles face scan
  if (typeof window !== "undefined") {
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Shield className="w-8 h-8 text-cyan-glow animate-pulse" />
    </div>
  );
}
