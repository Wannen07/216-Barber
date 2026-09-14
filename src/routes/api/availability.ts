import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "../../lib/bindings.server";

export const Route = createFileRoute("/api/availability")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const DB = bindings().DB;

        if (!DB) {
          return Response.json(
            { success: false, error: "Database unavailable" },
            { status: 500 },
          );
        }

        const url = new URL(request.url);
        const date = url.searchParams.get("date");

        if (!date) {
          return Response.json(
            { success: false, error: "Date manquante" },
            { status: 400 },
          );
        }

        const result = await DB.prepare(
          `SELECT appointment_time
           FROM appointments
           WHERE appointment_date = ?
           AND status = 'approved'
           ORDER BY appointment_time`,
        )
          .bind(date)
          .all();

        const bookedTimes = result.results.map(
          (row: any) => row.appointment_time,
        );

        return Response.json({
          success: true,
          date,
          bookedTimes,
        });
      },
    },
  },
});
