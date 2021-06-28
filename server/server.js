'use strict';
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const passport = require('passport'); // auth middleware
const userDao = require('./lib/user')
const express = require('express');
const survey = require('./lib/survey')
const session = require('express-session'); // enable sessions

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.get(username, password).then((response) => {
      if (!response)
        return done(null, false, { message: 'Incorrect username and/or password.' });
      return done(null, response.user);
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


// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
/* SURVEY API ENDPOINTS */
const basepath = "/api/surveys/";

/**
 * This endpoint creates a new survey starting from it's title and his owner
 */
app.post(basepath, async (req, res) => {
  try{
      if(!req.user) return res.status(401).send({error: "Unauthenticated User"})
      else {
        let response = await survey.new(req.body, req.user.id)
       return res.send({message: "survey successfully created"}) 
    }
  }
  catch(e){
      return res.status(500).send({error: "Internal Server Error"})
  }
})

app.get(basepath+":id", async (req,res) => {
  try{
    let result =  await survey.getFromDB(req.params.id)
    if(!result)
      return res.status(404).send({error: "Requested survey not found!"})
    else if (result)
      return res.status(200).send(result)
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
    let result = !req.user ? await survey.getList() : await survey.getMyList(req.user.id)
    return res.send(result);
  }
  catch(e){
    return res.status(500).send({error: "Internal Server Error"})
  }
})

app.get(basepath + "read/" + ":id" + "/partecipants", async (req, res) => {
  try {
    if(!req.user) res.status(401).send({error: "Not authenticated!"})
    else{
      let partecipants = await survey.getPartecipants(req.user.id,req.params.id)
      if(Object.keys(partecipants).length > 0)
        return res.send(partecipants)
      else
        return res.status(404).send({error:"No partecipants found"});
    }
  }catch(e){
    return res.status(500).send({error: "Internal Server Error", more: e})
  }
})


app.get(basepath + "read/" + ":id" + "/partecipants/" + ":pid", async (req, res) =>{ 
  try{
    if(!req.user) res.status(401).send({error: "Not authenticated!"})
    else{
      let submissions = await survey.getSubmissionForSurvey(req.user.id,req.params.id,req.params.pid)
      if(submissions!==false)
        return res.send(submissions)
      else
        return res.status(404).send({error:"No submissions found"});
    }
  }
  catch(e){
    console.log(e)
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