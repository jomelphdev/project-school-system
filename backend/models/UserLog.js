import db from '../config/database.js'

// Create New Iteration
export const insertLog = (data, result) => {
  db.query(
    'INSERT INTO user_env_log (email, ind_id, machine_id, ip_address, is_logged_in, platform, operating_system, browser, logical_processors, datetime, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
    [
      data.email,
      data.ind_id,
      data.machine_id,
      data.ip_address,
      data.is_logged_in,
      data.platform,
      data.operating_system,
      data.browser,
      data.logical_processors,
    ],
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

export const getLogByIndIdAndisLoggedInM = (ind_id, result) => {
  db.query('SELECT * FROM user_env_log WHERE ind_id = ? ORDER BY created_at DESC LIMIT 1', [ind_id], (err, results) => {
    if (err) {
      result(err, null)
    } else {
      result(null, results[0])
    }
  })
}