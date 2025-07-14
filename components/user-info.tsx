"use client";

import { User } from "lucide-react";
import { useAuth } from "./auth-provider";
import { useContext } from "react";
import { UserContext } from "@/lib/user-context";

export function UserInfo() {
  const { isAuthenticated } = useAuth();
  const { userData } = useContext(UserContext);

  return (
    <div className="border-t p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
          <User className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            {userData?.persona?.nombres} {userData?.persona?.apellidos}
          </p>
          <p className="text-xs text-gray-500">{userData?.rol?.nombre}</p>
        </div>
      </div>
    </div>
  );
}
