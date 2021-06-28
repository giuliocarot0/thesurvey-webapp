import SurveyViewer from './SurveyViewer'
import LoadingComponent from './LoadingComponent'

import {useState, useEffect} from 'react'
import {useLocation, Redirect} from 'react-router-dom'
import {Col} from 'react-bootstrap'
import API from '../API'
import './components.css'
export default function SurveyCompiler(props){
    const [survey, setSurvey] = useState(false);
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [validationError, setValidationError] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const {loggedIn} = props;
    const path = location.pathname.substring(10)
    const sid = parseInt(path)

    useEffect(()=>{
        const getSurvey = async (sid) => {
            try {
            let s = await API.getSurvey(sid)
                setSurvey(s) 
                setLoading(false)
            }catch(e){
                setError("Cannot get survey")
                setSurvey(false)
            }
        }

        if(!sid){
            setSurvey(false);
            setLoading(false)
        }
        else {   
            getSurvey(sid)                
            setLoading(false)

        }
                  
    },[sid])

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
        const submit = async(filledForm) =>{
            try{
                await API.submitEntries(filledForm)
                setSubmitted(true)
                setError(false)
                setLoading(false)   

            }
            catch(e){
                setSubmitted(false)
                setError(true)
                setLoading(false)   
            }
        }
        

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
                    ans.forEach( a => {
                        vanswers.push({
                        question_id: q.qid, 
                        answer_id: a.aid
                        })
                    })
                }
            }
            else{
                if(q.mandatory && q.answer.length === 0) errors.push(q.qid)
                else vanswers.push({question_id: q.qid, text: q.answer})
            }
        })
        if(errors.length > 0) {
            setValidationError(errors)
            setLoading(false)
        }
        else {
            let filledForm = {survey_id : survey.id, user: survey.user, entries: vanswers}
            submit(filledForm)
        }      
    }

    return (loading? <LoadingComponent></LoadingComponent> :
        submitted ? <Redirect to="/"></Redirect> : <>
        {loggedIn && <Redirect to="/dashboard"/>}
             
            {(validationError || error) && !loading && !submitted &&
                <Col className="theviewer" align="center">
                    <font color="red" >{!error ? "Validation Error, please check your entries before submit" : error}</font>
                </Col>
            }
            {survey && !error && !loading &&<>
           
            <SurveyViewer onAnswerChange={onAnswerChange} onSubmit={validateAndSubmit} onUserSet={userSetter} survey={survey}></SurveyViewer>
            </>
            }
            
            </>
    )

}