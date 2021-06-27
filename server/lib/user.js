
const db = require('./db')
const bcrypt = require('bcrypt')

exports.get =(email, password)=>{
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM USER WHERE username = ?"
        db.get(sql, [email], (err, row) => {
            if(err)
                reject(err)
            else if (row === undefined)
                resolve(false)
            else {
                let response = { 
                    user:  {
                        id: row.user_id,
                        username: row.username,
                        name: row.name
                    }}
               
                //verify whether the password is correct or not
                bcrypt.compare(password, row.hash).then( result => { 
                    if(result)
                        resolve(response)
                    else 
                        resolve(false)
                })
            }
            
        })
    })
}
exports.getUserById =(id)=>{
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM USER WHERE user_id = ?"
        db.get(sql, [id], (err, row) => {
            if(err)
                reject(err)
            else if (row === undefined)
                reject({error: "User not found"})
            else
                resolve({
                        id: row.user_id,
                        username: row.username,
                        name: row.name
                })
        })
    })
}
