import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { StudentUseCases } from '../useCases/StudentUseCases';
import { Link } from 'react-router-dom';
import "../styles/NewStudent.css"

function newStudent() {
  //CPF
  const cpfRef = useRef(null);

  const handleChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, "");

    if (inputValue.length <= 11) {
      let formattedValue = "";

      for (let i = 0; i < inputValue.length; i++) {
        if (i === 3 || i === 6) {
          formattedValue += ".";
        }
        if (i === 9) {
          formattedValue += "-";
        }
        formattedValue += inputValue[i];
      }

      setValues((prevState) => ({ ...prevState, cpf: formattedValue }))
      cpfRef.current.value = formattedValue;
    }
  };

  //DATA DE NASCIMENTO

  const handleBirthday = (event) => {
    let value = event.target.value;

    if (value.length === 11) {
      return;
    }

    if (value.length === 2 || value.length === 5) {
      value += '/';
    }

    setValues((prevState) => ({ ...prevState, birthday: value }))
  };

  const [renderResponse, setRenderResponse] = useState({
    response: "",
    status: true
  })

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false)
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);
    if (values.registration == "") {
      setError(true)
      return
    }

    const result = Object.values(valid).every(value => value === true);
    if (result) {
      const response = await StudentUseCases.CreateStudent(values.name, values.cpf, values.birthday, values.registration)
        setRenderResponse({ response: response, status: false })
    }
  };

  const [generate, setGenerete] = useState(false)

  const [valid, setValid] = useState({
    name: false,
    cpf: false,
    birthday: false,
    registration: false
  })

  const [values, setValues] = useState({
    name: '',
    cpf: '',
    birthday: '',
    registration: ''
  })
  const [validate, setValidate] = useState({
    name: false,
    cpf: false,
    birthday: false,
    registration: false
  })

  const handleRegistration = async (e) => {
    e.preventDefault()
    const registration = await StudentUseCases.StudentRegistration()
    setValues((prevState) => ({ ...prevState, registration: registration }))
    setGenerete(true)
    setValid((prevState) => ({ ...prevState, registration: true }))
    setValidate((prevState) => ({ ...prevState, registration: false }))
  }
  return (
    <main>
      {renderResponse.status ? (
        <div className='text-white'>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="fullName">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  value={values.name}
                  type="text"
                  placeholder="Nome Completo"
                  onChange={(event) => setValues((prevState) => ({ ...prevState, name: event.target.value }))}
                  onBlur={(() => {
                    if (values.name.length < 8) {
                      setValidate((prevState) => ({ ...prevState, name: true }))
                      setValid((prevState) => ({ ...prevState, name: false }))
                    } else {
                      setValidate((prevState) => ({ ...prevState, name: false }))
                      setValid((prevState) => ({ ...prevState, name: true }))
                    }
                  })}
                  required
                  isInvalid={validate.name}
                />
                <Form.Control.Feedback type="invalid" className='text-danger'>
                  Preencha com nome completo.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="cpf">
                <Form.Label>CPF</Form.Label>
                <Form.Control type="text" placeholder="000.000.000-00" ref={cpfRef} value={values.cpf} onChange={handleChange} required
                  onBlur={(() => {
                    if (values.cpf.length == 14) {
                      setValidate((prevState) => ({ ...prevState, cpf: false }))
                      setValid((prevState) => ({ ...prevState, cpf: true }))
                    } else {
                      setValidate((prevState) => ({ ...prevState, cpf: true }))
                      setValid((prevState) => ({ ...prevState, cpf: false }))
                    }
                  })}
                  isInvalid={validate.cpf}
                />
                <Form.Control.Feedback type="invalid" className='text-danger'>
                  Preencha com um CPF válido.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="birthday">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control type="text" placeholder="00/00/0000" value={values.birthday} onChange={handleBirthday} required
                  onBlur={(() => {
                    if (values.birthday.length == 10) {
                      setValidate((prevState) => ({ ...prevState, birthday: false }))
                      setValid((prevState) => ({ ...prevState, birthday: true }))
                    } else {
                      setValidate((prevState) => ({ ...prevState, birthday: true }))
                      setValid((prevState) => ({ ...prevState, birthday: false }))
                    }
                  })}
                  isInvalid={validate.birthday} />
                <Form.Control.Feedback type="invalid" className='text-danger'>
                  Preencha com a data de nascimento.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              {!generate ? (
                <Form.Group>
                  <button
                    className='btng btn-light mt-3' onClick={handleRegistration}>Gerar Matrícula</button>
                  {error ? (<p className='text-danger'>É obrigatório gerar a matrícula no momento do cadastro.</p>) : ""}
                </Form.Group>
              ) : (
                <Form.Group as={Col} md="4" controlId="registration">
                  <Form.Label>Matrícula</Form.Label>
                  <Form.Control readOnly isValid={true} placeholder="Matrícula"
                    value={values.registration}></Form.Control>
                </Form.Group>
              )}
            </Row>
            <div className='text-center2'>
              <Button className='text-center2' type="submit">Cadastrar</Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className='mt-5'>
          <h2 className='text-center text-white'>{renderResponse.response}</h2>
          <div className='mt-4 mb-5 text-center'>
            <Link to="/"><button className='btn-light btn'>Voltar para Tela Inicial</button></Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default newStudent