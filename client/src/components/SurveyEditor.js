import './components.css'
import {Col, Container, Form, Button, Row} from 'react-bootstrap'
import {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import API from '../API'
import QuestionViewer from './QuestionViewer'
import LoadingComponent from './LoadingComponent'


export default function SurveyEditor(props){
    const {loggedIn} = props
    const [questions, setQuestions] = useState([])
    const [title, setTitle] = useState("")
    const [step, setStep] = useState(0)
    const [questionCounter, setQuestionCounter] = useState(1)
    const [addForm, setAddForm] = useState(false);
    const [successful, setSuccessful] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const createOpenQuestion = (qid, text, mandatory) =>{
        return {"multiple":false,"qid":qid,"text":text,"mandatory":mandatory, answer:""}
    }
    
    const createClosedQuestion = (qid, text, min, max, answers) =>{
        return {"multiple":true,"qid":qid,"text":text,"answers":answers,"min":min,"max":max}
    }

    const createNewQuestion = (text, type, answers, min, max, mandatory)=>{
        if(type==="Open") 
            setQuestions([...questions, createOpenQuestion(questionCounter, text, mandatory)])
        else {
            setQuestions([...questions, createClosedQuestion(questionCounter, text, min, max, answers)])
        }
        setQuestionCounter(q=>q+1)
    }

    const deleteQuestion = (qid)=>{
        let questions2 = questions.filter((q) => {return q.qid !== parseInt(qid)})
        questions2.sort((a,b)=>{return a.qid - b.qid}).forEach((q,i) => {q.qid = i+1})
        setQuestionCounter(i=>i-1)
        setQuestions(questions2)
    }
    const swapUpQuestion = (qid) =>{
        for(let i in questions) {
            if(questions[i].qid === parseInt(qid) && i > 0){
                i = parseInt(i) 
                let qid_t = 0
                qid_t = questions[i-1].qid;
                questions[i-1].qid = questions[i].qid;
                questions[i].qid = qid_t;
                setQuestions([...questions])
                break;
            }
        }
    }

    const swapDownQuestion = (qid) =>{
        for(let i in questions) {
            if(questions[i].qid === parseInt(qid) && i < questions.length - 1){
                i = parseInt(i) 
                let qid_t = 0
                qid_t = questions[i+1].qid;
                questions[i+1].qid = questions[i].qid;
                questions[i].qid = qid_t;        
                setQuestions([...questions])
                break;
            }
        }     
    }

    const createSurvey = ()=>{
        setLoading(true);
        let survey = {title: title, questions: questions}
        API.createSurvey(survey).then((r) => {
            setSuccessful(true)
            setStep(0)
            setLoading(false)
        })
        .catch(e =>{
            setError(e)
            setStep(0)
            setLoading(false)
        })
    }

    return (
        <> 
            {loading ? <LoadingComponent></LoadingComponent>
            :<>
            {!loggedIn && <Redirect to="/login"/>}
            <Container>
                {(error || successful) && 
                <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}>
                    {error && <h4 color="red">{"Cannot create the survey due to" + error.error}</h4>}
                    {successful && <h4 color="red"> Your survey has been successfully created!</h4>}
                </Col>}
                <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}>
                    <h4>Survey Studio</h4>
                    <font>Create a new survey fullfilling the following fields and following the instructions</font>
                </Col>
                <Col className="theviewer"  md={{ span: 6, offset: 3 }}>
                    <Row>
                    {step===0 ? 
                        <div>
                            <Col md={6}><h4>Choose a title for your survey <font color="red">*</font></h4></Col>
                            <Col md={6}><Form.Control value={title} onChange={(e)=>{setTitle(e.target.value)}}type="text"></Form.Control></Col>
                            
                        </div>
                        : 
                        <div>
                            <div align="center"><h2>{title}</h2></div>
                            {questions.sort((a,b)=>{return a.qid-b.qid}).map((q, i) => { return (
                            <div key={q.qid}>
                                <div align="right">
                                    <Button variant="outline-secondary" id={q.qid} onClick={(e)=>deleteQuestion(e.target.id)}> Delete</Button>
                                    <Button variant="outline-secondary" disabled={questions.length === 1 || i  ===  0 } id={i + 1} onClick={(e)=>swapUpQuestion(e.target.id)}>Up</Button>
                                    <Button variant="outline-secondary" disabled={questions.length === 1 || i + 1 === questions.length } id={i + 1} onClick={(e)=>swapDownQuestion(e.target.id)}> Down</Button>
                               </div>
                               <QuestionViewer questionPreview  question={q}></QuestionViewer>
                            </div>)
                            })}
                            <Button variant="link" href={""} onClick={()=>setAddForm(!addForm)}>{addForm ? "x Close":"+ Add a question"}</Button>
                            {addForm ? <QuestionEditor onClose={()=>{setAddForm(false)}} addQuestion={createNewQuestion} ></QuestionEditor> : ""}

                        </div>
                     } 
                    </Row>
                    <Row>
                    <hr/>   
                    <Col md={6} align="left">
                        {step===0? 
                            <Link to="/dashboard">
                             <Button style={{margin:"20px", background:"none", color:"black"}}>Go back to Dashboard</Button>
                            </Link>
                        :
                            <Button style={{margin:"20px", background:"none", color:"black"}} onClick={()=>{setStep(0)}}>Back</Button>
                        }
                    </Col>   
                    <Col md={6} align="right">
                        {step===0?
                            <Button style={{margin:"20px"}} onClick={()=>{setStep(1)}} disabled={title===""}>Next</Button>
                            :
                            <Button style={{margin:"20px"}} onClick={()=>{createSurvey()}} disabled={questions.length < 1}>Create</Button>
                        }
                    </Col>
                    </Row>  
                </Col>
                
            </Container>
            </>}
        </>
    )
}

