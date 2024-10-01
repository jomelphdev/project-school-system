import db from "../config/database.js"

export const get360LikertM = (result) => {
    db.query(`SELECT * FROM 360_likert`, (err, results) => {
        if (err) {
            console.log(err)
            result(err, null)
        } else {
            result(null, results)
        }
    })
}