/*defines the type question*/

exports.create = (q)=>{
   let question = (q.mandatory === null && q.min!==null && q.max!==null) ? 
      {
        multiple: true,
        id: q.question_id,
        text: q.text,
        answers: [],
        min: q.min,
        max: q.max,
        order: q.position
    }:{
        multiple: false,
        id: q.question_id,
        text: q.text,
        mandatory: q.mandatory,
        order: q.position
    }
    return question;
}

const setPosition = (q, p) =>{
    q.order = p;
    return p;
} 


