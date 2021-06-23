import {Col, Container, Button, Form, Row} from 'react-bootstrap'
import {useState} from 'react'
import {Link} from 'react-router-dom'

import './components.css'

/*this method display a survey*/
function SurveyViewer(props) {
    const {readAnswers, survey, onAnswerChange, onUserSet} = props;
    const [user, setUser] = useState("");
    
    return(<>
            <Container >  
                <Col className="theviewer" md={{ span: 6, offset: 3 }}>
                    {survey ? <>                             
                        <div align="center"><h2>{survey.title}</h2> <p> <font color="red" >* indicates mandatory fields </font></p></div>
                        <Form> 
                            <Form.Group>
                                <h4> Name <font color="red">*</font></h4>
                                <div className="theanswers">
                                {readAnswers ? 
                                    <p>{survey.user}</p> 
                                    :
                                    <Form.Control  type="text" value ={user} onChange={e => {onUserSet(e.target.value); setUser(e.target.value)} }>
                                
                                </Form.Control>
                                }
                                </div>
                            </Form.Group>
                            <hr></hr>
                        
                            {survey.questions.map((q) => {
                                return(<QuestionViewer readAnswers={readAnswers} key={q.qid} question={q} answerHandler={onAnswerChange}> </QuestionViewer>) 
                            })}
                        </Form> 
                        </>
                        : 
                        <h3>Cannot find the requested survey</h3>}
                          <Row className="thebuttonbox">
                        <Link to="/" >
                            <Button variant="primary" className="backbtn" type="" >
                                { "< Back"}
                            </Button>
                        </Link> 
                        {survey && !readAnswers? <Button variant="primary" type="">
                            Submit
                        </Button> :""}                              
                    </Row>
                </Col>
                  
            </Container>
    </>)
}


function QuestionViewer(props) {
    let {question, answerHandler, readAnswers} = props;
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
                                <Form.Check type="checkbox" key={"multiple-" + a.aid} id={a.aid} onChange={(e)=> validateAndSubmit(e)} label={a.text}></Form.Check>
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
                                    <Form.Control as="textarea" maxLength={200} rows={4} value={input} onChange={(e)=>{answerHandler(question.qid, null, null, e.target.value); setInput(e.target.value)}}></Form.Control>
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
export default SurveyViewer;