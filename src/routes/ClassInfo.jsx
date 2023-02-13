import { useState, useEffect } from 'react';
import { AxiosApi } from "../services/RequisitionAPI"
import { Link, useNavigate } from 'react-router-dom';
import { Form, Row, Col } from "react-bootstrap";
import Loading from "../components/Loading";
import "../styles/info.css"
import removeStudent from "../assets/removeUser.png"
import addStudent from "../assets/addUser.png"
import { ClassRoomUseCases } from "../useCases/ClassRoomUseCases";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function ClassInfo() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState("true");
    const [isEditing, setIsEditing] = useState(false);
    const [deletingClassRoom, setDeletingClassRoom] = useState(false);
    const [editedThings, setEditedThings] = useState(false);

    const [handleState, setHandleState] = useState(0);
    const [reloadInfos, setReloadInfos] = useState(0);

    // STUDENTS
    const [students, setStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [uniqueKey, setUniqueKey] = useState(0);

    const [prevUpdate, setPrevUpdate] = useState({
        students: [],
        teacher: undefined
    })

    const [values, setValues] = useState({
        classRoom: undefined,
        teacher: undefined,
        year: undefined,
        students: []
    })

    const [invalidInput, setInvalidInput] = useState({
        classRoom: false,
        year: false,
        errorClassRoom: false,
        errorYear: false,
        errorMessage: "",
    })

    // EDIT CLASSROOM

    //TEACHER
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const handleChangeTeacher = (event) => {

        const selectedOption = teachers.find(
            (teacher) => teacher.nome === event.target.value
        );
        setSelectedTeacher(selectedOption);
    };


    useEffect(() => {
        async function dataRequisitons() {
            try {
                const connection = await AxiosApi.Get(window.location.pathname)
                setValues(() => ({ classRoom: connection.data.turma, teacher: connection.data.professor, year: connection.data.serie, students: connection.data.alunos }))
                setIsLoading('false')
                setPrevUpdate(() => ({ teacher: connection.data.professor, students: connection.data.alunos }))
            } catch (error) {
                setIsLoading("error")
            }
        }
        dataRequisitons()
    }, [handleState])
    // console.log(prevUpdate)


    useEffect(() => {
        async function dataRequisitons() {
            try {
                const teachers = await AxiosApi.Get('/professores')
                const filteredTeachers = teachers.data.filter(teacher => !teacher.turma);
                filteredTeachers.push(values.teacher)

                setTeachers(filteredTeachers)
                setSelectedTeacher(values.teacher)

                const students = await AxiosApi.Get('/alunos')
                const filteredStudents = students.data.filter(students => !students.turma);
                setStudents(values.students)
                setAvailableStudents(filteredStudents)
            } catch (error) {
                alert("erro ao recuperar dados, tente novamente mais tarde.(error code: 93L CI)")

            }
        }
        dataRequisitons()
    }, [handleState, values])




    const handleEditClick = () => {
        setIsEditing(true);
        setHandleState(handleState + 1);
        setReloadInfos(reloadInfos + 1)

    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedThings(false);
    };

    const handleSaveClick = async () => {
        if(values.year == ''){
            setInvalidInput(prevState => ({ ...prevState, errorYear: true }))
            return
        }
        let updateTeacher = { selectedTeacher: selectedTeacher }
        let updateStudents = { studentList: students }

        if (selectedTeacher != prevUpdate.teacher) {
            const prevTeacher = prevUpdate.teacher
            updateTeacher = { selectedTeacher, prevTeacher, update: true }
        }

        const { entered, exited } = compareStudentLists(prevUpdate.students, students, values.classRoom);

        if ((entered.length || exited.length) != 0) {
            updateStudents = { newStudent: entered, removedStudent: exited, studentList: students, update: true }
        }
        await ClassRoomUseCases.UpdateClassRoom(window.location.pathname, values.classRoom, values.year, updateStudents, updateTeacher)
        setEditedThings(true);
        setIsEditing(false);
        setHandleState(handleState + 1);

    };

    const compareStudentLists = (previousStudents, newStudents, classId) => {
        const entered = [];
        const exited = [];

        previousStudents.forEach(student => {
            if (student.turma === classId && !newStudents.includes(student)) {
                exited.push(student);
            }
        });

        newStudents.forEach(student => {
            if (student.turma === false && !previousStudents.includes(student)) {
                entered.push(student);
            }
        });

        return { entered, exited };
    };

    const handleDeleteTeacher = () => {
        setDeletingClassRoom(true);
        setEditedThings(false);
    }

    const handleDelete = async () => {
        alert(await ClassRoomUseCases.DeleteClassRoom(window.location.pathname, values.teacher, values.students));
        return navigate('/')
    }

    const handleStudentSelection = (student) => {
        setAvailableStudents([...availableStudents, student]);
        setStudents(students.filter((s) => s.id !== student.id));
        setInvalidInput(prevState => ({ ...prevState, errorMessage: "" }))
    };

    const handleStudentDeselection = (student) => {
        setStudents([...students, student]);
        setAvailableStudents(availableStudents.filter((s) => s.id !== student.id));
        setUniqueKey(uniqueKey + 1);
    };

    if (deletingClassRoom) {
        return (
            <main className='mb-5 text-center text-white'>
                <h5>A exclusão do cadastro é irreversível.</h5>
                <p>Tem certeza que deseja deletar o cadastro?</p>
                <button className='btn btn-danger' onClick={handleDelete}>Deletar</button>
                <button className='btn btn-light ms-5' onClick={() => setDeletingClassRoom(false)}>Cancelar</button>
            </main>
        )
    }

    if (isLoading == "true") {
        return (
            <main>
                <Loading />
                <p className="text-white text-center">Carregando informações da Turma...</p>;
            </main>
        )
    } else if (isLoading == "error") {
        return (
            <main className='text-center text-white'>
                <h1>Erro 404!</h1>
                <h4>Turma não encontrada.</h4>
                <div className='mt-4 mb-5'>
                    <Link to="/"><button className='btn-light btn'>Voltar para Tela Inicial</button></Link>
                </div>
            </main>
        )
    } else {
        return (
            <main>
                <div><Link to="/"><button className='btn-light btn'>Voltar</button></Link></div>
                {isEditing ? (
                    <div>
                        <Row className="mb-3 mx-5 mt-5  d-flex justify-content-between">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Não é possível modificar a numeração da turma após sua criação.</Tooltip>}>
                                <span className="d-inline-block">
                                    <Form.Group as={Col} md="3" controlId="classRoomCode">
                                        <Form.Label className="text-white">Turma</Form.Label>
                                        <Form.Control className='text-center'
                                            disabled
                                            value={values.classRoom}
                                            type="number"
                                        />
                                    </Form.Group>
                                </span>
                            </OverlayTrigger>
                            <Form.Group as={Col} md="3" controlId="yearCode">
                                <Form.Label className="text-white">Série</Form.Label>
                                <Form.Control
                                    value={values.year}
                                    type="number"
                                    placeholder="Ex.: 1"
                                    onChange={(event) => {
                                        setValues((prevState) => ({ ...prevState, year: event.target.value }))
                                        setInvalidInput(prevState => ({ ...prevState, errorYear: false }))
                                    }}
                                    isInvalid={invalidInput.errorYear}
                                />
                                <Form.Control.Feedback type="invalid" className='text-danger'>
                                    Preencha com a série, apenas números.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <div className="d-flex justify-content-center">
                            <section className="col-lg-5 row text-center">
                                <Form.Group controlId="ControlSelect1">
                                    <Form.Label className="text-white">Professores</Form.Label>
                                    <Form.Control as="select" value={selectedTeacher.nome} onChange={handleChangeTeacher}>
                                        <option value="" disabled>Selecionar professor</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id}>{teacher.nome}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </section>
                        </div>

                        <div className="mt-5">
                            <div className="d-flex bg-white d-flex justify-content-between p-5">
                                <section className="border rounded">
                                    <h4 className="text-center">Alunos Matrículados</h4>
                                    <hr />
                                    <div className=" list_students px-2">
                                        <ul>
                                            {students.map((student) => (
                                                <li key={student.id}>
                                                    <img src={removeStudent} width={'18px'} onClick={() => handleStudentSelection(student)} />
                                                    {student.nome}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                                <section className="border rounded">
                                    <h4 className="text-center">Alunos Disponíveis</h4>
                                    <hr />
                                    <div className="list_students px-2">
                                        <ul>
                                            {availableStudents.map((student) => (
                                                <li key={student.id + '-' + uniqueKey}>
                                                    {student.nome}
                                                    <img src={addStudent} width={'18px'} onClick={() => handleStudentDeselection(student)} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            </div>
                            <p className="text-center text-danger">{invalidInput.errorMessage}</p>
                        </div>
                        <div className="mt-5 text-center">
                            <button className='btn-success btn mx-5 m-1' onClick={handleSaveClick}>Salvar</button>
                            <button className='btn-light btn m-1' onClick={handleCancelClick}>Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className='mb-5 mx-3 text-white'>
                        <div className='text-center mb-5'>
                            <div>
                                {editedThings ? (
                                    <p className='text-success text-center mt-5'>Cadastro Alterado com sucesso!</p>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>

                        <h2 className="p-2 border rounded text-center mb-5">Turma {values.classRoom}</h2>
                        <p className="mb-4">Professor: {values.teacher.nome}</p>
                        <p className="mb-4">Série: {values.year}º</p>
                        <section className="border rounded">
                            <h4 className="text-center mb-4">Alunos Matriculados</h4>
                            <hr />

                            <div className="list_students">
                                {values.students ? (
                                    <div >

                                        {values.students.map(students => (
                                            <div className="d-flex border m-2 p-1 rounded" key={students.id}>
                                                <b>{students.nome}</b>
                                                <p className="mx-5">Matrícula: {students.matricula}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Carregando informações dos alunos...</p>
                                )}
                            </div>
                        </section>
                        <div className='d-flex justify-content-between mt-5'>
                            <div>
                                <button className='btn btn-light mx-2' onClick={handleEditClick}>Editar cadastro</button>

                            </div>
                            <div>
                                <button className='btn btn-danger mx-2' onClick={handleDeleteTeacher}>Deletar Cadastro</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        )
    }
}

export default ClassInfo