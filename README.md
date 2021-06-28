# Exam #1234: "Questionario"
## Student: s290251 CAROTA GIULIO 

## React Client Application Routes

- Route `/`: list of fillable surveys by an unauthenticated user.
- Route `/compiler/:sid` : allowsan unauthenticated user to compile a given survey. "sid" is the survey id.
- Route `/dashboard/`: the administrator dashboard lists own surveys and allows administrator to manage them.
- Route `/reader/:sid` : the results reader. Allows an administrator to check submissions for a given survey. "sid" is the survey id.
- Route `/create/` : also colled Survey Studio. At this route the administrator can create a new survey.  
- Route `/login/` : is the login page

## API Server

#### POST `/api/surveys/`
  - Adds a new survey
  - No request parameters needed
  - Body is a json object containing all the informations about the survey
  - Resonse is json containing details about the operation (if errors or successfull) 
  
  ###### example body
  ```
    {
        title:"Questionario di prova",
        questions: [
            {   
                qid: 1
                text: "Domanda di prova",
                multiple: true,
                min: 0,
                max: 3,
                answers: [{
                    text: "Risposta 1"
                },
                {
                    text: "Risposta 2"
                }]
            },
            {
                qid: 2,
                text: "Domanda di prova 2",
                multiple: false,
                mandatory: true,
            }
        ]
    }
  ```

#### GET `/api/surveys/`
  - Retrieve a list of surveys
  - No request parameters needed
  - Response is a list of fillable surveys if no user authenticated, otherwise a list of surveys created by the administrator is sent
###### example response
```
[   
    {   
        survey_id: 1,
        title: "Questionario 1"
    },
    {   
        survey_id: 2,
        title: "Questionario 2"
    }
]
```
#### PUT `/api/surveys/`
  - Create a new submissions for a certain survey
  - No request parameters needed
  - Request body must be a json containing a list of entries for the survey's plus fields to indicate survey id and partecipant name
  - Response is a json containing details about the operation (if errors or successfull) 

```
    {
        survey_id: 1, 
        user: "Mario",
        entries: [
            {
                question_id: 1,
                answer_id: 2
            },
            {
                question_id: 2,
                answer: "Risposta di prova"
            }
        ]
    }
```

#### GET `/api/surveys/:id`
 - Retrieve a survey
 - `id` is the requested survey id
 - Response is a json containing the survey
  ###### example response
  ```
    {
        sid: 1,
        title:"Questionario di prova",
        questions: [
            {   
                qid: 1
                text: "Domanda di prova",
                multiple: true,
                min: 0,
                max: 3,
                answers: [{
                    aid: 1,
                    text: "Risposta 1"
                },
                {
                    aid: 2,
                    text: "Risposta 2"
                }]
            },
            {
                qid: 2,
                text: "Domanda di prova 2",
                multiple: false,
                mandatory: true,
            }
        ]
    }
  ```

#### GET `/api/surveys/`
  - Retrieve a list of surveys
  - No request parameters needed
  - Response is a list of fillable surveys if no user authenticated, otherwise a list of surveys created by the administrator is sent
###### example response
```
[   
    {   
        survey_id: 1,
        title: "Questionario 1"
    },
    {   
        survey_id: 2,
        title: "Questionario 2"
    }
]
```
  
#### GET `/api/surveys/read/:id/partecipants`
  - Retrieve the list of survey's partecipants
  - `id` is the survey id
  - Response is a json containing the survey's partecipants details
###### example response
```
[   
    {   
        partecipant_id: 1,
        name: "Maria"
    },
    {   
        partecipant_id: 2,
        name: "Mario"
    }
]
```

#### GET `/api/surveys/read/:id/partecipants/:pid`
  - Retrieve a partecipant's entries for a specific survey
  - `id` is the survey id
  - `pid` is the partecipant id
###### example response
```
[
    {
        question_id: 1,
        answer_id: 2
    },
    {
        question_id: 2,
        answer: "Risposta di prova"
    }
]
```


## Database Tables

- Table `SURVEY` - contains  survey_id, title, owner
- Table `QUESTION` - contains survey_id, question_id, text, mandatory*, min*, max*
- Table `OPEN_ENTRY` - contains survey_id, question_id, text, partecipant
- Table `CLOSED_ENTRY` - contains survey_id, question_id, answer_id, partecipant
- Table `ANSWER` - contains survey_id, question_id, answer_id, text
- Table `USER` - contains user_id, username, name, hash
- Table `PARTECIPANT` - contains survey_id, partecipant_id, name

## Main React Components

- `SurveyNavbar` (in `Navbar.js`): is the Navbar. The navbar displays the actual location and allows access to login and logout functionalities
- `SurveyHome` (in `SurveyHome.js`): is the homepage component for an unauthenticated user. Allows users to display available surveys and compile them.
- `SurveyCompiler` (in `SurveyCompiler.js`): is the component that allows an unauthenticated user to fill a survey and submit it.

- `Login` (in `Login.js`): I
- `SurveyDashboard` (in `SurveyDashboard.js`): is the homepage for an authenticated user (administrator). Allows administrators to list and check their own surveys and check how many subscriptions there are. Also a new survey can be created starting from here.
- `ResultReader` (in `ResultReader.js`): this component allows administrators to check submissions navigating through partecipants' entries.
- `SurveyEditor` (in `SurveyEditor.js`): this component allows administrator to create a new surve thanks to the step by step creation procedure

- `SurveyViewer` (in `SurveyViewer.js`): this component can display a survey and handle answers to its questions. The survey can be open in read-only mode, in compile mode or in preview mode.
- `QuestionViewer` (in `QuestionViewer.js`): this component is expolited to display a specific question and handle the answer submission
- `QuestionEditor` (in `SurveyEditor.js`): this component is a form that is expolited to create a new question into the editor

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- john.doe@polito.it, Userpassword
- aw.2021@polito.it, Userpassword
