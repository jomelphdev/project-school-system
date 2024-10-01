import db from "../config/database.js";
import axios, * as others from 'axios';


// MANUALLY RUN USING POSTMAN BEFORE processing final deadline date
// Get list of oldest survey_result_id with duplicate statement num for that iteration (need to run this again until none are left)
export const b5GetDuplicateStatement1M = (data, result) => {
//STEP1
  let query1 = `
  SELECT MIN(survey_result_id) as survey_result_id
    FROM survey_result sr
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sr.survey_assignment_id
    LEFT JOIN survey_template st on st.survey_template_id = sa.survey_template_id
    WHERE  sr.record_type = 'Statement'
    AND sa.submitted_status = 1
    AND st.survey_type = 1
    AND sa.iteration_id = ${data.iteration_id}
    GROUP BY sr.statement_num, sr.survey_assignment_id
    HAVING COUNT(sr.statement_num) > 1
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

//STEP 2 SURVEY RESULT DATA FIX
export const b5DeleteDuplicateStatement2M = (data, result) => {
  let ctr = data.length;
  console.log('b5 Delete Duplicate Statement 2 M ctr data length: '+ ctr );
  console.log(data[0]['survey_result_id']);

  let query1 = `
  DELETE 
  FROM survey_result sr1
  WHERE sr1.survey_result_id IN ( 
  `;
  
  for(let i = 0; i < ctr; i++) 
  {
    if ( (i + 1) == ctr )
    {
      query1 = query1 + data[i]['survey_result_id'] + `)`;
      console.log("b5DeleteDuplicateStatement2M: step 2 b5 survey result data fix query: " + query1);
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
    else
    {
      query1 = query1 + data[i]['survey_result_id'] + `, `;
    }
  }
     
}



//STEP 3 SURVEY RESULT DATA FIX
export const b5DeleteSubtraitSupertrait3M = (data, result) => {
  let query1 = `
    DELETE sr1
    FROM survey_result sr1
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sr1.survey_assignment_id 
    LEFT JOIN survey_template st on st.survey_template_id = sa.survey_template_id
    WHERE sr1.record_type IN ('Subtrait', 'Supertrait')
    AND sa.iteration_id = ${data.iteration_id}
    AND st.survey_type = 1
  `;
  console.log("step 3 - big5 survey result data fix - delete existing subtrait supertrait")
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



//STEP 3a delete sr subtrait supertrait by sa_id
export const b5DeleteSubtraitSupertrait3aM = (data, result) => {
  let query1 = `
    DELETE 
    FROM survey_result sr1
    WHERE sr1.record_type IN ('Subtrait', 'Supertrait')
    AND sr1.survey_assignment_id = ${data.survey_assignment_id}
  `;
  console.log("step 3 - big5 survey result data fix - delete existing subtrait supertrait")
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

//STEP 4 SURVEY RESULT DATA FIX - get list of survey_assignment_id for iteration with submitted_status = 1 
export const b5GetSubmittedSurvey4M = (data, result) => {
  let query1 = `
    SELECT sa.survey_assignment_id, sa.org_id, sa.suborg_id,
    FROM survey_assignment sa
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN survey_result sr2 on sr2.survey_assignment_id = sa.survey_assignment_id
    WHERE sa.iteration_id = ${data.iteration_id}
    AND st.survey_type = 1
  `;
  console.log("step 4 - SURVEY RESULT DATA FIX - get list of survey_assignment_id for iteration with submitted_status = 1 ")
  console.log(query1);
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


//STEP 5 SURVEY RESULT DATA FIX - GENERATE DATA FOR INSERT SCORE



export const b5GenerateSubtrait5M = (id, result) => {

  
  let query1 = `
  SELECT 
r1.survey_assignment_id, 
r1.relationship_id, 
COUNT(*) AS N,

AVG(r1.KDY) AS avg_KDY, 
AVG(r1.KDY1) AS avg_KDY1, 
AVG(r1.KDY2) AS avg_KDY2, 
AVG(r1.KDY3) AS avg_KDY3, 
AVG(r1.KDY4) AS avg_KDY4, 
AVG(r1.KDY5) AS avg_KDY5, 
AVG(r1.KDY6) AS avg_KDY6, 

AVG(r1.DTO) AS avg_DTO, 
AVG(r1.DTO1) AS avg_DTO1,  
AVG(r1.DTO2) AS avg_DTO2,  
AVG(r1.DTO3) AS avg_DTO3,  
AVG(r1.DTO4) AS avg_DTO4,  
AVG(r1.DTO5) AS avg_DTO5,  
AVG(r1.DTO6) AS avg_DTO6,  

AVG(r1.CP) AS avg_CP,  
AVG(r1.CP1) AS avg_CP1,  
AVG(r1.CP2) AS avg_CP2,  
AVG(r1.CP3) AS avg_CP3,  
AVG(r1.CP4) AS avg_CP4,  
AVG(r1.CP5) AS avg_CP5,  
AVG(r1.CP6) AS avg_CP6,  

AVG(r1.SCP) AS avg_SCP,  
AVG(r1.SCP1) AS avg_SCP1,  
AVG(r1.SCP2) AS avg_SCP2,  
AVG(r1.SCP3) AS avg_SCP3,  
AVG(r1.SCP4) AS avg_SCP4,  
AVG(r1.SCP5) AS avg_SCP5,  
AVG(r1.SCP6) AS avg_SCP6,  

AVG(r1.LIC) AS avg_LIC,  
AVG(r1.LIC1) AS avg_LIC1, 
AVG(r1.LIC2) AS avg_LIC2,  
AVG(r1.LIC3) AS avg_LIC3,  
AVG(r1.LIC4) AS avg_LIC4,  
AVG(r1.LIC5) AS avg_LIC5,  
AVG(r1.LIC6) AS avg_LIC6,   

AVG(r1.LDF) AS avg_LDF,  
AVG(r1.LDF1) AS avg_LDF1,  
AVG(r1.LDF2) AS avg_LDF2,  
AVG(r1.LDF3) AS avg_LDF3,  
AVG(r1.LDF4) AS avg_LDF4,  
AVG(r1.LDF5) AS avg_LDF5,  
AVG(r1.LDF6) AS avg_LDF6,  

AVG(r1.CII1) AS avg_CII1,  
AVG(r1.CII2) AS avg_CII2,  
AVG(r1.CII3) AS avg_CII3,  
AVG(r1.CII4) AS avg_CII4,  
AVG(r1.CII5) AS avg_CII5,  
AVG(r1.CII6) AS avg_CII6,  
AVG(r1.CII7) AS avg_CII7,  
AVG(r1.CII8) AS avg_CII8,  
AVG(r1.CII9) AS avg_CII9,  
AVG(r1.CII10) AS avg_CII10,  
AVG(r1.CII11) AS avg_CII11,  
AVG(r1.CII12) AS avg_CII12,  
AVG(r1.CII13) AS avg_CII13,  
AVG(r1.CII14) AS avg_CII14,  
AVG(r1.CII15) AS avg_CII15,  
AVG(r1.CII16) AS avg_CII16,  
AVG(r1.CII17) AS avg_CII17,  
AVG(r1.CII18) AS avg_CII18,  
AVG(r1.CII19) AS avg_CII19,  
AVG(r1.CII20) AS avg_CII20,  
 
AVG(r1.ERX) AS avg_ERX,  
AVG(r1.EX) AS avg_EX,  
AVG(r1.OX) AS avg_OX,  
AVG(r1.AX) AS avg_AX,  
AVG(r1.CX) AS avg_CX,

r1.org_id,
r1.suborg_id,
r1.program_id,
r1.iteration_id

FROM r360_raw r1
WHERE r1.is_processed = 0
GROUP BY r1.survey_assignment_id, r1.relationship_id, r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id


FROM r360_raw r1
WHERE r1.is_processed = 0
AND r1.relationship_id IN (0, 1, 2, 3, 4, 5)
GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id
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

//STEP 6 SURVEY RESULT DATA FIX - insert subtrait supertrait for each survey_assignment_id 
export const b5InsertSubtrait6M = (data, result) => {
 
  let query1 = `
  INSERT INTO survey_result 
  (survey_assignment_id, 
   record_type, 
   record_type_id, 
   statement_num, 
   answer, 
   score, 
   org_id, 
   suborg_id
  ) 
  VALUES   `;

  let ctr = data.length;
  console.log('step 5 - b5InsertSubtraitSupertrait5M ctr data length: '+ ctr );
  console.log(data[0]['survey_assignment_id']);

  for(let i = 0; i < ctr; i++) 
  {

    query1 += `
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'ER1', 
      'Anxiety', 
      (SELECT AVG(sr.score) AS ER1 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q1', 'Q31', 'Q61', 'Q91')  AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'ER2', 
      'Anger', 
      (SELECT AVG(sr.score) AS ER2 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}  
      AND sr.statement_num IN ('Q6', 'Q36', 'Q66', 'Q96') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'ER3', 
      'Depression', 
      (SELECT AVG(sr.score) AS ER3 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q11', 'Q41', 'Q71', 'Q101') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'ER4', 
      'Self-Consciousness', 
      (SELECT AVG(sr.score) AS ER4 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q16', 'Q46', 'Q76', 'Q106') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'ER5', 
      'Immoderation', 
      (SELECT AVG(sr.score) AS ER5 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q21', 'Q51', 'Q81', 'Q111') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'ER6', 
      'Vulnerability', 
      (SELECT AVG(sr.score) AS ER6 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q26', 'Q56', 'Q86', 'Q116') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'E1', 
      'Friendliness', 
      (SELECT AVG(sr.score) AS E1 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q2', 'Q32', 'Q62', 'Q92') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'E2', 
      'Gregariousness', 
      (SELECT AVG(sr.score) AS E2 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q7', 'Q37', 'Q67', 'Q97') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'E3', 
      'Assertiveness', 
      (SELECT AVG(sr.score) AS E3 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']} 
      AND sr.statement_num IN ('Q12', 'Q42', 'Q72', 'Q102') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'E4', 
      'Activity level', 
      (SELECT AVG(sr.score) AS E4 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q17', 'Q47', 'Q77', 'Q107') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'E5', 
      'Excitement Seeking', 
      (SELECT AVG(sr.score) AS E5 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q22', 'Q52', 'Q82', 'Q112') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'E6', 
      'Cheerfulness', 
      (SELECT AVG(sr.score) AS E6 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
        AND sr.statement_num IN ('Q27', 'Q57', 'Q87', 'Q117') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    ##
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'O1', 
      'Imagination', 
      (SELECT AVG(sr.score) AS O1 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q3', 'Q33', 'Q63', 'Q93') AND sr.record_type = 'Statement'),
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']} 
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'O2', 
      'Artistic interests', 
      (SELECT AVG(sr.score) AS O2 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q8', 'Q38', 'Q68', 'Q98') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'O3', 
      'Emotionality', 
      (SELECT AVG(sr.score) AS O3 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q13', 'Q43', 'Q73', 'Q103') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'O4', 
      'Adventurousness', 
      (SELECT AVG(sr.score) AS O4 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q18', 'Q48', 'Q78', 'Q108') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'O5', 
      'Intellect', 
      (SELECT AVG(sr.score) AS O5 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q23', 'Q53', 'Q83', 'Q113') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'O6', 
      'Liberalism', 
      (SELECT AVG(sr.score) AS O6 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q28', 'Q58', 'Q88', 'Q118') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'A1', 
      'Trust', 
      (SELECT AVG(sr.score) AS A1 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q4', 'Q34', 'Q64', 'Q94') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'A2', 
      'Morality', 
      (SELECT AVG(sr.score) AS A2 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q9', 'Q39', 'Q69', 'Q99') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'A3', 
      'Altruism', 
      (SELECT AVG(sr.score) AS A3 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q14', 'Q44', 'Q74', 'Q104') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'A4', 
      'Cooperation', 
      (SELECT AVG(sr.score) AS A4 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q19', 'Q49', 'Q79', 'Q109') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'A5', 
      'Modesty', 
      (SELECT AVG(sr.score) AS A5 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q24', 'Q54', 'Q84', 'Q114') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'A6', 
      'Sympathy', 
      (SELECT AVG(sr.score) AS A6 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q29', 'Q59', 'Q89', 'Q119') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'C1', 
      'Self-efficacy', 
      (SELECT AVG(sr.score) AS C1 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q5', 'Q35', 'Q65', 'Q95') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'C2', 
      'Orderliness', 
      (SELECT AVG(sr.score) AS C2 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q10', 'Q40', 'Q70', 'Q100') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'C3', 
      'Dutifulness', 
      (SELECT AVG(sr.score) AS C3 FROM survey_result sr  WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q15', 'Q45', 'Q75', 'Q105') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'C4', 
      'Achievement-striving', 
      (SELECT AVG(sr.score) AS C4 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q20', 'Q50', 'Q80', 'Q110') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'C5', 
      'Self-discipline', 
      (SELECT AVG(sr.score) AS C5 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q25', 'Q55', 'Q85', 'Q115') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    ),
    (
      ${data[i]['survey_assignment_id']}, 
      'Subtrait', 
      '2', 
      'C6', 
      'Cautiousness', 
      (SELECT AVG(sr.score) AS C6 FROM survey_result sr WHERE sr.survey_assignment_id = ${data[i]['survey_assignment_id']}
      AND sr.statement_num IN ('Q30', 'Q60', 'Q90', 'Q120') AND sr.record_type = 'Statement')
      ${data[i]['org_id']}, 
      ${data[i]['suborg_id']}  
    )
    `;
    if ( (i + 1) == ctr )
    {
      query1 += `;`
      console.log(query1);
      db.query(
        query1,
        [],
        (err, results) => {
          if (err) {
            console.log(err)
            result(err, null)
          } else {
            let query2 = `UPDATE r360_raw SET is_processed = 1  WHERE is_processed = 0`;
            //console.log(query2);
    
            db.query(
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2);  
                  //result(null, results)
                }
              }
            )
    
            result(null, results)
          }
        }
      )
    }
    else
    {
      query1 += `,`
    }
  }
  
}





