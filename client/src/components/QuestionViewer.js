import {Form} from 'react-bootstrap'
import {useState} from 'react'

import './components.css'

export default function QuestionViewer(props) {
    let {question, answerHandler, readAnswers, questionPreview} = props;
    let [input, setInput] = useState("")
    const [error, setError] = useState(false)


    const validateAndSubmit = (e)=>{
        setError(false);
        let a_checked = question.answers.filter(a => a.selected).length
        console.log(a_checked)
        if(question.max && e.target.checked && a_checked >= question.max){
            e.target.checked = false;
            setError(true);
        }
        else
            answerHandler(question.qid, e.target.id, e.target.checked, null)
    }
    return(
        <>
                <Form.Group >
                        <h4>{question.text} {(question.mandatory || question.min>0)? <font color="red">*</font> : ""} </h4>                        
                        {error ? <font color="red">Max {question.max} answers allowed!</font>:""}
                
                        <div className="theanswers">
                        
                        {question.multiple? <>
                            {!readAnswers ? <>
                                {question.answers.map((a)=>{return( 
                                <Form.Check disabled={questionPreview} type="checkbox" key={"multiple-" + a.aid} id={a.aid} onChange={(e)=> validateAndSubmit(e)} label={a.text}></Form.Check>
                                )})}
                                <div align="right"><Form.Text>Minimum answers: {question.min}  Maximum answers: {question.max}</Form.Text></div>   
                                </> 
                                :
                                question.answers.filter(a => a.selected).map((a)=>{return( <li key={a.aid}> {a.text} </li> )}
                            )}
                            </>
                        :   
                            <> 
                            {!readAnswers ? 
                                <>
                                    <Form.Control disabled={questionPreview} as="textarea" maxLength={200} rows={4} value={input} onChange={(e)=>{answerHandler(question.qid, null, null, e.target.value); setInput(e.target.value)}}></Form.Control>
                                    <div align="right"><Form.Text>Max 200 characters allowed. {input.length}/200</Form.Text> </div>
                                </>
                                :
                                <p> {question.answer}</p> 
                            }
                            </>
                        }
                    </div>
                </Form.Group>
                <hr></hr>
        </>
    )
}