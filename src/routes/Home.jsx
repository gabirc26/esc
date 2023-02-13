import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import "../styles/home.css"
import { AxiosApi } from "../services/RequisitionAPI"
import alun from '../assets/alun.png'
import prof from '../assets/prof.png'
import turm from '../assets/turm.png'
import Carousel from 'react-bootstrap/Carousel'
import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import Loading from "../components/Loading"


function Home() {
    const [search, setSearch] = useState("")
    const [data, setData] = useState(undefined);
    const [requisitionData, setRequisitionData] = useState(undefined);
    const [searchError, setSearchError] = useState('')
    const [selectedOption, setSelectedOption] = useState('alunos')
    const [loadingScreen, setLoadingScreen] = useState(true)


    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value)
    };

    useEffect(() => {
        async function requisitionInfo() {
            try {
                const connection = await AxiosApi.Get(`/${selectedOption}`)
                setRequisitionData(connection.data)
            } catch (error) {
                setLoadingScreen(false)
            }

        }
        requisitionInfo()
    }, [selectedOption])



    useEffect(() => {
        if (search === "") {
            setRequisitionData(data)
            setSearchError("")
        }
    }, [search])

    const submitSearch = async (e) => {
        e.preventDefault()
        setData(requisitionData)
        let result
        if (selectedOption === "turmas") {
            result = requisitionData.filter(data => data.turma == search)
        } else {
            result = requisitionData.filter(data => data.nome == search).length == 0 ? requisitionData.filter(data => data.matricula == search) : requisitionData.filter(data => data.nome == search);
        }
        if (result.length == 0) {
            setRequisitionData(result)
            setSearchError("Nenhum cadastro encontrado.")
        } else {
            setRequisitionData(result)

        }


    }
    return (
        <main>
            <div>
                <div>
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={img1}
                                alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={img2}
                                alt="Second slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={img3}
                                alt="Third slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                </div><br />
                <div className="d-flex justify-content-center search__input">
                    <form onSubmit={submitSearch}>
                        {/* <Input placeholder="Buscar" value={search} className="form-control border-secondary rounded-pill" onChange={e => setSearch(e.target.value)} label="Buscar" /> */}
                        <input type="text" placeholder="Buscar" value={search} className="form-control border-secondary rounded-pill " onChange={e => setSearch(e.target.value)} />
                    </form>
                </div>
                <section className="d-flex justify-content-center border mx-5 rounded-pill radios__ sectionHome">
                    <div>
                        <h4 className="text-center sectionHome">Filtro</h4>
                        <div className="linhaHome">
                            <div className="text-center px-1 sectionHome">
                                <label htmlFor="student"><h5>Alunos</h5></label><br />
                                <img src={aluno} alt="aluno" className="iconesHome" />
                                {/* <Input type="radio" value="alunos" checked={selectedOption === "alunos"} onChange={handleOptionChange} /> */}
                                <input type="radio" value="alunos" checked={selectedOption === "alunos"} onChange={handleOptionChange} />
                            </div>
                            <div className="text-center px-1 sectionHome">
                                <label htmlFor="student"><h5>Professores</h5></label><br />
                                <img src={professor} alt="aluno" className="iconesHome" />
                                {/* <Input type="radio" value="professores" checked={selectedOption === 'professores'} onChange={handleOptionChange} /> */}
                                <input type="radio" value="professores" checked={selectedOption === "professores"} onChange={handleOptionChange} />
                            </div>
                            <div className="text-center px-1 sectionHome">
                                <label htmlFor="student"><h5>Turmas</h5></label><br />
                                <img src={turma} alt="aluno" className="iconesHome" />
                                {/* <Input type="radio" value="turmas" checked={selectedOption === 'turmas'} onChange={handleOptionChange} /> */}
                                <input type="radio" value="turmas" checked={selectedOption === "turmas"} onChange={handleOptionChange} />
                            </div>

                        </div>
                    </div>
                </section>
                <div className="list_div border mt-5 mx-5 text-white inferiorHome">
                    <p>{searchError}</p>
                    {requisitionData ? (
                        <div className="dadosHome">
                            {requisitionData.map((info) => (
                                <div className="border m-3 px-2 info__ justify-content-between " key={info.id}>
                                    <p className="m-2">{info.nome ? (`Nome: ${info.nome}`) : (`Turma: ${info.turma}`)}</p>
                                    <p className="m-2">{info.matricula ? (`Matrícula: ${info.matricula}`) : (null)}</p>
                                    <Link to={`/${selectedOption}/${info.id}`}> <button className="btn btn-light px-3 me-2 my-2">info</button></Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            {loadingScreen ?
                                (
                                    <div>
                                        <Loading />
                                        <p className="mt-5 text-center">Carregando informações...</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="mt-5 text-center">Erro Interno, Tente novamente mais tarde.(error code: 28L H)</p>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </main >
    )
}

export default Home