import db from '../config/database.js'

export const getAllRole = (result) => {
    db.query('SELECT * FROM role', (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
  }

  export const findRoleById = (id, result) => {
    db.query(
      'SELECT role_name FROM talentsage.role r WHERE r.role_id = ?',
      [id],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results[0])
        }
      }
    )
  }

  export const getAllRespondentsM = (result) => {
    db.query('SELECT * FROM relationship', (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
  }