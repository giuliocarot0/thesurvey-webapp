'use strict';

const express = require('express');
const survey = require('./lib/survey')


// init express
const app = new express();
const port = 3001;

app.use(express.json())
app.use((req, res, next) => {
  req.user = 1;
  next();
})


/* SURVEY API ENDPOINTS */
const basepath = "/api/surveys/";

/**
 * This endpoint creates a new survey starting from it's title and his owner
 */
app.post(basepath,  (req, res) => {
    var survey_obj = survey.create(req.body, req.user);
    survey.insertIntoDB(survey_obj, (err, result)  => {
      if(err || !result)
        return res.status(500).send({error: "Internal Server Error"})
      else 
        return res.status(200).send({message: "Survey sucessfully created"})
    })
})

app.get(basepath+":id", async (req,res) => {
  try{
    let result =  await survey.getFromDB(req.params.id)/*.catch(e=> { return res.status(500).send({error: "Internal Server Error"})})*/
    if(!result)
      return res.status(404).send({error: "Requested survey not found!"})
    else if (result && (result.public || result.owner === req.user))
      return res.status(200).send(result)
    else 
      return res.status(403).send({error: "Unauthorized user!"})
  }
  catch(e){
    console.log(e)
    return res.status(500).send({error: "Internal Server Error"})}
  })



/**
 * This endpoint return a list of surveys.
 * If user is authenticated, only his surveys will be returned
 * 
 * @param session_cookie
 * @returns surveys list
 */
app.get(basepath, async(req, res) => {
  try {
    let result = !req.user ? await survey.getList() : await survey.getMyList(req.user)
    return res.send(result);
  }
  catch(e){
    return res.status(500).send({error: "Internal Server Error"})
  }
})

app.get(basepath + "read/" + ":id" + "/partecipants", async (req, res) => {
  try {
    let partecipants = await survey.getPartecipants(req.user,req.params.id)
    if(Object.keys(partecipants).length > 0)
      return res.send(partecipants)
    else
      return res.status(404).send({error:"No partecipants found"});
  }catch(e){
    return res.status(500).send({error: "Internal Server Error", more: e})
  }
})


app.get(basepath + "read/" + ":id" + "/partecipants/" + ":pid", async (req, res) =>{ 
  try{
    if(!req.user) res.status(401).send({error: "Not authenticated!"})
    else{
      let submissions = await survey.getSubmissionForSurvey(req.user,req.params.id,req.params.pid)
      if(Object.keys(submissions).length > 0)
        return res.send(submissions)
      else
        return res.status(404).send({error:"No submissions found"});
    }
  }
  catch(e){
    return res.status(500).send({error: "Internal Server Error", more: e})
  }
})

app.put(basepath, async (req, res) => {
  try {
    let result = await survey.submit(req.body)  
    if (result) res.send({message: "Your submission has been accepted!"})
    else res.status(400).send({error: "Malformed submission, please ensure all field are formatted properly"})
  }catch(e){
    return res.status(500).send({error: "Internal Server Error", more: e})
  }
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});