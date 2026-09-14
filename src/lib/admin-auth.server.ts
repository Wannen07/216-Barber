import { bindings } from "./bindings.server";

const COOKIE_NAME = "barber_admin_session";

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string) {
  const secret = bindings().ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  return bytesToHex(new Uint8Array(signature));
}

export async function createAdminCookie() {
  const value = "216-barber-admin";
  const signature = await sign(value);

  return `${COOKIE_NAME}=${value}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`;
}

export async function isAdmin(request: Request) {
  const cookies = request.headers.get("cookie") || "";

  const match = cookies
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  if (!match) return false;

  const cookieValue = match.slice(COOKIE_NAME.length + 1);
  const [value, signature] = cookieValue.split(".");

  if (!value || !signature) return false;

  const expected = await sign(value);

  if (signature.length !== expected.length) return false;

  let difference = 0;

  for (let i = 0; i < signature.length; i++) {
    difference |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  return difference === 0 && value === "216-barber-admin";
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
