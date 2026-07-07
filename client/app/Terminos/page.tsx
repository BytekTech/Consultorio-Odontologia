"use client"
import { useEffect, useState } from 'react'
import { LegalSection, LegalDataProps } from './LegalSection';
import Link from 'next/link';

const LegalPage: React.FC = () => {
  
  const [items, setItems] = useState([])

  useEffect(()=>{
    fetch('/json/tyc.json')
      .then(res => res.json())
      .then(res => setItems(res))
  },[])

  const data: LegalDataProps[] = items as LegalDataProps[];

  return (
    <div className="tyc">
      <Link className='volver' href={'/'}>
        Volver
      </Link>
        <h1>Términos y Condiciones y Política de Privacidad</h1>
        <p className="updated">
          <strong>Última actualización:</strong> 20 de Febrero de 2026
        </p>
        {data.map((section) => (
          <LegalSection key={section.id} data={section} />
        ))}
    </div>
  )
}

export default LegalPage;