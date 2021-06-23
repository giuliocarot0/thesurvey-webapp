import SurveyViewer from './SurveyViewer'
import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {getSurvey, fillableSurvey} from './surveymock'

export default function SurveyCompiler(props){
    const [survey, setSurvey] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const location = useLocation();
    
    const path = location.pathname.substring(10)
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

    return (
        <>  
            <SurveyViewer onAnswerChange={onAnswerChange} onUserSet={userSetter} survey={survey}></SurveyViewer>
        </>
    )

}