import db from '../config/database.js'

// Get All Survey Templates
export const getAllSurveyTemplates = (orgId, result) => {
  db.query(
    'SELECT b.max_search_results FROM brand b JOIN org o ON o.brand_id = b.brand_id WHERE o.org_id = ?',
    [orgId],
    (err, results) => {
      if (err) return result(err, null)
      db.query(
        `SELECT * FROM survey_template LIMIT ${results[0].max_search_results}`,
        (err, results2) => {
          if (err) return result(err, null)
          result(null, results2)
        }
      )
    }
  )
}

// Get All survey template
export const getAllTemplates = (result) => {
  db.query('SELECT * FROM survey_template', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

// Get All survey template
export const showSurveyTemplateNameM = (result) => {
  db.query('SELECT survey_template_id, survey_template_name FROM survey_template WHERE nominee_survey_template_id IS NOT NULL', (err, results) => {
    if (err) return result(err, null)
    result(null, results)
  })
}

export const getSurveyTemplateBySurveyTemplateId = (id, result) => {
  let query1 = `SELECT * FROM survey_template WHERE survey_template_id = ${id}`
  console.log(query1)
  db.query(query1, [], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results[0])
    }
  })
}

// Get Survey Templates by Organization
export const getOrgSurveyTemplates = (orgID, suborgID, result) => {
  db.query(
    'SELECT * FROM survey_template_association sta JOIN survey_template st ON st.survey_template_id = sta.survey_template_id WHERE org_id = ? AND suborg_id = ?',
    [orgID, suborgID],
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

//? Create New Survey Template
export const insertSurveyTemplate = (data, result) => {
  db.query(
    'INSERT INTO survey_template (survey_version, survey_template_name, survey_description, survey_file, survey_type, nominee_survey_template_id, prepopulate_data, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      data.survey_version,
      data.survey_template_name,
      data.survey_description,
      data.survey_file,
      data.survey_type,
      data.nominee_survey_template_id,
      data.prepopulate_data,
      data.created_by,
      data.modified_by,
    ],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

//? Delete Survey Template
export const deleteSurveyTemplateById = (id, result) => {
  db.query(
    'DELETE FROM survey_template WHERE survey_template_id=? ',
    [id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

//? Update Survey Template
export const updateSurveyTemplateById = (id, data, result) => {
  db.query(
    `UPDATE survey_template SET survey_template_name = ?, survey_description = ?, survey_file = ?, survey_type = ?, modified_at = NOW(), modified_by = ? 
      WHERE survey_template_id = ?`,
    [
      data.survey_template_name,
      data.survey_description,
      data.survey_file,
      data.survey_type,
      data.modified_by,
      id,
    ],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

//Get All survey Templates
export const getAllDataSurveyTemplates = (result) => {
  db.query("SELECT * FROM survey_template_association sta JOIN survey_template st ON st.survey_template_id = sta.survey_template_id",
  (err, results) => {
    if (err) return result(err, null);
    result(null, results);
})
}

//Get prepopulate endpoint
export const getPrepolupateEndpointTemplatesM = (surveyTemplateId, result) => {
  db.query("SELECT pre_populate_survey_endpoint FROM survey_template WHERE survey_template_id = ?",
  [surveyTemplateId],
  (err, results) => {
    if (err) return result(err, null);
    result(null, results[0]);
    }
  )
}

//Get prepopulate endpoint
export const getCalculateEndpointTemplatesM = (surveyTemplateId, result) => {
  db.query("SELECT calculate_survey_endpoint FROM survey_template WHERE survey_template_id = ?",
  [surveyTemplateId],
  (err, results) => {
    if (err) return result(err, null);
    result(null, results[0]);
    }
  )
}

// get survey_template_id by survey_template_name
export const getSurveyTemplateBySurveyTemplateNameM = (survey_template_name, result) => {
  const query = `SELECT * FROM survey_template WHERE survey_template_name = '${survey_template_name}' OR survey_file LIKE '${survey_template_name}%' LIMIT 1`
  db.query(
      query, [],
      (err, results) => {
          if (err) {
              result(err, null)
          }
          else {
              if(results.length == 0) {
                  result(null, {"status" : 0, "message" : "Something went wrong, Survey template is not existing", "survey_template_id" : null })
              }
              else {
                  result(null, {"status" : 1, "message" : "Successfully retrieved requested records.", "survey_template_id" : results[0].survey_template_id })
              }
          }
      }
  )
}
//Update nominee_survey_template_id
export const updateNomineeSuveytemplateIdM = (survey_template_id, data, result) => { 
  db.query('UPDATE survey_template SET nominee_survey_template_id = ?, modified_at = NOW(), modified_by = ? WHERE survey_template_id = ?',
    [
      data.nominee_survey_template_id,
      data.modified_by,
      survey_template_id
    ],
    (err, results) => {
      if (err) {
        result(err, null)
      } else { 
        result(null, results)
      }
    }
  )
}

// Get Survey Template by version
export const getSurveyTemplateByVersionM = (result) => {
    db.query('SELECT * FROM survey_template WHERE survey_version = 2', (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
  }


export const checkExistSurveyTemplateByNameM = (survey_template_name, result) => {
    const query = 'SELECT * FROM survey_template WHERE survey_template_name = ? LIMIT 1'
    db.query(
        query, [survey_template_name],
        (err, results) => {
            if (err) {
                result(err, null)
            }
            else {
                if(results.length == 1) {
                    result(null, {"status" : 0, "message" : "Survey name already exist!", "Survey_template_id" : results[0].report_template_id })
                }
                else {
                    result(null, {"status" : 1, "message" : "Survey name not exist", "Survey_template_id" : null })
                }
            }
        }
    )
}