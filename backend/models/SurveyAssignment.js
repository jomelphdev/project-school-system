import db from "../config/database.js";
import axios, * as others from 'axios';

// Get Survey Templates by Organization
export const postSurveyAssignment = (data, result) => {
  // console.log(data)
  if (!data.survey_template_id) {
    result({ success: false, type: 'error', message: 'Please select a template' }, null)
  }
  else if (data.deadline_initial && data.deadline_final) {
    if (isNaN(data.program_id) && isNaN(data.iteration_id)) {
      db.query(`
        INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, NOW(), 1, NOW(), 1); INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, (SELECT MAX(program_id) FROM program), NOW(), 1, NOW(), 1); INSERT INTO survey_assignment (org_id, suborg_id, survey_template_id, survey_template_association_id, program_id, iteration_id, stream_id, group_id, launch_date, survey_reminder_date, initial_deadline_date, final_deadline_date, coach_report_start_date, coach_report_end_date, participant_report_start_date, created_at, created_by, modified_at, modified_by, ind_id, recipient_email, recommended_number_of_nominations, max_number_of_nominations, report_eligible_number_of_respondents) VALUES (?,?,?,?,(SELECT MAX(program_id) FROM program),(SELECT MAX(iteration_id) FROM iteration),?,?,?,?,?,?, ?,?,?, NOW(), ?, NOW(), ?, ?, ?, ?, ?, ?)`,
        [
          data.program_id,
          data.org_id,
          data.suborg_id,
          data.iteration_id,
          data.org_id,
          data.suborg_id,
          data.org_id, data.suborg_id ? data.suborg_id.toString() : 0, data.survey_template_id, data.survey_template_association_id,
          data.stream_id ? data.stream_id.toString() : 0,
          data.group_id ? data.group_id.toString() : 0, data.launch ? data.launch : null, data.reminder ? data.reminder : null,
          data.deadline_initial, data.deadline_final,
          data.coach_report_start ? data.coach_report_start : null, data.coach_report_end ? data.coach_report_end : null,
          data.participant_report_start ? data.participant_report_start : null,
          data.logged_in_user, data.logged_in_user,
          data.ind_id,
          data.recipient_email,
          data.recommended_number_of_nominations,
          data.max_number_of_nominations,
          data.report_eligible_number_of_respondents
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            result(err, null);
          }
          else {
            result(null, { success: true, type: 'success', message: 'The survey was successfully attached to this user' });
            console.log(results);
          }
        });
    } else if (!isNaN(data.program_id) && isNaN(data.iteration_id)) {
      db.query(`
        INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, NOW(), 1, NOW(), 1); INSERT INTO survey_assignment (org_id, suborg_id, survey_template_id, survey_template_association_id, program_id, iteration_id, stream_id, group_id, launch_date, survey_reminder_date, initial_deadline_date, final_deadline_date, coach_report_start_date, coach_report_end_date, participant_report_start_date, created_at, created_by, modified_at, modified_by, ind_id, recipient_email, recommended_number_of_nominations, max_number_of_nominations, report_eligible_number_of_respondents) VALUES (?,?,?,?,?,(SELECT MAX(iteration_id) FROM iteration),?,?,?,?,?,?,?,?,?, NOW(), ?, NOW(), ?, ?, ?, ?, ?, ?)`,
        [
          data.iteration_id,
          data.org_id,
          data.suborg_id,
          data.program_id,
          data.org_id, data.suborg_id ? data.suborg_id.toString() : 0, data.survey_template_id, data.survey_template_association_id,
          data.program_id ? data.program_id.toString() : 0, data.stream_id ? data.stream_id.toString() : 0,
          data.group_id ? data.group_id.toString() : 0, data.launch ? data.launch : null, data.reminder ? data.reminder : null,
          data.deadline_initial, data.deadline_final,
          data.coach_report_start ? data.coach_report_start : null, data.coach_report_end ? data.coach_report_end : null,
          data.participant_report_start ? data.participant_report_start : null,
          data.logged_in_user, data.logged_in_user,
          data.ind_id,
          data.recipient_email,
          data.recommended_number_of_nominations,
          data.max_number_of_nominations,
          data.report_eligible_number_of_respondents
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            result(err, null);
          }
          else {
            result(null, { success: true, type: 'success', message: 'The survey was successfully attached to this user' });
            console.log(results);
          }
        });
    } else if (isNaN(data.program_id)) {
      db.query(`
        INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, NOW(), 1, NOW(), 1); INSERT INTO survey_assignment (org_id, suborg_id, survey_template_id, survey_template_association_id, program_id, iteration_id, stream_id, group_id, launch_date, survey_reminder_date, initial_deadline_date, final_deadline_date, coach_report_start_date, coach_report_end_date, participant_report_start_date, created_at, created_by, modified_at, modified_by, ind_id, recipient_email, recommended_number_of_nominations, max_number_of_nominations, report_eligible_number_of_respondents) VALUES (?,?,?,?,(SELECT MAX(program_id) FROM program),?,?,?,?,?,?,?, ?,?,?, NOW(), ?, NOW(), ?, ?, ?, ?, ?, ?)`,
        [
          data.program_id,
          data.org_id,
          data.suborg_id,
          data.org_id, data.suborg_id ? data.suborg_id.toString() : 0, data.survey_template_id, data.survey_template_association_id,
          data.iteration_id ? data.iteration_id.toString() : 0, data.stream_id ? data.stream_id.toString() : 0,
          data.group_id ? data.group_id.toString() : 0, data.launch ? data.launch : null, data.reminder ? data.reminder : null,
          data.deadline_initial, data.deadline_final,
          data.coach_report_start ? data.coach_report_start : null, data.coach_report_end ? data.coach_report_end : null,
          data.participant_report_start ? data.participant_report_start : null,
          data.logged_in_user, data.logged_in_user,
          data.ind_id,
          data.recipient_email,
          data.recommended_number_of_nominations,
          data.max_number_of_nominations,
          data.report_eligible_number_of_respondents
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            result(err, null);
          }
          else {
            result(null, { success: true, type: 'success', message: 'The survey was successfully attached to this user' });
            console.log(results);
          }
        });
    } else {
      db.query(`
            INSERT INTO survey_assignment (org_id, suborg_id, survey_template_id, survey_template_association_id, program_id, iteration_id, stream_id, group_id, launch_date, survey_reminder_date, initial_deadline_date, final_deadline_date, coach_report_start_date, coach_report_end_date, participant_report_start_date, created_at, created_by, modified_at, modified_by, ind_id, recipient_email, recommended_number_of_nominations, max_number_of_nominations, report_eligible_number_of_respondents) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, ?,?,?, NOW(), ?, NOW(), ?, ?, ?, ?, ?, ?)`,
        [
          data.org_id, data.suborg_id ? data.suborg_id.toString() : 0, data.survey_template_id, data.survey_template_association_id,
          data.program_id ? data.program_id.toString() : 0, data.iteration_id ? data.iteration_id.toString() : 0, data.stream_id ? data.stream_id.toString() : 0,
          data.group_id ? data.group_id.toString() : 0, data.launch ? data.launch : null, data.reminder ? data.reminder : null,
          data.deadline_initial, data.deadline_final,
          data.coach_report_start ? data.coach_report_start : null, data.coach_report_end ? data.coach_report_end : null,
          data.participant_report_start ? data.participant_report_start : null,
          data.logged_in_user, data.logged_in_user,
          data.ind_id,
          data.recipient_email,
          data.recommended_number_of_nominations,
          data.max_number_of_nominations,
          data.report_eligible_number_of_respondents
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            result(err, null);
          }
          else {
            result(null, { success: true, type: 'success', message: 'The survey was successfully attached to this user' });
            console.log(results);
          }
        });
    }
  }
  else {
    result({ type: 'error', message: 'Please ensure deadline initial and deadline final are set' }, null);
  }
}

