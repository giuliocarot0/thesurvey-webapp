import SurveyViewer from './SurveyViewer'
import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {fillableSurvey} from './surveymock'
import {Alert, Col} from 'react-bootstrap'
import API from '../API'
import './components.css'
export default function SurveyCompiler(props){
    const [survey, setSurvey] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [validationError, setValidationError] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    
    const path = location.pathname.substring(10)
    const sid = parseInt(path)

    useEffect(()=>{
        if(!sid){
            setSurvey(false);
            setRefresh(false)
        }
        else {   
            API.getSurvey(sid)
            .then(s => {
                setSurvey(fillableSurvey(s)) 
                setRefresh(false)
            })  
            .catch(err => {
                setError(err.error)
                setSurvey(false)
                setRefresh(false)
            })       
           
            }
                  
    },[refresh,sid])

    const onAnswerChange = (qid, ansid, ansselected, text)=>{
        for(let q in survey.questions) {
            if(survey.questions[q].qid === qid && survey.questions[q].multiple)
                for(let a in survey.questions[q].answers){
                    if(survey.questions[q].answers[a].aid === parseInt(ansid)){
                        survey.questions[q].answers[a].selected = ansselected;
                    }
                }
            else if (survey.questions[q].qid === qid)
                survey.questions[q].answer = text;
        }
    }

    const userSetter = (user)=>{
        survey.user = user;
    }

    const validateAndSubmit = () =>{
        setLoading(true);
        //validation
        let vanswers = []
        let errors = []
        if(!survey.user) errors.push(0)
        survey.questions.forEach(q => {
            if(q.multiple){
                let ans = q.answers.filter(a=>{return a.selected})
                let ans_count = ans.length
                if (ans_count < q.min || ans_count > q.max) errors.push(q.qid)
                else {
                    ans.map( a => {
                        vanswers.push({
                        question_id: q.qid, 
                        answer_id: a.aid
                        })
                    })
                }
            }
            else{
                if(q.text.length === 0 && q.mandatory) errors.push(q.qid)
                else vanswers.push({question_id: q.qid, text: q.answer})
            }
        })
        if(errors.length > 0) {
            setValidationError(errors)
            setLoading(false)
        }
        else {
            let filledForm = {survey_id : survey.sid, user: survey.user, entries: vanswers}
            API.submitEntries(filledForm).then(res => {
                setLoading(false)
                setSubmitted(true)
            })
            .catch(err => {
                setLoading(false)
                setError(err.error)
            })
        }        
    }

    return (<>
            {loading && "LOADING..." } 
            {(validationError || error) && !loading &&
                <Col className="theviewer" align="center">
                    <font color="red" >{!error ? "Validation Error, please check your entries before submit" : error}</font>
                </Col>
            }
            {submitted &&
                <Col className="theviewer" align="center">
                    <font color="green" >{"Your submission has been successfully recorded"}</font>
                </Col>
            }
            {survey && !error && !loading &&<>
           
            <SurveyViewer onAnswerChange={onAnswerChange} onSubmit={validateAndSubmit} onUserSet={userSetter} survey={survey}></SurveyViewer>
            </>
            }
            
            </>
    )

}