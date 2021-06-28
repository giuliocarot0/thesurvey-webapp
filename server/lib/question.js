/*defines the type question*/

exports.create = (q)=>{
   let question = (q.mandatory === null && q.min!==null && q.max!==null) ? 
      {
        multiple: true,
        qid: q.question_id,
        text: q.text,
        answers: [],
        min: q.min,
        max: q.max,
    }:{
        multiple: false,
        qid: q.question_id,
        text: q.text,
        mandatory: q.mandatory,
    }
    return question;
}



