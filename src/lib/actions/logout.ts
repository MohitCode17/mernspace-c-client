"use server";

import { cookies } from "next/headers";

export default async function logout() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/auth/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
          cookie: `refreshToken=${cookies().get("refreshToken")?.value}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Login failed");
      return false;
    }

    cookies().delete("accessToken");
    cookies().delete("refreshToken");

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
  }
}
