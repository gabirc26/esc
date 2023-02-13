import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <div>
                <Link className="m-4 link__router" to="/"><button className="btn7 btn-light button"><h1>AGAPT</h1></button></Link>
            </div>
            <div>
                <Link className="m-4 link__router" to="/"><button className="btn btn-light button"><h5><strong>Home</strong></h5></button></Link>
                <Link className="m-1 link__router" to="/cadastro"><button className="btn btn-light button"><h5><strong>Cadastro</strong></h5></button></Link>
            </div>
        </nav>
    )
}

export default Navbar;