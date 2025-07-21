"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/middleware/auth-provider";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => logout;

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut size={16} />
      <span>Cerrar sesión</span>
    </Button>
  );
}
