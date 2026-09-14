import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "../../lib/bindings.server";
import { isAdmin } from "../../lib/admin-auth.server";

export const Route = createFileRoute("/api/admin-appointment-status")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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
          const body = (await request.json()) as {
            id?: number;
            status?: string;
          };

          const id = Number(body.id);
          const status = body.status;

          if (!id || !["approved", "refused"].includes(status || "")) {
            return Response.json(
              { success: false, error: "Requête invalide" },
              { status: 400 },
            );
          }

          const appointment = await DB.prepare(
            `SELECT id, appointment_date, appointment_time
             FROM appointments
             WHERE id = ?`,
          )
            .bind(id)
            .first();

          if (!appointment) {
            return Response.json(
              { success: false, error: "Rendez-vous introuvable" },
              { status: 404 },
            );
          }

          try {
            await DB.prepare(
              `UPDATE appointments
               SET status = ?
               WHERE id = ?`,
            )
              .bind(status, id)
              .run();
          } catch {
            return Response.json(
              {
                success: false,
                error: "Cet horaire est déjà réservé.",
              },
              { status: 409 },
            );
          }

          return Response.json({
            success: true,
            status,
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