//? Get All Survey Assignments
export const getAllSurveyAssignments = (orgId, result) => {
  db.query(
    `
            SELECT sa.survey_assignment_id, sa.recipient_email, sa.nominee_salutation, sa.nominee_message, p.program_name, o.org_name, it.iteration_name, b.website_url, b.website_sender_email, b.website_terms_url, b.website_privacy_url, b.website_contact_email, 
            sa.initial_deadline_date AS survey_close_date, DATEDIFF(sa.initial_deadline_date, CURRENT_TIMESTAMP())  AS days_until_survey_close_date, st.survey_template_name, st.survey_description, s.suborg_name, CONCAT (i.first_name, " ", i.last_name) AS user_full_name, i2.first_name AS survey_subject_first_name, CONCAT (i2.first_name, " ", i2.last_name)  AS survey_subject_full_name
            FROM survey_assignment sa
            LEFT JOIN program p ON p.program_id = sa.program_id
            LEFT JOIN org o ON o.org_id = sa.org_id
            LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
            LEFT JOIN brand b ON b.org_id = o.org_id
            LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
            LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id
            LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
            LEFT JOIN individual i ON i.ind_id = sa.ind_id
            LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
            WHERE sa.org_id = ${orgId}
            GROUP BY sa.survey_assignment_id
        `,
    (err, results2) => {
      if (err) return result(err, null)
      result(null, results2)
    }
  )
};

// Get Single Survey Assignment by survey_assignment_id
export const findSingleSurveyAssignmentById = (id, result) => {
  db.query(
    `   
            SELECT rt.report_template_name, sa.survey_assignment_id, sa.submitted_status, sa.recipient_email, sa.nominee_salutation, sa.nominee_message, sa.participant_report_start_date, p.program_name, o.org_name, it.iteration_name, b.header_bg_color, b.brand_path, b.website_url, b.website_sender_email, b.website_terms_url, b.website_privacy_url, b.website_contact_email, 
            sa.initial_deadline_date AS survey_close_date, DATEDIFF(sa.initial_deadline_date, CURRENT_TIMESTAMP())  AS days_until_survey_close_date, st.survey_template_name, st.survey_description, s.suborg_name, i.ind_id, i.email, CONCAT (i.first_name, " ", i.last_name) AS user_full_name, i2.first_name AS survey_subject_first_name, CONCAT (i2.first_name, " ", i2.last_name)  AS survey_subject_full_name, i.first_name AS first_name
            FROM survey_assignment sa
            LEFT JOIN program p ON p.program_id = sa.program_id
            LEFT JOIN org o ON o.org_id = sa.org_id
            LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
            LEFT JOIN brand b ON b.org_id = o.org_id AND b.suborg_id = sa.suborg_id
            LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
            LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id
            LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
            LEFT JOIN individual i ON i.ind_id = sa.ind_id
            LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
            LEFT JOIN report_template rt ON rt.survey_template_id = sa.survey_template_id
            WHERE sa.survey_assignment_id = ?
            AND rt.is_coach_report = 0 AND rt.is_group_report = 0 AND rt.is_faculty_report = 0
        `,
    [id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results[0])
    }
  );
};

// Get Surveys by ind_id
export const findSingleSurveyAssignmentByIndID = (ind_id, result) => {
  db.query(
    `
        SELECT i.time_zone ,st.survey_file, st.survey_template_name, st.survey_type, sa.final_deadline_date, sa.recipient_email, 
        sa.survey_assignment_id, sa.dropped_status, sa.ind_id, sa.org_id, sa.suborg_id, sa.submitted_status, sa.survey_template_id, 
        sa.survey_template_association_id, sa.program_id, sa.iteration_id, sa.stream_id, sa.group_id, sa.is_nomination,
        IF(
          (DATE_FORMAT(sa.final_deadline_date, '%Y-%m-%d %H:%i') 
          <= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT',
                  i.time_zone
                  ) , '%Y-%m-%d %H:%i' 
                  )
          ), "no", "yes"
        ) AS isShow
        FROM survey_assignment sa
        LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
        LEFT JOIN survey_template_association sta ON sta.survey_template_association_id = sa.survey_template_association_id
        LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
        WHERE
        sa.ind_id = ${ind_id}
        AND sa.launch_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone) , '%Y-%m-%d %H:%i' )
        `,
    [ind_id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  );
};
// Get Survey Active Reminders by  survey_assignment_id
export const findSingleSurveyActiveRemindersById = (id, result) => {
  db.query(
    `   
            SELECT GROUP_CONCAT(active_reminder_message) AS survey_active_reminders FROM 
            (
                SELECT IF ((survey_assignment.submitted_status = 0) , "submit your survey", NULL) AS active_reminder_message FROM survey_assignment WHERE survey_assignment_id = ?
                UNION
                SELECT IF ((survey_assignment.number_of_respondents < survey_assignment.report_eligible_number_of_respondents), "make more nominations",NULL) AS active_reminder_message FROM survey_assignment WHERE survey_assignment_id = ?
                UNION
                SELECT IF ((survey_assignment.number_of_nominated_primary_supervisor < 1), "nominate a supervisor",NULL) AS active_reminder_message FROM survey_assignment WHERE survey_assignment_id = ?
            ) AS temp_active_reminder 
            WHERE active_reminder_message IS NOT NULL;
        `,
    [id, id, id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results[0])
    }
  );
};

// Update stmt_answer when survey submit
export const updateStatementAnswerByAssignmentId = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET submitted_status = ?, submission_date = NOW(), stmt_answer = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.submitted_status, data.stmt_answer, data.modified_by, id],
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

