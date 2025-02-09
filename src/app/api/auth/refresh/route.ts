import { cookies } from "next/headers";
import { parse } from "cookie";

export async function POST() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/auth/refresh`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
        cookie: `refreshToken=${cookies().get("refreshToken")?.value}`,
      },
    }
  );

  if (!response.ok) {
    console.log("Refresh failed.");
    return Response.json({ success: false });
  }

  const c = response.headers.getSetCookie();
  const accessToken = c.find((cookie) => cookie.includes("accessToken"));
  const refreshToken = c.find((cookie) => cookie.includes("refreshToken"));

  if (!accessToken || !refreshToken) {
    console.log("Tokens could not found.");
    return Response.json({ success: false });
  }

  const parsedAccessToken = parse(accessToken);
  const parsedRefreshToken = parse(refreshToken);

  cookies().set("accessToken", parsedAccessToken.accessToken ?? "", {
    expires: new Date(parsedAccessToken.Expires as string),
    httpOnly: true,
    path: parsedAccessToken.Path,
    domain: parsedAccessToken.Domain,
    sameSite: parsedAccessToken.SameSite as "strict",
  });

  cookies().set("refreshToken", parsedRefreshToken.refreshToken ?? "", {
    expires: new Date(parsedRefreshToken.Expires as string),
    httpOnly: true,
    path: parsedRefreshToken.Path,
    domain: parsedRefreshToken.Domain,
    sameSite: parsedRefreshToken.SameSite as "strict",
  });

  return Response.json({ success: true });
}
