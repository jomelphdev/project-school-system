import db from '../config/database.js'

// create new survey result note
export const insertSurveyResultNote = (data, result) => {
    db.query('SELECT line_num FROM survey_result_note WHERE survey_assignment_id = ? ORDER BY survey_result_note_id DESC LIMIT 1',
        [data.survey_assignment_id],
        (err, results) => {
        if (err) return result(err, null)

        let lineNum = 1;
        if (!results[0]) lineNum = 1 
        else  lineNum = results[0].line_num + 1

        db.query(
            `INSERT INTO survey_result_note (survey_assignment_id, section_num, share_status, line_num, note_content, org_id, suborg_id, created_by, modified_by) VALUES ( ?, ?, ?, ${lineNum}, ?, ?, ?, ?, ?)`,
            [
              data.survey_assignment_id,
              data.section_num,
              data.share_status,
              data.note_content,
              data.org_id,
              data.suborg_id,
              data.created_by,
              data.modified_by,
            ],
            (err) => {
              if (err) return result(err, null)
              result(null, {status : 'success', message: 'New note has been created.'})
            }
        )
    })
}

// get survey result note by survey assignment id and section_num
export const getAllSurveyResultNoteBySurveyIdAndSectionAndResolvedStatus = (id, section_num, resolved_status, result) => {
    db.query('SELECT * FROM survey_result_note WHERE survey_assignment_id = ? AND section_num = ? AND resolved_status = ?',
      [id, section_num, resolved_status],
      (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    })
}

// Update surveyResult note
export const updateSurveyResultNoteById = (id, data, result) => {
  db.query(
    'UPDATE survey_result_note SET share_status = ?, note_content = ?, modified_by = ? WHERE survey_result_note_id = ?',
    [data.share_status, data.note_content, data.modified_by, id],
    (err) => {
      if (err) return result(err, null)
      result(null, {status : 'success', message: 'Updated Successfully.'})
    }
  )
}

// update note status to resolved by id
export const updateSurveyResultNoteResolvedStatusById = (id, result) => {
  db.query(
    'UPDATE survey_result_note SET resolved_status = 1 WHERE survey_result_note_id = ?',
    [id],
    (err) => {
      if (err) return result(err, null)
      result(null, {status : 'success', message: 'Notes has been resolved.'})
    }
  )
}