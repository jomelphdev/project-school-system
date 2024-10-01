import db from '../config/database.js'

// Get All Organization
export const getAllOrganization = (result) => {
  db.query('SELECT * FROM org', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get Single Organization
export const findOrganizationById = (id, result) => {
  db.query('SELECT * FROM org WHERE org_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results[0])
    }
  })
}
// Create New Organization
export const insertOrganization = (data, result) => {
  db.query(
    'INSERT INTO org (org_name, created_at, created_by, modified_at, modified_by) VALUES (?, NOW(), ?, NOW(), ?)',
    [data.org_name, data.created_by, data.modified_by],
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
// Update Organization
export const updateOrganizationById = (id, data, result) => {
  db.query(
    'UPDATE org SET org_name = ?, modified_at = NOW(), modified_by = ? WHERE org_id = ?',
    [data.org_name, data.modified_by, id],
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
// Delete Organization
export const deleteOrganizationById = (id, result) => {
  db.query('DELETE FROM org WHERE org_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get last org_id
export const getLastestOrgId = (result) => {
  db.query('SELECT MAX(org_id) AS latest_org_id FROM org', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}