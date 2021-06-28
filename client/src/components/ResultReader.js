import SurveyViewer from './SurveyViewer'
import {Col, Container, Button, ButtonGroup} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import {useLocation, Redirect} from 'react-router-dom'
import API from '../API'

export default function ResultReader(props){
    const {loggedIn} = props;

    const [surveys, setSurveys] = useState(false);
    const [index, setIndex] = useState("");
    const [refreshPartecipants, setRefreshPartecipants] = useState(false);
    const [error, setError] = useState(false)
    const [partecipants, setPartecipants] = useState(false)
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    
    const path = location.pathname.substring(8)
    const sid = parseInt(path)


    useEffect(() => {  
        let mounted = true
        if(sid){
            API.getPartecipants(sid).then((p) => {
                if(mounted){ 
                    setRefreshPartecipants(false)
                    setPartecipants(p)
                    setIndex(1)
                }
            })
            .catch(e => {
                if(mounted){ 
                    setIndex(false)
                    setPartecipants(false)
                    setLoading(false)
                    setError({error: e.error})
                    setRefreshPartecipants(false)
                }
            })
        }
        return ()=>{mounted=false}
    },[refreshPartecipants, sid])

    useEffect(()=>{
        if(index){
            API.getSubmissionForSurvey(sid, index).then((sub)=>{
                setSurveys(sub)
                setLoading(false)
            }).catch(e=>{
                setError({error: e.error})
                setSurveys(false)
            })
            setLoading(false)
        }
    }, [index, sid])

    const nextSubmission=()=>{
        setLoading(true)
        setIndex(i => i+1)
    }
    const previousSubmission = () => {
        setLoading(true)
        setIndex(i => i > 0 ? i-1 : i);
    }
    return (
        <>              
        {!loggedIn && <Redirect to="/"></Redirect>}
        <Container>
            <Col className="theviewer" md={{ span: 6, offset: 3 }}> 
            {error && <h3>{error.error}</h3> }
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