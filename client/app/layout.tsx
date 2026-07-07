import type { Metadata } from "next";
import "./globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Instrument_Serif, Playfair_Display } from 'next/font/google'
import Footer from "./_components/footer/Footer";
import Preloader from "./_components/preloader/Preloader";
import { siteUrl } from "./lib/site";

const title = "Dra. Silvia Pellegrino | Consultorio Odontológico Tablada";
const description = "Consultorio odontológico integral en La Tablada, Zona Oeste. Brindamos atención personalizada para el cuidado de tu salud bucal. Horarios de atención: Lunes y Miércoles de 15:30 a 20:00 hs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Dra. Silvia Pellegrino",
    title,
    description,
    images: [
      {
        url: "/img/us/us.webp",
        width: 700,
        height: 700,
        alt: "Consultorio Odontológico Dra. Silvia Pellegrino",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/us/us.webp"],
  },
  keywords: [
    "Dentista", 
    "Zona Oeste", 
    "Tablada",
    "Consultorio Odontológico",
    "Conductos",
    "Tratamiento bucal",
    "Bruxismo",
    "Periodoncia",
    "Estetica dental",
    "Implantes",
    "Protesis dentales",
    "Odontología niños",
    "Odontología adultos",
    "Dentista niños",
    "Dentista tablada",
    "Consultorio",
    "Salud Bucal",
    "Turnos dentista",
  ],
  icons: {
    icon: "/favicon.ico"
  }
}

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

// 2. Configuramos Playfair Display (Títulos)
const playfair = Playfair_Display({
  weight: '400',
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Consultorio Odontológico Dra. Silvia Pellegrino",
  description,
  image: `${siteUrl}/img/us/us.webp`,
  url: siteUrl,
  telephone: "+541146553353",
  priceRange: "$$",
  medicalSpecialty: "Dentistry",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Catriel 4929",
    addressLocality: "La Tablada",
    addressRegion: "Provincia de Buenos Aires",
    postalCode: "B1766FLK",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.68673857281178,
    longitude: -58.53040848780947,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Wednesday"],
      opens: "15:30",
      closes: "20:00",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${instrumentSerif.variable} ${playfair.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader>
          {children}
          <Footer/>
        </Preloader>
      </body>
      <SpeedInsights/>
    </html>
  )
}
