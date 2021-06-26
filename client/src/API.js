
const BASEURL = '/api'

function responseParser(fetchResponse) {
    return new Promise((resolve, reject)=>{
        fetchResponse
            .then((r)=>{
                if(r.ok){
                    r.json()
                        .then( json => resolve(json))
                        .catch( err => reject({error: "Cannot parse server response"}))
                }
                else {
                    r.json()
                    .then( json => reject(json))
                    .catch( err => reject({error: "Cannot parse server response"}))
                }
            })
            .catch(
                err => reject({error: "No server response"})
            )

    })
}


const getSurveyList = async ()=>{
    return responseParser(fetch(BASEURL + '/surveys')).then()    
}

const getSurvey = async(sid) => {
    return responseParser(fetch(BASEURL + '/surveys/' + sid)).then()
}

const getSubmissionForSurvey = async (sid, pid) => {
    return responseParser(fetch(BASEURL + '/surveys/read/' + sid +'/partecipants/'+ pid)).then()
}
const getPartecipants = async(sid) => {
    return responseParser(fetch(BASEURL + '/surveys/read/' + sid +'/partecipants/')).then()
}

const submitEntries = async (form) =>{
    return responseParser(fetch(BASEURL + '/surveys/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    }))
}
const API = {getSurveyList, getSurvey, getSubmissionForSurvey, getPartecipants, submitEntries}
export default API