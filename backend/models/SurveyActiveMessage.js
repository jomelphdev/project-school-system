import db from "../config/database.js";


// get active messages for single survey assignment id
export const getSurveyActiveMessageById = (id, result) => {

  //2022-09-22 jhun viber removed:
  // SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,    
  //   IF ((sa.number_of_respondents  < sa.report_eligible_number_of_respondents), "Not enough nominees have submitted for you to be eligible for your report",NULL) AS survey_message,  "Info" AS survey_message_type  
  //   FROM survey_assignment sa  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
  //   LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
  //   LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
  //   LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id  
  //   WHERE st.survey_type  = 2  AND sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
  //   UNION  

  let query1 =   `SELECT * FROM (  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,
    "Status is dropped"  AS survey_message, 
    "Warning" AS survey_message_type  
    FROM survey_assignment  sa  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  
    LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.dropped_status = 1
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,
    ""  AS survey_message, 
    "" AS survey_message_type  FROM survey_assignment  sa  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  
    LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,
    IF ((sa.submitted_status = 1 AND sa.submission_date <= sa.final_deadline_date ) , IF ((sa.is_nomination = 1), "Your responses have been successfully submitted", "You have successfully submitted your self-assessment"), NULL) AS survey_message, 
	"Qualified" AS survey_message_type  FROM survey_assignment  sa  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  
    LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((sa.submitted_status = 1 AND sa.submission_date > sa.final_deadline_date) , "This survey was not submitted before the deadline", NULL) AS survey_message,  "Warning" AS survey_message_type   FROM survey_assignment sa  
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((sa.submitted_status = 0) , "You have not yet submitted this survey", NULL) AS survey_message,  "Warning" AS survey_message_type  
    FROM survey_assignment  sa  LEFT JOIN survey_template st ON  st.survey_template_id = sa.survey_template_id  
    LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  LEFT JOIN program p ON p.program_id = sa.program_id 
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((sa.number_of_nominations < sa.recommended_number_of_nominations), 
    CONCAT("Please make more nominations. We recommend at least: ", sa.recommended_number_of_nominations),NULL) AS survey_message,  "Warning" AS survey_message_type   
    FROM survey_assignment sa  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id  
    WHERE  st.survey_type  = 2  AND sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,   
    IF ((sa.number_of_nominated_primary_supervisor < 1 ), "Please nominate at least one primary supervisor",NULL) AS survey_message,  "Warning" AS survey_message_type   
    FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id  
    WHERE  st.survey_type  = 2  AND sa.survey_assignment_id = ${id} AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((sa.submitted_status = 0) , CONCAT("Deadline: ",DATE_FORMAT(sa.initial_deadline_date,'%d-%b-%Y %H:%i')), NULL) AS survey_message,  "Info" AS survey_message_type  
    FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  LEFT JOIN program p ON p.program_id = sa.program_id 
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.is_nomination = 0  AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,   
    IF ((sa.coach_access_granted = 1 AND sa.submitted_status = 1) , "You have shared your report with your coach", NULL) AS survey_message,  "Info" AS survey_message_type   
    FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE  sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,   
    IF ((sa.coach_access_granted = 0 AND sa.submitted_status = 1) , "You have not shared the report with your coach", NULL) AS survey_message,  "Info" AS survey_message_type   
    FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE  sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION  
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name,    
    IF ((sa.hr_access_granted = 1 AND sa.submitted_status = 1) , "You have shared your report with your HR", NULL) AS survey_message,  "Info" AS survey_message_type   
    FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE  sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION 
    SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((sa.coach_group_access_granted = 1 
    AND sa.submitted_status = 1) , "You have shared your report with your coach group", NULL) AS survey_message,  "Info" AS survey_message_type   
    FROM survey_assignment sa LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  
    LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sa2 ON sa2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sa2.ind_id
    WHERE sa.survey_assignment_id = ${id} AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION
     SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((a.not_eligible = 0), "You have nominated enough people to be eligible for a report if they submit their surveys",NULL) AS survey_message,  "Qualified" AS survey_message_type  FROM survey_assignment sa  
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sap2 ON sap2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sap2.ind_id  
    LEFT JOIN 
		 (SELECT 
			  ${id} AS survey_assignment_id,
			  CASE 
			  WHEN a1.count_pdie >= 2 THEN 0
			  WHEN (a1.count_psup >= 1) AND (a1.count_pdie <> 1) THEN 0
			  ELSE '1'
			  END 
			  AS not_eligible,
			  a1.count_pdie,
			  a1.count_psup
			  
			  FROM 
			  (
			  SELECT
			  (
			  SELECT COUNT(*)
			  FROM survey_assignment sa2
			  WHERE sa2.parent_survey_assignment_id = ${id}
			  AND sa2.relationship_id = 1 #primary supervisor
			  ) AS count_psup,
			  (
			  SELECT COUNT(*)
			  FROM survey_assignment sa3
			  WHERE sa3.parent_survey_assignment_id = ${id}
			  AND sa3.relationship_id IN (2,3,4,5) #all other nominees
			  ) AS count_pdie
			  ) AS a1) a
			  ON a.survey_assignment_id = sa.survey_assignment_id
    WHERE  st.survey_type  = 2  AND  sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
    UNION
     SELECT st.survey_template_name,p.program_name, iteration_name,  CONCAT(i2.first_name, " ", i2.last_name) AS subject_full_name, 
    IF ((a.not_eligible = 0), "You have nominated enough people to be eligible for a report if they submit their surveys", "Not enough nominees have submitted for you to be eligible for your report") AS survey_message,  IF ((a.not_eligible = 0), "Qualified", "Info") AS survey_message_type
     FROM survey_assignment sa  
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id  LEFT JOIN suborg s ON s.suborg_id = sa.suborg_id  
    LEFT JOIN program p ON p.program_id = sa.program_id LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id 
    LEFT JOIN survey_assignment sap2 ON sap2.survey_assignment_id = sa.parent_survey_assignment_id
    LEFT JOIN individual i2 ON i2.ind_id = sap2.ind_id  
    LEFT JOIN 
		 (SELECT 
			  ${id} AS survey_assignment_id,
			  CASE 
			  WHEN a1.count_pdie >= 2 THEN 0
			  WHEN (a1.count_psup >= 1) AND (a1.count_pdie <> 1) THEN 0
			  ELSE '1'
			  END 
			  AS not_eligible,
			  a1.count_pdie,
			  a1.count_psup
			  
			  FROM 
			  (
			  SELECT
			  (
			  SELECT COUNT(*)
			  FROM survey_assignment sa2
			  WHERE sa2.parent_survey_assignment_id = ${id}
			  AND sa2.relationship_id = 1 #primary supervisor
			  ) AS count_psup,
			  (
			  SELECT COUNT(*)
			  FROM survey_assignment sa3
			  WHERE sa3.parent_survey_assignment_id = ${id}
			  AND sa3.relationship_id IN (2,3,4,5) #all other nominees
			  ) AS count_pdie
			  ) AS a1) a
			  ON a.survey_assignment_id = sa.survey_assignment_id
    WHERE  st.survey_type  = 2  AND  sa.survey_assignment_id = ${id}  AND sa.is_nomination = 0 AND sa.dropped_status = 0
     ) 
    AS survey_active_message  WHERE survey_message IS NOT NULL
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );

};




// get participant report by ind_id
export const getParticipantReportsByIdM = (id, result) => {

  let query1 =   `
  SELECT 
	CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
	sa.ind_id, 
	sa.survey_assignment_id, 
	sa.survey_template_id, 
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name,
  sa.is_pdf_available,
	sa.coach_access_granted,
  sa.dropped_status
    FROM survey_assignment sa 
      LEFT JOIN org o ON o.org_id = sa.org_id
      LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
      LEFT JOIN program p ON p.program_id = sa.program_id
      LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
      LEFT JOIN stream s ON s.stream_id = sa.stream_id
      LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
      LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
      LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
      LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
        WHERE sa.ind_id = ${id} 
          AND rt.is_coach_report IN (0,2)
          AND rt.is_faculty_report = 0
          AND ((rt.tag_type IS NULL) OR (rt.tag_type = ''))
          AND DATE_FORMAT(sa.participant_report_start_date, '%Y-%m-%d %H:%i')  <= 
          DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
          AND sa.is_participant_report_processed = 1 
    
    
    
    UNION
    
SELECT 
    CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
    sa.ind_id, 
    sa.survey_assignment_id, 
    sa.survey_template_id, 
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    sa.iteration_id, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    o.org_name,
    so.suborg_name, 
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.is_pdf_available,
    sa.coach_access_granted,
    sa.dropped_status
      FROM survey_assignment sa 
        LEFT JOIN org o ON o.org_id = sa.org_id
        LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
        LEFT JOIN program p ON p.program_id = sa.program_id
        LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
        LEFT JOIN stream s ON s.stream_id = sa.stream_id
        LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
        LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
        LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
        LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
          WHERE sa.ind_id = ${id}
            AND rt.is_coach_report IN (0,2)
            AND rt.is_faculty_report = 0
            AND ((rt.tag_type IS NOT NULL) OR (rt.tag_type <> ''))
            AND DATE_FORMAT(sa.participant_report_start_date, '%Y-%m-%d %H:%i')  <= 
            DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
            AND sa.is_participant_report_processed = 1 
            AND rt.tag_type IN 
              (
                SELECT t2.tag_type
                FROM survey_assignment sa2 
                LEFT JOIN survey_assignment_tag sat2 ON sat2.survey_assignment_id = sa2.survey_assignment_id 
                LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id      
                WHERE 
                sa2.survey_assignment_id = sa.survey_assignment_id
              )

              UNION

          SELECT 
              CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
              sa.ind_id, 
              sa.survey_assignment_id, 
              sa.survey_template_id, 
              st.survey_type, 
              st.survey_template_name, 
              sa.org_id, 
              sa.suborg_id, 
              sa.program_id, 
              sa.iteration_id, 
              rt.report_template_id, 
              rt.tag_type,
              rt.report_file, 
              rt.report_template_name, 
              o.org_name,
              so.suborg_name, 
              p.program_name, 
              i.iteration_name, 
              s.stream_name, 
              g.group_name, 
              sa.is_pdf_available,
              sa.coach_access_granted,
              sa.dropped_status
                FROM survey_assignment sa 
                  LEFT JOIN org o ON o.org_id = sa.org_id
                  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
                  LEFT JOIN program p ON p.program_id = sa.program_id
                  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
                  LEFT JOIN stream s ON s.stream_id = sa.stream_id
                  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
                  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
                  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
                  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
                  LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
                  LEFT JOIN tag t ON t.tag_id = sat.tag_id  
                    WHERE sa.ind_id = ${id}
                      AND sa.submitted_status = 1
                      AND rt.is_coach_report IN (0,2)
                      AND rt.is_faculty_report = 0
                      AND rt.tag_type IS NULL
                      AND i.never_run_iteration = 1
                      AND t.tag_type = 'immediate_report_release'
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // console.log(query1);
        result(null, results);
      }
    }
  );

};

