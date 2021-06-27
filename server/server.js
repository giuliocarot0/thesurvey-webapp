'use strict';
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const passport = require('passport'); // auth middleware
const userDao = require('./lib/user')
const express = require('express');
const survey = require('./lib/survey')

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


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
app.post(basepath, async (req, res) => {
  try{
      if(!req.user) return res.status(401).send({error: "Unauthenticated User"})
      else {
        let response = await survey.new(req.body, req.user)
       return res.send({message: "survey successfully created"}) 
    }
  }
  catch(e){
      console.log(e)
      return res.status(500).send({error: "Internal Server Error"})
  }
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
      if(submissions!==false)
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


/*===== USER APIs =========*/
// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});