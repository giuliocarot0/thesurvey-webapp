import './components.css'
import {Col, Container, Form, Button, Row} from 'react-bootstrap'
import {useState} from 'react'

export default function SurveyEditor(props){

    const [questions, setQuestions] = useState([])
    const [title, setTitle] = useState("")
    const [step, setStep] = useState(0)
    return (
        <> 
            <Container>
                <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}>
                    <h4>Survey Studio</h4>
                    <font>Create a new survey fullfilling the following fields and following the instructions</font>
                </Col>
                <Col className="theviewer"  md={{ span: 6, offset: 3 }}>
                    <Row>
                    {step===0 ? 
                        <>
                            <Col md={6}><h4>Choose a title for your survey <font color="red">*</font></h4></Col>
                            <Col md={6}><Form.Control value={title} onChange={(e)=>{setTitle(e.target.value)}}type="text"></Form.Control></Col>
                            
                        </>
                        : 
                        <>
                            <div align="center"><h2>{title}</h2></div>
                            <a href="#">+ Add a question</a>
                            <QuestionEditor></QuestionEditor>

                        </>
                     } 
                    </Row>
                    <Row>
                    <hr/>   
                    <Col md={6} align="left">
                        <Button style={{margin:"20px", background:"none", color:"black"}} onClick={()=>{setStep(0)}} disabled={step ===0}>Back</Button>
                    </Col>   
                    <Col md={6} align="right">
                        <Button style={{margin:"20px"}} onClick={()=>{setStep(1)}} disabled={title==="" || step ===1}>Next</Button>
                    </Col>
                    </Row>  
                </Col>
                
            </Container>
        </>
    )
}

function QuestionEditor(props){
    const {addQuestion} = props
    const [type, setType] = useState("Open"); 
    const [text, setText] = useState("");
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);

    const [mandatory, setMandatory] = useState(false)

    const createMaxOptions = ()=>{
        let options = [];
        for(let i=min; i <=10; i++)
            options.push(i);
        return options;
    }
    return(
        <div className="editor">
            <Form>
                <h4>Question text</h4>
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
                            <Form.Control value={max} as="select"  onChange={(e)=>{setMax(e.target.value)}} >
                                {createMaxOptions().map((i)=> {return <option>{i}</option>})}
                            </Form.Control>
                        </>
                    }
                </Form.Group>
                {type==="Multiple" ? <>
                <h4>Answers</h4>
                <Form.Group>
                    <Form.Control value={ans1} onChange={(e)=>{setAns1(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans2} onChange={(e)=>{setAns2(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans3} onChange={(e)=>{setAns3(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans4} onChange={(e)=>{setAns4(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans5} onChange={(e)=>{setAns5(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans6} onChange={(e)=>{setAns6(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans7} onChange={(e)=>{setAns7(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans8} onChange={(e)=>{setAns8(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans9} onChange={(e)=>{setAns9(e.target.value)}} type="text"></Form.Control>
                    <Form.Control value={ans10} onChange={(e)=>{setAns10(e.target.value)}} type="text"></Form.Control>
                </Form.Group>
                </>
                : 
                ""}
            </Form>
        </div>
    )
}