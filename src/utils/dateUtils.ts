export const DEFAULT_TIMEZONE = 'America/Bogota';

/**
 * Returns current date in YYYY-MM-DD format based on America/Bogota
 */
export function getTodayDateString(timeZone = DEFAULT_TIMEZONE): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

/**
 * Returns current time in HH:mm:ss format based on America/Bogota
 */
export function getCurrentTimeString(timeZone = DEFAULT_TIMEZONE): string {
  const now = new Date();
  return now.toLocaleTimeString('es-CO', {
    timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Returns a human formatted friendly date string: "Lunes, 24 de agosto de 2026"
 */
export function getFormattedFullDate(dateStr?: string, timeZone = DEFAULT_TIMEZONE): string {
  const date = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  return new Intl.DateTimeFormat('es-CO', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Converts HH:mm string to minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts minutes from midnight back to HH:mm
 */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculates duration between two HH:mm strings and returns "Xh Ym"
 */
export function calculateDurationString(start: string, end: string): string {
  if (!start || !end) return '0h 0m';
  const startMins = timeStringToMinutes(start);
  let endMins = timeStringToMinutes(end);

  // If overnight shift
  if (endMins < startMins) {
    endMins += 24 * 60;
  }

  const diffMins = Math.max(0, endMins - startMins);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Calculates duration in decimal hours (e.g. 1.5)
 */
export function calculateDecimalHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const startMins = timeStringToMinutes(start);
  let endMins = timeStringToMinutes(end);
  if (endMins < startMins) endMins += 24 * 60;
  const diffMins = Math.max(0, endMins - startMins);
  return Number((diffMins / 60).toFixed(2));
}