export const b5DeleteM = (data, result) => {
  let query1 = `
    DELETE c, nr
    FROM b5_cohort  c
    JOIN b5_norm_raw nr ON nr.org_id = c.org_id 
    AND nr.suborg_id = c.suborg_id
    AND nr.program_id = c.program_id
    AND nr.iteration_id = c.iteration_id
    WHERE c.org_id = ${data.org_id}
    AND c.suborg_id = ${data.suborg_id}
    AND c.program_id = ${data.program_id}
    AND c.iteration_id = ${data.iteration_id}
  `;
  console.log(query1);
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


export const b5Delete2M = (id, result) => {
  let query1 = `
    DELETE c, nr
    FROM b5_cohort  c
    JOIN b5_norm_raw nr ON nr.org_id = c.org_id 
      AND nr.suborg_id = c.suborg_id
      AND nr.program_id = c.program_id
      AND nr.iteration_id = c.iteration_id
    JOIN iteration i ON i.org_id = c.org_id 
      AND i.suborg_id = c.suborg_id
      AND i.program_id = c.program_id
      AND i.iteration_id = c.iteration_id
    WHERE 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i') 
  `;
  console.log(query1);
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

// Get list of survey assignments by launch date
export const b5GetFinalDeadlineM = (id, result) => {
  //console.log("send_"+id);
  //let date_today = '2022-05-31 20:14:00';
  //let query1 = `SELECT survey_assignment_id, org_id, suborg_id, program_id FROM survey_assignment sa WHERE DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT('2022-05-31 20:14:00', '%Y-%m-%d %H:%i' ) AND ${"send_"+id} = 1`;
  //let query1 = `SELECT survey_assignment_id, ind_id, org_id, suborg_id, program_id, is_nomination 
  //FROM survey_assignment sa WHERE DATE_FORMAT(${id}, '%Y-%m-%d %H:%i')  = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i' )`;
  
  let query1 = `SELECT sa.survey_assignment_id, sa.ind_id, 
  sa.org_id, sa.suborg_id, sa.program_id, sa.iteration_id, 
  sa.is_nomination, i.iteration_name, i.time_zone
  FROM survey_assignment sa 
  LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
  LEFT JOIN survey_template st on st.survey_template_id = sa.survey_template_id
  WHERE sa.dropped_status = 0 AND sa.submitted_status = 1 AND
  st.survey_type = 1 AND
  DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')  
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


// insert b5_norm_raw
export const b5NormRawInsertM = (data, result) => {
  let query1 = `
  INSERT INTO b5_norm_raw 
  (
    source,
    sex, age, country, 
    er1, er2, er3, er4, er5, er6, 
    e1, e2, e3, e4, e5, e6, 
    o1, o2, o3, o4, o5, o6, 
    a1, a2, a3, a4, a5, a6, 
    c1, c2, c3, c4, c5, c6, 
    er, e, o, a, c, 
    survey_assignment_id, ind_id, 
    org_id, suborg_id, program_id, iteration_id
  ) 
  VALUES 
  (
    'sa',

    (select answer as sex from survey_result where survey_assignment_id = ${data.survey_assignment_id} and statement_num = 'Q122'),
    (select answer as age from survey_result where survey_assignment_id = ${data.survey_assignment_id} and statement_num = 'Q123'),
    (select answer as country from survey_result where survey_assignment_id = ${data.survey_assignment_id} and statement_num = 'Q121'),
    
    (select score as ER1 from survey_result where survey_assignment_id = ${data.survey_assignment_id} and statement_num = 'ER1'),
    (SELECT score AS ER2 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'ER2'),
    (SELECT score AS ER3 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'ER3'),
    (SELECT score AS ER4 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'ER4'),
    (SELECT score AS ER5 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'ER5'),
    (SELECT score AS ER6 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'ER6'),

    (select score as E1 from survey_result where survey_assignment_id = ${data.survey_assignment_id} and statement_num = 'E1'),
    (SELECT score AS E2 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'E2'),
    (SELECT score AS E3 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'E3'),
    (SELECT score AS E4 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'E4'),
    (SELECT score AS E5 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'E5'),
    (SELECT score AS E6 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'E6'),

    (SELECT score AS O1 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O1'),
    (SELECT score AS O2 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O2'),
    (SELECT score AS O3 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O3'),
    (SELECT score AS O4 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O4'),
    (SELECT score AS O5 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O5'),
    (SELECT score AS O6 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O6'),

    (SELECT score AS A1 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A1'),
    (SELECT score AS A2 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A2'),
    (SELECT score AS A3 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A3'),
    (SELECT score AS A4 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A4'),
    (SELECT score AS A5 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A5'),
    (SELECT score AS A6 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A6'),

    (SELECT score AS C1 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C1'),
    (SELECT score AS C2 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C2'),
    (SELECT score AS C3 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C3'),
    (SELECT score AS C4 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C4'),
    (SELECT score AS C5 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C5'),
    (SELECT score AS C6 FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C6'),

    (SELECT score AS ER FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'ER'),
    (SELECT score AS E FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'E'),
    (SELECT score AS O FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'O'),
    (SELECT score AS A FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'A'),
    (SELECT score AS C FROM survey_result WHERE survey_assignment_id = ${data.survey_assignment_id} AND statement_num = 'C'),

    ${data.survey_assignment_id},
    (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${data.survey_assignment_id}),

    (SELECT org_id FROM survey_assignment WHERE survey_assignment_id = ${data.survey_assignment_id}),
    (SELECT suborg_id FROM survey_assignment WHERE survey_assignment_id = ${data.survey_assignment_id}),
    (SELECT program_id FROM survey_assignment WHERE survey_assignment_id = ${data.survey_assignment_id}),
    (SELECT iteration_id FROM survey_assignment WHERE survey_assignment_id = ${data.survey_assignment_id})
  ) 
  `;


    console.log(query1);
  db.query(
    query1,
    [],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        let query2 = `UPDATE survey_assignment sa SET sa.is_participant_report_processed = 1  WHERE sa.survey_assignment_id = ${data.survey_assignment_id}`;
        //console.log(query2);

        db.query(
          query2,
          [],
          (err, results) => {
            if (err) {
              console.log(err)
              //result(err, null)
            } else {
              console.log(query2);  
              //result(null, results)
            }
          }
        )

        result(null, results)
      }
    }
  )
}



// insert b5_norm_raw
export const b5CohortInsertM = (data, result) => {
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
  
  (select AVG (ER1) as ER1 from b5_norm_raw where org_id = ${data.org_id} and suborg_id = ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (ER2) as ER2 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (ER3) as ER3 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (ER4) as ER4 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (ER5) as ER5 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (ER6) as ER6 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

  (select AVG (E1) as E1 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (E2) as E2 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (E3) as E3 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (E4) as E4 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (E5) as E5 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (select AVG (E6) as E6 from b5_norm_raw where org_id = ${data.org_id} and ${data.suborg_id} and program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

  (SELECT AVG (O1) AS O1 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (O2) AS O2 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (O3) AS O3 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (O4) AS O4 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (O5) AS O5 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (O6) AS O6 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

  (SELECT AVG (A1) AS A1 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (A2) AS A2 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (A3) AS A3 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (A4) AS A4 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (A5) AS A5 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (A6) AS A6 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

  (SELECT AVG (C1) AS C1 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (C2) AS C2 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (C3) AS C3 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (C4) AS C4 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (C5) AS C5 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (C6) AS C6 FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),

  (SELECT AVG (ER) AS ER FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (E) AS E FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (O) AS O FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (A) AS A FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  (SELECT AVG (C) AS C FROM b5_norm_raw WHERE org_id = ${data.org_id} AND ${data.suborg_id} AND program_id = ${data.program_id} AND iteration_id = ${data.iteration_id} ),
  

  (${data.org_id}),
  (${data.suborg_id}),
  (${data.program_id}),
  (${data.iteration_id})
  
) 
  `;


    console.log(query1);
  db.query(
    query1,
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





export const b5ReportDataM = (data, result) => {
  let query1 = `
  SELECT
  bnr.survey_assignment_id,
  bnr.ind_id,
  bnr.sex, 
  bnr.age, 
  bnr.country, 
  bnr.org_id, 
  bnr.suborg_id, 
  bnr.program_id, 
  bnr.iteration_id, 
  
  
  bnr.er1 AS ind_ER1, 
  bnr.er2 AS ind_ER2, 
  bnr.er3 AS ind_ER3, 
  bnr.er4 AS ind_ER4, 
  bnr.er5 AS ind_ER5, 
  bnr.er6 AS ind_ER6, 
  
  bnr.e1 AS ind_E1, 
  bnr.e2 AS ind_E2, 
  bnr.e3 AS ind_E3, 
  bnr.e4 AS ind_E4, 
  bnr.e5 AS ind_E5, 
  bnr.e6 AS ind_E6,
  
  bnr.o1 AS ind_O1, 
  bnr.o2 AS ind_O2, 
  bnr.o3 AS ind_O3, 
  bnr.o4 AS ind_O4, 
  bnr.o5 AS ind_O5, 
  bnr.o6 AS ind_O6,
  
  bnr.a1 AS ind_A1, 
  bnr.a2 AS ind_A2, 
  bnr.a3 AS ind_A3, 
  bnr.a4 AS ind_A4, 
  bnr.a5 AS ind_A5, 
  bnr.a6 AS ind_A6,
  
  bnr.c1 AS ind_C1, 
  bnr.c2 AS ind_C2, 
  bnr.c3 AS ind_C3, 
  bnr.c4 AS ind_C4, 
  bnr.c5 AS ind_C5, 
  bnr.c6 AS ind_C6,
  
  bnr.er AS ind_ER, 
  bnr.e AS ind_E, 
  bnr.o AS ind_O, 
  bnr.a AS ind_A, 
  bnr.c AS ind_C,
  
  
  bc.er1 as cohort_ER1, 
  bc.er2 as cohort_ER2, 
  bc.er3 as cohort_ER3, 
  bc.er4 as cohort_ER4, 
  bc.er5 as cohort_ER5, 
  bc.er6 as cohort_ER6, 
  
  bc.e1 AS cohort_E1, 
  bc.e2 AS cohort_E2, 
  bc.e3 AS cohort_E3, 
  bc.e4 AS cohort_E4, 
  bc.e5 AS cohort_E5, 
  bc.e6 AS cohort_E6,
  
  bc.o1 AS cohort_O1, 
  bc.o2 AS cohort_O2, 
  bc.o3 AS cohort_O3, 
  bc.o4 AS cohort_O4, 
  bc.o5 AS cohort_O5, 
  bc.o6 AS cohort_O6,
  
  bc.a1 AS cohort_A1, 
  bc.a2 AS cohort_A2, 
  bc.a3 AS cohort_A3, 
  bc.a4 AS cohort_A4, 
  bc.a5 AS cohort_A5, 
  bc.a6 AS cohort_A6,
  
  bc.c1 AS cohort_C1, 
  bc.c2 AS cohort_C2, 
  bc.c3 AS cohort_C3, 
  bc.c4 AS cohort_C4, 
  bc.c5 AS cohort_C5, 
  bc.c6 AS cohort_C6,
  
  bc.er AS cohort_ER, 
  bc.e AS cohort_E, 
  bc.o AS cohort_O, 
  bc.a AS cohort_A, 
  bc.c AS cohort_C,
  
  ( 
   (
    (
      SELECT bnr4b.er1_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er1, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er1 ASC) er1_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er1, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER1,
    ###########
   ( 
    (
    (
      SELECT bnr4b.er2_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er2, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er2 ASC) er2_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er2, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER2,
   
  ###########
   ###########
   ( 
    (
    (
      SELECT bnr4b.er3_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er3, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er3 ASC) er3_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er3, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER3,
   
  ###########
   ###########
   ( 
    (
    (
      SELECT bnr4b.er4_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er4, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er4 ASC) er4_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er4, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER4,
   
  ###########
   ###########
   ( 
    (
    (
      SELECT bnr4b.er5_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er5, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er5 ASC) er5_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er5, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER5,
   
  ###########
   ###########
   ( 
    (
    (
      SELECT bnr4b.er6_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er6, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er6 ASC) er6_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er6, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER6,
   
  ###########
   ( 
    (
    (
      SELECT bnr4b.e_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.e, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.e ASC) e_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.e, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_E,
 ###########
   ( 
    (
    (
      SELECT bnr4b.er_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.er, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.er ASC) er_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.er, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_ER,
   
  ###########   
   ###########
   ( 
    (
    (
      SELECT bnr4b.o_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.o, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.o ASC) o_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.o, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_O,
   
  ###########
   ###########
   ( 
    (
    (
      SELECT bnr4b.a_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.a, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.a ASC) a_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.a, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_A,
   
  ###########
    ###########
   ( 
    (
    (
      SELECT bnr4b.c_rank
      FROM 
      (
        SELECT bnr4a.b5_norm_raw_id, bnr4a.c, bnr4a.country, bnr4a.survey_assignment_id, RANK()
          OVER (PARTITION BY bnr4a.country 
          ORDER BY bnr4a.c ASC) c_rank
        FROM
        (
          SELECT bnr4.b5_norm_raw_id, bnr4.c, bnr4.country, bnr4.survey_assignment_id
          FROM b5_norm_raw bnr4
          WHERE (bnr4.sex = '${data.sex}' AND bnr4.country = '${data.country}' AND bnr4.source = '${data.source}') 
          OR(bnr4.survey_assignment_id = ${data.survey_assignment_id}) 
        ) AS bnr4a
      ) AS  bnr4b
      WHERE bnr4b.survey_assignment_id = ${data.survey_assignment_id}
    ) 
   / 
    (
      SELECT COUNT(*)  FROM b5_norm_raw bnr2 
      WHERE bnr2.sex = bnr.sex AND bnr2.country = bnr.country AND bnr2.source = '${data.source}'
    )  
    ) *100
   ) as n_percentile_C,
   
  ###########
   bns.*
   #########   
   FROM b5_norm_raw bnr 
  LEFT JOIN b5_cohort bc ON bc.org_id = bnr.org_id AND bc.suborg_id = bnr.suborg_id AND bc.program_id = bnr.program_id AND bc.iteration_id = bnr.iteration_id 
  left join b5_norm_sum bns on bns.sex = bnr.sex and bns.country = bnr.country AND bns.source = '${data.source}'
  WHERE bnr.survey_assignment_id = ${data.survey_assignment_id}
  `;
  console.log(query1);
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


export const b5ReportData2M = (data, result) => {
  let query1 = 
  `SELECT n, country, sex FROM b5_norm_sum WHERE country = "${data.country}" AND sex = '${data.sex}' LIMIT 1`;
  db.query(query1,
    [],
    (err, results) => {
      if (err) { 
        return result(err, null)
      }
      else {
        if(results.length == 0) {
          // no sex and country in b5_norm_sum ex. if the sex is trans
          result(null, {status: "noData", message: "No data found!"})
        }
        else if(results[0].n == 0) {
          // there are sex and country in b5_norm_sum but there is no data in other column like n column
          result(null, {status: "noNormingData", message: "No norming data found!"})
        }
        else {
          normingData(data, result)
        }
      }
    }
  )
}


const normingData = (data, result) => {
  let query1 = 
  `
    SELECT
    bnr.survey_assignment_id,
    bnr.ind_id,
    bnr.sex, 
    bnr.age, 
    bnr.country, 
    bnr.org_id, 
    bnr.suborg_id, 
    bnr.program_id, 
    bnr.iteration_id, 
    
    
    bnr.er1 AS ind_ER1, 
    bnr.er2 AS ind_ER2, 
    bnr.er3 AS ind_ER3, 
    bnr.er4 AS ind_ER4, 
    bnr.er5 AS ind_ER5, 
    bnr.er6 AS ind_ER6, 
    
    bnr.e1 AS ind_E1, 
    bnr.e2 AS ind_E2, 
    bnr.e3 AS ind_E3, 
    bnr.e4 AS ind_E4, 
    bnr.e5 AS ind_E5, 
    bnr.e6 AS ind_E6,
    
    bnr.o1 AS ind_O1, 
    bnr.o2 AS ind_O2, 
    bnr.o3 AS ind_O3, 
    bnr.o4 AS ind_O4, 
    bnr.o5 AS ind_O5, 
    bnr.o6 AS ind_O6,
    
    bnr.a1 AS ind_A1, 
    bnr.a2 AS ind_A2, 
    bnr.a3 AS ind_A3, 
    bnr.a4 AS ind_A4, 
    bnr.a5 AS ind_A5, 
    bnr.a6 AS ind_A6,
    
    bnr.c1 AS ind_C1, 
    bnr.c2 AS ind_C2, 
    bnr.c3 AS ind_C3, 
    bnr.c4 AS ind_C4, 
    bnr.c5 AS ind_C5, 
    bnr.c6 AS ind_C6,
    
    bnr.er AS ind_ER, 
    bnr.e AS ind_E, 
    bnr.o AS ind_O, 
    bnr.a AS ind_A, 
    bnr.c AS ind_C,
    
    
    bc.er1 AS cohort_ER1, 
    bc.er2 AS cohort_ER2, 
    bc.er3 AS cohort_ER3, 
    bc.er4 AS cohort_ER4, 
    bc.er5 AS cohort_ER5, 
    bc.er6 AS cohort_ER6, 
    
    bc.e1 AS cohort_E1, 
    bc.e2 AS cohort_E2, 
    bc.e3 AS cohort_E3, 
    bc.e4 AS cohort_E4, 
    bc.e5 AS cohort_E5, 
    bc.e6 AS cohort_E6,
    
    bc.o1 AS cohort_O1, 
    bc.o2 AS cohort_O2, 
    bc.o3 AS cohort_O3, 
    bc.o4 AS cohort_O4, 
    bc.o5 AS cohort_O5, 
    bc.o6 AS cohort_O6,
    
    bc.a1 AS cohort_A1, 
    bc.a2 AS cohort_A2, 
    bc.a3 AS cohort_A3, 
    bc.a4 AS cohort_A4, 
    bc.a5 AS cohort_A5, 
    bc.a6 AS cohort_A6,
    
    bc.c1 AS cohort_C1, 
    bc.c2 AS cohort_C2, 
    bc.c3 AS cohort_C3, 
    bc.c4 AS cohort_C4, 
    bc.c5 AS cohort_C5, 
    bc.c6 AS cohort_C6,
    
    bc.er AS cohort_ER, 
    bc.e AS cohort_E, 
    bc.o AS cohort_O, 
    bc.a AS cohort_A, 
    bc.c AS cohort_C,
    bns.*,
    z_scores.*,

    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER1,2) = zt.z_lookup )*100 AS percentile_ER1,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER2,2) = zt.z_lookup )*100 AS percentile_ER2,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER3,2) = zt.z_lookup )*100 AS percentile_ER3,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER4,2) = zt.z_lookup )*100 AS percentile_ER4,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER5,2) = zt.z_lookup )*100 AS percentile_ER5,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER6,2) = zt.z_lookup )*100 AS percentile_ER6,

    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E1,2) = zt.z_lookup )*100 AS percentile_E1,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E2,2) = zt.z_lookup )*100 AS percentile_E2,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E3,2) = zt.z_lookup )*100 AS percentile_E3,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E4,2) = zt.z_lookup )*100 AS percentile_E4,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E5,2) = zt.z_lookup )*100 AS percentile_E5,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E6,2) = zt.z_lookup )*100 AS percentile_E6,

    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O1,2) = zt.z_lookup )*100 AS percentile_O1,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O2,2) = zt.z_lookup )*100 AS percentile_O2,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O3,2) = zt.z_lookup )*100 AS percentile_O3,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O4,2) = zt.z_lookup )*100 AS percentile_O4,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O5,2) = zt.z_lookup )*100 AS percentile_O5,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O6,2) = zt.z_lookup )*100 AS percentile_O6,

    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A1,2) = zt.z_lookup )*100 AS percentile_A1,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A2,2) = zt.z_lookup )*100 AS percentile_A2,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A3,2) = zt.z_lookup )*100 AS percentile_A3,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A4,2) = zt.z_lookup )*100 AS percentile_A4,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A5,2) = zt.z_lookup )*100 AS percentile_A5,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A6,2) = zt.z_lookup )*100 AS percentile_A6,

    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C1,2) = zt.z_lookup )*100 AS percentile_C1,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C2,2) = zt.z_lookup )*100 AS percentile_C2,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C3,2) = zt.z_lookup )*100 AS percentile_C3,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C4,2) = zt.z_lookup )*100 AS percentile_C4,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C5,2) = zt.z_lookup )*100 AS percentile_C5,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C6,2) = zt.z_lookup )*100 AS percentile_C6,

    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER,2) = zt.z_lookup )*100 AS percentile_ER,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_E,2) = zt.z_lookup )*100 AS percentile_E,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_O,2) = zt.z_lookup )*100 AS percentile_O,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_A,2) = zt.z_lookup )*100 AS percentile_A,
    (SELECT z_value FROM ztable zt WHERE ROUND(z_score_C,2) = zt.z_lookup )*100 AS percentile_C,

    (CASE 
      WHEN ( z_score_ER1 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER1 >=  -1.5 )  and ( z_score_ER1 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER1 >=  -0.5 )  and ( z_score_ER1 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER1 >=   0.5 )  and ( z_score_ER1 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER1 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER1,

    (CASE 
      WHEN ( z_score_ER2 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER2 >=  -1.5 )  and ( z_score_ER2 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER2 >=  -0.5 )  and ( z_score_ER2 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER2 >=   0.5 )  and ( z_score_ER2 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER2 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER2,

    (CASE 
      WHEN ( z_score_ER3 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER3 >=  -1.5 )  and ( z_score_ER3 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER3 >=  -0.5 )  and ( z_score_ER3 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER3 >=   0.5 )  and ( z_score_ER3 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER3 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER3,

    (CASE 
      WHEN ( z_score_ER4 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER4 >=  -1.5 )  and ( z_score_ER4 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER4 >=  -0.5 )  and ( z_score_ER4 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER4 >=   0.5 )  and ( z_score_ER4 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER4 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER4,

    (CASE 
      WHEN ( z_score_ER5 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER5 >=  -1.5 )  and ( z_score_ER5 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER5 >=  -0.5 )  and ( z_score_ER5 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER5 >=   0.5 )  and ( z_score_ER5 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER5 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER5,

    (CASE 
      WHEN ( z_score_ER6 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER6 >=  -1.5 )  and ( z_score_ER6 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER6 >=  -0.5 )  and ( z_score_ER6 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER6 >=   0.5 )  and ( z_score_ER6 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER6 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER6,


    (CASE 
      WHEN ( z_score_E1 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E1 >=  -1.5 )  and ( z_score_E1 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E1 >=  -0.5 )  and ( z_score_E1 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E1 >=   0.5 )  and ( z_score_E1 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E1 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E1,

    (CASE 
      WHEN ( z_score_E2 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E2 >=  -1.5 )  and ( z_score_E2 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E2 >=  -0.5 )  and ( z_score_E2 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E2 >=   0.5 )  and ( z_score_E2 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E2 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E2,

    (CASE 
      WHEN ( z_score_E3 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E3 >=  -1.5 )  and ( z_score_E3 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E3 >=  -0.5 )  and ( z_score_E3 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E3 >=   0.5 )  and ( z_score_E3 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E3 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E3,

    (CASE 
      WHEN ( z_score_E4 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E4 >=  -1.5 )  and ( z_score_E4 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E4 >=  -0.5 )  and ( z_score_E4 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E4 >=   0.5 )  and ( z_score_E4 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E4 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E4,

    (CASE 
      WHEN ( z_score_E5 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E5 >=  -1.5 )  and ( z_score_E5 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E5 >=  -0.5 )  and ( z_score_E5 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E5 >=   0.5 )  and ( z_score_E5 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E5 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E5,

    (CASE 
      WHEN ( z_score_E6 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E6 >=  -1.5 )  and ( z_score_E6 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E6 >=  -0.5 )  and ( z_score_E6 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E6 >=   0.5 )  and ( z_score_E6 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E6 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E6,



    (CASE 
      WHEN ( z_score_O1 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O1 >=  -1.5 )  and ( z_score_O1 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O1 >=  -0.5 )  and ( z_score_O1 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O1 >=   0.5 )  and ( z_score_O1 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O1 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O1,

    (CASE 
      WHEN ( z_score_O2 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O2 >=  -1.5 )  and ( z_score_O2 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O2 >=  -0.5 )  and ( z_score_O2 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O2 >=   0.5 )  and ( z_score_O2 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O2 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O2,

    (CASE 
      WHEN ( z_score_O3 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O3 >=  -1.5 )  and ( z_score_O3 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O3 >=  -0.5 )  and ( z_score_O3 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O3 >=   0.5 )  and ( z_score_O3 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O3 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O3,

    (CASE 
      WHEN ( z_score_O4 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O4 >=  -1.5 )  and ( z_score_O4 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O4 >=  -0.5 )  and ( z_score_O4 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O4 >=   0.5 )  and ( z_score_O4 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O4 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O4,

    (CASE 
      WHEN ( z_score_O5 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O5 >=  -1.5 )  and ( z_score_O5 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O5 >=  -0.5 )  and ( z_score_O5 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O5 >=   0.5 )  and ( z_score_O5 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O5 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O5,

    (CASE 
      WHEN ( z_score_O6 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O6 >=  -1.5 )  and ( z_score_O6 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O6 >=  -0.5 )  and ( z_score_O6 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O6 >=   0.5 )  and ( z_score_O6 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O6 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O6,



    (CASE 
      WHEN ( z_score_A1 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A1 >=  -1.5 )  and ( z_score_A1 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A1 >=  -0.5 )  and ( z_score_A1 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A1 >=   0.5 )  and ( z_score_A1 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A1 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A1,

    (CASE 
      WHEN ( z_score_A2 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A2 >=  -1.5 )  and ( z_score_A2 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A2 >=  -0.5 )  and ( z_score_A2 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A2 >=   0.5 )  and ( z_score_A2 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A2 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A2,

    (CASE 
      WHEN ( z_score_A3 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A3 >=  -1.5 )  and ( z_score_A3 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A3 >=  -0.5 )  and ( z_score_A3 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A3 >=   0.5 )  and ( z_score_A3 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A3 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A3,

    (CASE 
      WHEN ( z_score_A4 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A4 >=  -1.5 )  and ( z_score_A4 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A4 >=  -0.5 )  and ( z_score_A4 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A4 >=   0.5 )  and ( z_score_A4 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A4 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A4,

    (CASE 
      WHEN ( z_score_A5 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A5 >=  -1.5 )  and ( z_score_A5 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A5 >=  -0.5 )  and ( z_score_A5 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A5 >=   0.5 )  and ( z_score_A5 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A5 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A5,

    (CASE 
      WHEN ( z_score_A6 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A6 >=  -1.5 )  and ( z_score_A6 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A6 >=  -0.5 )  and ( z_score_A6 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A6 >=   0.5 )  and ( z_score_A6 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A6 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A6,



    (CASE 
      WHEN ( z_score_C1 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C1 >=  -1.5 )  and ( z_score_C1 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C1 >=  -0.5 )  and ( z_score_C1 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C1 >=   0.5 )  and ( z_score_C1 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C1 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C1,

    (CASE 
      WHEN ( z_score_C2 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C2 >=  -1.5 )  and ( z_score_C2 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C2 >=  -0.5 )  and ( z_score_C2 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C2 >=   0.5 )  and ( z_score_C2 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C2 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C2,

    (CASE 
      WHEN ( z_score_C3 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C3 >=  -1.5 )  and ( z_score_C3 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C3 >=  -0.5 )  and ( z_score_C3 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C3 >=   0.5 )  and ( z_score_C3 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C3 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C3,

    (CASE 
      WHEN ( z_score_C4 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C4 >=  -1.5 )  and ( z_score_C4 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C4 >=  -0.5 )  and ( z_score_C4 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C4 >=   0.5 )  and ( z_score_C4 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C4 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C4,

    (CASE 
      WHEN ( z_score_C5 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C5 >=  -1.5 )  and ( z_score_C5 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C5 >=  -0.5 )  and ( z_score_C5 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C5 >=   0.5 )  and ( z_score_C5 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C5 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C5,

    (CASE 
      WHEN ( z_score_C6 <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C6 >=  -1.5 )  and ( z_score_C6 <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C6 >=  -0.5 )  and ( z_score_C6 <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C6 >=   0.5 )  and ( z_score_C6 <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C6 >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C6,

    (CASE 
      WHEN ( z_score_ER <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_ER >=  -1.5 )  and ( z_score_ER <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_ER >=  -0.5 )  and ( z_score_ER <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_ER >=   0.5 )  and ( z_score_ER <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_ER >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_ER,

    (CASE 
      WHEN ( z_score_E <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_E >=  -1.5 )  and ( z_score_E <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_E >=  -0.5 )  and ( z_score_E <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_E >=   0.5 )  and ( z_score_E <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_E >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_E,

    (CASE 
      WHEN ( z_score_O <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_O >=  -1.5 )  and ( z_score_O <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_O >=  -0.5 )  and ( z_score_O <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_O >=   0.5 )  and ( z_score_O <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_O >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_O,

    (CASE 
      WHEN ( z_score_A <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_A >=  -1.5 )  and ( z_score_A <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_A >=  -0.5 )  and ( z_score_A <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_A >=   0.5 )  and ( z_score_A <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_A >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_A,

    (CASE 
      WHEN ( z_score_C <   -1.5 )                              THEN 'VERY LOW'
      WHEN ( z_score_C >=  -1.5 )  and ( z_score_C <  -0.5 ) THEN 'LOW'
      WHEN ( z_score_C >=  -0.5 )  and ( z_score_C <=  0.5 ) THEN 'TYPICAL'
      WHEN ( z_score_C >=   0.5 )  and ( z_score_C <=  1.5 ) THEN 'HIGH'
      WHEN ( z_score_C >    1.5 )                              THEN 'VERY HIGH'
      END
    ) AS z_score_desc_C


    FROM b5_norm_raw bnr 
    LEFT JOIN b5_cohort bc ON bc.org_id = bnr.org_id AND bc.suborg_id = bnr.suborg_id AND bc.program_id = bnr.program_id AND bc.iteration_id = bnr.iteration_id
    LEFT JOIN b5_norm_sum bns ON bns.sex = "${data.sex}" AND bns.country = "${data.country}" AND bns.source = "${data.source}" AND bns.age = 0 AND bns.bucket = ""
    LEFT JOIN
    (SELECT
      (SELECT 
        (bnr5.er1 - bns5.er1_mean) / bns5.er1_std AS z_score_er1
        FROM  b5_norm_raw bnr5
        LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
        WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER1,     
      (SELECT 
          (bnr5.er2 - bns5.er2_mean) / bns5.er2_std AS z_score_er2
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER2, 
      (SELECT 
          (bnr5.er3 - bns5.er3_mean) / bns5.er3_std AS z_score_er3
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER3, 
      (SELECT 
          (bnr5.er4 - bns5.er4_mean) / bns5.er4_std AS z_score_er4
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER4, 
      (SELECT 
          (bnr5.er5 - bns5.er5_mean) / bns5.er5_std AS z_score_er5
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER5, 
      (SELECT 
          (bnr5.er6 - bns5.er6_mean) / bns5.er6_std AS z_score_er6
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER6, 
      
      
      (SELECT 
          (bnr5.e1 - bns5.e1_mean) / bns5.e1_std AS z_score_E1
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E1, 
      (SELECT 
          (bnr5.e2 - bns5.e2_mean) / bns5.e2_std AS z_score_E2
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E2, 
      (SELECT 
          (bnr5.e3 - bns5.e3_mean) / bns5.e3_std AS z_score_E3
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E3, 
      (SELECT 
          (bnr5.e4 - bns5.e4_mean) / bns5.e4_std AS z_score_E4
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E4, 
      (SELECT 
          (bnr5.e5 - bns5.e5_mean) / bns5.e5_std AS z_score_E5
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E5, 
      (SELECT 
          (bnr5.e6 - bns5.e6_mean) / bns5.e6_std AS z_score_E6
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E6, 
      
      (SELECT 
          (bnr5.o1 - bns5.o1_mean) / bns5.o1_std AS z_score_o1
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O1, 
      (SELECT 
          (bnr5.o2 - bns5.o2_mean) / bns5.o2_std AS z_score_o2
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O2, 
      (SELECT 
          (bnr5.o3 - bns5.o3_mean) / bns5.o3_std AS z_score_o3
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O3, 
      (SELECT 
          (bnr5.o4 - bns5.o4_mean) / bns5.o4_std AS z_score_o4
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O4, 
      (SELECT 
          (bnr5.o5 - bns5.o5_mean) / bns5.o5_std AS z_score_o5
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O5, 
      (SELECT 
          (bnr5.o6 - bns5.o6_mean) / bns5.o6_std AS z_score_o6
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O6, 
      
      (SELECT 
          (bnr5.a1 - bns5.a1_mean) / bns5.a1_std AS z_score_a1
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A1, 
      (SELECT 
          (bnr5.a2 - bns5.a2_mean) / bns5.a2_std AS z_score_a2
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A2, 
      (SELECT 
          (bnr5.a3 - bns5.a3_mean) / bns5.a3_std AS z_score_a3
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A3, 
      (SELECT 
          (bnr5.a4 - bns5.a4_mean) / bns5.a4_std AS z_score_a4
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A4, 
      (SELECT 
          (bnr5.a5 - bns5.a5_mean) / bns5.a5_std AS z_score_a5
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A5, 
      (SELECT 
          (bnr5.a6 - bns5.a6_mean) / bns5.a6_std AS z_score_a6
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A6, 
      
      
      (SELECT 
          (bnr5.c1 - bns5.c1_mean) / bns5.c1_std AS z_score_c1
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C1, 
      (SELECT 
          (bnr5.c2 - bns5.c2_mean) / bns5.c2_std AS z_score_c2
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C2, 
      (SELECT 
          (bnr5.c3 - bns5.c3_mean) / bns5.c3_std AS z_score_c3
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C3, 
      (SELECT 
          (bnr5.c4 - bns5.c4_mean) / bns5.c4_std AS z_score_c4
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C4, 
      (SELECT 
          (bnr5.c5 - bns5.c5_mean) / bns5.c5_std AS z_score_c5
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C5, 
      (SELECT 
          (bnr5.c6 - bns5.c6_mean) / bns5.c6_std AS z_score_c6
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C6,

      (SELECT 
          (bnr5.er - bns5.er_mean) / bns5.er_std AS z_score_er
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_ER, 
      (SELECT 
          (bnr5.e - bns5.e_mean) / bns5.e_std AS z_score_e
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_E, 
      (SELECT 
          (bnr5.o - bns5.o_mean) / bns5.o_std AS z_score_o
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_O, 
      (SELECT 
          (bnr5.a - bns5.a_mean) / bns5.a_std AS z_score_a
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_A, 
      (SELECT 
          (bnr5.c - bns5.c_mean) / bns5.c_std AS z_score_c
          FROM  b5_norm_raw bnr5
          LEFT JOIN b5_norm_sum bns5 ON bns5.country = "${data.country}"  AND bns5.sex =  "${data.sex}"   AND bns5.source = "${data.source}" AND bns5.age = 0 AND bns5.bucket = ""
          WHERE bnr5.source = 'sa' AND bnr5.survey_assignment_id = ${data.survey_assignment_id} 
      ) AS z_score_C,
      ${data.survey_assignment_id} AS survey_assignment_id 
    ) AS z_scores ON z_scores.survey_assignment_id = bnr.survey_assignment_id

    WHERE bnr.survey_assignment_id = ${data.survey_assignment_id} 
  `;
  console.log(query1);
  db.query(query1,
    [],
    (err, results) => {
      if (err) { 
        return result(err, null)
      }
      else {
        if(results.length == 0) {
          // no data with this survey_assignment_id or something went wrong
          result(null, {status: "noSurveyData", message: "No survey data found!"})
        }
        else {
          result(null, results)
        }
      }
    }
  )
}


export const b5InsertSurveyResultTraitsM = (data, result) => {
  let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  let s1_org_id = data[0]['org_id'];
  let s1_suborg_id = data[0]['suborg_id'];

  //let pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
  //console.log ("pos value: " + pos );
  //console.log ("Q1_pos : "+ Q1_pos);
  ////ER1//////
  let Q1_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q1');
  let Q31_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q31');
  let Q61_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q61');
  let Q91_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q91');
  
  console.log ( "data q1 pos score: " + data[Q1_pos]['score']);
  console.log ( "data q31 pos score: " + data[Q31_pos]['score']);
  console.log ( "data q61 pos score: " + data[Q61_pos]['score']);
  console.log ( "data q91 pos score: " + data[Q91_pos]['score']);

  let Q1_score = data[Q1_pos]['score'];
  let Q31_score = data[Q31_pos]['score'];
  let Q61_score = data[Q61_pos]['score'];
  let Q91_score = data[Q91_pos]['score'];

  let ER1 = ( Q1_score + Q31_score + Q61_score + Q91_score);
  console.log ("ER1 Total:" +ER1);
  ER1 = ER1 / 4;
  console.log ("ER1 AVG:" +ER1);

////ER2//////sr.statement_num IN ('Q6', 'Q36', 'Q66', 'Q96') AND sr.record_type = 'Statement') AS ER2,
let Q6_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q6');
let Q36_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q36');
let Q66_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q66');
let Q96_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q96');

console.log ( "data q6 pos score: " + data[Q6_pos]['score']);
console.log ( "data q36 pos score: " + data[Q36_pos]['score']);
console.log ( "data q66 pos score: " + data[Q66_pos]['score']);
console.log ( "data q96 pos score: " + data[Q96_pos]['score']);

let Q6_score = data[Q6_pos]['score'];
let Q36_score = data[Q36_pos]['score'];
let Q66_score = data[Q66_pos]['score'];
let Q96_score = data[Q96_pos]['score'];

let ER2 = ( Q6_score + Q36_score + Q66_score + Q96_score);
console.log ("ER2 Total:" +ER2);
ER2 = ER2 / 4;
console.log ("ER2 AVG:" +ER2);


////ER3////// ('Q11', 'Q41', 'Q71', 'Q101') AND sr.record_type = 'Statement') AS ER3,
let Q11_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q11');
let Q41_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q41');
let Q71_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q71');
let Q101_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q101');

let Q11_score = data[Q11_pos]['score'];
let Q41_score = data[Q41_pos]['score'];
let Q71_score = data[Q71_pos]['score'];
let Q101_score = data[Q101_pos]['score'];

let ER3 = ( Q11_score + Q41_score + Q71_score + Q101_score);
console.log ("ER3 Total:" +ER3);
ER3 = ER3 / 4;
console.log ("ER3 AVG:" +ER3);

////ER4////// ('Q16', 'Q46', 'Q76', 'Q106') AND sr.record_type = 'Statement') AS ER4,
let Q16_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q16');
let Q46_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q46');
let Q76_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q76');
let Q106_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q106');

let Q16_score = data[Q16_pos]['score'];
let Q46_score = data[Q46_pos]['score'];
let Q76_score = data[Q76_pos]['score'];
let Q106_score = data[Q106_pos]['score'];

let ER4 = ( Q16_score + Q46_score + Q76_score + Q106_score);
console.log ("ER4 Total:" +ER4);
ER4 = ER4 / 4;
console.log ("ER4 AVG:" +ER4);

////ER5////// sr.statement_num IN ('Q21', 'Q51', 'Q81', 'Q111') AND sr.record_type = 'Statement') AS ER5,
let Q21_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q21');
let Q51_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q51');
let Q81_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q81');
let Q111_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q111');

let Q21_score = data[Q21_pos]['score'];
let Q51_score = data[Q51_pos]['score'];
let Q81_score = data[Q81_pos]['score'];
let Q111_score = data[Q111_pos]['score'];

let ER5 = ( Q21_score + Q51_score + Q81_score + Q111_score);
console.log ("ER5 Total:" +ER5);
ER5 = ER5 / 4;
console.log ("ER5 AVG:" +ER5);


////ER6//////sr.statement_num IN ('Q26', 'Q56', 'Q86', 'Q116') AND sr.record_type = 'Statement') AS ER6,
let Q26_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q26');
let Q56_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q56');
let Q86_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q86');
let Q116_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q116');

let Q26_score = data[Q26_pos]['score'];
let Q56_score = data[Q56_pos]['score'];
let Q86_score = data[Q86_pos]['score'];
let Q116_score = data[Q116_pos]['score'];

let ER6 = ( Q26_score + Q56_score + Q86_score + Q116_score);
console.log ("ER6 Total:" +ER6);
ER6 = ER6 / 4;
console.log ("ER6 AVG:" +ER6);

////E1////// sr.statement_num IN ('Q2', 'Q32', 'Q62', 'Q92') AND sr.record_type = 'Statement') AS E1,
let Q2_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q2');
let Q32_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q32');
let Q62_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q62');
let Q92_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q92');

let Q2_score = data[Q2_pos]['score'];
let Q32_score = data[Q32_pos]['score'];
let Q62_score = data[Q62_pos]['score'];
let Q92_score = data[Q92_pos]['score'];

let E1 = ( Q2_score + Q32_score + Q62_score + Q92_score);
console.log ("E1 Total:" +E1);
E1= E1 / 4;
console.log ("E1 AVG:" +ER1);


////E2//////sr.statement_num IN ('Q7', 'Q37', 'Q67', 'Q97') AND sr.record_type = 'Statement') AS E2,
let Q7_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
let Q37_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q37');
let Q67_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q67');
let Q97_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q97');

let Q7_score = data[Q7_pos]['score'];
let Q37_score = data[Q37_pos]['score'];
let Q67_score = data[Q67_pos]['score'];
let Q97_score = data[Q97_pos]['score'];

let E2 = ( Q7_score + Q37_score + Q67_score + Q97_score);
console.log ("E2 Total:" +E2);
E2= E2 / 4;
console.log ("E2 AVG:" +ER2);


////E3//////('Q12', 'Q42', 'Q72', 'Q102') AND sr.record_type = 'Statement') AS E3,
let Q12_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q12');
let Q42_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q42');
let Q72_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q72');
let Q102_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q102');

let Q12_score = data[Q12_pos]['score'];
let Q42_score = data[Q42_pos]['score'];
let Q72_score = data[Q72_pos]['score'];
let Q102_score = data[Q102_pos]['score'];

let E3 = ( Q12_score + Q42_score + Q72_score + Q102_score);
console.log ("E3 Total:" +E3);
E3= E3 / 4;
console.log ("E3 AVG:" +ER3);


////E4//////  ('Q17', 'Q47', 'Q77', 'Q107') AND sr.record_type = 'Statement') AS E4,
let Q17_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q17');
let Q47_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q47');
let Q77_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q77');
let Q107_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q107');

let Q17_score = data[Q17_pos]['score'];
let Q47_score = data[Q47_pos]['score'];
let Q77_score = data[Q77_pos]['score'];
let Q107_score = data[Q107_pos]['score'];

let E4 = ( Q17_score + Q47_score + Q77_score + Q107_score);
console.log ("E4 Total:" +E4);
E4= E4 / 4;
console.log ("E4 AVG:" +ER4);

////E5//////sr.statement_num IN ('Q22', 'Q52', 'Q82', 'Q112') AND sr.record_type = 'Statement') AS E5,
let Q22_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q22');
let Q52_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q52');
let Q82_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q82');
let Q112_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q112');

let Q22_score = data[Q22_pos]['score'];
let Q52_score = data[Q52_pos]['score'];
let Q82_score = data[Q82_pos]['score'];
let Q112_score = data[Q112_pos]['score'];

let E5 = ( Q22_score + Q52_score + Q82_score + Q112_score);
console.log ("E5 Total:" +E5);
E5= E5 / 4;
console.log ("E5 AVG:" +ER5);

////E6/////sr.statement_num IN ('Q27', 'Q57', 'Q87', 'Q117') AND sr.record_type = 'Statement') AS E6,
let Q27_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q27');
let Q57_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q57');
let Q87_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q87');
let Q117_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q117');

let Q27_score = data[Q27_pos]['score'];
let Q57_score = data[Q57_pos]['score'];
let Q87_score = data[Q87_pos]['score'];
let Q117_score = data[Q117_pos]['score'];

let E6 = ( Q27_score + Q57_score + Q87_score + Q117_score);
console.log ("E6 Total:" +E6);
E6= E6 / 4;
console.log ("E6 AVG:" +ER6);


/////O1//// sr.statement_num IN ('Q3', 'Q33', 'Q63', 'Q93') AND sr.record_type = 'Statement') AS O1,
let Q3_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q3');
let Q33_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q33');
let Q63_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q63');
let Q93_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q93');

let Q3_score = data[Q3_pos]['score'];
let Q33_score = data[Q33_pos]['score'];
let Q63_score = data[Q63_pos]['score'];
let Q93_score = data[Q93_pos]['score'];

let O1 = ( Q3_score + Q33_score + Q63_score + Q93_score);
console.log ("O1 Total:" +O1);
O1= O1 / 4;
console.log ("O1 AVG:" +O1);

/////O2////  sr.statement_num IN ('Q8', 'Q38', 'Q68', 'Q98') AND sr.record_type = 'Statement') AS O2,
let Q8_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q8');
let Q38_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q38');
let Q68_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q68');
let Q98_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q98');

let Q8_score = data[Q8_pos]['score'];
let Q38_score = data[Q38_pos]['score'];
let Q68_score = data[Q68_pos]['score'];
let Q98_score = data[Q98_pos]['score'];

let O2 = ( Q8_score + Q38_score + Q68_score + Q98_score);
console.log ("O1 Total:" +O2);
O2= O2 / 4;
console.log ("O2 AVG:" +O2);

/////O3////  AND sr.statement_num IN ('Q13', 'Q43', 'Q73', 'Q103') AND sr.record_type = 'Statement') AS O3,
let Q13_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q13');
let Q43_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q43');
let Q73_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q73');
let Q103_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q103');

let Q13_score = data[Q13_pos]['score'];
let Q43_score = data[Q43_pos]['score'];
let Q73_score = data[Q73_pos]['score'];
let Q103_score = data[Q103_pos]['score'];

let O3 = ( Q13_score + Q43_score + Q73_score + Q103_score);
console.log ("O3 Total:" +O3);
O3= O3 / 4;
console.log ("O3 AVG:" +O3);


/////O4////    AND sr.statement_num IN ('Q18', 'Q48', 'Q78', 'Q108') AND sr.record_type = 'Statement') AS O4,
let Q18_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q18');
let Q48_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q48');
let Q78_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q78');
let Q108_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q108');

let Q18_score = data[Q18_pos]['score'];
let Q48_score = data[Q48_pos]['score'];
let Q78_score = data[Q78_pos]['score'];
let Q108_score = data[Q108_pos]['score'];

let O4 = ( Q18_score + Q48_score + Q78_score + Q108_score);
console.log ("O4 Total:" +O4);
O4= O4 / 4;
console.log ("O4 AVG:" +O4);



/////O5////  AND sr.statement_num IN ('Q23', 'Q53', 'Q83', 'Q113') AND sr.record_type = 'Statement') AS O5,
let Q23_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q23');
let Q53_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q53');
let Q83_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q83');
let Q113_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q113');

let Q23_score = data[Q23_pos]['score'];
let Q53_score = data[Q53_pos]['score'];
let Q83_score = data[Q83_pos]['score'];
let Q113_score = data[Q113_pos]['score'];

let O5 = ( Q23_score + Q53_score + Q83_score + Q113_score);
console.log ("O5 Total:" +O5);
O5= O5 / 4;
console.log ("O5 AVG:" +O5);


/////O6////  AND sr.statement_num IN ('Q28', 'Q58', 'Q88', 'Q118') AND sr.record_type = 'Statement') AS O6,
let Q28_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q28');
let Q58_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q58');
let Q88_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q88');
let Q118_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q118');

let Q28_score = data[Q28_pos]['score'];
let Q58_score = data[Q58_pos]['score'];
let Q88_score = data[Q88_pos]['score'];
let Q118_score = data[Q118_pos]['score'];

let O6 = ( Q28_score + Q58_score + Q88_score + Q118_score);
console.log ("O6 Total:" +O6);
O6= O6 / 4;
console.log ("O6 AVG:" +O6);


/////A1////  AND sr.statement_num IN ('Q4', 'Q34', 'Q64', 'Q94') AND sr.record_type = 'Statement') AS A1,
let Q4_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q4');
let Q34_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q34');
let Q64_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q64');
let Q94_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q94');

let Q4_score = data[Q4_pos]['score'];
let Q34_score = data[Q34_pos]['score'];
let Q64_score = data[Q64_pos]['score'];
let Q94_score = data[Q94_pos]['score'];

let A1 = ( Q4_score + Q34_score + Q64_score + Q94_score);
console.log ("A1 Total:" +A1);
A1= A1 / 4;
console.log ("A1 AVG:" +A1);


/////A2////  AND sr.statement_num IN ('Q9', 'Q39', 'Q69', 'Q99') AND sr.record_type = 'Statement') AS A2,
let Q9_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q9');
let Q39_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q39');
let Q69_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q69');
let Q99_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q99');

let Q9_score = data[Q9_pos]['score'];
let Q39_score = data[Q39_pos]['score'];
let Q69_score = data[Q69_pos]['score'];
let Q99_score = data[Q99_pos]['score'];

let A2 = ( Q9_score + Q39_score + Q69_score + Q99_score);
console.log ("A2 Total:" +A2);
A2= A2 / 4;
console.log ("A2 AVG:" +A2);


/////A3////  AND sr.statement_num IN ('Q14', 'Q44', 'Q74', 'Q104') AND sr.record_type = 'Statement') AS A3,
let Q14_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q14');
let Q44_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q44');
let Q74_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q74');
let Q104_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q104');

let Q14_score = data[Q14_pos]['score'];
let Q44_score = data[Q44_pos]['score'];
let Q74_score = data[Q74_pos]['score'];
let Q104_score = data[Q104_pos]['score'];

let A3 = ( Q14_score + Q44_score + Q74_score + Q104_score);
console.log ("A3 Total:" +A3);
A3= A3 / 4;
console.log ("A3 AVG:" +A3);


/////A4////   AND sr.statement_num IN ('Q19', 'Q49', 'Q79', 'Q109') AND sr.record_type = 'Statement') AS A4,
let Q19_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q19');
let Q49_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q49');
let Q79_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q79');
let Q109_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q109');

let Q19_score = data[Q19_pos]['score'];
let Q49_score = data[Q49_pos]['score'];
let Q79_score = data[Q79_pos]['score'];
let Q109_score = data[Q109_pos]['score'];

let A4 = ( Q19_score + Q49_score + Q79_score + Q109_score);
console.log ("A4 Total:" +A4);
A4= A4 / 4;
console.log ("A4 AVG:" +A4);



/////A5////AND sr.statement_num IN ('Q24', 'Q54', 'Q84', 'Q114') AND sr.record_type = 'Statement') AS A5,
let Q24_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q24');
let Q54_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q54');
let Q84_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q84');
let Q114_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q114');

let Q24_score = data[Q24_pos]['score'];
let Q54_score = data[Q54_pos]['score'];
let Q84_score = data[Q84_pos]['score'];
let Q114_score = data[Q114_pos]['score'];

let A5 = ( Q24_score + Q54_score + Q84_score + Q114_score);
console.log ("A5 Total:" +A5);
A5= A5 / 4;
console.log ("A5 AVG:" +A5);



/////A6////  AND sr.statement_num IN ('Q29', 'Q59', 'Q89', 'Q119') AND sr.record_type = 'Statement') AS A6,
let Q29_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q29');
let Q59_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q59');
let Q89_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q89');
let Q119_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q119');

let Q29_score = data[Q29_pos]['score'];
let Q59_score = data[Q59_pos]['score'];
let Q89_score = data[Q89_pos]['score'];
let Q119_score = data[Q119_pos]['score'];

let A6 = ( Q29_score + Q59_score + Q89_score + Q119_score);
console.log ("A6 Total:" +A6);
A6= A6 / 4;
console.log ("A6 AVG:" +A6);


/////C1////  AND sr.statement_num IN ('Q5', 'Q35', 'Q65', 'Q95') AND sr.record_type = 'Statement') AS C1,
let Q5_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q5');
let Q35_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q35');
let Q65_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q65');
let Q95_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q95');

let Q5_score = data[Q5_pos]['score'];
let Q35_score = data[Q35_pos]['score'];
let Q65_score = data[Q65_pos]['score'];
let Q95_score = data[Q95_pos]['score'];

let C1 = ( Q5_score + Q35_score + Q65_score + Q95_score);
console.log ("C1 Total:" +C1);
C1= C1 / 4;
console.log ("C1 AVG:" +C1);



/////C2////  AND sr.statement_num IN ('Q10', 'Q40', 'Q70', 'Q100') AND sr.record_type = 'Statement') AS C2,
let Q10_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q10');
let Q40_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q40');
let Q70_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q70');
let Q100_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q100');

let Q10_score = data[Q10_pos]['score'];
let Q40_score = data[Q40_pos]['score'];
let Q70_score = data[Q70_pos]['score'];
let Q100_score = data[Q100_pos]['score'];

let C2 = ( Q10_score + Q40_score + Q70_score + Q100_score);
console.log ("C2 Total:" +C2);
C2= C2 / 4;
console.log ("C2 AVG:" +C2);



/////C3////   AND sr.statement_num IN ('Q15', 'Q45', 'Q75', 'Q105') AND sr.record_type = 'Statement') AS C3,
let Q15_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q15');
let Q45_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q45');
let Q75_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q75');
let Q105_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q105');

let Q15_score = data[Q15_pos]['score'];
let Q45_score = data[Q45_pos]['score'];
let Q75_score = data[Q75_pos]['score'];
let Q105_score = data[Q105_pos]['score'];

let C3 = ( Q15_score + Q45_score + Q75_score + Q105_score);
console.log ("C3 Total:" +C3);
C3= C3 / 4;
console.log ("C3 AVG:" +C3);



/////C4////   AND sr.statement_num IN ('Q20', 'Q50', 'Q80', 'Q110') AND sr.record_type = 'Statement') AS C4,
let Q20_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q20');
let Q50_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q50');
let Q80_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q80');
let Q110_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q110');

let Q20_score = data[Q20_pos]['score'];
let Q50_score = data[Q50_pos]['score'];
let Q80_score = data[Q80_pos]['score'];
let Q110_score = data[Q110_pos]['score'];

let C4 = ( Q20_score + Q50_score + Q80_score + Q110_score);
console.log ("C4 Total:" +C4);
C4= C4 / 4;
console.log ("C4 AVG:" +C4);




/////C5////  AND sr.statement_num IN ('Q25', 'Q55', 'Q85', 'Q115') AND sr.record_type = 'Statement') AS C5,
let Q25_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q25');
let Q55_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q55');
let Q85_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q85');
let Q115_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q115');

let Q25_score = data[Q25_pos]['score'];
let Q55_score = data[Q55_pos]['score'];
let Q85_score = data[Q85_pos]['score'];
let Q115_score = data[Q115_pos]['score'];

let C5 = ( Q25_score + Q55_score + Q85_score + Q115_score);
console.log ("C5 Total:" +C5);
C5= C5 / 4;
console.log ("C5 AVG:" +C5);

/////C6////AND sr.statement_num IN ('Q30', 'Q60', 'Q90', 'Q120') AND sr.record_type = 'Statement') AS C6
let Q30_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q30');
let Q60_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q60');
let Q90_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q90');
let Q120_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q120');

let Q30_score = data[Q30_pos]['score'];
let Q60_score = data[Q60_pos]['score'];
let Q90_score = data[Q90_pos]['score'];
let Q120_score = data[Q120_pos]['score'];

let C6 = ( Q30_score + Q60_score + Q90_score + Q120_score);
console.log ("C6 Total:" +C6);
C6= C6 / 4;
console.log ("C6 AVG:" +C6);

let ER = (ER1 + ER2 + ER3 + ER4 + ER5 + ER6) / 6;
let E = (E1 + E2 + E3 + E4 + E5 + E6) / 6;
let O = (O1 + O2 + O3 + O4 + O5 + O6) / 6;
let A = (A1 + A2 + A3 + A4 + A5 + A6) / 6;
let C = (C1 + C2 + C3 + C4 + C5 + C6) / 6;

  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) 
  VALUES 
   (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER1",
      "Anxiety",
      ${ER1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER2",
      "Anger",
      ${ER2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER3",
      "Depression",
      ${ER3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER4",
      "Self-Consciousness",
      ${ER4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER5",
      "Immoderation",
      ${ER5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER6",
      "Vulnerability",
      ${ER6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E1",
      "Friendliness",
      ${E1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E2",
      "Gregariousness",
      ${E2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E3",
      "Assertiveness",
      ${E3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E4",
      "Activity level",
      ${E4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E5",
      "Excitement Seeking",
      ${E5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E6",
      "Cheerfulness",
      ${E6}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O1",
      "Imagination",
      ${O1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O2",
      "Artistic interests",
      ${O2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O3",
      "Emotionality",
      ${O3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O4",
      "Adventurousness",
      ${O4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O5",
      "Intellect",
      ${O5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O6",
      "Liberalism",
      ${O6}
    ),
   
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A1",
      "Trust",
      ${A1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A2",
      "Morality",
      ${A2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A3",
      "Altruism",
      ${A3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A4",
      "Cooperation",
      ${A4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A5",
      "Modesty",
      ${A5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A6",
      "Sympathy",
      ${A6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C1",
      "Self-efficacy",
      ${C1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C2",
      "Orderliness",
      ${C2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C3",
      "Dutifulness",
      ${C3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C4",
      "Achievement-striving",
      ${C4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C5",
      "Self-discipline",
      ${C5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C6",
      "Cautiousness",
      ${C6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "ER",
      "Emotional Reactiveness",
      ${ER}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "E",
      "Extraversion",
      ${E}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "O",
      "Openness to Experience",
      ${O}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "A",
      "Agreeableness",
      ${A}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "C",
      "Conscientiousness",
      ${C}
    )

  `
  console.log(query1)



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



export const b5GetSurveyResultM = (survey_assignment_id, result) => {
  db.query('SELECT * FROM survey_result WHERE survey_assignment_id = ?',
    [survey_assignment_id],
    (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}



export const b5GetSurveyAssignmentForSRReprocessingM = (iteration_id, result) => {
  let query1 = `
  SELECT sa.survey_assignment_id
    FROM survey_assignment sa
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    WHERE  
    sa.submitted_status = 1
    AND st.survey_type = 1 #1 big5, 2 360
    AND sa.iteration_id = ${iteration_id} #2: mba2024  
  `;
  db.query(query1,
    [],
    (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}





export const b5CoachReportDataM = (data, result) => {
  let query1 = 
  `
  SELECT

sa.stream_id,
sa.group_id,
sa.submitted_status,
sa.dropped_status,
sa.is_participant_report_processed,
sa.coach_id,
sa.coach_access_granted,
sa.coach_group_access_granted,
sa.hr_access_granted,
sa.coach_report_start_date,
sa.coach_report_end_date,
sa.is_nomination,
sa.in_cohort,
sa.complete_survey,
sa.no_duplicates,
sa.complete_calculations,
sa.is_calculation_complete,
i.first_name,
i.last_name,

  bnr.survey_assignment_id,
  bnr.ind_id,
  bnr.sex, 
  bnr.age, 
  bnr.country, 
  bnr.org_id, 
  bnr.suborg_id, 
  bnr.program_id, 
  bnr.iteration_id, 
  
  
  bnr.er1 AS ind_ER1, 
  bnr.er2 AS ind_ER2, 
  bnr.er3 AS ind_ER3, 
  bnr.er4 AS ind_ER4, 
  bnr.er5 AS ind_ER5, 
  bnr.er6 AS ind_ER6, 
  
  bnr.e1 AS ind_E1, 
  bnr.e2 AS ind_E2, 
  bnr.e3 AS ind_E3, 
  bnr.e4 AS ind_E4, 
  bnr.e5 AS ind_E5, 
  bnr.e6 AS ind_E6,
  
  bnr.o1 AS ind_O1, 
  bnr.o2 AS ind_O2, 
  bnr.o3 AS ind_O3, 
  bnr.o4 AS ind_O4, 
  bnr.o5 AS ind_O5, 
  bnr.o6 AS ind_O6,
  
  bnr.a1 AS ind_A1, 
  bnr.a2 AS ind_A2, 
  bnr.a3 AS ind_A3, 
  bnr.a4 AS ind_A4, 
  bnr.a5 AS ind_A5, 
  bnr.a6 AS ind_A6,
  
  bnr.c1 AS ind_C1, 
  bnr.c2 AS ind_C2, 
  bnr.c3 AS ind_C3, 
  bnr.c4 AS ind_C4, 
  bnr.c5 AS ind_C5, 
  bnr.c6 AS ind_C6,
  
  bnr.er AS ind_ER, 
  bnr.e AS ind_E, 
  bnr.o AS ind_O, 
  bnr.a AS ind_A, 
  bnr.c AS ind_C,
  
  
  bc.er1 AS cohort_ER1, 
  bc.er2 AS cohort_ER2, 
  bc.er3 AS cohort_ER3, 
  bc.er4 AS cohort_ER4, 
  bc.er5 AS cohort_ER5, 
  bc.er6 AS cohort_ER6, 
  
  bc.e1 AS cohort_E1, 
  bc.e2 AS cohort_E2, 
  bc.e3 AS cohort_E3, 
  bc.e4 AS cohort_E4, 
  bc.e5 AS cohort_E5, 
  bc.e6 AS cohort_E6,
  
  bc.o1 AS cohort_O1, 
  bc.o2 AS cohort_O2, 
  bc.o3 AS cohort_O3, 
  bc.o4 AS cohort_O4, 
  bc.o5 AS cohort_O5, 
  bc.o6 AS cohort_O6,
  
  bc.a1 AS cohort_A1, 
  bc.a2 AS cohort_A2, 
  bc.a3 AS cohort_A3, 
  bc.a4 AS cohort_A4, 
  bc.a5 AS cohort_A5, 
  bc.a6 AS cohort_A6,
  
  bc.c1 AS cohort_C1, 
  bc.c2 AS cohort_C2, 
  bc.c3 AS cohort_C3, 
  bc.c4 AS cohort_C4, 
  bc.c5 AS cohort_C5, 
  bc.c6 AS cohort_C6,
  
  bc.er AS cohort_ER, 
  bc.e AS cohort_E, 
  bc.o AS cohort_O, 
  bc.a AS cohort_A, 
  bc.c AS cohort_C,
  bns.*,
  (bnr.er1 - bns.er1_mean) / bns.er1_std AS z_score_ER1,
  (bnr.er2 - bns.er2_mean) / bns.er2_std AS z_score_ER2,
  (bnr.er3 - bns.er3_mean) / bns.er3_std AS z_score_ER3,
  (bnr.er4 - bns.er4_mean) / bns.er4_std AS z_score_ER4,
  (bnr.er5 - bns.er5_mean) / bns.er5_std AS z_score_ER5,
  (bnr.er6 - bns.er6_mean) / bns.er6_std AS z_score_ER6,
  
  (bnr.e1 - bns.e1_mean) / bns.e1_std AS z_score_E1,
  (bnr.e2 - bns.e2_mean) / bns.e2_std AS z_score_E2,
  (bnr.e3 - bns.e3_mean) / bns.e3_std AS z_score_E3,
  (bnr.e4 - bns.e4_mean) / bns.e4_std AS z_score_E4,
  (bnr.e5 - bns.e5_mean) / bns.e5_std AS z_score_E5,
  (bnr.e6 - bns.e6_mean) / bns.e6_std AS z_score_E6,
  
  (bnr.o1 - bns.o1_mean) / bns.o1_std AS z_score_O1,
  (bnr.o2 - bns.o2_mean) / bns.o2_std AS z_score_O2,
  (bnr.o3 - bns.o3_mean) / bns.o3_std AS z_score_O3,
  (bnr.o4 - bns.o4_mean) / bns.o4_std AS z_score_O4,
  (bnr.o5 - bns.o5_mean) / bns.o5_std AS z_score_O5,
  (bnr.o6 - bns.o6_mean) / bns.o6_std AS z_score_O6,
  
  (bnr.a1 - bns.a1_mean) / bns.a1_std AS z_score_A1,
  (bnr.a2 - bns.a2_mean) / bns.a2_std AS z_score_A2,
  (bnr.a3 - bns.a3_mean) / bns.a3_std AS z_score_A3,
  (bnr.a4 - bns.a4_mean) / bns.a4_std AS z_score_A4,
  (bnr.a5 - bns.a5_mean) / bns.a5_std AS z_score_A5,
  (bnr.a6 - bns.a6_mean) / bns.a6_std AS z_score_A6,
  
  (bnr.c1 - bns.c1_mean) / bns.c1_std AS z_score_C1,
  (bnr.c2 - bns.c2_mean) / bns.c2_std AS z_score_C2,
  (bnr.c3 - bns.c3_mean) / bns.c3_std AS z_score_C3,
  (bnr.c4 - bns.c4_mean) / bns.c4_std AS z_score_C4,
  (bnr.c5 - bns.c5_mean) / bns.c5_std AS z_score_C5,
  (bnr.c6 - bns.c6_mean) / bns.c6_std AS z_score_C6,
  
  (bnr.er - bns.er_mean) / bns.er_std AS z_score_ER,
  (bnr.e - bns.e_mean) / bns.e_std AS z_score_E,
  (bnr.o - bns.o_mean) / bns.o_std AS z_score_O,
  (bnr.a - bns.a_mean) / bns.a_std AS z_score_A,
  (bnr.c - bns.c_mean) / bns.c_std AS z_score_C,
  
  
  (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER1,2) = zt.z_lookup )*100 AS percentile_ER1,
  (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER2,2) = zt.z_lookup )*100 AS percentile_ER2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER3,2) = zt.z_lookup )*100 AS percentile_ER3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER4,2) = zt.z_lookup )*100 AS percentile_ER4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER5,2) = zt.z_lookup )*100 AS percentile_ER5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER6,2) = zt.z_lookup )*100 AS percentile_ER6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E1,2) = zt.z_lookup )*100 AS percentile_E1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E2,2) = zt.z_lookup )*100 AS percentile_E2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E3,2) = zt.z_lookup )*100 AS percentile_E3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E4,2) = zt.z_lookup )*100 AS percentile_E4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E5,2) = zt.z_lookup )*100 AS percentile_E5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E6,2) = zt.z_lookup )*100 AS percentile_E6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O1,2) = zt.z_lookup )*100 AS percentile_O1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O2,2) = zt.z_lookup )*100 AS percentile_O2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O3,2) = zt.z_lookup )*100 AS percentile_O3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O4,2) = zt.z_lookup )*100 AS percentile_O4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O5,2) = zt.z_lookup )*100 AS percentile_O5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O6,2) = zt.z_lookup )*100 AS percentile_O6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A1,2) = zt.z_lookup )*100 AS percentile_A1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A2,2) = zt.z_lookup )*100 AS percentile_A2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A3,2) = zt.z_lookup )*100 AS percentile_A3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A4,2) = zt.z_lookup )*100 AS percentile_A4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A5,2) = zt.z_lookup )*100 AS percentile_A5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A6,2) = zt.z_lookup )*100 AS percentile_A6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C1,2) = zt.z_lookup )*100 AS percentile_C1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C2,2) = zt.z_lookup )*100 AS percentile_C2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C3,2) = zt.z_lookup )*100 AS percentile_C3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C4,2) = zt.z_lookup )*100 AS percentile_C4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C5,2) = zt.z_lookup )*100 AS percentile_C5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C6,2) = zt.z_lookup )*100 AS percentile_C6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER,2) = zt.z_lookup )*100 AS percentile_ER,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E,2) = zt.z_lookup )*100 AS percentile_E,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O,2) = zt.z_lookup )*100 AS percentile_O,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A,2) = zt.z_lookup )*100 AS percentile_A,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C,2) = zt.z_lookup )*100 AS percentile_C

