
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
exports.getMyList = (uid)=>{
    return new Promise((resolve, reject) => {
        if(!uid) reject({error: "invalid userId"})
        else{
            let query =
            "SELECT S.title, S.survey_id, COUNT(DISTINCT partecipant_id) AS submission \
            FROM PARTECIPANT P, SURVEY S \
            WHERE P.survey_id = S.survey_id AND S.owner = ? \
            GROUP BY S.survey_id;"
            let list = db.all(query, [uid], (err, rows)=>{
                if(err) reject(err);
                else{
                    let sList = []
                    rows.map((s) => {
                        sList.push({id: s.survey_id, title: s.title, submission: s.submission})
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
            quest[q].answers = await getAnswersFromDB(quest[q].id);
        }
    }
    return quest;

}

const getAnswersFromDB = async (qid) => {
    return new Promise((resolve, reject) => {
        let ans_query = "SELECT answer_id, text FROM ANSWER WHERE question_id = ?"
        db.all(ans_query, [qid], (err, result) => {
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
                else reject({error: "cannot add the following entry"})
            })
        } 
        else if (entry.answer_id){
            let ins = "INSERT INTO CLOSED_ENTRY VALUES (?,?,?,?)"
            db.run(ins, [ entry.question_id, entry.answer_id ,uid,sid],async function(err, res){
                if(err) reject({error: err})
                else if( this.changes > 0 ) resolve(res)
                else reject({error: "cannot add the following entry"})
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
                        else reject({error: "Cannot update PARTECIPANT"})
                    })
                }
            })
        }
    })
}


exports.getSubmissionForSurvey  = async (uid,sid,pid) =>{
    
        let open_entries = await getOpenEntries(uid,sid,pid)
        let closed_entries = await getClosedEntries(uid, sid, pid)

       // now creates arrays of arrays to ensure direct access to questions and eventually answers
       return new Promise((resolve, reject) => {
           if(open_entries && closed_entries) resolve(open_entries.concat(closed_entries))
           else reject({error: "Error retreiving entries form DB"})
       })
}

const getOpenEntries = async (sid, uid, partecipant) => {
    return new Promise((resolve, reject) =>{
        let open_entries = "SELECT E.question_id, E.text  \
                              FROM PARTECIPANT P, OPEN_ENTRY E, SURVEY S\
                              WHERE P.partecipant_id = E.partecipant AND S.survey_id = E.survey_id AND E.survey_id = ? AND S.owner = ? AND E.partecipant = ?"
        db.all(open_entries, [sid, uid, partecipant], (err, result) => {
            if(err) reject(err)
            else resolve(result)
            })
         })
    }

const getClosedEntries = async (sid, uid, partecipant) => {
    return new Promise((resolve, reject) =>{
        let open_entries = "SELECT E.question_id, E.answer_id\
                              FROM PARTECIPANT P, CLOSED_ENTRY E, SURVEY S\
                              WHERE P.partecipant_id = E.partecipant AND S.survey_id = E.survey_id AND E.survey_id = ? AND S.owner = ? AND E.partecipant = ?"
        db.all(open_entries, [sid, uid, partecipant], (err, result) => {
            if(err) reject(err)
            else resolve(result)
            })
         })
}