import "../styles/registry.css"
import { Link } from "react-router-dom"
import alun from '../assets/alun.png'
import prof from '../assets/prof.png'
import turm from '../assets/turm.png'



function Registry() {
    return (
        <>
            <main>
                <section className='d-flex wrap mt-5 justify-content-center flex-wrap'>
                    <div className="div_registry m-4 rounded">
                    <img src={alun} alt="aluno" className="iconesH" />
                        <h3 className="text-center  #050081">Aluno</h3>
                 
                        <Link to="/new/aluno"><button className="btn1 btn-light m-5">CADASTRAR</button></Link>
                        
                    </div>
                    <div className="div_registry m-4 rounded">
                    <img src={prof} alt="professor" className="iconesH" />
                        <h3 className="text-center #050081">Professor</h3>
                        
                        <Link to="/new/professor"><button className="btn1 btn-light m-5">CADASTRAR</button></Link>
                    </div>
                    <div className="div_registry m-4 rounded">
                    <img src={turm} alt="turma" className="iconesH" />
                        <h3 className="text-center #050081 ">Turma</h3>
                   
                        <Link to="/new/turma"><button className="btn1 btn-light m-5">CADASTRAR</button></Link>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Registry