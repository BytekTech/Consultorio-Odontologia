import LeftComponent from "./left/LeftComponent";
import RightComponent from "./right/RightComponent";

export default function Nosotros() {
  return (
    <div className='nosotros' id='nosotros'>
      <h1>NOSOTROS</h1>
      <div className='nosotrosDivision'>
        <LeftComponent/>
        <RightComponent/>
      </div>
    </div>
  )
}