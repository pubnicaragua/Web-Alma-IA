import { fetchWithAuth } from "@/lib/api-config";
import { da } from "date-fns/locale";

export interface UpdatePasswordData {
  new_password: string;
  currentPassword: string;
}

export const fetchUpdatePassword = async (
  data: UpdatePasswordData
): Promise<boolean> => {
  try {
    const response = await fetchWithAuth("/auth/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: data.new_password,
        currentPassword: data.currentPassword,
      }),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchRestorePassword = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(
      "https://api-almaia.onrender.com/api/v1/auth/solicitar/cambio/password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export interface fetchRestorePasswordCodeType {
  email: string;
  resetCode: string;
  newPassword: string;
}

export const fetchRestorePasswordCode = async (
  data: fetchRestorePasswordCodeType
): Promise<boolean> => {
  try {
    const response = await fetch(
      "https://api-almaia.onrender.com/api/v1/auth/restore-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.newPassword,
          pass: data.resetCode,
        }),
      }
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
