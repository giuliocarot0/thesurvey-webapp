let surveys = [{"id":1,"title":"Questionario Di Prova","owner":1,"public":0,"questions":[{"multiple":false,"id":1,"text":"Alessandro è scemo?","mandatory":0,"order":0},{"multiple":true,"id":2,"text":"Alessandro è nato a...","answers":[{"answer_id":1,"text":"Melfi"},{"answer_id":2,"text":"Torino"},{"answer_id":3,"text":"Milano"},{"answer_id":4,"text":"Bologna"}],"min":1,"max":3,"order":0}]},
 {"id":2,"title":"Proposte per il 15 Agosto","owner":1,"public":0,"questions":[{"multiple":false,"id":1,"text":"Descrivi perché vorresti partecipare","mandatory":0,"order":0},{"multiple":true,"id":2,"text":"Quale luogo preferisci?","answers":[{"answer_id":1,"text":"Montagna"},{"answer_id":2,"text":"Lago"},{"answer_id":3,"text":"Collina"},{"answer_id":4,"text":"Mare"},{"answer_id":5,"text":"Città"}],"min":1,"max":3,"order":0},{"multiple":false,"id":3,"text":"Descrivi cosa ti piacerebbe provare","mandatory":1,"order":0}]},
 {"id":3,"title":"Organizzazione escursione San Lorenzo","owner":1,"public":0,"questions":[{"multiple":false,"id":1,"text":"Alessandro è scemo?","mandatory":0,"order":0},{"multiple":true,"id":2,"text":"Alessandro è nato a...","answers":[{"answer_id":1,"text":"Melfi"},{"answer_id":2,"text":"Torino"},{"answer_id":3,"text":"Milano"},{"answer_id":4,"text":"Bologna"}],"min":1,"max":3,"order":0}]}
]
const getSurvey = (id)=>{
    let survey = surveys.filter(s=>(s.id === id))
    if(survey.length>0) return survey[0];
    else return false;
} 

const getSurveyList = ()=>{
    return [
            {"id":1, "title":"Questionario di prova"},
            {"id":2, "title":"Proposte per il 15 Agosto"},
            {"id":3, "title":"Organizzazione escursione San Lorenzo"}
        ]
    }
const getMySurveyList = ()=>{
        return [
                {"id":1, "title":"Questionario di prova", "submissions": 3},
                {"id":2, "title":"Proposte per il 15 Agosto", "submissions": 3},
                {"id":3, "title":"Organizzazione escursione San Lorenzo", "submissions": 3}
            ]
        }
  /*this method prepare an array to input answers*/
  const fillableSurvey = (s) => {
    let questions = []
    if(!s) return false;
     s.questions.map((q) => {
        if(q.multiple){
            let answers = q.answers.map((a) => {return {aid: a.answer_id, text: a.text, selected: false}});
            answers.sort((a,b) => a.aid - b.aid)
            return questions.push({qid: q.id, multiple: true, text: q.text, min: q.min, max:q.max, answers: answers})
        }
        else    
            return questions.push({qid: q.id, text: q.text, madatory: q.mandatory, answer:""});
    })
    questions.sort((a,b) => a.qid - b.qid)
    return {sid: s.id, title: s.title, questions:questions, user:""};
}

    const filledSurvey = (survey, a, p) => {
        let s = JSON.parse(JSON.stringify(survey))
        //assuming s a fillableSurvey
        for(let e in a){
            if(a[e].text){
                s.questions[a[e].question_id - 1].answer = a[e].text;
            }
            else{ 
                s.questions[a[e].question_id - 1 ].answers[a[e].answer_id  - 1].selected = true;           
            }
        }
        s.user = p;
        return s;
    }

    const filledSurveys = (s, a) => {
        let survey = {sid: s.id, title: s.title, questions: s.questions, user: a.partecipant}
        return survey
    }


const createOpenQuestion = (qid, text, mandatory) =>{
    return {"multiple":false,"qid":qid,"text":text,"mandatory":mandatory,answer:"","order":qid}
}

const createClosedQuestion = (qid, text, min, max, answers) =>{
    return {"multiple":true,"qid":qid,"text":text,"answers":answers,"min":min,"max":max,"order":qid}
}

module.exports = {getSurvey, fillableSurvey,getSurveyList,getMySurveyList, filledSurvey, createClosedQuestion, createOpenQuestion }