export const getFacultyReportsByIdM = (org_id, suborg, result) => {

  let query1 =   `
    SELECT
    CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
    sa.ind_id, 
    sa.survey_assignment_id, 
    sa.survey_template_id, 
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    sa.iteration_id, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    so.suborg_name, 
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.coach_access_granted,
    sa.dropped_status
  FROM survey_assignment sa 
    LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
    LEFT JOIN program p ON p.program_id = sa.program_id
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN stream s ON s.stream_id = sa.stream_id
    LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
    LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.org_id = ${org_id}
  AND sa.suborg_id IN(${suborg})
  AND rt.is_faculty_report = 1
  AND rt.is_coach_report IN (0,2)
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  AND sa.dropped_status = 0
  AND sa.is_participant_report_processed = 1 
  GROUP BY suborg_name, program_name, iteration_name, report_file
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // console.log(query1);
        result(null, results);
      }
    }
  );

};

// get coach report by ind_id of coach
export const getCoachReportsByIdM = (id, result) => {
  let query1 =   
  `SELECT 
	CONCAT(ind.first_name, " ", ind.last_name) AS full_name, 
	sa.ind_id, 
	sa.survey_assignment_id, 
  sa.final_deadline_date,
	sa.survey_template_id,
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
  IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
  IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
  rt.is_coach_report,
  rt.is_group_report,
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
	sa.coach_access_granted,
  sa.coach_id,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.coach_id = ${id}
  AND rt.is_coach_report IN (1,2)
  AND rt.is_group_report = 0
  AND ((rt.tag_type IS NULL) OR (rt.tag_type = ''))
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  
  AND DATE_FORMAT(sa.coach_report_start_date, '%Y-%m-%d %H:%i')  <= 
  DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
  DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
  DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))
  AND sa.is_participant_report_processed = 1 
  GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
  
  UNION
  
  SELECT 
	"" AS full_name, 
	"" AS ind_id, 
	0 AS survey_assignment_id, 
  sa.final_deadline_date,
	sa.survey_template_id,
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
  IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
  IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
  rt.is_coach_report,
  rt.is_group_report, 
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
	sa.coach_access_granted,
  sa.coach_id,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.coach_id = ${id}
  AND rt.is_coach_report IN (1,2)
  AND rt.is_group_report = 1
  AND ((rt.tag_type IS NULL) OR (rt.tag_type = ''))
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  
  AND DATE_FORMAT(sa.coach_report_start_date, '%Y-%m-%d %H:%i')  <= 
  DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
  DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
  DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))

  AND sa.is_participant_report_processed = 1 
  GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
  
  UNION
  
   SELECT 
    CONCAT(ind.first_name, " ", ind.last_name) AS full_name, 
    sa.ind_id, 
    sa.survey_assignment_id, 
    sa.final_deadline_date,
    sa.survey_template_id,
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    sa.iteration_id, 
    IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
    IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
    rt.is_coach_report,
    rt.is_group_report, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    o.org_name,
    so.suborg_name, 
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.coach_access_granted,
    sa.coach_id,
    sa.dropped_status
  FROM survey_assignment sa 
    LEFT JOIN org o ON o.org_id = sa.org_id
    LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
    LEFT JOIN program p ON p.program_id = sa.program_id
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN stream s ON s.stream_id = sa.stream_id
    LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
    LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
    WHERE sa.coach_id = ${id}
    AND rt.is_coach_report IN (1,2)
    AND ((rt.tag_type IS NOT NULL) OR (rt.tag_type <> ''))
    AND sa.is_nomination = 0
    AND sa.submitted_status = 1
    
    AND DATE_FORMAT(sa.coach_report_start_date, '%Y-%m-%d %H:%i')  <= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
    AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))
    AND sa.is_participant_report_processed = 1 
    AND rt.tag_type IN 
    (
            SELECT t2.tag_type
            FROM survey_assignment sa2 
            LEFT JOIN survey_assignment_tag sat2 ON sat2.survey_assignment_id = sa2.survey_assignment_id 
            LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id      
            WHERE 
            sa2.survey_assignment_id = sa.survey_assignment_id
          )
      
    AND rt.is_group_report <> 1
    GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
    
    UNION
    
    SELECT 
    "" AS full_name, 
    "" AS ind_id, 
    0 AS survey_assignment_id, 
    sa.final_deadline_date,
    sa.survey_template_id,
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    sa.iteration_id, 
    IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
    IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
    rt.is_coach_report,
    rt.is_group_report, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    o.org_name,
    so.suborg_name, 
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.coach_access_granted,
    sa.coach_id,
    sa.dropped_status
  FROM survey_assignment sa 
    LEFT JOIN org o ON o.org_id = sa.org_id
    LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
    LEFT JOIN program p ON p.program_id = sa.program_id
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN stream s ON s.stream_id = sa.stream_id
    LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
    LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
    WHERE sa.coach_id = ${id}
    AND rt.is_coach_report IN (1,2)
    AND ((rt.tag_type IS NOT NULL) OR (rt.tag_type <> ''))
    AND sa.is_nomination = 0
    AND sa.submitted_status = 1
    
    AND DATE_FORMAT(sa.coach_report_start_date, '%Y-%m-%d %H:%i')  <= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
    AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))
    AND sa.is_participant_report_processed = 1 
    AND rt.tag_type IN 
    (
            SELECT t2.tag_type
            FROM survey_assignment sa2 
            LEFT JOIN survey_assignment_tag sat2 ON sat2.survey_assignment_id = sa2.survey_assignment_id 
            LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id      
            WHERE 
            sa2.survey_assignment_id = sa.survey_assignment_id
          )
      
     AND rt.is_group_report = 1
    GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id

    UNION

    SELECT 
	CONCAT(ind.first_name, " ", ind.last_name) AS full_name, 
	sa.ind_id, 
	sa.survey_assignment_id, 
  sa.final_deadline_date,
	sa.survey_template_id,
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
  IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
  IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
  rt.is_coach_report,
  rt.is_group_report, 
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
	sa.coach_access_granted,
  sa.coach_id,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
  LEFT JOIN tag t ON t.tag_id = sat.tag_id
  WHERE sa.coach_id = ${id}
  AND rt.is_coach_report IN (1,2)
  AND rt.is_group_report = 0
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  AND rt.tag_type IS NULL
  AND i.never_run_iteration = 1
  AND t.tag_type = 'immediate_report_release'
  GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // console.log(query1);
        result(null, results);
      }
    }
  );

};


