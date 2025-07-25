import { fetchWithAuth } from "@/lib/api-config";

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
