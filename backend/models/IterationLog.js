import db from '../config/database.js'



export const getAllIterationLog = (result) => {
    db.query('SELECT * FROM iteration_log', (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
  }

  export const findIterationLogByIterationId = (id, result) => {
    db.query(
      `SELECT batch_action_name, DATE_FORMAT(action_when,'%d-%b-%Y %H:%i') as action_when, action_by, STATUS
        FROM iteration_log il
          LEFT JOIN org o ON o.org_id = il.org_id
          LEFT JOIN suborg so ON so.suborg_id = il.suborg_id
          LEFT JOIN program p ON p.program_id = il.program_id
          LEFT JOIN iteration it ON it.iteration_id = il.iteration_id
          LEFT JOIN batch_action ba ON ba.batch_action_id = il.action_made
            WHERE il.iteration_id = ${id}
              ORDER BY action_when DESC`,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }


  export const insertIterationLog = (data, result) => {
    db.query(
      `INSERT INTO iteration_log (iteration_id, action_made, action_when, action_by, action_by_id, status, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) 
      VALUES (${data.iteration_id}, ${data.action_made}, NOW(), '${data.action_by}', ${data.action_by_id}, '${data.status}', ${data.org_id}, ${data.suborg_id}, ${data.program_id}, NOW(), ${data.created_by}, NOW(), ${data.modified_by})`,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }