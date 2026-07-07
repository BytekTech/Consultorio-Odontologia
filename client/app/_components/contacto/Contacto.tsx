"use client"
import ContactoMap from "./ContactoMap";
import ContactoItem from "./ContactoItem";
import { useEffect, useState } from "react";

export default function Contacto() {

  const [item, setItem] = useState([])

  useEffect(()=>{
    fetch('/json/contacto.json')
      .then(res => res.json())
      .then(res => setItem(res))
  },[])

  return (
    <div className='contacto' id='contacto'>
      <h1>CONTACTO</h1>
      <div className='contactoDivision'>
        <ContactoMap/>
        <ContactoItem data={item}/>
      </div>
    </div>
  )
}