FROM b5_norm_raw bnr 
  LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = bnr.survey_assignment_id
  LEFT JOIN individual i ON i.ind_id = sa.ind_id
  LEFT JOIN b5_cohort bc ON bc.org_id = bnr.org_id AND bc.suborg_id = bnr.suborg_id AND bc.program_id = bnr.program_id AND bc.iteration_id = bnr.iteration_id
  LEFT JOIN b5_norm_sum bns ON bns.sex = bnr.sex AND bns.country = bnr.country AND bns.source = 'IPIP120' AND bns.age = 0 AND bns.bucket = ""

  WHERE sa.coach_id = ${data.coach_id}
  AND sa.coach_access_granted = 1
  AND sa.survey_template_id = ${data.survey_template_id}
  AND sa.is_participant_report_processed = 1
  AND bnr.iteration_id = ${data.iteration_id}
  AND sa.stream_id = ${data.stream_id}
  AND sa.group_id = ${data.group_id}
  LIMIT 6
    `
    ;
    console.log(query1);
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

export const b5FacultyReportDataM = (data, result) => {
  let query1 = 
  `
  SELECT

sa.submitted_status,
sa.dropped_status,
sa.is_participant_report_processed,
sa.coach_id,
sa.coach_access_granted,
sa.coach_group_access_granted,
sa.hr_access_granted,
sa.coach_report_start_date,
sa.coach_report_end_date,
sa.is_nomination,
sa.in_cohort,
sa.complete_survey,
sa.no_duplicates,
sa.complete_calculations,
sa.is_calculation_complete,
i.first_name,
i.last_name,

  bnr.survey_assignment_id,
  bnr.ind_id,
  bnr.sex, 
  bnr.age, 
  bnr.country, 
  bnr.org_id, 
  bnr.suborg_id, 
  bnr.program_id, 
  bnr.iteration_id, 
  
  
  bnr.er1 AS ind_ER1, 
  bnr.er2 AS ind_ER2, 
  bnr.er3 AS ind_ER3, 
  bnr.er4 AS ind_ER4, 
  bnr.er5 AS ind_ER5, 
  bnr.er6 AS ind_ER6, 
  
  bnr.e1 AS ind_E1, 
  bnr.e2 AS ind_E2, 
  bnr.e3 AS ind_E3, 
  bnr.e4 AS ind_E4, 
  bnr.e5 AS ind_E5, 
  bnr.e6 AS ind_E6,
  
  bnr.o1 AS ind_O1, 
  bnr.o2 AS ind_O2, 
  bnr.o3 AS ind_O3, 
  bnr.o4 AS ind_O4, 
  bnr.o5 AS ind_O5, 
  bnr.o6 AS ind_O6,
  
  bnr.a1 AS ind_A1, 
  bnr.a2 AS ind_A2, 
  bnr.a3 AS ind_A3, 
  bnr.a4 AS ind_A4, 
  bnr.a5 AS ind_A5, 
  bnr.a6 AS ind_A6,
  
  bnr.c1 AS ind_C1, 
  bnr.c2 AS ind_C2, 
  bnr.c3 AS ind_C3, 
  bnr.c4 AS ind_C4, 
  bnr.c5 AS ind_C5, 
  bnr.c6 AS ind_C6,
  
  bnr.er AS ind_ER, 
  bnr.e AS ind_E, 
  bnr.o AS ind_O, 
  bnr.a AS ind_A, 
  bnr.c AS ind_C,
  
  
  bc.er1 AS cohort_ER1, 
  bc.er2 AS cohort_ER2, 
  bc.er3 AS cohort_ER3, 
  bc.er4 AS cohort_ER4, 
  bc.er5 AS cohort_ER5, 
  bc.er6 AS cohort_ER6, 
  
  bc.e1 AS cohort_E1, 
  bc.e2 AS cohort_E2, 
  bc.e3 AS cohort_E3, 
  bc.e4 AS cohort_E4, 
  bc.e5 AS cohort_E5, 
  bc.e6 AS cohort_E6,
  
  bc.o1 AS cohort_O1, 
  bc.o2 AS cohort_O2, 
  bc.o3 AS cohort_O3, 
  bc.o4 AS cohort_O4, 
  bc.o5 AS cohort_O5, 
  bc.o6 AS cohort_O6,
  
  bc.a1 AS cohort_A1, 
  bc.a2 AS cohort_A2, 
  bc.a3 AS cohort_A3, 
  bc.a4 AS cohort_A4, 
  bc.a5 AS cohort_A5, 
  bc.a6 AS cohort_A6,
  
  bc.c1 AS cohort_C1, 
  bc.c2 AS cohort_C2, 
  bc.c3 AS cohort_C3, 
  bc.c4 AS cohort_C4, 
  bc.c5 AS cohort_C5, 
  bc.c6 AS cohort_C6,
  
  bc.er AS cohort_ER, 
  bc.e AS cohort_E, 
  bc.o AS cohort_O, 
  bc.a AS cohort_A, 
  bc.c AS cohort_C,
  bns.*,
  (bnr.er1 - bns.er1_mean) / bns.er1_std AS z_score_ER1,
  (bnr.er2 - bns.er2_mean) / bns.er2_std AS z_score_ER2,
  (bnr.er3 - bns.er3_mean) / bns.er3_std AS z_score_ER3,
  (bnr.er4 - bns.er4_mean) / bns.er4_std AS z_score_ER4,
  (bnr.er5 - bns.er5_mean) / bns.er5_std AS z_score_ER5,
  (bnr.er6 - bns.er6_mean) / bns.er6_std AS z_score_ER6,
  
  (bnr.e1 - bns.e1_mean) / bns.e1_std AS z_score_E1,
  (bnr.e2 - bns.e2_mean) / bns.e2_std AS z_score_E2,
  (bnr.e3 - bns.e3_mean) / bns.e3_std AS z_score_E3,
  (bnr.e4 - bns.e4_mean) / bns.e4_std AS z_score_E4,
  (bnr.e5 - bns.e5_mean) / bns.e5_std AS z_score_E5,
  (bnr.e6 - bns.e6_mean) / bns.e6_std AS z_score_E6,
  
  (bnr.o1 - bns.o1_mean) / bns.o1_std AS z_score_O1,
  (bnr.o2 - bns.o2_mean) / bns.o2_std AS z_score_O2,
  (bnr.o3 - bns.o3_mean) / bns.o3_std AS z_score_O3,
  (bnr.o4 - bns.o4_mean) / bns.o4_std AS z_score_O4,
  (bnr.o5 - bns.o5_mean) / bns.o5_std AS z_score_O5,
  (bnr.o6 - bns.o6_mean) / bns.o6_std AS z_score_O6,
  
  (bnr.a1 - bns.a1_mean) / bns.a1_std AS z_score_A1,
  (bnr.a2 - bns.a2_mean) / bns.a2_std AS z_score_A2,
  (bnr.a3 - bns.a3_mean) / bns.a3_std AS z_score_A3,
  (bnr.a4 - bns.a4_mean) / bns.a4_std AS z_score_A4,
  (bnr.a5 - bns.a5_mean) / bns.a5_std AS z_score_A5,
  (bnr.a6 - bns.a6_mean) / bns.a6_std AS z_score_A6,
  
  (bnr.c1 - bns.c1_mean) / bns.c1_std AS z_score_C1,
  (bnr.c2 - bns.c2_mean) / bns.c2_std AS z_score_C2,
  (bnr.c3 - bns.c3_mean) / bns.c3_std AS z_score_C3,
  (bnr.c4 - bns.c4_mean) / bns.c4_std AS z_score_C4,
  (bnr.c5 - bns.c5_mean) / bns.c5_std AS z_score_C5,
  (bnr.c6 - bns.c6_mean) / bns.c6_std AS z_score_C6,
  
  (bnr.er - bns.er_mean) / bns.er_std AS z_score_ER,
  (bnr.e - bns.e_mean) / bns.e_std AS z_score_E,
  (bnr.o - bns.o_mean) / bns.o_std AS z_score_O,
  (bnr.a - bns.a_mean) / bns.a_std AS z_score_A,
  (bnr.c - bns.c_mean) / bns.c_std AS z_score_C,
  
  
  (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER1,2) = zt.z_lookup )*100 AS percentile_ER1,
  (SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER2,2) = zt.z_lookup )*100 AS percentile_ER2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER3,2) = zt.z_lookup )*100 AS percentile_ER3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER4,2) = zt.z_lookup )*100 AS percentile_ER4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER5,2) = zt.z_lookup )*100 AS percentile_ER5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER6,2) = zt.z_lookup )*100 AS percentile_ER6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E1,2) = zt.z_lookup )*100 AS percentile_E1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E2,2) = zt.z_lookup )*100 AS percentile_E2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E3,2) = zt.z_lookup )*100 AS percentile_E3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E4,2) = zt.z_lookup )*100 AS percentile_E4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E5,2) = zt.z_lookup )*100 AS percentile_E5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E6,2) = zt.z_lookup )*100 AS percentile_E6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O1,2) = zt.z_lookup )*100 AS percentile_O1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O2,2) = zt.z_lookup )*100 AS percentile_O2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O3,2) = zt.z_lookup )*100 AS percentile_O3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O4,2) = zt.z_lookup )*100 AS percentile_O4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O5,2) = zt.z_lookup )*100 AS percentile_O5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O6,2) = zt.z_lookup )*100 AS percentile_O6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A1,2) = zt.z_lookup )*100 AS percentile_A1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A2,2) = zt.z_lookup )*100 AS percentile_A2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A3,2) = zt.z_lookup )*100 AS percentile_A3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A4,2) = zt.z_lookup )*100 AS percentile_A4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A5,2) = zt.z_lookup )*100 AS percentile_A5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A6,2) = zt.z_lookup )*100 AS percentile_A6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C1,2) = zt.z_lookup )*100 AS percentile_C1,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C2,2) = zt.z_lookup )*100 AS percentile_C2,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C3,2) = zt.z_lookup )*100 AS percentile_C3,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C4,2) = zt.z_lookup )*100 AS percentile_C4,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C5,2) = zt.z_lookup )*100 AS percentile_C5,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C6,2) = zt.z_lookup )*100 AS percentile_C6,

