
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
            return questions.push({qid: q.id, text: q.text, mandatory: q.mandatory, answer:""});
    })
    questions.sort((a,b) => a.qid - b.qid)
    return {sid: s.id, title: s.title, questions:questions, user:""};
}



const createOpenQuestion = (qid, text, mandatory) =>{
    return {"multiple":false,"qid":qid,"text":text,"mandatory":mandatory, answer:""}
}

const createClosedQuestion = (qid, text, min, max, answers) =>{
    return {"multiple":true,"qid":qid,"text":text,"answers":answers,"min":min,"max":max}
}

module.exports = {fillableSurvey, createClosedQuestion, createOpenQuestion }
