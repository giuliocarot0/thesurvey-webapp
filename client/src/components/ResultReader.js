import SurveyViewer from './SurveyViewer'
import {Col, Container, Button, ButtonGroup} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {fillableSurvey, filledSurvey} from './surveymock'
import API from '../API'

export default function ResultReader(props){
    const [survey, setSurvey] = useState(false)
    const [surveys, setSurveys] = useState(false);
    const [index, setIndex] = useState("");
    const [refreshSurvey, setRefreshSurvey] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [refreshPartecipants, setRefreshPartecipants] = useState(false);
    const [error, setError] = useState(false)
    const [partecipants, setPartecipants] = useState(false)
    const [loading, setLoading] = useState(false)
    const location = useLocation();
    
    const path = location.pathname.substring(8)
    const sid = parseInt(path)

    useEffect(()=>{
        if(!sid){
            setSurveys(false);
            setRefreshSurvey(false)
        }
        else {  
            if(!survey)
                API.getSurvey(sid).then((s)=>{
                    let fs = fillableSurvey(s)
                    setSurvey(fs)
                    setRefreshSurvey(false)
                    setRefresh(true)
                }).catch(e=>{
                    setSurvey(false)
                    setError({error: "Cannot get requested survey"})
                    setLoading(false)
                    setRefreshSurvey(false)
                })  
    }},[refreshSurvey,sid, survey])
    
    useEffect(() => {
        if(survey && sid){
            API.getPartecipants(sid).then((p) => {
                setRefreshPartecipants(false)
                setPartecipants(p)
                setIndex(1)
                setRefresh(true)
            })
            .catch(e => {
                setPartecipants(false)
                setLoading(false)
                setError({error: "cannot retreive survey partecipants"})
                setRefreshPartecipants(false)
            })
        }
    },[refreshPartecipants, survey, sid])

    useEffect(()=>{
        if(survey && index && partecipants){
            API.getSubmissionForSurvey(sid, index).then((sub)=>{
                let fsurveys = filledSurvey(survey, sub, partecipants[index-1].name)
                if(fsurveys){ 
                    setSurveys(fsurveys)
                    setRefresh(false)
                    setLoading(false)
                }
                else {
                    setSurveys(false)
                    setRefresh(false)
                    setError({error: "Cannot create render suitable survey"})
                }
            }).catch(e=>{
                setError({error: e})
                setSurveys(false)
                setRefresh(false)
            })
            setLoading(false)
        }
    }, [survey, refresh, sid, index, partecipants])

    const nextSubmission=()=>{
        setLoading(true)
        setIndex(i => i+1)
        setRefresh(true);
    }
    const previousSubmission = () => {
        setLoading(true)
        setIndex(i => i > 0 ? i-1 : i);
        setRefresh(true)
    }
    return (
        <>              
        
        <Container>
            <Col className="theviewer" md={{ span: 6, offset: 3 }}> 
            {error} <h3>{error}</h3>
            {!loading? <> {
                surveys && <>
                    <Col md={4}>  
                        <ButtonGroup>
                            <Button disabled={index===1} onClick={()=>previousSubmission()}>Previous</Button>
                            <Button disabled>{index}</Button>
                            <Button disabled={index===partecipants.length } onClick={()=>nextSubmission()}>Next</Button>
                        </ButtonGroup>
                    </Col>
                    <Col md={8}>
                        <div align="right" ><h4> {partecipants[index - 1].name+"'s submission"} </h4></div>
                    </Col>
                </>} 
            </>
            : <h2>The content is loading...</h2>
            }
            </Col>  
            </Container>
            
            {!error && !loading && surveys && <SurveyViewer readAnswers survey={surveys} ></SurveyViewer>}
            
        </>
    )

}