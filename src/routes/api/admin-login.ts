import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "../../lib/bindings.server";
import { createAdminCookie } from "../../lib/admin-auth.server";

export const Route = createFileRoute("/api/admin-login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { password } = (await request.json()) as {
            password?: string;
          };

          const adminPassword = bindings().ADMIN_PASSWORD;

          if (!adminPassword) {
            return Response.json(
              { success: false, error: "Admin non configuré" },
              { status: 500 },
            );
          }

          if (!password || password !== adminPassword) {
            return Response.json(
              { success: false, error: "Mot de passe incorrect" },
              { status: 401 },
            );
          }

          const cookie = await createAdminCookie();

          return Response.json(
            { success: true },
            {
              headers: {
                "Set-Cookie": cookie,
              },
            },
          );
        } catch (error) {
          console.error(error);

          return Response.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 },
          );
        }
      },
    },
  },
});
