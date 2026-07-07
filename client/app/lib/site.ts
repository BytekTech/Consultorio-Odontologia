// Dominio de producción. En Vercel se resuelve solo por env;
// el fallback es solo para desarrollo local. Cambiá el fallback si el
// dominio final no es este.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://silviapellegrino.com"
