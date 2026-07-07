"use client"
import { useEffect, useState } from "react"

// Imágenes críticas para el primer frame (los backgrounds son CSS, no los
// precarga next/image, por eso aparecen de golpe si no se esperan aquí).
const CRITICAL_IMAGES = [
  "/img/backgrounds/backgroundDentist.webp",
  "/img/backgrounds/backgroundTreatments.webp",
  "/img/us/us.webp",
]

export default function Preloader({ children }: { readonly children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    const preload = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // no bloquear si una imagen falla
        img.src = src
      })

    // Failsafe: nunca mantener el overlay más de 5s.
    const timeout = setTimeout(() => {
      if (!cancelled) setLoaded(true)
    }, 5000)

    Promise.all(CRITICAL_IMAGES.map(preload)).then(() => {
      if (cancelled) return
      clearTimeout(timeout)
      setLoaded(true)
    })

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <div className={`preloader ${loaded ? "hidden" : ""}`} aria-hidden={loaded}>
        <span className="preloaderSpinner" />
      </div>
      {children}
    </>
  )
}
