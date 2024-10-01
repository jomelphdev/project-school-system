import db from "../config/database.js";

//todo Delete Big5 Cohort by final_deadline_date
export const deleteBig5CohortM = (id, result) => {
  let query1 = `
    DELETE c
    FROM b5_cohort c
    JOIN iteration i ON i.org_id = c.org_id 
      AND i.suborg_id = c.suborg_id
      AND i.program_id = c.program_id
      AND i.iteration_id = c.iteration_id
    WHERE 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
    AND i.never_run_iteration = 0
  `
  console.log(query1)
  db.query(
    query1,
    [],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Get Big5 final_deadline_date
export const getBig5FinalDeadlineDateM = (id, result) => {
  let query1 = `
    SELECT 
      sa.survey_assignment_id, 
      sa.ind_id, 
      sa.org_id, 
      sa.suborg_id, 
      sa.program_id, 
      sa.iteration_id, 
      sa.is_nomination, 
      i.iteration_name, 
      i.time_zone
    FROM survey_assignment sa 
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN survey_template st on st.survey_template_id = sa.survey_template_id
    WHERE 
      sa.dropped_status = 0 AND 
      sa.submitted_status = 1 AND 
      st.survey_type = 1 AND
      DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
      AND i.never_run_iteration = 0
  `
  console.log(query1)
  db.query(
    query1, 
    [],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Delete Big5 Cohort by iteration_id
export const forceDeleteBig5CohortM = (id, result) => {
  let query1 = `
    DELETE c
    FROM b5_cohort c
    JOIN iteration i 
       ON i.org_id = c.org_id 
      AND i.suborg_id = c.suborg_id
      AND i.program_id = c.program_id
      AND i.iteration_id = c.iteration_id
    WHERE
      i.iteration_id = ?
      AND i.never_run_iteration = 0
  `
  console.log(query1)
  db.query(
    query1,
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Get Big5 list by iteration
export const forceGetBig5IterationListM = (id, result) => {
  let query1 = `
    SELECT 
      sa.survey_assignment_id,
      sa.org_id, 
      sa.suborg_id, 
      sa.program_id, 
      sa.iteration_id,
      i.iteration_name
    FROM survey_assignment sa 
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    WHERE 
      sa.dropped_status = 0 AND 
      sa.submitted_status = 1 AND 
      st.survey_type = 1 AND
      sa.iteration_id = ?
      AND i.never_run_iteration = 0
  `
  console.log(query1)
  db.query(
    query1, 
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Insert Big5 Cohort Data
export const insertBig5CohortM = (data, result) => {
  let query1 = `
    INSERT INTO b5_cohort 
      (
        er1, er2, er3, er4, er5, er6, 
        e1, e2, e3, e4, e5, e6, 
        o1, o2, o3, o4, o5, o6, 
        a1, a2, a3, a4, a5, a6, 
        c1, c2, c3, c4, c5, c6, 
        er, e, o, a, c, 
        org_id, suborg_id, program_id, iteration_id 
      ) 
    VALUES 
      (
        (SELECT AVG (ER1) AS ER1 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (ER2) AS ER2 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (ER3) AS ER3 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (ER4) AS ER4 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (ER5) AS ER5 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (ER6) AS ER6 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

        (SELECT AVG (E1) AS E1 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (E2) AS E2 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (E3) AS E3 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (E4) AS E4 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (E5) AS E5 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (E6) AS E6 from b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

        (SELECT AVG (O1) AS O1 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (O2) AS O2 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (O3) AS O3 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (O4) AS O4 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (O5) AS O5 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (O6) AS O6 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

        (SELECT AVG (A1) AS A1 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (A2) AS A2 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (A3) AS A3 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (A4) AS A4 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (A5) AS A5 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (A6) AS A6 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

        (SELECT AVG (C1) AS C1 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (C2) AS C2 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (C3) AS C3 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (C4) AS C4 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (C5) AS C5 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (C6) AS C6 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

        (SELECT AVG (ER) AS ER FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (E) AS E FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (O) AS O FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (A) AS A FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        (SELECT AVG (C) AS C FROM b5_norm_raw WHERE org_id = ${data.org_id} AND suborg_id = ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
        
        (${data.org_id}),
        (${data.suborg_id}),
        (${data.program_id}),
        (${data.iteration_id})
      ) 
  `
  console.log(query1);
  db.query(
    query1,
    [],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}