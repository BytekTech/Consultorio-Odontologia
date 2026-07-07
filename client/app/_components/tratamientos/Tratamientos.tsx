"use client"
import { useEffect, useState } from "react";
import TratamientoItem from "./TratamientoItem";
import Image from "next/image";

export default function Tratamientos() {

  const [items, setItems] = useState([])

  useEffect(()=> {
    fetch('/json/tratamientos.json')
      .then(res => res.json())
      .then(res => setItems(res))
  }, [])
  return (
    <div className='tratamientos' id='tratamientos'>
      <h1>TRATAMIENTOS</h1>
      <TratamientoItem data={items}/>
      <Image
        src={'/img/backgrounds/backgroundTreatments.webp'}
        alt='Fondo tratamientos'
        fill
        priority
      />
    </div>
  )
}