// get Not Eligibel 360 by survey_assignment_id
export const getNotEligible360M = (id, result) => {
  let query1 =   `SELECT 
  ${id} AS survey_assignment_id,
  CASE 
  WHEN a.count_pdie >= 2 THEN 0
  WHEN (a.count_psup >= 1) AND (a.count_pdie <> 1) THEN 0
  ELSE '1'
  END 
  AS not_eligible,
  a.count_pdie,
  a.count_psup
  
  FROM 
  (
  SELECT
  (
  SELECT COUNT(*)
  FROM r360_raw rc
  WHERE rc.survey_assignment_id = ${id}
  AND rc.relationship_id = 1 #primary supervisor
  ) AS count_psup,
  (
  SELECT COUNT(*)
  FROM r360_raw rc
  WHERE rc.survey_assignment_id = ${id}
  AND rc.relationship_id IN (2,3,4,5) #all other nominees
  ) AS count_pdie
  ) AS a
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // console.log(query1);
        result(null, results);
      }
    }
  );

};


export const getParticipantReportsByIdAdmin = (id, result) => {

  let query1 =   `
  SELECT 
	CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
	sa.ind_id, 
	sa.survey_assignment_id, 
	sa.survey_template_id, 
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
	so.suborg_name, 
  o.org_name,
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
  sa.is_pdf_available,
	sa.coach_access_granted,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.ind_id = ${id} 
  AND rt.is_coach_report IN (0,2)
  AND rt.is_faculty_report = 0
  AND ((rt.tag_type IS NULL) OR (rt.tag_type = ''))
  AND sa.is_participant_report_processed = 1 
    
    
    
    UNION
    
SELECT 
    CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
    sa.ind_id, 
    sa.survey_assignment_id, 
    sa.survey_template_id, 
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    sa.iteration_id, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    so.suborg_name, 
    o.org_name,
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.is_pdf_available,
    sa.coach_access_granted,
    sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.ind_id = ${id}
  AND rt.is_coach_report IN (0,2)
  AND rt.is_faculty_report = 0
  AND sa.is_participant_report_processed = 1 

  UNION

  SELECT 
      CONCAT(ind.first_name, ' ', ind.last_name) AS full_name, 
      sa.ind_id, 
      sa.survey_assignment_id, 
      sa.survey_template_id, 
      st.survey_type, 
      st.survey_template_name, 
      sa.org_id, 
      sa.suborg_id, 
      sa.program_id, 
      sa.iteration_id, 
      rt.report_template_id, 
      rt.tag_type,
      rt.report_file, 
      rt.report_template_name, 
      o.org_name,
      so.suborg_name, 
      p.program_name, 
      i.iteration_name, 
      s.stream_name, 
      g.group_name, 
      sa.is_pdf_available,
      sa.coach_access_granted,
      sa.dropped_status
        FROM survey_assignment sa 
          LEFT JOIN org o ON o.org_id = sa.org_id
          LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
          LEFT JOIN program p ON p.program_id = sa.program_id
          LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
          LEFT JOIN stream s ON s.stream_id = sa.stream_id
          LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
          LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
          LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
          LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
          LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
          LEFT JOIN tag t ON t.tag_id = sat.tag_id  
            WHERE sa.ind_id = ${id}
              AND sa.submitted_status = 1
              AND rt.is_coach_report IN (0,2)
              AND rt.is_faculty_report = 0
              AND rt.tag_type IS NULL
              AND i.never_run_iteration = 1
              AND t.tag_type = 'immediate_report_release'
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // console.log(query1);
        result(null, results);
      }
    }
  );

};