(SELECT z_value FROM ztable zt WHERE ROUND(z_score_ER,2) = zt.z_lookup )*100 AS percentile_ER,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_E,2) = zt.z_lookup )*100 AS percentile_E,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_O,2) = zt.z_lookup )*100 AS percentile_O,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_A,2) = zt.z_lookup )*100 AS percentile_A,
(SELECT z_value FROM ztable zt WHERE ROUND(z_score_C,2) = zt.z_lookup )*100 AS percentile_C

FROM b5_norm_raw bnr 
  LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = bnr.survey_assignment_id
  LEFT JOIN individual i ON i.ind_id = sa.ind_id
  LEFT JOIN b5_cohort bc ON bc.org_id = bnr.org_id AND bc.suborg_id = bnr.suborg_id AND bc.program_id = bnr.program_id AND bc.iteration_id = bnr.iteration_id
  LEFT JOIN b5_norm_sum bns ON bns.sex = bnr.sex AND bns.country = bnr.country AND bns.source = 'IPIP120' AND bns.age = 0 AND bns.bucket = ""

WHERE bnr.iteration_id = ${data.iteration_id}
AND sa.survey_template_id = ${data.survey_template_id}
AND is_nomination = 0 
AND is_participant_report_processed = 1
AND submitted_status = 1
AND dropped_status = 0
    `
    ;
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


//get countries
export const b5GetCountriesM = (result) => {
  let query1 = `SELECT DISTINCT country FROM b5_norm_sum WHERE country != "" ORDER BY country ASC  `;
  db.query(query1, (err, results) => {
    if (err) return result(err, null)
    result(null, results)
  })
}