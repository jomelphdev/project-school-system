import db from '../config/database.js'

// Get All Stream
export const getAllStream = (result) => {
  db.query('SELECT * FROM stream', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get Single Stream
export const findStreamById = (id, result) => {
  db.query('SELECT * FROM stream WHERE stream_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results[0])
    }
  })
}
// Get all Stream by Iteration ID
export const findStreamByIterationId = (id, result) => {
  db.query(
    'SELECT * FROM stream WHERE iteration_id = ?',
    [id],
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
// Create New Stream
export const insertStream = (data, result) => {
  db.query(
    'INSERT INTO stream (stream_name, org_id, suborg_id, program_id, iteration_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)',
    [
      data.stream_name,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      data.created_by,
      data.modified_by,
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
// Update Stream
export const updateStreamById = (id, data, result) => {
  db.query(
    'UPDATE stream SET stream_name = ?, modified_at = NOW(), modified_by = ? WHERE stream_id = ?',
    [data.stream_name, data.modified_by, id],
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
// Delete Stream
export const deleteStreamById = (id, result) => {
  db.query('DELETE FROM stream WHERE stream_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

export const getIterationStreams = (id, result) => {
  db.query('SELECT * FROM stream WHERE iteration_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

