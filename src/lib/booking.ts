export const SERVICES = [
  "Coupe Homme",
  "Barbe",
  "Coupe + Barbe",
  "Dégradé",
  "Styling",
];

export const SLOT_DURATION = 45;

export function isMonday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 1;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function makeSlots(start: string, end: string) {
  const slots: string[] = [];
  let current = toMinutes(start);
  const endMinutes = toMinutes(end);

  while (current + SLOT_DURATION <= endMinutes) {
    slots.push(toTime(current));
    current += SLOT_DURATION;
  }

  return slots;
}

export function getAvailableBaseSlots(date: string) {
  if (!date || isMonday(date)) {
    return [];
  }

  return [
    ...makeSlots("10:00", "13:30"),
    ...makeSlots("15:00", "21:00"),
  ];
}
