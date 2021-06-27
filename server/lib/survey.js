
const db = require('./db')
const question = require('./question')

/*defines the survey object*/

exports.create = (b)=>{
    return {
        id: b.survey_id,
        title: b.title,
        owner: b.owner,
        questions: []
    }
}

exports.new = async (survey, uid)=>{
    try {
        console.log(survey)
        let survey_id = await addIntoSurvey(survey, uid);
        if (!survey_id) throw new Exception()
        console.log(survey)
        for(let q in survey.questions){
            await addQuestion(survey.questions[q], survey_id)
            for(let a in survey.questions[q].answers){
                await addAnswer(survey.questions[q].answers[a], survey.questions[q].qid, survey_id)
            }
        }
        return new Promise((resolve, reject)=>{
                    resolve(survey_id)
        })
    }
    catch(e){
        return new Promise((resolve, reject)=>{
            reject({error: e})
        })
    }
}

const addIntoSurvey = (survey, uid) => {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO SURVEY (title, owner) VALUES(?,?)"
        db.run(query, [survey.title, uid], async function(err, res){
            if(err) reject({error:"Internal Server Error", from: "add_survey", more: err})
            else if (this.changes > 0) resolve(this.lastID);
            else reject({error: "Invalid Data Entry"})
        })
    })
}
const addQuestion = (question, survey_id) => {
    return new Promise((resolve, reject) => {
        if(question.multiple){
            let query = "INSERT INTO QUESTION (question_id, survey_id, text, min, max) VALUES(?,?,?,?,?)"
            db.run(query, [question.qid, survey_id, question.text, question.min, question.max], async function(err, res){
                if(err) reject({error:"Internal Server Error", from: "add_question", more: err})
                else if (this.changes > 0) resolve(this.lastID);
                else reject({error: "Invalid Data Entry"})
            })
        }
        else {
            let query = "INSERT INTO QUESTION (question_id, survey_id, text, mandatory) VALUES(?,?,?,?)"
            db.run(query, [question.qid, survey_id, question.text, question.mandatory], async function(err, res){
                if(err) reject({error:"Internal Server Error" ,from: "add_question", more: err})
                else if (this.changes > 0) resolve(this.lastID);
                else refect({error: "Invalid Data Entry"})
            })
        }
    })
}
const addAnswer = (answer, question_id, survey_id)=>{
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO ANSWER (answer_id, question_id, text, survey_id) VALUES(?,?,?,?)"
        db.run(query, [answer.aid, question_id, answer.text, survey_id], async function(err, res){
            if(err) reject({error:"Internal Server Error", more: err})
            else if (this.changes > 0) resolve(this.lastID);
            else refect({error: "Invalid Data Entry"})
        })
    })
} 

exports.getList = ()=>{
    return new Promise((resolve, reject)=>{
        let query = "SELECT * FROM SURVEY"
        let list = db.all(query, (err, rows)=>{
            if(err) reject(err);
            else{
                let sList = []
                rows.map((s) => {
                    sList.push({id: s.survey_id, title: s.title})
                })
                resolve(sList)
            }
        })
    })
}
exports.getPartecipants = ((uid, sid) => {
    return new Promise ((resolve, reject) => {
        let query = "SELECT partecipant_id, name \
                    FROM PARTECIPANT P, SURVEY S  \
                    WHERE S.survey_id = P.survey_id AND S.owner = ? AND S.survey_id = ?"
        db.all(query, [uid, sid], (err, res) => {
            if(err) reject(err)
            else resolve(res)
        })
    })
})

const hasPartecipated = ((uid, sid, pid) => {
    return new Promise ((resolve, reject) => {
        let query = "SELECT partecipant_id \
                    FROM PARTECIPANT P, SURVEY S  \
                    WHERE S.survey_id = P.survey_id AND S.owner = ? AND S.survey_id = ? AND P.partecipant_id = ?"
        db.get(query, [uid, sid, pid], (err, res) => {
            if(err) reject(err)
            else resolve(res)
        })
    })
})
exports.getMyList = (uid)=>{
    return new Promise((resolve, reject) => {
        if(!uid) reject({error: "invalid userId"})
        else{
            let query =
            "SELECT S.title, S.survey_id, COUNT(Distinct P.partecipant_id) as submissions\
            FROM  SURVEY S \
            LEFT JOIN PARTECIPANT P\
            ON S.survey_id = P.survey_id\
            WHERE owner = ? \
            GROUP BY S.survey_id"
            let list = db.all(query, [uid], (err, rows)=>{
                if(err) reject(err);
                else{
                    let sList = []
                    rows.map((s) => {
                        sList.push({id: s.survey_id, title: s.title, submission: s.submissions})
                    })
                    resolve(sList)
                }
            })
        }
    })
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
            quest[q].answers = await getAnswersFromDB(quest[q].id, sid);
        }
    }
    return quest;

}