export const updateSurveyAssignmentDates = (id, data, result) => {

  if (data.launch != '' && data.launch != undefined && data.launch != null) {
    let query1 = `UPDATE survey_assignment SET launch_date = '${data.launch}', modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else if (data.deadline_final != '' && data.deadline_final != undefined && data.deadline_final != null) {
    let query1 = `UPDATE survey_assignment SET final_deadline_date = '${data.deadline_final}', modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else if (data.coach_report_start != '' && data.coach_report_start != undefined && data.coach_report_start != null) {
    let query1 = `UPDATE survey_assignment SET coach_report_start_date = '${data.coach_report_start}', coach_report_end_date = NULL, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else if (data.coach_report_end != '' && data.coach_report_end != undefined && data.coach_report_end != null) {
    let query1 = `UPDATE survey_assignment SET coach_report_end_date = '${data.coach_report_end}', modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else if (data.participant_report_start != '' && data.participant_report_start != undefined && data.participant_report_start != null) {
    let query1 = `UPDATE survey_assignment SET participant_report_start_date = '${data.participant_report_start}', modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else if (data.reminder != '' && data.reminder != undefined && data.reminder != null) {
    let query1 = `UPDATE survey_assignment SET survey_reminder_date = '${data.reminder}', modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else if (data.initial_deadline != '' && data.initial_deadline != undefined && data.initial_deadline != null) {
    let query1 = `UPDATE survey_assignment SET initial_deadline_date = '${data.initial_deadline}', modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
    // console.log(query1);
    db.query(query1,
      [],
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
}
// Update coach_access_granted
export const updateCoachAccessGrantedByAssignmentId = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET coach_access_granted = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.coach_access_granted, data.modified_by, id],
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
// Update coach_group_access_granted
export const updateCoachGroupAccessGrantedByAssignmentId = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET coach_group_access_granted = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.coach_group_access_granted, data.modified_by, id],
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
// Update hr_access_granted
export const updateHrAccessGrantedByAssignmentId = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET hr_access_granted = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.hr_access_granted, data.modified_by, id],
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
// Update number_of_respondents
export const updateNumberOfRespondentsByAssignmentId = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET number_of_respondents = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.number_of_respondents, data.modified_by, id],
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
// get one data by survey_assignment_id
export const viewSurveyAssignmentById = (id, result) => {
  db.query(
    'SELECT * FROM survey_assignment WHERE survey_assignment_id = ?',
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

//get data to use in making a nomination
export const getAllNominationsData = (survey_assignment_id, result) => {
  db.query(
    `
          SELECT  sa.submitted_status, sa.initial_deadline_date, sa.final_deadline_date, sa.survey_reminder_date, sa.launch_date, sa.coach_access_granted,sa.coach_group_access_granted,sa.hr_access_granted,sa.recommended_number_of_nominations,sa.number_of_nominations,sa.max_number_of_nominations,
          CONCAT(sa.number_of_nominations, "/", sa.max_number_of_nominations) AS nominations_made,
          CONCAT(sa.number_of_respondents, "/", sa.number_of_nominations) AS respondents,
          IF (sa.number_of_respondents >= report_eligible_number_of_respondents, "yes", "no") AS enough_respondents_eligible_for_report
          FROM survey_assignment sa
          WHERE sa.survey_assignment_id = ?
        `,
    [survey_assignment_id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
};

export const getAllNomineeData = (survey_assignment_id, result) => {
  db.query(
    `
      SELECT i.ind_id, CONCAT(i.first_name, ' ', i.last_name) AS full_name, r.relationship_name, sa.created_at, IF(i.logged_in=1,'Yes','No') AS logged_in, i.email, sa.survey_assignment_id,
      IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation,
      CONCAT(i.first_name, ' ', i.last_name)) AS full_name, sa.final_deadline_date,
      CASE WHEN sa.submission_date IS NULL THEN 'Not submitted' WHEN sa.submission_date IS NOT NULL THEN sa.submission_date END AS date_submitted,
      CASE WHEN  sa.dropped_status = 1 THEN 'Dropped'
      WHEN ( (sa.launch_date > NOW()) OR (sa.launch_date IS NULL)  ) THEN 'Not yet launched' 
      WHEN ( (sa.submitted_status = 0) AND  ( (it.final_deadline_date > NOW()) OR (it.final_deadline_date IS NULL) ) AND  (COUNT(sr.survey_result_id)  = 0 )  ) THEN 'Ready to start' 
      WHEN ( (sa.submitted_status = 0) AND  ( (it.final_deadline_date > NOW()) OR (it.final_deadline_date IS NULL)  ) AND  (COUNT(sr.survey_result_id)  > 0 )  ) THEN 'Started' 
      WHEN ( (it.final_deadline_date < sa.submission_date)  OR ((sa.submitted_status = 0)  AND  (it.final_deadline_date < NOW()) ) ) THEN 'Closed (unsubmitted)' 
      WHEN ( (sa.submitted_status = 1) AND  (it.final_deadline_date >= sa.submission_date)  AND  (sa.expiry_date <= NOW())  ) THEN 'Report expired' 
      WHEN ( (sa.submitted_status = 1) AND  (it.final_deadline_date >= sa.submission_date)  AND ((sa.participant_report_start_date > NOW()) OR (sa.participant_report_start_date IS NULL)  )   
      AND ((sa.coach_report_start_date > NOW()) OR (sa.coach_report_start_date IS NULL)  )  ) THEN 'Closed (submitted)' 
      WHEN ( (sa.submitted_status = 1) AND  (it.final_deadline_date >= sa.submission_date)  AND (sa.participant_report_start_date <= NOW()) AND (sa.coach_report_start_date <= NOW())) THEN 'Report available' 
      WHEN ( (sa.submitted_status = 1) AND  (it.final_deadline_date >= sa.submission_date)  AND (sa.participant_report_start_date <= NOW()) ) THEN 'Report available for participant' 
      WHEN ( (sa.submitted_status = 1) AND  (it.final_deadline_date >= sa.submission_date)  AND (sa.coach_report_start_date <= NOW()) ) THEN 'Report available for coach' ELSE 'Check survey assignment dates' END AS STATUS 
      FROM survey_assignment sa 
      LEFT JOIN individual i ON i.ind_id = sa.ind_id
      LEFT JOIN relationship r ON r.relationship_id = sa.relationship_id
      LEFT JOIN survey_result sr ON sr.survey_assignment_id = sa.survey_assignment_id
      LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
      WHERE sa.parent_survey_assignment_id = ?
      GROUP BY sa.survey_assignment_id
      `,
    [survey_assignment_id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
};

// Update shared report with coach
export const updateSharedReports = (id, data, result) => {
  db.query(
    `UPDATE survey_assignment SET ${data.whoAccess} = ? WHERE survey_assignment_id = ?`,
    [data.accessValue, id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

//get nominees by parent_survey_assignment_id
export const getAllSurveyAssignmentNominees = (id, result) => {
  db.query(
    `
            SELECT sa.survey_assignment_id, sa.nominee_salutation, sa.recipient_email,  sa.email_check, sa.relationship_id, r.relationship_name, sa.created_at AS nominated_on 
            FROM survey_assignment sa
            JOIN relationship r ON r.relationship_id = sa.relationship_id
            WHERE parent_survey_assignment_id = ?
        `,
    [id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
};
//Get survey_assigment by org_id and suborg_id
export const getSurveyAssignmentByOrg = (org_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
            
          
      WHERE sa.org_id = ${org_id}
        GROUP BY sa.survey_assignment_id
    `,
    [org_id],
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

export const getSurveyAssignmentByOrgAndSuborg = (org_id, suborg_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}

          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
              
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      GROUP BY sa.survey_assignment_id
    `,
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

export const getSurveyAssignmentByOrgAndSuborgAndProgram = (org_id, suborg_id, program_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.program_id = ${program_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
            AND s4.program_id = ${program_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
               
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.program_id LIKE ${program_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, program_id],
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

export const getSurveyAssignmentByOrgAndSuborgAndProgramAndIteration = (org_id, suborg_id, program_id, iteration_id, result) => {
  db.query(
  `SELECT 
        sa.survey_assignment_id,
        DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
        DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
        DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
        DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
        DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
        DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
        DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
        sa.submitted_status,
        IF(sa.undropped=1,'Yes','No') AS undropped,
        sa.undropped_date,
        i.ind_id,
        icoach.email AS coach_email,
        #COUNT(sr.survey_result_id) AS survey_answers , 
        sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
        IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
        CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
        GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
        st.survey_template_name, 
        DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
        DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
        DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
        s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
        IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
        CASE
          WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
          WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
          ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
        END AS nominations_submitted,
        
        CASE 
        WHEN  sa.dropped_status = 1 
        THEN 'Dropped'
        
        WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
        THEN 'Not yet launched' 
        
        WHEN ( (sa.submitted_status = 0) 
        AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        OR (sa.final_deadline_date IS NULL) ) 
        AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
        AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
        THEN 'Ready to start' 
        
        WHEN ( (sa.submitted_status = 0) 
        AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        OR (sa.final_deadline_date IS NULL)  ) 
        AND ( ( SELECT COUNT(*) FROM survey_result sr 
        WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
        THEN 'Started' 
        
      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
      AND (sa.coach_report_start_date IS NULL) ) 
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
      AND (sa.coach_report_start_date IS NULL) )
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
      
      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
      AND it.never_run_iteration = 1
      AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
      AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
        
        WHEN ((sa.final_deadline_date < sa.submission_date)  
        OR ((sa.submitted_status = 0)  
        AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
        THEN 'Closed (unsubmitted)' 
        
        WHEN ((sa.submitted_status = 1) 
        AND  (sa.final_deadline_date >= sa.submission_date)
        AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
        THEN 'Report expired' 
        
      WHEN ( (sa.submitted_status = 1) 
      AND  (sa.final_deadline_date >= sa.submission_date) 
      AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

      WHEN ( (sa.submitted_status = 1) 
      AND  (sa.final_deadline_date >= sa.submission_date) 
      AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
      AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date IS NULL  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
      AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
      AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
      AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
        
      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
      AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
      AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
      AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
      AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
        DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
        DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

        WHEN ( (sa.submitted_status = 1) 
        AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
        THEN 'Report available for participant' 
        
      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
      AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
      AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
        
      WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
      AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
      AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
      AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
        DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
        DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
          
          ELSE 'Check survey assignment dates' END AS STATUS
          
    FROM survey_assignment sa 
    LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
    LEFT JOIN tag t ON t.tag_id = sat.tag_id 
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
    LEFT JOIN individual i ON i.ind_id = sa.ind_id 
    LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
    LEFT JOIN stream s ON s.stream_id = sa.stream_id 
    LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
    LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

      LEFT JOIN (
      SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
      FROM survey_assignment_tag sat2
      LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
      HAVING tag_type LIKE '%immediate_report_release%'
      )
      sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.program_id = ${program_id}
            AND s3.iteration_id = ${iteration_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
            AND s4.program_id = ${program_id}
            AND s4.iteration_id = ${iteration_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
              
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.program_id LIKE ${program_id}
      AND sa.iteration_id LIKE ${iteration_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, program_id, iteration_id],
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

export const getSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream = (org_id, suborg_id, program_id, iteration_id, stream_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.program_id = ${program_id}
            AND s3.iteration_id = ${iteration_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
            AND s4.program_id = ${program_id}
            AND s4.iteration_id = ${iteration_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
             
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.program_id LIKE ${program_id}
      AND sa.iteration_id LIKE ${iteration_id}
      AND sa.stream_id LIKE ${stream_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, program_id, iteration_id, stream_id],
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

export const getSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate = (org_id, suborg_id, program_id, iteration_id, stream_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.program_id = ${program_id}
            AND s3.iteration_id = ${iteration_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
            AND s4.program_id = ${program_id}
            AND s4.iteration_id = ${iteration_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
          
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.program_id LIKE ${program_id}
      AND sa.iteration_id LIKE ${iteration_id}
      AND sa.stream_id LIKE ${stream_id}
      AND sa.survey_template_id LIKE ${template_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, program_id, iteration_id, stream_id, template_id],
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

export const getSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate = (org_id, suborg_id, program_id, iteration_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.program_id = ${program_id}
            AND s3.iteration_id = ${iteration_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
            AND s4.program_id = ${program_id}
            AND s4.iteration_id = ${iteration_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.program_id LIKE ${program_id}
      AND sa.iteration_id LIKE ${iteration_id}
      AND sa.survey_template_id LIKE ${template_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, program_id, iteration_id, template_id],
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

export const getSurveyAssignmentByOrgSuborgProgramSurveyTemplate = (org_id, suborg_id, program_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.program_id = ${program_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
            AND s4.program_id = ${program_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
           
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.program_id LIKE ${program_id}
      AND sa.survey_template_id LIKE ${template_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, program_id, template_id],
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

export const getSurveyAssignmentByOrgSuborgSurveyTemplate = (org_id, suborg_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
    DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
    DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
    DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
    DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
    DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
    DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
    DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
    sa.submitted_status,
    IF(sa.undropped=1,'Yes','No') AS undropped,
    sa.undropped_date,
    i.ind_id,
    icoach.email AS coach_email,
    #COUNT(sr.survey_result_id) AS survey_answers , 
    sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
    IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
    CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
    GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , 
    st.survey_template_name, 
    DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
    DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
    s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
    IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
    CASE
      WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
      WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
      ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
    END AS nominations_submitted,
    
    CASE 
    WHEN  sa.dropped_status = 1 
    THEN 'Dropped'
    
    WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
    THEN 'Not yet launched' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL) ) 
    AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
    AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
    THEN 'Ready to start' 
    
    WHEN ( (sa.submitted_status = 0) 
    AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    OR (sa.final_deadline_date IS NULL)  ) 
    AND ( ( SELECT COUNT(*) FROM survey_result sr 
    WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
    THEN 'Started' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'


  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'
  
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date))
  AND it.never_run_iteration = 1
  AND sat3.tag_type LIKE 'immediate_report_release' THEN 'Report Released Immediately'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
    WHEN ((sa.final_deadline_date < sa.submission_date)  
    OR ((sa.submitted_status = 0)  
    AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
    THEN 'Closed (unsubmitted)' 
    
    WHEN ((sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)
    AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
    THEN 'Report expired' 
    
  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) 
  AND  (sa.final_deadline_date >= sa.submission_date) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
  AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date IS NULL  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'

  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
  AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
  AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
  AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
  AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 

    WHEN ( (sa.submitted_status = 1) 
    AND  (sa.final_deadline_date >= sa.submission_date)  
    AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
    AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
    THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
    
  WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
  AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
  AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
      
      ELSE 'Check survey assignment dates' END AS STATUS
      
FROM survey_assignment sa 
LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
LEFT JOIN tag t ON t.tag_id = sat.tag_id 
LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
LEFT JOIN individual i ON i.ind_id = sa.ind_id 
LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
LEFT JOIN stream s ON s.stream_id = sa.stream_id 
LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id

  LEFT JOIN (
  SELECT sat2.survey_assignment_id, sat2.tag_id, t2.tag_type
  FROM survey_assignment_tag sat2
  LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id
  HAVING tag_type LIKE '%immediate_report_release%'
  )
  sat3 ON sat3.survey_assignment_id = sa.survey_assignment_id 

            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.org_id = ${org_id}
            AND s3.suborg_id = ${suborg_id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.org_id = ${org_id}
            AND s4.suborg_id = ${suborg_id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
                
          
      WHERE sa.org_id = ${org_id}
      AND sa.suborg_id LIKE ${suborg_id}
      AND sa.survey_template_id LIKE ${template_id}
      GROUP BY sa.survey_assignment_id
    `,
    [org_id, suborg_id, template_id],
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

export const getSurveyAssignmentBySurveyAssignmentId = (id, result) => {
  db.query(
    `SELECT 
            sa.survey_assignment_id,
            DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
            DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
            DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
            DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
            DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
            DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
            DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
            sa.submitted_status,
            IF(sa.undropped=1,'Yes','No') AS undropped,
            sa.undropped_date,
            i.ind_id,
            icoach.email AS coach_email,
            #COUNT(sr.survey_result_id) AS survey_answers , 
            sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
            IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
            CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
            GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
            DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
            DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
            DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
            s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
            IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
            CASE
              WHEN sa4.total_respondent IS NULL AND sa3.respondent_count IS NULL THEN '0/0'
              WHEN sa3.respondent_count IS NULL THEN CONCAT( 0 , "/", sa4.total_respondent)
              ELSE CONCAT(  (sa3.respondent_count ) , "/", sa4.total_respondent)
            END AS nominations_submitted,
            
            CASE 
            WHEN  sa.dropped_status = 1 
            THEN 'Dropped'
            
            WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
            THEN 'Not yet launched' 
            
            WHEN ( (sa.submitted_status = 0) 
            AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
            OR (sa.final_deadline_date IS NULL) ) 
            AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
            AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
            THEN 'Ready to start' 
            
            WHEN ( (sa.submitted_status = 0) 
            AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
            OR (sa.final_deadline_date IS NULL)  ) 
            AND ( ( SELECT COUNT(*) FROM survey_result sr 
            WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
            THEN 'Started' 
            
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
  
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
  
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
          AND (sa.coach_report_start_date IS NULL) ) 
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
  
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
  
  
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
          AND (sa.coach_report_start_date IS NULL) )
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
          AND it.never_run_iteration = 1
          AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
  
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
          AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
            
            WHEN ((sa.final_deadline_date < sa.submission_date)  
            OR ((sa.submitted_status = 0)  
            AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
            THEN 'Closed (unsubmitted)' 
            
            WHEN ((sa.submitted_status = 1) 
            AND  (sa.final_deadline_date >= sa.submission_date)
            AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
            THEN 'Report expired' 
             
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
          AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date IS NULL  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
      
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
          AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
          AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
          AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
             
           WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
          AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
            DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
            DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
      
            WHEN ( (sa.submitted_status = 1) 
            AND  (sa.final_deadline_date >= sa.submission_date)  
            AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
            AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
             THEN 'Report available for participant' 
             
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
             
          WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
          AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
            DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
            DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
              
              ELSE 'Check survey assignment dates' END AS STATUS
            FROM survey_assignment sa 
            LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
            LEFT JOIN tag t ON t.tag_id = sat.tag_id 
            LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
            LEFT JOIN individual i ON i.ind_id = sa.ind_id 
            LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
            LEFT JOIN stream s ON s.stream_id = sa.stream_id 
            LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
            LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
      
            LEFT JOIN (
          SELECT 
            s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
          FROM survey_assignment s3
          WHERE s3.survey_assignment_id = ${id}
            AND s3.submitted_status = 1
          GROUP BY s3.parent_survey_assignment_id
        ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id
        
          LEFT JOIN (
          SELECT 
            s4.parent_survey_assignment_id,
            COUNT(s4.parent_survey_assignment_id) AS total_respondent
          FROM survey_assignment s4
          WHERE s4.survey_assignment_id = ${id}
          GROUP BY s4.parent_survey_assignment_id
        ) sa4 ON sa4.parent_survey_assignment_id = sa.survey_assignment_id 
               
          
      WHERE sa.survey_assignment_id = ${id}
      GROUP BY sa.survey_assignment_id
  `,
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

// update email and recipient_email in individual and survey assignment
export const updateEmails = (id, data, result) => {
  if(data.isUpdateEmailExist == "yes") {
    // update only survey assignment
    db.query(
      "SELECT ind_id, email FROM `individual` WHERE email = ? LIMIT 1",
      [data.email],
      (err, results) => {
        if (err) return result(err, null)
        db.query(
          `UPDATE survey_assignment SET ind_id = ?, recipient_email = ?, modified_by = ?, modified_at = NOW() WHERE survey_assignment_id = ?`,
          [results[0].ind_id, results[0].email, data.login_ind_id, id],
          (err, results2) => {
            if (err) return result(err, null)
            result(null, results2)
          }
        )
      }
    )
  }
  else {
    //update individual and survey assignment
    db.query(
      "SELECT ind_id FROM `survey_assignment` WHERE survey_assignment_id = ? LIMIT 1",
      [id],
      (err, results) => {
        if (err) return result(err, null)
        db.query(
          `UPDATE individual SET email = ?, modified_by = ?, modified_at = NOW() WHERE ind_id = ${results[0].ind_id}`,
          [data.email, data.login_ind_id],
          (err, results2) => {
            if (err) return result(err, null)
            db.query(
              `UPDATE survey_assignment SET recipient_email = ?, modified_by = ?, modified_at = NOW() WHERE survey_assignment_id = ?`,
              [data.email, data.login_ind_id, id],
              (err, results3) => {
                if (err) return result(err, null)
                result(null, results3)
              }
            )
          }
        )
      }
    )
  }
}

// Update Group Name
export const updateChangeGroupName = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  db.query(query1,
    [],
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

export const updateCoachPermission = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET coach_access_granted = ?  WHERE survey_assignment_id = ?',
    [data.coach_access_granted, id],
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

// Update Stream Name
export const updateChangeStreamName = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  db.query(query1,
    [],
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

// Update Iteration Name
export const updateChangeIterationName = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET iteration_id = ${data.iteration_id}, stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  db.query(query1,
    [],
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

// Update Program Name
export const updateChangeProgramName = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET program_id = ${data.program_id}, iteration_id = ${data.iteration_id}, stream_id = ${data.iteration_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  db.query(query1,
    [],
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

// Update SubOrg Name
export const updateChangeSubOrgName = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET suborg_id = ${data.suborg_id}, program_id = ${data.program_id}, iteration_id = ${data.iteration_id}, stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  db.query(query1,
    [],
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

// Update Drop and Undrop
export const updateDropandUndrop = (id, data, result) => {
  let query1;

  if (data.dropped_status != 0) {
    //drop
    query1 = `UPDATE survey_assignment SET dropped_status = ${data.dropped_status}, dropped_date = NOW(), undropped_date = ${data.undropped_date}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  } else {
    //undrop
    query1 = `UPDATE survey_assignment SET dropped_status = ${data.dropped_status}, dropped_date = ${data.dropped_date}, undropped = ${data.undropped},
    undropped_date = NOW(), modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  }

  db.query(query1,
    [],
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

// Un-Submit a Survey
export const unSubmitSurvey = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET submitted_status = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.submitted_status, data.modified_by, id],
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

// Update Coach Name
export const updateCoachName = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`;
  db.query(query1,
    [],
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

// update relationship_id in survey assignment
export const updatesRelationshipId = (id, data, result) => {
  // update survey assignment

  if (data.old_relationship_id == 1 && data.new_relationship_id != 1) {
    // decrement the number_of_nominated_primary_supervisor
    db.query(
      "UPDATE survey_assignment SET number_of_nominated_primary_supervisor = (number_of_nominated_primary_supervisor - 1 ) WHERE survey_assignment_id = ?",
      [data.parent_survey_assignment_id],
      (err) => {
        if (err) return result(err, null)
      }
    );
  }
  if (data.old_relationship_id != 1 && data.new_relationship_id == 1) {
    // increment the number_of_nominated_primary_supervisor
    db.query(
      "UPDATE survey_assignment SET number_of_nominated_primary_supervisor = (number_of_nominated_primary_supervisor + 1 ) WHERE survey_assignment_id = ?",
      [data.parent_survey_assignment_id],
      (err) => {
        if (err) return result(err, null)
      }
    );
  }
  db.query(
    `UPDATE survey_assignment SET relationship_id = ? WHERE survey_assignment_id = ?`,
    [data.new_relationship_id, id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

// Get Single Survey Assignment by survey_assignment_id
export const findSingleSurveyAssignmentTagById = (sharedreport, id, result) => {
  db.query(
    `   
        SELECT t.tag_id, t.tag_type, t.org_id, sa.survey_assignment_id, sa.org_id, sat.sa_tag_id, sat.tag_id
        FROM tag t
        JOIN survey_assignment sa ON t.org_id = sa.org_id
        JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id
        WHERE t.tag_type = ? AND sat.survey_assignment_id = ? AND t.tag_id = sat.tag_id;
      `,
    [sharedreport, id],
    (err, results) => {
      if (err) return result(err, null)

      if (!results[0]) return result('no_result')
      result(null, results[0])
    }
  );
};

// Get Single Email - check email if already exist
export const findSingleSurveyAssignmentByEmailAndParentID = (id, email, result) => {
  db.query(
    'SELECT * FROM survey_assignment where parent_survey_assignment_id = ? AND recipient_email = ?',
    [id, email],
    (err, results) => {
      if (err) return result(err, null)

      if (!results[0])
        return result({ message: 'notexist', payload: 'Email and parent survey assignment id not yet exist' })
      result({
        data: results[0],
        message: 'exist',
        payload: 'You cannot nominate same email in the same survey.',
      })
    }
  )
}

export const getParticipantNameBySurveyAssignmentId = (id, result) => {
  db.query(
    `SELECT IF(CONCAT(ind.first_name, ' ', ind.last_name) IS NULL, nominee_salutation,
    CONCAT(ind.first_name, ' ', ind.last_name)) AS full_name
    FROM survey_assignment sa
    LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
    WHERE sa.survey_assignment_id = ?`,
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

// Update survey_opened
export const updateSurveyOpenedStatus = (survey_assignment_id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET survey_opened = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.survey_opened, data.modified_by, survey_assignment_id],
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

// Update survey_complete
export const updateCompleteSurveyStatus = (survey_assignment_id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET complete_survey = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.complete_survey, data.modified_by, survey_assignment_id],
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
// Update no_duplicates
export const updateNoDuplicateStatus = (survey_assignment_id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET no_duplicates = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ?',
    [data.no_duplicates, data.modified_by, survey_assignment_id],
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
// Update complete_calclations
export const updateCompleteCalculationStatus = (data, result) => {
  let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  let s1_ind_id = data[0]['ind_id'];
  db.query(
    `UPDATE survey_assignment SET complete_calculations = 1, modified_at = NOW(), modified_by = ${s1_ind_id} WHERE survey_assignment_id = ${s1_survey_assignment_id}`,
    [],
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

//update nominee suborg by parent survey assignment id
export const updateNomineeSuborgByParentSurveyAssignmentId = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET suborg_id = ${data.suborg_id}, program_id = ${data.program_id}, iteration_id = ${data.iteration_id}, stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE parent_survey_assignment_id IN (${id})`;
  // console.log(query1);
  db.query(query1,
    [],
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

//update nominee program by parent survey assignment id
export const updateNomineeProgramByParentSurveyAssignmentId = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET program_id = ${data.program_id}, iteration_id = ${data.iteration_id}, stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE parent_survey_assignment_id IN (${id})`;
  // console.log(query1);
  db.query(query1,
    [],
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

//update nominee iteration by parent survey assignment id
export const updateNomineeIterationByParentSurveyAssignmentId = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET iteration_id = ${data.iteration_id}, stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE parent_survey_assignment_id IN (${id})`;
  // console.log(query1);
  db.query(query1,
    [],
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

//update nominee stream by parent survey assignment id
export const updateNomineeStreamByParentSurveyAssignmentId = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET stream_id = ${data.stream_id}, group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE parent_survey_assignment_id IN (${id})`;
  // console.log(query1);
  db.query(query1,
    [],
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

//update nominee group by parent survey assignment id
export const updateNomineeGroupByParentSurveyAssignmentId = (id, data, result) => {
  let query1 = `UPDATE survey_assignment SET group_id = ${data.group_id}, coach_id = ${data.coach_id}, modified_at = NOW(), modified_by = ${data.modified_by} WHERE parent_survey_assignment_id IN (${id})`;
  // console.log(query1);
  db.query(query1,
    [],
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

export const getAllSurveyStatisticsByIterationAndTemplate = (iteration_id, template_id, nominee_template_id, result) => {

  let query1 =
    `
    SELECT
    (SELECT COUNT(*)
     FROM(
       SELECT * FROM
         survey_assignment sa
         WHERE sa.is_nomination = 0 
         AND sa.iteration_id = ${iteration_id}
         AND sa.survey_template_id = ${template_id}
         GROUP BY sa.ind_id
         ) AS pc) AS participants_count,
   (SELECT COUNT(*)
     FROM(
       SELECT * FROM
         survey_assignment sa
         WHERE sa.is_nomination = 1 
         AND sa.iteration_id = ${iteration_id}
         AND sa.survey_template_id = ${nominee_template_id}
         GROUP BY sa.ind_id
         ) AS nc) AS nominees_count,
   (SELECT COUNT(*)
     FROM(
       SELECT * FROM
         survey_assignment sa
         WHERE sa.is_nomination = 0
         AND sa.iteration_id = ${iteration_id}
         AND sa.survey_template_id = ${template_id}
         AND sa.submitted_status = 1 
         GROUP BY sa.ind_id
         ) AS ps) AS participants_submitted,
   (SELECT COUNT(*)
     FROM(
       SELECT * FROM
         survey_assignment sa
         WHERE sa.is_nomination = 1
         AND sa.iteration_id = ${iteration_id}
         AND sa.survey_template_id = ${nominee_template_id}
         AND submitted_status = 1 
         GROUP BY sa.ind_id
         ) AS ns) AS nominees_submitted,
   (SELECT COUNT(*)
     FROM(
       SELECT sa.* FROM
         survey_assignment sa
         LEFT JOIN individual i ON i.ind_id = sa.ind_id
         WHERE sa.is_nomination = 0
         AND sa.iteration_id = ${iteration_id}
         AND sa.survey_template_id = ${template_id}
         AND i.logged_in = 1 
         GROUP BY sa.ind_id
         ) AS pr) AS participants_registered,
   (SELECT COUNT(*)
     FROM(
       SELECT sa.* FROM
         survey_assignment sa
         LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
         WHERE sa.is_nomination = 0
         AND sa.iteration_id = ${iteration_id}
         AND sa.survey_template_id = ${template_id}
         AND sa.submitted_status = 1 
         AND it.final_deadline_date >= sa.submission_date
         AND sa.participant_report_start_date <= NOW()
         AND sa.dropped_status = 0
         GROUP BY sa.ind_id
         ) AS pe) AS participants_eligible
      `

  db.query(query1,
    [],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    }
  )

};



export const getAllSurveyStatisticsByIteration = (iteration_id, result) => {

  let query1 =
    `
  SELECT
  (SELECT COUNT(*)
  FROM(
    SELECT * FROM
      survey_assignment sa
      WHERE sa.is_nomination = 0 
      AND sa.iteration_id = ${iteration_id}
      GROUP BY sa.ind_id
      ) AS pc) AS participants_count,
  (SELECT COUNT(*)
  FROM(
    SELECT * FROM
      survey_assignment sa
      WHERE sa.is_nomination = 1 
      AND sa.iteration_id = ${iteration_id}
      GROUP BY sa.ind_id
      ) AS nc) AS nominees_count,
  (SELECT COUNT(*)
  FROM(
    SELECT * FROM
      survey_assignment sa
      WHERE sa.is_nomination = 0
      AND sa.iteration_id = ${iteration_id}
      AND sa.submitted_status = 1 
      GROUP BY sa.ind_id
      ) AS ps) AS participants_submitted,
  (SELECT COUNT(*)
  FROM(
    SELECT * FROM
      survey_assignment sa
      WHERE sa.is_nomination = 1
      AND sa.iteration_id = ${iteration_id}
      AND submitted_status = 1 
      GROUP BY sa.ind_id
      ) AS ns) AS nominees_submitted,
  (SELECT COUNT(*)
  FROM(
    SELECT sa.* FROM
      survey_assignment sa
      LEFT JOIN individual i ON i.ind_id = sa.ind_id
      WHERE sa.is_nomination = 0
      AND sa.iteration_id = ${iteration_id}
      AND i.logged_in = 1 
      GROUP BY sa.ind_id
      ) AS pr) AS participants_registered,
  (SELECT COUNT(*)
  FROM(
    SELECT sa.* FROM
      survey_assignment sa
      LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
      WHERE sa.is_nomination = 0
      AND sa.iteration_id = ${iteration_id}
      AND sa.submitted_status = 1 
      AND it.final_deadline_date >= sa.submission_date
      AND sa.participant_report_start_date <= NOW()
      AND sa.dropped_status = 0
      GROUP BY sa.ind_id
      ) AS pe) AS participants_eligible
  `

  db.query(query1,
    [],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    }
  )
};


export const getClientSurveyAssignmentByOrg = (org_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
      
    WHERE sa.org_id = ${org_id}
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
`,
    [org_id],
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

export const getClientSurveyAssignmentByOrgAndSuborg = (org_id, suborg_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ?
    AND sa.suborg_id LIKE ? 
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
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

export const getClientSurveyAssignmentByOrgAndSuborgAndProgram = (org_id, suborg_id, program_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.program_id = ${program_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ?
    AND sa.suborg_id LIKE ? 
    AND sa.program_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, program_id],
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

export const getClientSurveyAssignmentByOrgAndSuborgAndProgramAndIteration = (org_id, suborg_id, program_id, iteration_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.program_id = ${program_id}
          AND s3.iteration_id = ${iteration_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ?
    AND sa.suborg_id LIKE ? 
    AND sa.program_id LIKE ?
    AND sa.iteration_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, program_id, iteration_id],
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

export const getClientSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream = (org_id, suborg_id, program_id, iteration_id, stream_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.program_id = ${program_id}
          AND s3.iteration_id = ${iteration_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ? 
    AND sa.suborg_id LIKE ?
    AND sa.program_id LIKE ?
    AND sa.iteration_id LIKE ?
    AND sa.stream_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, program_id, iteration_id, stream_id],
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

export const getClientSurveyAssignmentByOrgSuborgSurveyTemplate = (org_id, suborg_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ? 
    AND sa.suborg_id LIKE ?
    AND sa.survey_template_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, template_id],
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

export const getClientSurveyAssignmentByOrgSuborgProgramSurveyTemplate = (org_id, suborg_id, program_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.program_id = ${program_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ? 
    AND sa.suborg_id LIKE ?
    AND sa.program_id LIKE ?
    AND sa.survey_template_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, program_id, template_id],
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

export const getClientSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate = (org_id, suborg_id, program_id, iteration_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.program_id = ${program_id}
          AND s3.iteration_id = ${iteration_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ? 
    AND sa.suborg_id LIKE ?
    AND sa.program_id LIKE ?
    AND sa.iteration_id LIKE ?
    AND sa.survey_template_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, program_id, iteration_id, template_id],
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

export const getClientSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate = (org_id, suborg_id, program_id, iteration_id, stream_id, template_id, result) => {
  db.query(
    `SELECT 
    sa.survey_assignment_id,
          DATE_FORMAT(it.final_deadline_date,'%d-%b-%Y %H:%i') AS it_final_deadline_date, 
          DATE_FORMAT(sa.final_deadline_date,'%d-%b-%Y %H:%i') AS final_deadline_date, 
          DATE_FORMAT(sa.expiry_date,'%d-%b-%Y %H:%i') AS expiry_date, 
          DATE_FORMAT(sa.participant_report_start_date,'%d-%b-%Y %H:%i') AS participant_report_start_date, 
          DATE_FORMAT(sa.coach_report_start_date,'%d-%b-%Y %H:%i') AS coach_report_start_date, 
          DATE_FORMAT(sa.coach_report_end_date,'%d-%b-%Y %H:%i') AS coach_report_end_date,
          DATE_FORMAT(sa.submission_date,'%d-%b-%Y %H:%i') AS submission_date, 
          sa.submitted_status,
          IF(sa.undropped=1,'Yes','No') AS undropped,
          sa.undropped_date,
          i.ind_id,
          icoach.email AS coach_email,
          #COUNT(sr.survey_result_id) AS survey_answers , 
          sa.survey_assignment_id, IF(i.logged_in=1,'Yes','No') AS logged_in, 
          IF(CONCAT(i.first_name, ' ', i.last_name) IS NULL, nominee_salutation, 
          CONCAT(i.first_name, ' ', i.last_name)) AS full_name, 
          GROUP_CONCAT(t.tag_name SEPARATOR', ') AS tag_names , st.survey_template_name, 
          DATE_FORMAT(sa.launch_date,'%d-%b-%Y %H:%i') AS launch_date, 
          DATE_FORMAT(sa.survey_reminder_date,'%d-%b-%Y %H:%i') AS survey_reminder_date, 
          DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS initial_deadline_date, 
          s.stream_name, g.group_name, IF(sa.coach_access_granted=1,'Yes','No') AS coach_access_granted, 
          IF(sa.coach_group_access_granted=1,'Yes','No') AS coach_group_access_granted, 
          IF(CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations) IS NULL, '0/0',
          CONCAT(  (sa3.respondent_count ) , "/", sa.number_of_nominations)) AS nominations_submitted,
          
          CASE 
          WHEN  sa.dropped_status = 1 
          THEN 'Dropped'
          
          WHEN ( (sa.launch_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) OR (sa.launch_date IS NULL)  ) 
          THEN 'Not yet launched' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL) ) 
          AND  ( (SELECT COUNT(*) FROM survey_result sr WHERE sr.survey_assignment_id = sa.survey_assignment_id  ) = 0  ) 
          AND ( DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) >= sa.launch_date)  ) 
          THEN 'Ready to start' 
          
          WHEN ( (sa.submitted_status = 0) 
          AND  ( (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          OR (sa.final_deadline_date IS NULL)  ) 
          AND ( ( SELECT COUNT(*) FROM survey_result sr 
          WHERE sr.survey_assignment_id = sa.survey_assignment_id) > 0 )  ) 
          THEN 'Started' 
          
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) 
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'


        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) )
        AND it.never_run_iteration = 1
        AND t.tag_type = 'immediate_report_release' THEN 'Report Released Immediately'

        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Open (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Open (submitted)'
          
          WHEN ((sa.final_deadline_date < sa.submission_date)  
          OR ((sa.submitted_status = 0)  
          AND  (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) ) 
          THEN 'Closed (unsubmitted)' 
          
          WHEN ((sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)
          AND  (sa.expiry_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))  ) 
          THEN 'Report expired' 
           
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) <= 2, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 

          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) IS NULL, (sa3.respondent_count ) IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL ) AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)' 
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) ) 
        AND (sa.coach_report_start_date IS NULL) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date IS NULL  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
    
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date) 
        AND (sa.final_deadline_date < DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ) )
        AND (sa.participant_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )  ) 
        AND (sa.coach_report_start_date >= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) ) THEN 'Closed (submitted)'
           
         WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL) 
        AND IF(sa.coach_report_end_date IS NULL, sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available' 
    
          WHEN ( (sa.submitted_status = 1) 
          AND  (sa.final_deadline_date >= sa.submission_date)  
          AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
          AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) 
           THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.participant_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2, (sa3.respondent_count ) IS NULL)) THEN 'Report available for participant' 
           
        WHEN ( (sa.submitted_status = 1) AND  (sa.final_deadline_date >= sa.submission_date)  
        AND (sa.coach_report_start_date <= DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' )) 
        AND IF (st.survey_type=2, (sa3.respondent_count ) > 2,(sa3.respondent_count ) IS NULL)
        AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
          DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', it.time_zone  ) , '%Y-%m-%d %H:%i' ))) THEN 'Report available for coach' 
            
            ELSE 'Check survey assignment dates' END AS STATUS
          FROM survey_assignment sa 
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id 
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
          LEFT JOIN individual i ON i.ind_id = sa.ind_id 
          LEFT JOIN individual icoach ON icoach.ind_id = sa.coach_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id 
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id 
          LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    
          LEFT JOIN (
        SELECT 
          s3.parent_survey_assignment_id,
          COUNT(s3.parent_survey_assignment_id) AS respondent_count
        FROM survey_assignment s3
        WHERE s3.org_id = ${org_id}
          AND s3.suborg_id = ${suborg_id}
          AND s3.program_id = ${program_id}
          AND s3.iteration_id = ${iteration_id}
          AND s3.submitted_status = 1
        GROUP BY s3.parent_survey_assignment_id
      ) sa3 ON sa3.parent_survey_assignment_id = sa.survey_assignment_id     
    WHERE sa.org_id = ? 
    AND sa.suborg_id LIKE ?
    AND sa.program_id LIKE ?
    AND sa.iteration_id LIKE ?
    AND sa.stream_id LIKE ?
    AND sa.survey_template_id LIKE ?
    AND sa.is_nomination = 0
    GROUP BY sa.survey_assignment_id
  `,
    [org_id, suborg_id, program_id, iteration_id, stream_id, template_id],
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

// for creating CSV
export const getDataforCreatingCSVM = (iteration_id, survey_template_id, result) => {
    db.query(
      'SELECT p.program_name, i.iteration_name, s.stream_name, g.group_name, st.survey_template_name, sa.survey_template_id, sa.ind_id, sa.recipient_email, sa.stmt_answer, sa.submitted_status, sa.submission_date FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id LEFT JOIN stream s ON s.stream_id = sa.program_id LEFT JOIN `group` g ON g.group_id = sa.group_id WHERE sa.survey_template_id = 23 AND sa.submitted_status = 1 AND sa.stmt_answer != "" #ORDER BY ind_id ASC',
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
};

// Getting railroad_status
export const getRailroadStatusM = (survey_assignment_id, result) => {
  db.query(
    `
      SELECT railroad_status FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}
    `,
    [],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    }
  )
};
// Update railroad_status
export const updateRailroadStatusM = (data, survey_assignment_id, result) => {
  db.query(
    `
      UPDATE survey_assignment SET railroad_status = ? WHERE survey_assignment_id = ${survey_assignment_id}
    `,
    [data.railroad_status],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        console.log(results)
        result(null, results)
      }
    }
  )
};


export const updateRecipentEmailByIndId = (id, data, result) => {
  db.query(
    'UPDATE survey_assignment SET recipient_email = ? WHERE ind_id = ?',
    [data.email, id],
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

export const getEarliestFinalDeadlineDateByIterationIdM = (iteration_id, result) => {
  db.query(
    `SELECT MIN(DATE_FORMAT(final_deadline_date,'%Y-%m-%d %H:%i')) AS earliest_final_deadline, iteration_id FROM survey_assignment WHERE iteration_id = ${iteration_id}`,
    [],
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


export const updateIsPdfAvailableBySurveyAssignmentIdM = (id, data, result) => {
  db.query(
    `UPDATE survey_assignment SET is_pdf_available = 1, modified_at = NOW(), modified_by = ${data.modified_by} WHERE survey_assignment_id IN (${id})`,
    [],
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


// make pdf available
export const updateSurveyPdfAvailableM = (survey_assignment_id, result) => {
  db.query(
    'UPDATE survey_assignment SET is_pdf_available = 1 WHERE survey_assignment_id = ?',
    [survey_assignment_id],
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