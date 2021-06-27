
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


const createOpenQuestion = (qid, text, mandatory) =>{
    return {"multiple":false,"qid":qid,"text":text,"mandatory":mandatory, answer:""}
}

const createClosedQuestion = (qid, text, min, max, answers) =>{
    return {"multiple":true,"qid":qid,"text":text,"answers":answers,"min":min,"max":max}
}

module.exports = {fillableSurvey, filledSurvey, createClosedQuestion, createOpenQuestion }