const getAnswersFromDB = async (qid, sid) => {
    return new Promise((resolve, reject) => {
        let ans_query = "SELECT answer_id, text FROM ANSWER WHERE question_id = ? AND survey_id = ?"
        db.all(ans_query, [qid, sid], (err, result) => {
            if(err)
                reject(err)
            resolve(result);
        })
    })
}


exports.submit = async (survey) => {
    try{        
        let uid = await addPartecipant(survey.survey_id, survey.user);
        for(let i in survey.entries)
            await addEntry(survey.survey_id, uid, survey.entries[i])
        return new Promise((resolve, reject)=>{
            resolve({message: "Successfully updated"})
        })
    }catch(e) {
        return new Promise((resolve, reject)=>{
            console.log(e)
            reject({error: e})
        })
    }

}
const addEntry = (sid, uid, entry) =>{
    return new Promise((resolve, reject) => {
        if(entry.text) {
            let ins = "INSERT INTO OPEN_ENTRY VALUES (?,?,?,?)"
            db.run(ins, [sid, entry.question_id, entry.text ,uid],async function(err, res){
                if(err) reject({error: err})
                else if( this.changes > 0 ) resolve(res)
                else reject(null)
            })
        } 
        else if (entry.answer_id){
            let ins = "INSERT INTO CLOSED_ENTRY VALUES (?,?,?,?)"
            db.run(ins, [ entry.question_id, entry.answer_id ,uid,sid],async function(err, res){
                if(err) reject({error: err})
                else if( this.changes > 0 ) resolve(res)
                else reject({error: "Invalid parameters"})
            })
        }
        else {
            resolve()
        }
    })
}
const addPartecipant = (sid,name) => {
    return new Promise ((resolve, reject) => {
        if(!sid || !name) reject({error: "Missing parameters"})
        else{
            let get = "SELECT MAX(partecipant_id) as lastID FROM PARTECIPANT WHERE survey_id = ?"
            db.get(get, [sid], (err, res) => {
                if(err) reject(err)
                else{
                    let ins = "INSERT INTO PARTECIPANT VALUES (?,?,?)"
                    db.run(ins, [res.lastID + 1, name, sid], async function (err, result){
                        if(err) reject({error: err})
                        else if (this.changes > 0) resolve(res.lastID + 1)
                        else reject({error: "Invalid parameters"})
                    })
                }
            })
        }
    })
}


exports.getSubmissionForSurvey  = async (uid,sid,pid) =>{
        let partecipated = await hasPartecipated(uid, sid, pid)
        let open_entries = await getOpenEntries(sid,uid,pid)
        let closed_entries = await getClosedEntries(sid, uid, pid)
       // now creates arrays of arrays to ensure direct access to questions and eventually answers
       return new Promise((resolve, reject) => {
           if(!partecipated) resolve(false)
           else if (open_entries && closed_entries) resolve(open_entries.concat(closed_entries))
           else reject({error: "Error retreiving entries form DB"})
       })
}

const getOpenEntries = async (sid, uid, partecipant) => {
    return new Promise((resolve, reject) =>{
        let open_entries = "SELECT E.question_id, E.text  \
                              FROM OPEN_ENTRY E, SURVEY S \
                              WHERE S.survey_id = E.survey_id AND E.survey_id = ? AND S.owner = ? AND E.partecipant = ?"
        console.log(sid)
        db.all(open_entries, [sid, uid, partecipant], (err, result) => {
            if(err) reject(err)
            else {
                resolve(result)
            }
            })
         })
    }

const getClosedEntries = async (sid, uid, partecipant) => {
    return new Promise((resolve, reject) =>{
        let open_entries = "SELECT E.question_id, E.answer_id\
                              FROM CLOSED_ENTRY E, SURVEY S\
                              WHERE S.survey_id = E.survey_id AND E.survey_id = ? AND S.owner = ? AND E.partecipant = ?"
        db.all(open_entries, [sid, uid, partecipant], (err, result) => {
            if(err) reject(err)
            else resolve(result)
            })
         })
}