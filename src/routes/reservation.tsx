import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getAvailableBaseSlots, isMonday, SERVICES } from "../lib/booking";

export const Route = createFileRoute("/reservation")({
  component: Reservation,
});

function Reservation() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const slots = useMemo(() => {
    if (!date) return [];

    return getAvailableBaseSlots(date).filter(
      (slot) => !bookedTimes.includes(slot),
    );
  }, [date, bookedTimes]);

  useEffect(() => {
    setTime("");
    setBookedTimes([]);

    if (!date || isMonday(date)) return;

    fetch(`/api/availability?date=${encodeURIComponent(date)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookedTimes)) {
          setBookedTimes(data.bookedTimes);
        }
      })
      .catch(() => {
        setMessage("Impossible de vérifier les disponibilités.");
      });
  }, [date]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!name || !phone || !service || !date || !time) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          service,
          appointment_date: date,
          appointment_time: time,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.error || "Une erreur est survenue.");
        return;
      }

      setMessage(
        "Demande envoyée ✓ Votre rendez-vous est en attente de confirmation.",
      );

      setName("");
      setPhone("");
      setService("");
      setDate("");
      setTime("");
    } catch {
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="reservation-page">
      <a className="reservation-back" href="/">
        ← 216 BARBER
      </a>

      <section className="reservation-card">
        <p className="eyebrow">216 BARBER</p>

        <h1>
          Prendre <i>rendez-vous</i>
        </h1>

        <p className="reservation-intro">
          Choisissez votre service, la date et l'heure qui vous conviennent.
        </p>

        <form onSubmit={submit} className="reservation-form">
          <label>
            Nom
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              autoComplete="name"
              required
            />
          </label>

          <label>
            Téléphone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+216"
              autoComplete="tel"
              required
            />
          </label>

          <label>
            Service
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">Choisir un service</option>

              {SERVICES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          {date && isMonday(date) && (
            <div className="reservation-warning">
              Le salon est fermé le lundi.
            </div>
          )}

          {date && !isMonday(date) && (
            <div>
              <span className="reservation-label">Heure</span>

              <div className="time-grid">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={time === slot ? "time active" : "time"}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {slots.length === 0 && (
                <p className="reservation-warning">
                  Aucun horaire disponible pour cette date.
                </p>
              )}
            </div>
          )}

          <button
            className="reservation-submit"
            type="submit"
            disabled={loading || !time}
          >
            {loading ? "Envoi..." : "Envoyer la demande →"}
          </button>

          {message && <p className="reservation-message">{message}</p>}
        </form>

        <div className="reservation-info">
          <span>Mardi — Dimanche</span>
          <b>10:00 — 21:00</b>
          <small>Pause 13:30 — 15:00 • Lundi fermé</small>
        </div>
      </section>
    </main>
  );
}
