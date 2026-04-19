const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDateString(value: string): boolean {
  if (!isoDate.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime());
}

export function validateStayDates(
  checkIn: string,
  checkOut: string,
): { ok: true } | { ok: false; message: string } {
  if (!isValidIsoDateString(checkIn) || !isValidIsoDateString(checkOut)) {
    return { ok: false, message: "Dates must be YYYY-MM-DD." };
  }
  if (checkOut <= checkIn) {
    return { ok: false, message: "Check-out must be after check-in." };
  }
  return { ok: true };
}

export function validateGuestCount(
  guestCount: number,
  maxGuests: number,
): { ok: true } | { ok: false; message: string } {
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    return {
      ok: false,
      message: "Guest count must be a whole number of at least 1.",
    };
  }
  if (!Number.isInteger(maxGuests) || maxGuests < 1) {
    return { ok: false, message: "This room has an invalid capacity in the system." };
  }
  if (guestCount > maxGuests) {
    return {
      ok: false,
      message: `Guest count cannot exceed ${maxGuests} for this room.`,
    };
  }
  return { ok: true };
}
