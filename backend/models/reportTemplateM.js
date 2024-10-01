import db from '../config/database.js'

// Create New Report Template
export const createReportTemplateM = (data, result) => {

    const query = `
        INSERT INTO report_template(report_template_name, report_description, report_file, survey_template_id, tag_type, is_coach_report, is_group_report, is_faculty_report, created_by, modified_by)
        VALUES(?,?,?,?,?,?,?,?,?,?)
    `
    db.query(
        query,
        [data.report_template_name, data.report_description, data.report_file, data.survey_template_id, data.tag_type, data.is_coach_report, data.is_group_report, data.is_faculty_report, data.created_by, data.modified_by],
        (err, results) => {
            if (err) return result(err, null)
            result(null, results)
        }
    )
}

// check report template name if already exist 
export const checkExistReportTemplateByNameM = (report_template_name, result) => {
    const query = 'SELECT * FROM report_template WHERE report_template_name = ? LIMIT 1'
    db.query(
        query, [report_template_name],
        (err, results) => {
            if (err) {
                result(err, null)
            }
            else {
                if(results.length == 1) {
                    result(null, {"status" : 0, "message" : "Report name already exist!", "report_template_id" : results[0].report_template_id })
                }
                else {
                    result(null, {"status" : 1, "message" : "Report name not exist", "report_template_id" : null })
                }
            }
        }
    )
}

// update report template by report template name
export const updateReportTemplateM = (data, result) => {
    const query = `
        UPDATE report_template SET report_template_name = ?, report_file = ?, modified_by = ?
        WHERE report_template_name = ?
    `
    db.query(
        query,
        [data.report_template_name, data.report_file, data.modified_by, data.orig_report_template_name],
        (err, results) => {
            if (err) return result(err, null)
            result(null, results)
        }
    )
}

// update report template by report template id
export const updateReportTemplateByIdM = (id, data, result) => {
    const query = `
        UPDATE report_template SET report_template_name = ?, report_description = ?, report_file = ?, survey_template_id = ?, tag_type = ?, is_coach_report = ?, is_group_report = ?, is_faculty_report = ?, modified_by = ?
        WHERE report_template_id = ?
    `
    db.query(
        query,
        [data.report_template_name, data.report_description, data.report_file, data.survey_template_id, data.tag_type, data.is_coach_report, data.is_group_report, data.is_faculty_report, data.modified_by, id],
        (err, results) => {
            if (err) return result(err, null)
            result(null, results)
        }
    )
}

// delete report template by report template id
export const deleteReportTemplateM = (id, result) => {
    const query = 'DELETE FROM report_template WHERE report_template_id = ?'
    db.query(
        query, [id], (err, results) => {
            if (err) return result(err, null)
            result(null, results)
        }
    )
}



export const getAllReportTemplates = (result) => {
    db.query(`SELECT 
                rt.report_template_id, 
                rt.report_template_name, 
                rt.report_description, 
                rt.report_file,
                st.survey_template_name,
                st.survey_file,
                st.survey_type,
                rt.survey_template_id,
                rt.tag_type,
                rt.is_coach_report,
                rt.is_group_report,
                rt.is_faculty_report
                FROM report_template rt
                JOIN survey_template st ON rt.survey_template_id = st.survey_template_id
                ORDER BY rt.report_template_id DESC
            `, 
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
  }