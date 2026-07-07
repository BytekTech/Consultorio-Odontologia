"use client"
import { useActiveSection } from "@/app/hooks/useActiveSection"
import { Link } from "react-scroll"
import { useEffect, useRef, useState } from "react"

export interface LinkItem {
  id: number;
  ref: string;
  text: string;
}

export interface HeaderProps {
  readonly links: LinkItem[]
}

export default function HeaderLinks({ links }: HeaderProps) {

  const sectionIds = links.map(link => link.ref);
  const activeSection = useActiveSection(sectionIds);

  // En dispositivos táctiles no hay hover: el texto se revela con esta clase
  // al tocar el enlace y se limpia (vuelve a puntos) al tocar fuera del header.
  const [revealed, setRevealed] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setRevealed(null);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  if (!links || links.length === 0) return null;

  const revealOnTouch = (id: number) => {
    if (window.matchMedia("(hover: none)").matches) setRevealed(id);
  };

  return (
    <nav className='headerLinks' ref={navRef}>
      {links.map((link) => (
        <Link
          key={link.id}
          to={link.ref}
          spy={true}
          smooth={true}
          duration={500}
          offset={0}
          className={`${activeSection === link.ref ? 'active' : ''} ${revealed === link.id ? 'revealed' : ''}`}
          onClick={() => revealOnTouch(link.id)}
        >
          {link.text}
        </Link>
      ))}
    </nav>
  )
}