export const getCoachReportsByIdAdmin = (id, result) => {
  let query1 =   
  `SELECT 
	CONCAT(ind.first_name, " ", ind.last_name) AS full_name, 
	sa.ind_id, 
	sa.survey_assignment_id, 
  sa.final_deadline_date,
	sa.survey_template_id,
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
  IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
  IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
  rt.is_coach_report,
  rt.is_group_report,
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
	sa.coach_access_granted,
  sa.coach_id,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.coach_id = ${id}
  AND rt.is_coach_report IN (1,2)
  AND rt.is_group_report = 0
  AND ((rt.tag_type IS NULL) OR (rt.tag_type = ''))
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  AND sa.is_participant_report_processed = 1 
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))

  GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
  
  UNION
  
  SELECT 
	"" AS full_name, 
	"" AS ind_id, 
	0 AS survey_assignment_id, 
  sa.final_deadline_date,
	sa.survey_template_id,
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
  IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
  IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
  rt.is_coach_report,
  rt.is_group_report, 
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
	sa.coach_access_granted,
  sa.coach_id,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  WHERE sa.coach_id = ${id}
  AND rt.is_coach_report IN (1,2)
  AND rt.is_group_report = 1
  AND ((rt.tag_type IS NULL) OR (rt.tag_type = ''))
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  AND sa.is_participant_report_processed = 1 
  AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))
    
  GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
  
  UNION
  
  SELECT 
    CONCAT(ind.first_name, " ", ind.last_name) AS full_name, 
    sa.ind_id, 
    sa.survey_assignment_id, 
    sa.final_deadline_date,
    sa.survey_template_id,
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
    IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
    sa.group_id,
    rt.is_coach_report,
    rt.is_group_report, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    o.org_name,
    so.suborg_name, 
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.coach_access_granted,
    sa.coach_id,
    sa.dropped_status
  FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
    LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
    LEFT JOIN program p ON p.program_id = sa.program_id
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN stream s ON s.stream_id = sa.stream_id
    LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
    LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
    WHERE sa.coach_id = ${id}
    AND rt.is_coach_report IN (1,2)
    AND ((rt.tag_type IS NOT NULL) OR (rt.tag_type <> ''))
    AND sa.is_nomination = 0
    AND sa.submitted_status = 1
    AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
      DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
      DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))

    AND rt.tag_type IN 
    (
            SELECT t2.tag_type
            FROM survey_assignment sa2 
            LEFT JOIN survey_assignment_tag sat2 ON sat2.survey_assignment_id = sa2.survey_assignment_id 
            LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id      
            WHERE 
            sa2.survey_assignment_id = sa.survey_assignment_id
          )
      
    AND rt.is_group_report <> 1
    GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
    
    UNION
    
    SELECT 
    "" AS full_name, 
    "" AS ind_id, 
    0 AS survey_assignment_id, 
    sa.final_deadline_date,
    sa.survey_template_id,
    st.survey_type, 
    st.survey_template_name, 
    sa.org_id, 
    sa.suborg_id, 
    sa.program_id, 
    sa.iteration_id, 
    IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
    IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
    rt.is_coach_report,
    rt.is_group_report, 
    rt.report_template_id, 
    rt.tag_type,
    rt.report_file, 
    rt.report_template_name, 
    o.org_name,
    so.suborg_name, 
    p.program_name, 
    i.iteration_name, 
    s.stream_name, 
    g.group_name, 
    sa.coach_access_granted,
    sa.coach_id,
    sa.dropped_status
  FROM survey_assignment sa 
    LEFT JOIN org o ON o.org_id = sa.org_id
    LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
    LEFT JOIN program p ON p.program_id = sa.program_id
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN stream s ON s.stream_id = sa.stream_id
    LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
    LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
    WHERE sa.coach_id = ${id}
    AND rt.is_coach_report IN (1,2)
    AND ((rt.tag_type IS NOT NULL) OR (rt.tag_type <> ''))
    AND sa.is_nomination = 0
    AND sa.submitted_status = 1
    
    AND DATE_FORMAT(sa.coach_report_start_date, '%Y-%m-%d %H:%i')  <= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' )
    AND IF(sa.coach_report_end_date IS NULL,	sa.coach_report_end_date IS NULL, 
    DATE_FORMAT(sa.coach_report_end_date, '%Y-%m-%d %H:%i')  >= 
    DATE_FORMAT( CONVERT_TZ(NOW(),'GMT', i.time_zone  ) , '%Y-%m-%d %H:%i' ))
    AND sa.is_participant_report_processed = 1 
    AND rt.tag_type IN 
    (
            SELECT t2.tag_type
            FROM survey_assignment sa2 
            LEFT JOIN survey_assignment_tag sat2 ON sat2.survey_assignment_id = sa2.survey_assignment_id 
            LEFT JOIN tag t2 ON t2.tag_id = sat2.tag_id      
            WHERE 
            sa2.survey_assignment_id = sa.survey_assignment_id
          )
      
     AND rt.is_group_report = 1
    GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id

    UNION

    SELECT 
	CONCAT(ind.first_name, " ", ind.last_name) AS full_name, 
	sa.ind_id, 
	sa.survey_assignment_id, 
  sa.final_deadline_date,
	sa.survey_template_id,
	st.survey_type, 
	st.survey_template_name, 
	sa.org_id, 
	sa.suborg_id, 
	sa.program_id, 
	sa.iteration_id, 
  IF(sa.stream_id IS NULL, 0, sa.stream_id) AS stream_id,
  IF(sa.group_id IS NULL, 0, sa.group_id) AS group_id,
  rt.is_coach_report,
  rt.is_group_report, 
	rt.report_template_id, 
	rt.tag_type,
	rt.report_file, 
	rt.report_template_name, 
  o.org_name,
	so.suborg_name, 
	p.program_name, 
	i.iteration_name, 
	s.stream_name, 
	g.group_name, 
	sa.coach_access_granted,
  sa.coach_id,
  sa.dropped_status
FROM survey_assignment sa 
  LEFT JOIN org o ON o.org_id = sa.org_id
  LEFT JOIN suborg so ON so.suborg_id = sa.suborg_id
  LEFT JOIN program p ON p.program_id = sa.program_id
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN stream s ON s.stream_id = sa.stream_id
  LEFT JOIN talentsage.group g ON g.group_id = sa.group_id
  LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
  LEFT JOIN report_template rt ON rt.survey_template_id = st.survey_template_id
  LEFT JOIN individual ind ON ind.ind_id = sa.ind_id
  LEFT JOIN survey_assignment_tag sat ON sat.survey_assignment_id = sa.survey_assignment_id 
  LEFT JOIN tag t ON t.tag_id = sat.tag_id
  WHERE sa.coach_id = ${id}
  AND rt.is_coach_report IN (1,2)
  AND rt.is_group_report = 0
  AND sa.is_nomination = 0
  AND sa.submitted_status = 1
  AND rt.tag_type IS NULL
  AND i.never_run_iteration = 1
  AND t.tag_type = 'immediate_report_release'
  GROUP BY report_template_id, suborg_name, iteration_name, stream_name, group_name, sa.survey_assignment_id
    `;
  db.query(query1, [], (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // console.log(query1);
        result(null, results);
      }
    }
  );

};