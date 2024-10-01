import db from '../config/database.js'

// Get All group
export const getAllGroup = (result) => {
  db.query('SELECT * FROM `group`', (err, results) => {
    if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}
// Get All Brand
export const getStreamGroups = (streamID, result) => {
  db.query('SELECT * FROM `group` WHERE stream_id = ?', [streamID], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

// Get all Group by stream_id
export const findGroupByStreamId = (id, result) => {
  db.query('SELECT * FROM `group` WHERE stream_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

// Get Single Group
export const findGroupById = (id, result) => {
  db.query('SELECT * FROM `group` WHERE group_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

// Create New Group
export const insertGroup = (data, result) => {
  db.query(
    'INSERT INTO `group` (group_name, org_id, suborg_id, program_id, iteration_id, stream_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)',
    [
      data.group_name,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      data.stream_id,
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
// Update Group
export const updateGroupById = (id, data, result) => {
  db.query(
    'UPDATE `group` SET group_name = ?, modified_at = NOW(), modified_by = ? WHERE group_id = ?',
    [data.group_name, data.modified_by, id],
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
// Delete Group
export const deleteGroupById = (id, result) => {
  db.query('DELETE FROM `group` WHERE group_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
