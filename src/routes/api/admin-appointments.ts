import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "../../lib/bindings.server";
import { isAdmin } from "../../lib/admin-auth.server";

export const Route = createFileRoute("/api/admin-appointments")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdmin(request))) {
          return Response.json(
            { success: false, error: "Non autorisé" },
            { status: 401 },
          );
        }
        const DB = bindings().DB;

        if (!DB) {
          return Response.json(
            { success: false, error: "Database unavailable" },
            { status: 500 },
          );
        }

        try {
          const result = await DB.prepare(`
            SELECT
              id,
              name,
              phone,
              service,
              appointment_date,
              appointment_time,
              status,
              created_at
            FROM appointments
            ORDER BY appointment_date ASC, appointment_time ASC
          `).all();

          return Response.json({
            success: true,
            appointments: result.results,
          });
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