function QuestionEditor(props){
    const {addQuestion, onClose} = props
    const [type, setType] = useState("Open"); 
    const [text, setText] = useState("");
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);
    const [answers, setAnswers] = useState(["","","","","","","","","",""]);
    const [mandatory, setMandatory] = useState(false);
    const [error, setError] = useState(false);
    const [activeAnswers, setActiveAnswers] = useState(1)

    const editAnswer = (id, text) => {
        answers[id - 1] = text;
        let answers2 = answers.map((a) => {return a})
        setAnswers(answers2)
    }

    const createMaxOptions = ()=>{
        let options = [];
        for(let i=min; i <=10; i++)
            options.push(i);
        return options;
    }

    const createQuestion = ()=>{
        /*first of all validates inputs */
        if(text==="") setError("Question number must have a text")
        else
            if(type==="Multiple"){
                let validAnswers = answers.filter((a) => {return a!==""}).map((a,i) => {return {aid: i+1, text: a, selected: false}})
                if(validAnswers.length > 10)
                    setError("Answers number must be less or equal than 10")
                else if( validAnswers.length < min || validAnswers.length < max)
                    setError("Answers number must be greater or equal to minimum answer option")
                else{
                    addQuestion(text, type, validAnswers, min, max, null);
                    onClose()
                }
            }
            else{
                addQuestion(text, type, null, null, null, mandatory)
                onClose()
            }
    }
    return(
        <div className="editor">
            { error ? <div align="center"> <font color="red">{error}</font> </div> : ""}
            <Form>
                <h4>Question text <font color="red">*</font></h4>
                <Form.Group>
                    <Form.Control  as="textarea" value={text} onChange={(e)=>{setText(e.target.value)}}>
                    </Form.Control>
                </Form.Group>
                <h4>Question type</h4>
                <Form.Group>
                    <Form.Control value={type} as="select"  onChange={(e)=>{setType(e.target.value)}} >
                        <option>Open</option>
                        <option>Multiple</option>
                    </Form.Control>
                </Form.Group>
                <h4>Question Options</h4>
                <Form.Group>
                    {type==="Open" ? 
                        <Form.Check checked={mandatory} onChange={(e)=>{setMandatory(e.target.checked)}} label="mandatory"/> 
                        : 
                        <>
                            <h5>Min Answers</h5>
                            <Form.Control value={min} as="select"  onChange={(e)=>{setMin(e.target.value); if(max<e.target.value) setMax(min)}} >
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </Form.Control>
                            <h5>Max Answers</h5>
                            <Form.Control value={max} as="select"  onChange={(e)=>{setMax(parseInt(e.target.value))}} >
                                {createMaxOptions().map((i)=> {return <option key={i}>{i}</option>})}
                            </Form.Control>
                        </>
                    }
                </Form.Group>
                {type==="Multiple" ? <>
                <h4>Answers</h4>
                <Form.Group>
                    {answers.map((a,i) => { return(
                    i<activeAnswers &&
                        <div key={"div-"+(i+1)}>
                        <Form.Text key={"label-"+(i+1)}>Answer {i+1}</Form.Text>
                        <Form.Control value={answers[i]} type="text" key={i+1} id={i+1} onChange={(e)=>{editAnswer(e.target.id,e.target.value)}}></Form.Control>
                        </div>
                    
                    )})}
                    <Button variant="link" disabled={activeAnswers===10} onClick={()=>{setActiveAnswers(i=>i < 10 ? i+1 : i)}}>Add an answer</Button>
                   
                
                </Form.Group> 
                </>
                : 
                ""}
                <Button disabled={text.length === 0} onClick={createQuestion}> Create Question</Button>
            </Form>
        </div>
    )
}
