import db from '../config/database.js'
// get shering options data
export const findSharingTags = (org_id, survey_assignment_id, result) => {
  db.query(
    `SELECT 
    (
    SELECT COUNT(*)  AS show_coach_group_report FROM survey_assignment_tag sat
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sat.survey_assignment_id
    LEFT JOIN tag t ON t.tag_id = sat.tag_id
    WHERE t.tag_type IN ('coach_group_report')
    AND sat.org_id = ?
    AND sat.survey_assignment_id = ? 
    ) AS show_coach_group_report,
    #for each item in array do for hr_report, if 1 exist show the hr_group
    (SELECT COUNT(*)  AS show_hr_report FROM survey_assignment_tag sat
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sat.survey_assignment_id
    LEFT JOIN tag t ON t.tag_id = sat.tag_id
    WHERE t.tag_type IN ('hr_report')
    AND sat.org_id = ?
    AND sat.survey_assignment_id = ? )
    AS show_hr_report,
    #for each item in array do for hr_report, if 1 do not show coach sharing
    (SELECT COUNT(*)  AS do_not_show_coach_sharing FROM survey_assignment_tag sat
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sat.survey_assignment_id
    LEFT JOIN tag t ON t.tag_id = sat.tag_id
    WHERE t.tag_type IN ('disable_coach_sharing')
    AND sat.org_id = ?
    AND sat.survey_assignment_id = ? )
    AS do_not_show_coach_sharing`,
    [
      org_id,
      survey_assignment_id,
      org_id,
      survey_assignment_id,
      org_id,
      survey_assignment_id,
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

export const insertSurveyAssignmentTag = (data, result) => {
  db.query(
    'INSERT INTO survey_assignment_tag (survey_assignment_id, tag_id, org_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, NOW(), 1, NOW(), 1)',
    [
      data.survey_assignment_id,
      data.tag_id,
      data.org_id,
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

//Remove tag function in Admin Dashboard
export const deleteTagBySurveyAssignmentId = (survey_assignment_id, tag_id, result) => {
  let query1 = `DELETE FROM survey_assignment_tag WHERE survey_assignment_id IN (${survey_assignment_id}) AND tag_id IN(${tag_id})`
  db.query(query1, [], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
