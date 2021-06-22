import {Col, Container, Button, Form, Row} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import {useLocation, Redirect, Link} from 'react-router-dom'
import QuestionViewer from './QuestionViewer'
import {getSurvey, fillableSurvey} from './surveymock'
import './components.css'

/*this method display a survey*/
function SurveyViewer(props) {

    const [survey, setSurvey] = useState(false);
    const [user, setUser] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const location = useLocation();
    const path = location.pathname.substring(9)
    const sid = parseInt(path)

    useEffect(()=>{
        if(!sid){
            setSurvey(false);
            setRefresh(false)
        }
        else {   
            let surveyObj = getSurvey(sid);           
            setSurvey(fillableSurvey(surveyObj)) 
            setRefresh(false)
            }
                  
    },[refresh])

    const onAnswerChange = (qid, ansid, ansselected, text)=>{
        for(let q in survey.questions) {
            if(survey.questions[q].qid === qid && survey.questions[q].multiple)
                for(let a in survey.questions[q].answers){
                    if(survey.questions[q].answers[a].aid === parseInt(ansid)){
                        survey.questions[q].answers[a].selected = ansselected;
                        console.log(survey)

                    }
                }
            else if (survey.questions[q].qid === qid)
                survey.questions[q].answer = text;
        }
    }
    
    return(<>
        
        {sid ? 
            <Container >
                <Col className="theviewer" md={{ span: 6, offset: 3 }}>
                    {survey ? <>
                              
                        <div align="center"><h2>{survey.title}</h2> <p> <font color="red" >* indicates mandatory fields </font></p></div>
                        <Form> 
                            <Form.Group>
                                <h4> Please submit your name! <font color="red">*</font></h4>
                                <div className="theanswers">
                                <Form.Control  type="text">
                                </Form.Control></div>
                            </Form.Group>
                            <hr></hr>
                        
                            {survey.questions.map((q) => {
                                return(<QuestionViewer question={q} answerHandler={onAnswerChange}> </QuestionViewer>) 
                            })}
                        </Form> 
                        </>
                        : 
                        <h3>Cannot find the requested survey</h3>}
                </Col>
                    <Row className="thebuttonbox">
                        <Link to="/home" >
                            <Button variant="primary" className="backbtn" type="" >
                                { "< Back"}
                            </Button>
                        </Link> 
                        {survey? <Button variant="primary" type="">
                            Submit
                        </Button> :""}                              
                    </Row>
            </Container>
            
            :
            <>
                <Redirect to = "/"></Redirect>
                <div align="center"><h2>Cannot find the requested survey</h2></div>
            </>}
    </>)
}

export default SurveyViewer;