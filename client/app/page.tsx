import Header from "./_components/header/Header";
import Dentista from "./_components/dentista/Dentista";
import Nosotros from "./_components/nosotros/Nosotros";
import Tratamientos from "./_components/tratamientos/Tratamientos";
import Contacto from "./_components/contacto/Contacto";

export default function Home() {
  return (
    <div>
      <Header/>
      <Dentista/>
      <Nosotros/>
      <Tratamientos/>
      <Contacto/>
    </div>
  );
}
