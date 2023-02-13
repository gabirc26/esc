import { useEffect, useState } from "react"
import { Form, Col, Row } from "react-bootstrap"
import { AxiosApi } from "../services/RequisitionAPI"
import { ClassRoomUseCases } from "../useCases/ClassRoomUseCases"
import "../styles/classRoomRegister.css"
import removeStudent from "../assets/removeUser.png"
import addStudent from "../assets/addUser.png"
import { Link } from "react-router-dom"
import "../styles/NewClass.css"

function NewClass() {

    const [values, setValues] = useState({
        classRoom: "",
        students: "",
        year: ""
    })
    const [steps, setSteps] = useState({
        one: true,
        two: false,
        three: false,
        four: false
    })

    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const handleChangeTeacher = (event) => {
        const selectedOption = teachers.find(
            (teacher) => teacher.nome === event.target.value
        );
        setSelectedTeacher(selectedOption);
        setSteps(prevStats => ({ ...prevStats, two: false, three: true, four: true }))
    };

    const [invalidInput, setInvalidInput] = useState({
        classRoom: false,
        year: false,
        errorClassRoom: false,
        errorYear: false,
        inputsPassed: 0,
        errorMessage: "",
        invalidClassRoom: false
    })

    const handleClassRoomBlur = () => {
        if (values.classRoom.length == 4) {
            setInvalidInput(prevState => ({ ...prevState, errorClassRoom: false, classRoom: true }))
        } else {
            setInvalidInput(prevState => ({ ...prevState, errorClassRoom: true }))

        }
    }
    const handleYearBlur = () => {
        if ((values.year.length < 3) && (values.year.length > 0)) {
            setInvalidInput(prevState => ({ ...prevState, errorYear: false, year: true }))
        } else {
            setInvalidInput(prevState => ({ ...prevState, errorYear: true }))

        }
    }

    useEffect(() => { 
        setInvalidInput(prevState => ({ ...prevState, invalidClassRoom: false, classRoom: false}))
        async function testClassRoom() {
            try {
                const connection = await AxiosApi.Get(`/turmas?turma=${values.classRoom}`)
                if (connection.data.length != 0) {
                    setInvalidInput(prevState => ({ ...prevState, invalidClassRoom: true, errorClassRoom: false, classRoom: false }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        testClassRoom()
    }, [values.classRoom])

    //ALUNOS
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [uniqueKey, setUniqueKey] = useState(0);
    useEffect(() => {
        async function dataRequisitons() {
            const students = await AxiosApi.Get('/alunos')
            const filteredStudents = students.data.filter(students => !students.turma);
            setStudents(filteredStudents)

            const teachers = await AxiosApi.Get('/professores')
            const filteredTeachers = teachers.data.filter(teacher => !teacher.turma);
            setTeachers(filteredTeachers)

        }
        dataRequisitons()
    }, [selectedTeacher])

    const handleStudentSelection = (student) => {
        setSelectedStudents([...selectedStudents, student]);
        setStudents(students.filter((s) => s.id !== student.id));
        setInvalidInput(prevState => ({ ...prevState, errorMessage: "" }))
    };

    const handleStudentDeselection = (student) => {
        setStudents([...students, student]);
        setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
        setUniqueKey(uniqueKey + 1);
    };
    const [create, setCreate] = useState({
        message: "200",
        status: false
    })

    if (create.status) {
        return (
            <main className="text-center text-white">
                {create.message == "200" ? (<h4 className="mt-5">Turma Criada com sucesso!</h4>) : (<div>
                    <h4 className="mt-5">{create.message}</h4>
                </div>
                )}
                <Link to="/"><button className='btn-light btn mt-5'>Voltar para Tela Inicial</button></Link>
            </main>
        )
    }

    const CreateNewClassRoom = async (e) => {
        e.preventDefault()
        if (selectedStudents.length == 0) {
            setInvalidInput(prevState => ({ ...prevState, errorMessage: "É obrigatório a escolha de pelo menos um aluno." }))
        } else {
            const createClassRoom = await ClassRoomUseCases.CreateClassRoom(values.classRoom, values.year, selectedStudents, selectedTeacher)
            const editStudents = createClassRoom == '200' ? await ClassRoomUseCases.EditStudent(values.classRoom, selectedStudents) : setCreate(() => ({ message: createClassRoom, status: true }));
            const editTeacher = editStudents == '200' ? await ClassRoomUseCases.EditTeacher(values.classRoom, selectedTeacher) : setCreate(() => ({ message: editStudents, status: true }));
            editTeacher == '200' ? setCreate(prevState => ({ ...prevState, status: true })) : setCreate(() => ({ message: editTeacher, status: true }));
        }
    }
    return (
        <main>
            {teachers ? (
                <div>
                    <div className="mb-5">
                        <h5 className="text-white text-center">Criar Turma</h5>
                    </div>

                    {steps.one &&
                        steps.one ? (
                        <div className="m-5 text-center">
                            <section>
                                <Row className="mb-3  d-flex justify-content-between">
                                    <Form.Group as={Col} md="3" controlId="classRoomCode">
                                        <Form.Label className="text-white">Turma</Form.Label>
                                        <Form.Control
                                            value={values.classRoom}
                                            type="number"
                                            placeholder="Ex.: 1001"
                                            onChange={(event) => setValues((prevState) => ({ ...prevState, classRoom: event.target.value }))}
                                            onBlur={handleClassRoomBlur}
                                            isInvalid={invalidInput.errorClassRoom}
                                        />
                                        {invalidInput.invalidClassRoom && <p className="text-danger">Turma já existente.</p>}
                                        <Form.Control.Feedback type="invalid" className='text-danger'>
                                            Preencha com a numeração da turma, a numeração deve conter 4 dígitos.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md="3" controlId="classRoomCode">
                                        <Form.Label className="text-white">Série</Form.Label>
                                        <Form.Control
                                            value={values.year}
                                            type="number"
                                            placeholder="Ex.: 1"
                                            onChange={(event) => setValues((prevState) => ({ ...prevState, year: event.target.value }))}
                                            onBlur={handleYearBlur}
                                            isInvalid={invalidInput.errorYear}
                                        />
                                        <Form.Control.Feedback type="invalid" className='text-danger'>
                                            Preencha com a série, apenas números.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                            </section>


                            <button onClick={(e) => {
                                e.preventDefault()
                                if ((invalidInput.classRoom) && (invalidInput.year) && (!invalidInput.invalidClassRoom)) {
                                    setSteps(prevState => ({ ...prevState, one: false, two: true }))
                                } else {
                                    handleClassRoomBlur()
                                    handleYearBlur()
                                }
                            }} className=' mt-6 btn-light btn'>Prosseguir</button>
                        </div>
                    ) : (
                        <div className="teacher__selected border rounded-pill d-flex justify-content-between px-5">
                            <p className="text-white mt-1">Turma: {values.classRoom}</p>
                            <p className="text-white mt-1">Série: {values.year}°</p>
                        </div>
                    )}


                    {steps.two &&
                        <div>
                            <section className="col-lg-5 row text-center">
                                <Form.Group controlId="ControlSelect1">
                                    <Form.Label className="text-white">Professores</Form.Label>
                                    <Form.Control as="select" value={selectedTeacher} onChange={handleChangeTeacher}>
                                        <option value="" disabled>Selecionar professor</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id}>{teacher.nome}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </section>
                        </div>}

                    {steps.three &&
                        <div className="mt-5">
                            <div className="teacher__selected border rounded-pill d-flex justify-content-center">
                                <p className="text-white mt-1">Professor(a): {selectedTeacher.nome}</p>
                            </div>
                        </div>}

                    {steps.four &&
                        (
                            <div className="mt-5">
                                <div className="d-flex bg-white d-flex justify-content-between p-5">
                                    <section className="border rounded">
                                        <h4 className="text-center">Lista de Alunos</h4>
                                        <hr />
                                        <div className=" list_students px-2">
                                            <ul>
                                                {students.map((student) => (
                                                    <li key={student.id}>
                                                        <img src={addStudent} width={'18px'} onClick={() => handleStudentSelection(student)} />
                                                        {student.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>
                                    <section className="border rounded">
                                        <h4 className="text-center">Alunos Selecionados</h4>
                                        <hr />
                                        <div className="list_students px-2">
                                            <ul>
                                                {selectedStudents.map((student) => (
                                                    <li key={student.id + '-' + uniqueKey}>
                                                        {student.nome}
                                                        <img src={removeStudent} width={'18px'} onClick={() => handleStudentDeselection(student)} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>

                                </div>
                                <p className="text-center text-danger">{invalidInput.errorMessage}</p>

                                <div className="text-center">
                                    <button onClick={CreateNewClassRoom} className=' mt-5 btn-light btn'>Cadastrar</button>
                                </div>
                            </div>
                        )}
                </div>
            ) : (
                <div>
                    <h1>Loading</h1>
                </div>
            )}
            <div>
                <Link to="/cadastro"><button className='btn-light btn mt-5 ms-2'>Cancelar Cadastro</button></Link>
            </div>

        </main>
    )
}

export default NewClass