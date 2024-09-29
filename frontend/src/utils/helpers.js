// Helper function for convert number into currency
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

// Helper function to convert date
export function formatReadableDate(isoDateString) {
  const date = new Date(isoDateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedDay}.${formattedMonth}.${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
