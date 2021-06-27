
const db = require('/db')
const bcrypt = require('bcrypt')

exports.get =(email, password)=>{
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM USER WHERE username = ?"
        db.get(sql, [email], (err, row) => {
            if(err)
                reject(err)
            else if (row === undefined)
                resolve({error: "User not found"})
            else {
                let response = { 
                    user:  {
                        id: row.id,
                        username: row.email,
                        name: row.name
                    }}
                    
                //verify whether the password is correct or not
                bcrypt.compare(password, row.hash).then( result => { 
                    if(result)
                        resolve(response)
                    else 
                        resolve({error: "Wrong password!"})
                })
            }
            
        })
    })
}
exports.getById =(id)=>{
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM USER WHERE user_id = ?"
        db.get(sql, [id], (err, row) => {
            if(err)
                reject(err)
            else if (row === undefined)
                resolve({error: "User Not Found"})
            else
                resolve({
                    user:  {
                        id: row.id,
                        username: row.email,
                        name: row.name
                    }
                })
        })
    })
}
