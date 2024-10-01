import db from '../config/database.js'

// Get All Survey Template Association
export const getAllSurveyTemplateAssociation = (result) => {
  db.query('SELECT * FROM survey_template_association', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get Single Survey Template Association
export const findSurveyTemplateAssociationById = (id, result) => {
  db.query(
    'SELECT * FROM survey_template_association WHERE survey_template_association_id = ?',
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
// Get all Survey Template Association by org_id
export const findSurveyTemplateAssociationOrgId = (id, result) => {
  db.query(
    'SELECT * FROM `survey_template` st LEFT JOIN `survey_template_association` sta ON sta.survey_template_id = st.survey_template_id WHERE sta.org_id = ? AND suborg_id = 0',
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
// Get all Survey Template Association by org and suborg_id
export const findSurveyTemplateAssociationBySuborgId = (
  org_id,
  suborg_id,
  result
) => {
  db.query(
    'SELECT * FROM `survey_template` st LEFT JOIN `survey_template_association` sta ON sta.survey_template_id = st.survey_template_id WHERE sta.org_id = ? AND sta.suborg_id = ?',
    [org_id, suborg_id],
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
// Get all Survey_URL by org_id, survey_template_id, suborg_id
export const findSurveyUrlByOrgIdSurveyTemplateIdSuborgId = (
  org_id,
  survey_template_id,
  suborg_id,
  result
) => {
  db.query(
    'SELECT CONCAT(b.website_url, st.survey_file) AS survey_url FROM survey_template_association sta LEFT JOIN org o ON o.org_id = sta.org_id LEFT JOIN brand b ON b.brand_id = o.brand_id LEFT JOIN survey_template st ON st.survey_template_id = sta.survey_template_id WHERE sta.org_id = ? AND sta.survey_template_id = ? AND sta.suborg_id = ? ',
    [org_id, survey_template_id, suborg_id],
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
// Create New Survey Template Association
export const insertSurveyTemplateAssociation = (data, result) => {
  db.query(
    'INSERT INTO survey_template_association (survey_template_association_name, survey_template_id, survey_template_link, org_id, suborg_id, created_at, created_by, modified_at, modified_by) VALUES (?,?,?,?,?, NOW(), ?, NOW(), ?)',
    [
      data.survey_template_association_name,
      data.survey_template_id,
      data.survey_template_link,
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
// Update Survey Template Association
export const updateSurveyTemplateAssociationById = (id, data, result) => {
  db.query(
    'UPDATE survey_template_association SET survey_template_association_name = ?, survey_template_id = ?, survey_template_link = ?, modified_at = NOW(), modified_by = ? WHERE survey_template_association_id = ?',
    [
      data.survey_template_association_name,
      data.survey_template_id,
      data.survey_template_link,
      data.modified_by,
      id,
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
// Delete Survey Template Association
export const deleteSurveyTemplateAssociationById = (id, result) => {
  db.query(
    'DELETE FROM survey_template_association WHERE survey_template_association_id = ?',
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
// Delete Survey Template Association By org_id
export const deleteSurveyTemplateAssociationByOrgIdAndSuborgId = (org_id, suborg_id, result) => {
  db.query(
    'DELETE FROM survey_template_association WHERE org_id = ? AND suborg_id = ?',
    [org_id, suborg_id],
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
// Delete Survey Template Association By org_id and suborg_id
export const deleteSurveyTemplateAssociationBySuborgId = (
  org_id,
  suborg_id,
  result
) => {
  db.query(
    'DELETE FROM survey_template_association WHERE org_id = ? AND suborg_id = ?',
    [org_id, suborg_id],
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
