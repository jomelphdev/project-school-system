import db from '../config/database.js'

// Get All Program
export const getAllProgram = (result) => {
  db.query('SELECT * FROM program', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get Single Program
export const findProgramById = (id, result) => {
  db.query(
    'SELECT * FROM program WHERE program_id = ?',
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
// Get all Porgram by suborg_id
export const findProgramBySuborgId = (id, result) => {
  db.query("SELECT * FROM program WHERE suborg_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};
// Create New Program
export const insertProgram = (data, result) => {
  db.query(
    'INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, NOW(), ?, NOW(), ?)',
    [
      data.program_name,
      data.org_id,
      data.suborg_id,
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
// Update Program
export const updateProgramById = (id, data, result) => {
  db.query(
    'UPDATE program SET program_name = ?, modified_at = NOW(), modified_by = ? WHERE program_id = ?',
    [data.program_name, data.modified_by, id],
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
// Delete Program
export const deleteProgramById = (id, result) => {
  db.query('DELETE FROM program WHERE program_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

export const getSuborgPrograms = (suborgID, result) => {
  db.query('SELECT * FROM program WHERE suborg_id = ?', [suborgID], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })  
}
