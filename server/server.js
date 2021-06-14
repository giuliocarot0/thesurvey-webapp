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
const basepath = "/api/survey/";

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





// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});