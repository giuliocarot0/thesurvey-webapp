const sqlite3 = require('sqlite3').verbose();

//create a db object;

let db = new sqlite3.Database('./survey.db', (err) => {
    if(err) {
        return console.error(err.message);
    }
    else
        console.log("DB successfully connected to SURVEY_API");
})



closeConnection = () => {
    db.close(err => {
        if(err) {
            return console.error(err.message);
        }
        console.log("DB connection successfully closed");
    })
}

module.exports = db;