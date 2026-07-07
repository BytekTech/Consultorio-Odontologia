import Presentation from './Presentation'
import CardsDentista from './cards/CardsDentista'

export default function Dentista() {
  return (
    <div className='dentista' id='dentista'>
      <div className='dentistaDivision'>
        <Presentation/>
      </div>
      <CardsDentista/>
    </div>
  )
}