import db from '../config/database.js'

// Get All Iteration
export const getAllIteration = (result) => {
  db.query('SELECT * FROM iteration', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get Single Iteration
export const findIterationById = (id, result) => {
  db.query(
    'SELECT * FROM iteration WHERE iteration_id = ?',
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
// Get all Iteration by program_id
export const findIterationByProgramId = (id, result) => {
  db.query(
    'SELECT * FROM iteration WHERE program_id = ?',
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
// Create New Iteration
export const insertIteration = (data, result) => {
  db.query(
    'INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, NOW(), ?, NOW(), ?)',
    [
      data.iteration_name,
      data.org_id,
      data.suborg_id,
      data.program_id,
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
// Update Iteration
export const updateIterationById = (id, data, result) => {
  db.query(
    'UPDATE iteration SET iteration_name = ?, time_zone = ?, final_deadline_date = ?, never_run_iteration = ?, modified_at = NOW(), modified_by = ? WHERE iteration_id = ?',
    [data.iteration_name, data.time_zone, data.final_deadline_date, data.never_run_iteration, data.modified_by, id],
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

export const updateIterationFinalDeadlineDateById = (id, data, result) => {
  console.log(data)
  db.query(
    'UPDATE iteration SET final_deadline_date = ?, modified_at = NOW(), modified_by = ? WHERE iteration_id = ?',
    [data.final_deadline_date, data.modified_by, id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, { success: true, type: 'success', message: 'The survey was successfully attached to this user' }, results);
      }
    }
  )
}

// Delete Iteration
export const deleteIterationById = (id, result) => {
  db.query(
    'DELETE FROM iteration WHERE iteration_id = ?',
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

//get program iterations
export const getProgramIterations = (programID, result) => {
  db.query(
    'SELECT * FROM iteration WHERE program_id = ?',
    [programID],
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

export const getIterationFinalDeadlineDateByIdM = (id, result) => {
  db.query(
    `SELECT
      iteration_id,
      iteration_name, 
      time_zone,
      DATE_FORMAT(final_deadline_date,'%Y-%m-%d %H:%i') AS final_deadline_date,
      never_run_iteration
    FROM iteration WHERE iteration_id = ?`,
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