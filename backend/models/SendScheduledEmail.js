import db from "../config/database.js";
import axios, * as others from 'axios';


// Get timezone list with offset 2022-10-11
export const getTimeZoneM = (result) => {
  db.query("SELECT tn.timezone_name, TIMEDIFF(CONVERT_TZ(NOW(), 'GMT', tn.timezone_name), CONVERT_TZ(NOW(), 'GMT', '+00:00')) AS timezone_offset FROM timezone_name_amazon tn", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};



// Get single survey assingnment submitted
export const getSingleSurveyAssignmentSubmittedM = (id, result) => {
  db.query("SELECT * FROM survey_assignment WHERE survey_assignment_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
};


// Get list of survey assignments by participant report start date passed
export const getScheduledParticipantReportM = (id, result) => {  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, 
  i.time_zone, st.survey_type
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  WHERE sa.dropped_status = 0 AND sa.submitted_status = 1 AND sa.is_participant_report_processed = 1 AND
  DATE_FORMAT(sa.${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone ) , '%Y-%m-%d %H:%i' )  
  `;
  console.log(query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);    

    }
  });
};

//When iteration column never_run_iteration = 1 
export const getScheduledParticipantReportByNeverRunIterationM = (id, result) => {  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
  LEFT JOIN tag t ON t.tag_id = sat.tag_id 
  WHERE sa.survey_assignment_id = ${id}
  AND i.never_run_iteration = 1
  AND t.tag_type = 'immediate_report_release'
  `;
  console.log(query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};


// 2022-09-20 Get list of survey assignments by coach report start date passed
export const getScheduledCoachReportM = (id, result) => {  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone, sa.coach_id, ind.email, concat(ind.first_name, " ", ind.last_name) as full_name
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind on ind.ind_id = sa.coach_id
  WHERE sa.dropped_status = 0 AND sa.submitted_status = 1 AND sa.is_participant_report_processed = 1 AND
  DATE_FORMAT(sa.${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )  
  `;
  console.log(query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};


//Coach Group Report Email sending
export const getScheduledCoachGroupReportM = (id, result) => {  
  let query1 = `SELECT DISTINCT sa.org_id, sa.suborg_id, sa.program_id, i.iteration_name, i.time_zone, sa.coach_id, ind.email, concat(ind.first_name, " ", ind.last_name) as full_name
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind on ind.ind_id = sa.coach_id
  WHERE sa.dropped_status = 0 AND sa.submitted_status = 1 AND sa.is_participant_report_processed = 1 AND
  DATE_FORMAT(sa.${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )  
  `;
  console.log(query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};

//SELECT DISTINCT sa.org_id, sa.suborg_id, sa.program_id, i.iteration_name, i.time_zone, sa.coach_id, ind.email, CONCAT(ind.first_name, " ", ind.last_name) AS full_name
  //FROM survey_assignment sa 
  //LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  //LEFT JOIN individual ind ON ind.ind_id = sa.coach_id
  //WHERE sa.dropped_status = 0 AND sa.submitted_status = 1 AND sa.is_participant_report_processed = 1 AND
   //sa.coach_report_start_date = DATE_FORMAT('2023-08-12 14:00:00', '%Y-%m-%d %H:%i')


// Get list of survey assignments by launch date
export const getScheduledSurveysM = (id, result) => {
  //console.log("send_"+id);
  
  //2022-09-19 ticket Ticket # 29148 added condition where sa.submitted_status <> 1 
  //"I would be expecting that reminder only goes to Participants and Nominees that HAVE NOT completed task/not submitted"
  //2022-09-21 REMINDER NOT LAUNCH REMOVED sa.submitted_status <> 1 AND
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  WHERE sa.dropped_status <> 1 AND 
  DATE_FORMAT(sa.${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
  AND sa.launch_date = sa.${id}
  `;

  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};


// Get subject and body from email template
export const getETSubjectBodyM = (id, result) => {
  //console.log("send_"+id);
  //let date_today = '2022-05-31 20:14:00';
  let query1 = `SELECT subject, email_body FROM email_template WHERE email_template_id = ?`;
  db.query(query1, 
  [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      let new_subject = results[0]['subject'];
      new_subject = new_subject.replace("$SURVEY_PROGRAM_NAME$", "Survey1")
      //results[0]=results[0]['subject'];
      results[0]=new_subject;
      result(null, results[0]);
      
      let arr1 = results;
      console.log(arr1[0]);
      

    }
  });
};


// Get token values
export const getTokenValuesM = (id, result) => {
  
    let query2 =
    `
    SELECT sa.survey_assignment_id, CONCAT (i.first_name, " ", i.last_name )  AS user_full_name, i.email, i.logged_in, sa.recipient_email, sa2.nominee_salutation, sa2.nominee_message, sa.participant_report_start_date, p.program_name, o.org_name, 
    b.website_url, b.website_sender_email, b.website_terms_url, b.website_privacy_url, b.website_contact_email, b.header_bg_color, b.brand_path,
    DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i') AS survey_initial_close_date, st.survey_template_name, st.survey_description, s.suborg_name, DATEDIFF(sa.final_deadline_date, NOW() ) AS days_until_survey_close_date, 
    IF ( (sa.is_nomination = 1), CONCAT(i2.first_name, " ", i2.last_name), CONCAT (i.first_name, " ", i.last_name ) ) AS survey_subject_full_name, 
    IF ((sa.is_nomination = 1), i2.first_name, i.first_name) AS survey_subject_first_name, it.iteration_name, sa.ind_id,
    sam.survey_active_reminders
    FROM survey_assignment sa
    LEFT JOIN program p ON p.program_id = sa.program_id
    LEFT JOIN org o ON o.org_id = sa.org_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
    LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id
    LEFT JOIN brand b ON b.brand_id = (SELECT brand_id FROM brand b1 WHERE b1.org_id = sa.org_id AND b1.suborg_id = sa.suborg_id)
    LEFT JOIN individual i ON i.ind_id = sa.ind_id
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    LEFT JOIN iteration it ON it.iteration_id = sa.iteration_id
    LEFT JOIN 
    (
      SELECT survey_assignment_id, GROUP_CONCAT(survey_message SEPARATOR' ') AS survey_active_reminders FROM 
      (
        SELECT ${id} AS survey_assignment_id, "<ul>" AS survey_message
        UNION
        SELECT 
        sa.survey_assignment_id,
        IF ((sa.submitted_status = 0) , "<li>Submit the survey</li>", NULL) AS survey_message
        FROM survey_assignment  sa 
        LEFT JOIN survey_template st ON  st.survey_template_id = sa.survey_template_id 
        LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id 
        LEFT JOIN program p ON p.program_id = sa.program_id
        LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
        WHERE survey_assignment_id = ${id} 
        UNION 
        SELECT 
        sa.survey_assignment_id,
        IF ((sa.number_of_nominations < sa.recommended_number_of_nominations ), "<li>Nominate more people to be eligible for a report</li>", NULL) AS survey_message
        FROM survey_assignment sa 
        LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
        LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id 
        LEFT JOIN program p ON p.program_id = sa.program_id
        LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
        WHERE st.survey_type  = 2 
        AND survey_assignment_id = ${id} AND sa.is_nomination = 0
        UNION 
        SELECT
        sa.survey_assignment_id,
        IF ((sa.number_of_nominated_primary_supervisor < 1 ), "<li>Nominate at least one primary supervisor</li>",NULL) AS survey_message
        FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
        LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id 
        LEFT JOIN program p ON p.program_id = sa.program_id
        LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
        WHERE st.survey_type  = 2 
        AND survey_assignment_id = ${id} AND sa.is_nomination = 0
        UNION 
        SELECT ${id} AS survey_assignment_id, "</ul>" AS survey_message
      )
      AS survey_active_message 
      WHERE survey_message IS NOT NULL
    ) AS sam ON sam.survey_assignment_id = sa.survey_assignment_id
  WHERE sa.survey_assignment_id = ${id}
    `;
  db.query(query2, 
  [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {  
      result(null, results[0]);
      
    }
  });
};


//vty
//? Get Email Template given template_type, org/suborg/program_id
export const getEmailTemplateByTemplateTypeM = (template_type,org_id,suborg_id,program_id, result) => {
  console.log(template_type);
  console.log(org_id);
  console.log(suborg_id);
  console.log(program_id);
  let query1 =
    `
      SELECT et.email_template_id, et.template_type, et.subject, et.email_body FROM email_template et,
      (
        SELECT
          IF(
              (	SELECT email_template_id FROM email_template et
            WHERE et.template_type = '${template_type}'
            AND et.org_id = ${org_id} 
            AND et.suborg_id = ${suborg_id} 
            AND et.program_id = ${program_id}
              )  IS NULL, 
            (
                IF(	
              
              (	SELECT email_template_id FROM email_template et
                  WHERE et.template_type = '${template_type}'
                  AND et.org_id = ${org_id} 
                  AND et.suborg_id = ${suborg_id} 
                  AND et.program_id = 0
              ) IS NULL,
                  (
                SELECT email_template_id FROM email_template et
                WHERE et.template_type = '${template_type}'
                AND et.org_id = ${org_id} 
                AND et.suborg_id = 0 
                AND et.program_id = 0
                  
                  ),
                  (
                SELECT email_template_id FROM email_template et
                WHERE et.template_type = '${template_type}'
                AND et.org_id = ${org_id} 
                AND et.suborg_id = ${suborg_id} 
                AND et.program_id = 0
                  )
              )
              
            ), 
            (
                SELECT email_template_id FROM email_template et
                WHERE et.template_type = '${template_type}'
                AND et.org_id = ${org_id} 
                AND et.suborg_id = ${suborg_id} 
                AND et.program_id = ${program_id}
            )
          ) AS email_template_id
      ) AS etid
      WHERE etid.email_template_id = et.email_template_id
    `;

  var vty1 = db.query(
      query1,
       [],
      (err, results) => {
          if (err) return result(err, null)
          result(null, results[0])
          console.log(results[0]);
      }
  );
  //console.log(vty1);
};



// Get list of survey assignments by launch date
export const processScheduledEmailM = (id, result) => {
  //console.log("send_"+id);
  //let date_today = '2022-05-31 20:14:00';
  // let query1 = `SELECT survey_assignment_id FROM survey_assignment sa WHERE DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT('2022-05-31 20:14:00', '%Y-%m-%d %H:%i' ) AND ${"send_"+id} = 1`;
  // db.query(query1, 
  // [], (err, results) => {
  //   if (err) {
  //     console.log(err);
  //     result(err, null);
  //   } else {
  //     result(null, results);
      
  //     let arr1 = results;
  //     console.log(arr1);
      

  //   }
  // });

  
  // var data = '';
  // var config = {
  //   method: 'get',
  //   url: 'https://localhost:5000/process-scheduled-email/launch_date',
  //   headers: { 
  //     'token': 'cCW7PW2CRotxuALrBuMob5lXgVhY4xo'
  //   },
  //   data : data
  // };

  // axios.post('https://localhost:5000/process-scheduled-email/launch_date')
	// .then(function(response) 
	// 	{
	// 		console.log(response.data);
	// 	})
	// .catch(function(error) 
	// 	{
	// 		console.log("Error get scheduled surveys for emailing: ", error);
	// 	});



  
};


// Get list of survey assignments FOR EMAIL REMINDER 
//2022-09-21 use query from getScheduledSurveys instead of from getScheduledSurveysM1 email reminder that is for different purpose and will run every minute if used as this cron is set per minute. 
//2022-09-20 added suppress_email_sending check
// ${id} passed is the survey_reminder_date
//2022-12-27 added AND sa.survey_reminder_date = ${id}
//2022-12-27 added AND sa.initial_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )

export const getScheduledSurveysM1 = (id, result) => {  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
  WHERE sa.submitted_status <> 1 AND
  #( (sa.submitted_status <> 1) OR st.)AND
  ind.suppress_email_sending <> 1 AND
  sa.dropped_status <> 1 AND 
  DATE_FORMAT(sa.${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ) 
  AND sa.survey_reminder_date = sa.${id}
  AND sa.initial_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )

  UNION 
  
  SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
  WHERE sa.submitted_status = 1 AND
  st.survey_type = 2 AND #360 survey ticket 29149
  sa.is_nomination = 0 AND #participant ticket 29149
  ( (sa.number_of_nominations < 7) OR (sa.number_of_nominated_primary_supervisor < 1) )AND #ticket 29149
  ind.suppress_email_sending <> 1 AND
  sa.dropped_status <> 1 AND 
  DATE_FORMAT(sa.${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ) 
  AND sa.survey_reminder_date = sa.${id}
  AND sa.initial_deadline_date > DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
  `;
  console.log("query1: " + query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};




// Get list of survey assignments not yet submitted, not yet past initial deadline date for auto-email every 5 3 2 1 EMAIL REMINDER 2022-09-20 suppress_email_sending check
// ${id} passed is the initial deadline date, it will only get those with initial deadline date greater than now
// 2022-12-27 added ticket 29437 union condition
export const getScheduledSurveysM2 = (id, result) => {  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone, sa.initial_deadline_date, DATEDIFF (DATE_FORMAT(initial_deadline_date, '%Y-%m-%d %H:%i'),  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i' ) )  AS num_days_before_initial_deadline
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.submitted_status <> 1 AND
  ind.suppress_email_sending <> 1 AND
  sa.dropped_status <> 1 AND 
  DATE_FORMAT(sa.launch_date, '%Y-%m-%d %H:%i') < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i') AND
  DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  > DATE_FORMAT
  ( CONVERT_TZ ( NOW(),'GMT', i.time_zone )  , '%Y-%m-%d %H:%i'  )
  AND 
  ( 
   DATEDIFF
   (
    DATE_FORMAT(${id}, '%Y-%m-%d %H:%i'),  
    DATE_FORMAT ( CONVERT_TZ (  NOW(),'GMT', i.time_zone ) , '%Y-%m-%d %H:%i' )
   )  IN (5,3,2,1)
  ) 
  UNION
  SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone, sa.initial_deadline_date, DATEDIFF (DATE_FORMAT(initial_deadline_date, '%Y-%m-%d %H:%i'),  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i' ) )  AS num_days_before_initial_deadline
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id 
  WHERE sa.submitted_status = 1 AND #TICKET 29437
  ind.suppress_email_sending <> 1 AND
  sa.dropped_status <> 1 AND 
  DATE_FORMAT(sa.launch_date, '%Y-%m-%d %H:%i') < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i') AND
  st.survey_type = 2 AND #360 survey ticket 29437
  sa.is_nomination = 0 AND #participant ticket 29437
  ( (sa.number_of_nominations < 7) OR (sa.number_of_nominated_primary_supervisor < 1) )AND #ticket 29149
  DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  > DATE_FORMAT
  ( CONVERT_TZ ( NOW(),'GMT', i.time_zone )  , '%Y-%m-%d %H:%i'  )
  AND 
  ( 
   DATEDIFF
   (
    DATE_FORMAT(${id}, '%Y-%m-%d %H:%i'),  
    DATE_FORMAT ( CONVERT_TZ (  NOW(),'GMT', i.time_zone ) , '%Y-%m-%d %H:%i' )
   )  IN (5,3,2,1)
  ) 
  `;
  console.log("query1: " + query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};



// Get list of survey assignments not yet submitted, not yet past initial deadline date for auto-email  not in 5 3 2 1 DAYS before initial deadline date (to be cron every sat)
// ${id} passed is the initial deadline date, it will only get those with initial deadline date greater than now
// 5,4,3,2,1,0 0 is for day of deadline do not send since only have a few minutes to complete as per prior discussion
// 2022-12-27 added ticket 29437 union condition
export const getScheduledSurveysM3 = (id, result) => {

  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone, sa.initial_deadline_date, DATEDIFF (DATE_FORMAT(initial_deadline_date, '%Y-%m-%d %H:%i'),  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i' ) )  AS num_days_before_initial_deadline
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.submitted_status <> 1 AND
  ind.suppress_email_sending <> 1 AND
  sa.dropped_status <> 1 AND 
  DATE_FORMAT(sa.launch_date, '%Y-%m-%d %H:%i') <   DATE_FORMAT(
    CONVERT_TZ
     (
      NOW(),'GMT', i.time_zone	    
     ) 
    , '%Y-%m-%d %H:%i' 
    )
  AND
  DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  > DATE_FORMAT
  (
  CONVERT_TZ
   (
    NOW(),'GMT', i.time_zone
   ) 
  , '%Y-%m-%d %H:%i' 
  )
AND 
( 
  DATEDIFF
  (
    DATE_FORMAT(${id}, '%Y-%m-%d %H:%i'),  
    DATE_FORMAT( CONVERT_TZ  ( NOW(),'GMT', i.time_zone )  , '%Y-%m-%d %H:%i' ) ) NOT IN (5,3,2,1,0)
) 
UNION
SELECT sa.survey_assignment_id, sa.ind_id, sa.org_id, sa.suborg_id, sa.program_id, sa.is_nomination, i.iteration_name, i.time_zone, sa.initial_deadline_date, DATEDIFF (DATE_FORMAT(initial_deadline_date, '%Y-%m-%d %H:%i'),  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i' ) )  AS num_days_before_initial_deadline
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  #360 survey ticket 29437
  WHERE sa.submitted_status = 1 AND #TICKET 29437
  ind.suppress_email_sending <> 1 AND
  sa.dropped_status <> 1 AND 
  st.survey_type = 2 AND #360 survey ticket 29437
  sa.is_nomination = 0 AND #participant ticket 29437
  ( (sa.number_of_nominations < 7) OR (sa.number_of_nominated_primary_supervisor < 1) )AND #ticket 29149
  DATE_FORMAT(sa.launch_date, '%Y-%m-%d %H:%i') <   DATE_FORMAT(
    CONVERT_TZ
     (
      NOW(),'GMT', i.time_zone	    
     ) 
    , '%Y-%m-%d %H:%i' 
    )
  AND
  DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  > DATE_FORMAT
  (
  CONVERT_TZ
   (
    NOW(),'GMT', i.time_zone
   ) 
  , '%Y-%m-%d %H:%i' 
  )
AND 
( 
  DATEDIFF
  (
    DATE_FORMAT(${id}, '%Y-%m-%d %H:%i'),  
    DATE_FORMAT( CONVERT_TZ  ( NOW(),'GMT', i.time_zone )  , '%Y-%m-%d %H:%i' ) ) NOT IN (5,3,2,1,0)
) 

  `;
  console.log("query1: " + query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
      
      let arr1 = results;
      console.log(arr1);
      

    }
  });
};