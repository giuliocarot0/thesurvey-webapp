
const db = require('./db')
const question = require('./question')

/*defines the survey object*/

exports.create = (b)=>{
    return {
        id: b.survey_id,
        title: b.title,
        owner: b.owner,
        public: b.public,
        questions: []
    }
}


exports.getFromDB =  (id) => {
    return new Promise((resolve, reject) =>{
    /*get the survey from DB*/
    let query1 = "SELECT * FROM SURVEY WHERE survey_id = ?";
    let row = db.get(query1, [id],(err, row) => {
    if(err) reject(err)
    else if(row){
            let survey = this.create(row);
            getQuestionsFromDB(survey.id).then((response) => {
                survey.questions = response;
                resolve(survey);
            })
        }
        else resolve(null)
    })
    })
} 

const getQuestionsFromDB = async (sid) => {
        let questions = new Promise((resolve, reject) => {
        let queryQuestions = "SELECT * FROM QUESTION WHERE  survey_id = ?"
        rows =db.all(queryQuestions, [sid], (err, rows)=>{
         if(err) 
            reject(err)
         if(rows){
                console.log(rows)
                let questions = []
                for(i in rows){
                    let question_obj = question.create(rows[i])
                    questions.push(question_obj)
                }
                resolve (questions)
            }
            else resolve ([])
        })
    })
    let quest =  await questions;
    for(q in quest) {
        if(quest[q].multiple){
            quest[q].answers = await getAnswersFromDB(quest[q].id);
        }
    }
    return quest;

}

const getAnswersFromDB = async (qid) => {
    return new Promise((resolve, reject) => {
        ans_query = "SELECT answer_id, text FROM ANSWER WHERE question_id = ?"
        db.all(ans_query, [qid], (err, result) => {
            if(err)
                reject(err)
            resolve(result);
        })
    })
}