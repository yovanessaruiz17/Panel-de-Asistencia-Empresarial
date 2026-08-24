/**
 * Masks a cédula number for privacy, e.g. "1023456789" -> "1.023.***.789"
 */
export function maskCedula(cedula: string): string {
  if (!cedula) return '';
  const clean = cedula.replace(/\D/g, '');
  if (clean.length <= 4) return clean;

  const firstPart = clean.slice(0, clean.length - 6);
  const middlePart = '***';
  const lastPart = clean.slice(-3);

  const formattedFirst = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formattedFirst ? `${formattedFirst}.${middlePart}.${lastPart}` : `${middlePart}.${lastPart}`;
}

/**
 * Returns initials from full name e.g. "Juan Carlos Pérez" -> "JP"
 */
export function getInitials(nombres: string, apellidos: string = ''): string {
  const n = nombres?.trim().split(' ')[0]?.[0] || '';
  const a = apellidos?.trim().split(' ')[0]?.[0] || '';
  return (n + a).toUpperCase() || 'YD';
}

/**
 * Capitalizes string nicely
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
