import SurveyViewer from './SurveyViewer'
import LoadingComponent from './LoadingComponent'
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
    const [partecipants, setPartecipants] = useState(true)
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    
    const path = location.pathname.substring(8)
    const sid = parseInt(path)


    useEffect(() => {  
        const getPartecipants = async(sid) =>{
            try{
                let p = await API.getPartecipants(sid);
                setRefreshPartecipants(false)
                setPartecipants(p)
                setIndex(1)
            }catch(e){
                setIndex(false)
                setPartecipants(false)
                setLoading(false)
                setError({error: e.error})
                setRefreshPartecipants(false)
            }
        }
        if(sid){
            getPartecipants(sid);
        }
    },[refreshPartecipants, sid])

    useEffect(()=>{
        const getSubmission= async(pid, sid) => {
            try{
                let sub = await API.getSubmissionForSurvey(sid, pid);
                setSurveys(sub)
                setLoading(false)
            }catch(e){
                setError({error: e.error})
                setSurveys(false)
                setLoading(false)
            }
        } 
        if(index){
           getSubmission(index, sid) 
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

        loading? <LoadingComponent></LoadingComponent> :
        <>              
        {!loggedIn && <Redirect to="/"></Redirect>}
        <Container>
            <Col className="theviewer" md={{ span: 6, offset: 3 }}> 
            {error && <h3>{error.error}</h3> }
            {
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
            
            </Col>  
            </Container>
            
            {!error && !loading && surveys && <SurveyViewer readAnswers survey={surveys} ></SurveyViewer>}
            
        </>
    )

}