import {Col, Container, Button, Form, Row} from 'react-bootstrap'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import QuestionViewer from './QuestionViewer'
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



export default SurveyViewer;