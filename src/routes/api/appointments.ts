import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "../../lib/bindings.server";

export const Route = createFileRoute("/api/appointments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const DB = bindings().DB;

        if (!DB) {
          return Response.json(
            { success: false, error: "Database unavailable" },
            { status: 500 },
          );
        }

        try {
          const body = (await request.json()) as {
            name?: string;
            phone?: string;
            service?: string;
            appointment_date?: string;
            appointment_time?: string;
          };

          const name = body.name?.trim();
          const phone = body.phone?.trim();
          const service = body.service?.trim();
          const appointmentDate = body.appointment_date?.trim();
          const appointmentTime = body.appointment_time?.trim();

          if (
            !name ||
            !phone ||
            !service ||
            !appointmentDate ||
            !appointmentTime
          ) {
            return Response.json(
              { success: false, error: "Champs obligatoires manquants" },
              { status: 400 },
            );
          }

          await DB.prepare(
            `INSERT INTO appointments
            (name, phone, service, appointment_date, appointment_time, status)
            VALUES (?, ?, ?, ?, ?, 'pending')`,
          )
            .bind(
              name,
              phone,
              service,
              appointmentDate,
              appointmentTime,
            )
            .run();

          return Response.json({
            success: true,
            message: "Demande de rendez-vous envoyée",
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
