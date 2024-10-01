import db from "../config/database.js"

export const get360InstructionM = (data, result) => {
  db.query(`SELECT * FROM 360_instruction WHERE org_id = ? and suborg_id = ? AND program_id = ? AND iteration_id = ?`,
    [data.org_id, data.suborg_id, data.program_id, data.iteration_id, data.for_participant],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}