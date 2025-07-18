"use client";
import { useUser } from "@/middleware/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AlertasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getFuntions } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!getFuntions("Alertas")) {
      router.replace("/");
    }
  }, [getFuntions, router]);

  return <>{children}</>;
}
