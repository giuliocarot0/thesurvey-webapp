import {Container, Form, Col, Row} from 'react-bootstrap'
import {useState} from 'react'
import './components.css'

export default function QuestionViewer(props) {
    let {question, answerHandler} = props;
    let [input, setInput] = useState("")
    return(
        <>
                <Form.Group >
                        <h4>{question.text} {(question.mandatory || question.min>0)? <font color="red">*</font> : ""} </h4>                        
                        
                
                        <div className="theanswers">
                        {question.multiple? <>
                           {question.answers.map((a)=>{return(
                                <Form.Check type="checkbox" id={a.aid} onChange={(e)=> answerHandler(question.qid, e.target.id, e.target.checked, null)} label={a.text}></Form.Check>
                                )})}
                                <div align="right"><Form.Text>Minimum answers: {question.min}  Maximum answers: {question.max}</Form.Text></div>

                                </>
                        :   
                            <>
                                <Form.Control as="textarea" maxlength={200} rows={4} value={input} onChange={(e)=>{answerHandler(question.qid, null, null, e.target.value); setInput(e.target.value)}}></Form.Control>
                                <div align="right"><Form.Text>Max 200 characters allowed. {input.length}/200</Form.Text> </div>
                            </>
                            
                        }
                    </div>
                </Form.Group>
                <hr></hr>
        </>
    )
}