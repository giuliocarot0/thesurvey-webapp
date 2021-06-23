import SurveyViewer from './SurveyViewer'
import {Col, Container, Button} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {getSurvey, filledSurveys} from './surveymock'

export default function ResultReader(props){
    const [surveys, setSurveys] = useState(false);
    const [index, setIndex] = useState("");
    const [refresh, setRefresh] = useState(true);
    const location = useLocation();
    
    const path = location.pathname.substring(8)
    const sid = parseInt(path)

    useEffect(()=>{
        if(!sid){
            setSurveys(false);
            setRefresh(false)
        }
        else {   
            let surveyObj = getSurvey(sid);           
            setSurveys(filledSurveys(surveyObj)) 
            setIndex(0)
            setRefresh(false)
            }
                  
    },[refresh,sid])

    return (
        <>  
            {surveys ? 
            <Container>
            <Col className="theviewer" md={{ span: 6, offset: 3 }}> 
                    <Col md={4}>  
                    <Button style={{margin:"5px"}} disabled={index===0} onClick={()=>setIndex(i => i-1)}>Previous</Button>
                    <Button disabled={index===surveys.length-1} onClick={()=>setIndex(i => i+1)}>Next</Button>
                    </Col>
                    <Col md={8}>
                        <div align="right" ><h4> {surveys[index].user+"'s submission"} </h4></div>
                    </Col>
            </Col>  
            </Container>
            :""}
            <SurveyViewer readAnswers survey={surveys[index]} ></SurveyViewer>
            
        </>
    )

}