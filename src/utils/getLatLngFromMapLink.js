export const getLatLngFromMapLink = (link) => {
  const url = new URL(link);
  const lat = parseFloat(url.searchParams.get("mlat"));
  const lng = parseFloat(url.searchParams.get("mlon"));
  if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  return null;
};
