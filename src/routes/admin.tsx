import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "approved" | "refused";
  created_at: string;
};

function Admin() {
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadAppointments() {
    try {
      const res = await fetch("/api/admin-appointments");

      if (res.status === 401) {
        setLoggedIn(false);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments);
        setLoggedIn(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage(data.error || "Connexion impossible");
      return;
    }

    setPassword("");
    setLoggedIn(true);
    await loadAppointments();
  }

  async function changeStatus(
    id: number,
    status: "approved" | "refused",
  ) {
    setMessage("");

    const res = await fetch("/api/admin-appointment-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage(data.error || "Erreur");
      return;
    }

    await loadAppointments();
  }

  if (loading) {
    return <main className="admin-page">Chargement...</main>;
  }

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <p className="eyebrow">216 BARBER</p>
          <h1>Administration</h1>

          <form onSubmit={login}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Connexion →</button>
          </form>

          {message && <p className="admin-message">{message}</p>}
        </section>
      </main>
    );
  }

  const pending = appointments.filter((a) => a.status === "pending");
  const approved = appointments.filter((a) => a.status === "approved");
  const history = appointments.filter((a) => a.status === "refused");

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">216 BARBER</p>
          <h1>Dashboard</h1>
        </div>

        <span>{pending.length} en attente</span>
      </header>

      {message && <p className="admin-message">{message}</p>}

      <section className="admin-section">
        <h2>Demandes en attente</h2>

        {pending.length === 0 && (
          <p className="admin-empty">Aucune demande en attente.</p>
        )}

        <div className="admin-list">
          {pending.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <div className="appointment-top">
                <strong>{appointment.name}</strong>
                <span>EN ATTENTE</span>
              </div>

              <p>{appointment.service}</p>

              <div className="appointment-details">
                <b>{appointment.appointment_date}</b>
                <b>{appointment.appointment_time}</b>
                <a href={`tel:${appointment.phone}`}>
                  {appointment.phone}
                </a>
              </div>

              <div className="appointment-actions">
                <button
                  className="approve"
                  onClick={() =>
                    changeStatus(appointment.id, "approved")
                  }
                >
                  Accepter
                </button>

                <button
                  className="refuse"
                  onClick={() =>
                    changeStatus(appointment.id, "refused")
                  }
                >
                  Refuser
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Agenda</h2>

        <div className="admin-list">
          {approved.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <div className="appointment-top">
                <strong>{appointment.name}</strong>
                <span>CONFIRMÉ</span>
              </div>

              <p>{appointment.service}</p>

              <div className="appointment-details">
                <b>{appointment.appointment_date}</b>
                <b>{appointment.appointment_time}</b>
                <a href={`tel:${appointment.phone}`}>
                  {appointment.phone}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Refusés</h2>

        <p className="admin-empty">
          {history.length} rendez-vous refusé(s)
        </p>
      </section>
    </main>
  );
}
