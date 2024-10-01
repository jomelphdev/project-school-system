import db from '../config/database.js'

// Get surveyResult by survey_assignment_id
export const getAllSurveyResult = (survey_assignment_id, result) => {
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
// Get surveyResult by survey_assignment_id and statement_num
export const findSurveyResultByStamentNum = (survey_assignment_id, statement_num, result) => {
  db.query(
    'SELECT * FROM survey_result WHERE survey_assignment_id = ? AND statement_num = ?',
    [survey_assignment_id, statement_num],
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
// Create New surveyResult
export const insertSurveyResult = (data, result) => {
  db.query(
    'INSERT INTO survey_result (survey_assignment_id, record_type, record_type_id, statement_num, answer, score, org_id, suborg_id, created_at, created_by, modified_at, modified_by) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)',
    [
      data.survey_assignment_id,
      data.record_type,
      data.record_type_id,
      data.statement_num,
      data.answer,
      data.score,
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
// Update surveyResult
export const updateSurveyResultByStatementNum = (survey_assignment_id, statement_num, data, result) => {
  db.query(
    'UPDATE survey_result SET answer = ?, score = ?, modified_at = NOW(), modified_by = ? WHERE survey_assignment_id = ? AND statement_num = ?',
    [data.answer, data.score, data.modified_by, survey_assignment_id, statement_num],
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
// Delete surveyResult
export const deleteSurveyResultByStatementNum = (id, result) => {
  db.query(
    'DELETE FROM survey_result WHERE statement_num = ?',
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

export const calculateSurveyResults = (id, result) => {
  db.query(
    `DELETE FROM survey_result WHERE record_type = 'Cohort' AND survey_assignment_id = ?`,
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

// Get reorder data
export const getReOrderResult = (survey_assignment_id, record_type, result) => {
  db.query('SELECT answer FROM survey_result WHERE survey_assignment_id = ? AND record_type = ? ORDER BY score ASC',
    [survey_assignment_id, record_type],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}

// get sex and country by survey_assignment_id
export const getSexAndCountry = (survey_assignment_id, result) => {
  db.query(`
  SELECT
  ${survey_assignment_id} AS survey_assignment_id,
    (SELECT sr.answer
    FROM survey_result sr
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sr.survey_assignment_id
    WHERE sr.statement_num = "Q121" AND sa.survey_assignment_id = ${survey_assignment_id}) AS country,
    (SELECT sr.answer
    FROM survey_result sr
    LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sr.survey_assignment_id
    WHERE sr.statement_num = "Q122" AND sa.survey_assignment_id = ${survey_assignment_id}) AS gender
  `,
    [],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    })
}

// Get empty answer count
export const getEmptyAnswerCount = (survey_assignment_id, result) => {
  db.query('SELECT COUNT(*) AS empty_answer FROM survey_result WHERE survey_assignment_id = ? AND answer = "" AND record_type = "Statement"',
    [survey_assignment_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results[0])
      }
    })
}

// Get duplicate count
export const getDuplciateAnswer = (survey_assignment_id, result) => {
  db.query(`
    SELECT MIN(survey_result_id) AS has_duplicate_survey_result_id, sr.statement_num
      FROM survey_result sr
      LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sr.survey_assignment_id
      LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
      WHERE
      sa.survey_assignment_id = ?
      GROUP BY sr.statement_num
      HAVING COUNT(sr.statement_num) > 1
  `,
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

// Delete surveyResult
export const deleteDuplicateSurveyResultM = (survey_result_id, result) => {
  db.query(
    'DELETE FROM survey_result WHERE survey_result_id IN (?)',
    [survey_result_id],
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

//todo Populate BIG5 Survey Result
export const prePopulateSurveyBig5 = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Statement",1,"Q37","",null),
    (?,?,?,"Statement",1,"Q38","",null),
    (?,?,?,"Statement",1,"Q39","",null),
    (?,?,?,"Statement",1,"Q40","",null),
    (?,?,?,"Statement",1,"Q41","",null),
    (?,?,?,"Statement",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","",null),
    (?,?,?,"Statement",1,"Q54","",null),
    (?,?,?,"Statement",1,"Q55","",null),
    (?,?,?,"Statement",1,"Q56","",null),
    (?,?,?,"Statement",1,"Q57","",null),
    (?,?,?,"Statement",1,"Q58","",null),
    (?,?,?,"Statement",1,"Q59","",null),
    (?,?,?,"Statement",1,"Q60","",null),
    (?,?,?,"Statement",1,"Q61","",null),
    (?,?,?,"Statement",1,"Q62","",null),
    (?,?,?,"Statement",1,"Q63","",null),
    (?,?,?,"Statement",1,"Q64","",null),
    (?,?,?,"Statement",1,"Q65","",null),
    (?,?,?,"Statement",1,"Q66","",null),
    (?,?,?,"Statement",1,"Q67","",null),
    (?,?,?,"Statement",1,"Q68","",null),
    (?,?,?,"Statement",1,"Q69","",null),
    (?,?,?,"Statement",1,"Q70","",null),
    (?,?,?,"Statement",1,"Q71","",null),
    (?,?,?,"Statement",1,"Q72","",null),
    (?,?,?,"Statement",1,"Q73","",null),
    (?,?,?,"Statement",1,"Q74","",null),
    (?,?,?,"Statement",1,"Q75","",null),
    (?,?,?,"Statement",1,"Q76","",null),
    (?,?,?,"Statement",1,"Q77","",null),
    (?,?,?,"Statement",1,"Q78","",null),
    (?,?,?,"Statement",1,"Q79","",null),
    (?,?,?,"Statement",1,"Q80","",null),
    (?,?,?,"Statement",1,"Q81","",null),
    (?,?,?,"Statement",1,"Q82","",null),
    (?,?,?,"Statement",1,"Q83","",null),
    (?,?,?,"Statement",1,"Q84","",null),
    (?,?,?,"Statement",1,"Q85","",null),
    (?,?,?,"Statement",1,"Q86","",null),
    (?,?,?,"Statement",1,"Q87","",null),
    (?,?,?,"Statement",1,"Q88","",null),
    (?,?,?,"Statement",1,"Q89","",null),
    (?,?,?,"Statement",1,"Q90","",null),
    (?,?,?,"Statement",1,"Q91","",null),
    (?,?,?,"Statement",1,"Q92","",null),
    (?,?,?,"Statement",1,"Q93","",null),
    (?,?,?,"Statement",1,"Q94","",null),
    (?,?,?,"Statement",1,"Q95","",null),
    (?,?,?,"Statement",1,"Q96","",null),
    (?,?,?,"Statement",1,"Q97","",null),
    (?,?,?,"Statement",1,"Q98","",null),
    (?,?,?,"Statement",1,"Q99","",null),
    (?,?,?,"Statement",1,"Q100","",null),
    (?,?,?,"Statement",1,"Q101","",null),
    (?,?,?,"Statement",1,"Q102","",null),
    (?,?,?,"Statement",1,"Q103","",null),
    (?,?,?,"Statement",1,"Q104","",null),
    (?,?,?,"Statement",1,"Q105","",null),
    (?,?,?,"Statement",1,"Q106","",null),
    (?,?,?,"Statement",1,"Q107","",null),
    (?,?,?,"Statement",1,"Q108","",null),
    (?,?,?,"Statement",1,"Q109","",null),
    (?,?,?,"Statement",1,"Q110","",null),
    (?,?,?,"Statement",1,"Q111","",null),
    (?,?,?,"Statement",1,"Q112","",null),
    (?,?,?,"Statement",1,"Q113","",null),
    (?,?,?,"Statement",1,"Q114","",null),
    (?,?,?,"Statement",1,"Q115","",null),
    (?,?,?,"Statement",1,"Q116","",null),
    (?,?,?,"Statement",1,"Q117","",null),
    (?,?,?,"Statement",1,"Q118","",null),
    (?,?,?,"Statement",1,"Q119","",null),
    (?,?,?,"Statement",1,"Q120","",null),
    (?,?,?,"Statement",1,"Q121","",null),
    (?,?,?,"Statement",1,"Q122","",null),
    (?,?,?,"Statement",1,"Q123","",null),
    (?,?,?,"Statement",1,"Q124","No","0"),
    (?,?,?,"Statement",1,"Q125","No","0"),
    (?,?,?,"Statement",1,"Q126","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate TeamLeader Participant Survey Result
export const prePopulateSurveyTeamLeaderP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","No","0"),
    (?,?,?,"Statement",1,"Q54","No","0"),
    (?,?,?,"Statement",1,"Q55","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate TeamLeader Nominee Survey Result
export const prePopulateSurveyTeamLeaderN = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null)
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate GeneralManager Participant Survey Result
export const prePopulateSurveyGeneralManagerP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","No","0"),
    (?,?,?,"Statement",1,"Q54","No","0"),
    (?,?,?,"Statement",1,"Q55","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate GeneralManager Nominee Survey Result
export const prePopulateSurveyGeneralManagerN = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null)
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate SeniorExecProgram Participant Survey Result
export const prePopulateSurveySeniorExecProgramP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","",null),
    (?,?,?,"Statement",1,"Q54","",null),
    (?,?,?,"Statement",1,"Q55","No","0"),
    (?,?,?,"Statement",1,"Q56","No","0"),
    (?,?,?,"Statement",1,"Q57","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate SeniorExecProgram Nominee Survey Result
export const prePopulateSurveySeniorExecProgramN = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","",null),
    (?,?,?,"Statement",1,"Q54","",null)
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate Talentsage Participant Survey Result
export const prePopulateSurveyTalentsageP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","No","0"),
    (?,?,?,"Statement",1,"Q53","No","0"),
    (?,?,?,"Statement",1,"Q54","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate Talentsage Nominee Survey Result
export const prePopulateSurveyTalentsageN = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null)
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate HELP360 Paricipant Survey Result
export const prePopulateSurveyHelpP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Statement",1,"Q37","",null),
    (?,?,?,"Statement",1,"Q38","",null),
    (?,?,?,"Statement",1,"Q39","",null),
    (?,?,?,"Statement",1,"Q40","",null),
    (?,?,?,"Statement",1,"Q41","",null),
    (?,?,?,"Statement",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","",null),
    (?,?,?,"Statement",1,"Q54","",null),
    (?,?,?,"Statement",1,"Q55","",null),
    (?,?,?,"Statement",1,"Q56","",null),
    (?,?,?,"Statement",1,"Q57","",null),
    (?,?,?,"Statement",1,"Q58","",null),
    (?,?,?,"Statement",1,"Q59","",null),
    (?,?,?,"Statement",1,"Q60","",null),
    (?,?,?,"Statement",1,"Q61","",null),
    (?,?,?,"Statement",1,"Q62","",null),
    (?,?,?,"Statement",1,"Q63","",null),
    (?,?,?,"Statement",1,"Q64","",null),
    (?,?,?,"Statement",1,"Q65","",null),
    (?,?,?,"Statement",1,"Q66","",null),
    (?,?,?,"Statement",1,"Q67","",null),
    (?,?,?,"Statement",1,"Q68","No","0"),
    (?,?,?,"Statement",1,"Q69","No","0"),
    (?,?,?,"Statement",1,"Q70","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate HELP360 Paricipant Survey Result
export const prePopulateSurveyHelpN = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Statement",1,"Q37","",null),
    (?,?,?,"Statement",1,"Q38","",null),
    (?,?,?,"Statement",1,"Q39","",null),
    (?,?,?,"Statement",1,"Q40","",null),
    (?,?,?,"Statement",1,"Q41","",null),
    (?,?,?,"Statement",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","",null),
    (?,?,?,"Statement",1,"Q54","",null),
    (?,?,?,"Statement",1,"Q55","",null),
    (?,?,?,"Statement",1,"Q56","",null),
    (?,?,?,"Statement",1,"Q57","",null),
    (?,?,?,"Statement",1,"Q58","",null),
    (?,?,?,"Statement",1,"Q59","",null),
    (?,?,?,"Statement",1,"Q60","",null),
    (?,?,?,"Statement",1,"Q61","",null),
    (?,?,?,"Statement",1,"Q62","",null),
    (?,?,?,"Statement",1,"Q63","",null),
    (?,?,?,"Statement",1,"Q64","",null),
    (?,?,?,"Statement",1,"Q65","",null),
    (?,?,?,"Statement",1,"Q66","",null),
    (?,?,?,"Statement",1,"Q67","",null)
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate Confirmation Survey Result
export const prePopulateSurveyConfirmationM = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate EURONAV Participant Survey Result
export const prePopulateSurveyEuroNavP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","No","0"),
    (?,?,?,"Statement",1,"Q53","No","0"),
    (?,?,?,"Statement",1,"Q54","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate EURONAV Nominee Survey Result
export const prePopulateSurveyEuroNavN = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Ranking",1,"Q37","",null),
    (?,?,?,"Ranking",1,"Q38","",null),
    (?,?,?,"Ranking",1,"Q39","",null),
    (?,?,?,"Ranking",1,"Q40","",null),
    (?,?,?,"Ranking",1,"Q41","",null),
    (?,?,?,"Ranking",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null)
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//todo Populate Qsort Survey Result
export const prePopulateSurveyQsort = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Statement",1,"Q37","",null),
    (?,?,?,"Statement",1,"Q38","",null),
    (?,?,?,"Statement",1,"Q39","",null),
    (?,?,?,"Statement",1,"Q40","",null),
    (?,?,?,"Statement",1,"Q41","No","0"),
    (?,?,?,"Statement",1,"Q42","No","0"),
    (?,?,?,"Statement",1,"Q43","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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
//update VFP answer column to null
export const prePopulateSurveyVFP = (data, result) => {
  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score)
  VALUES
    (?,?,?,"Statement",1,"Q1","",null),
    (?,?,?,"Statement",1,"Q2","",null),
    (?,?,?,"Statement",1,"Q3","",null),
    (?,?,?,"Statement",1,"Q4","",null),
    (?,?,?,"Statement",1,"Q5","",null),
    (?,?,?,"Statement",1,"Q6","",null),
    (?,?,?,"Statement",1,"Q7","",null),
    (?,?,?,"Statement",1,"Q8","",null),
    (?,?,?,"Statement",1,"Q9","",null),
    (?,?,?,"Statement",1,"Q10","",null),
    (?,?,?,"Statement",1,"Q11","",null),
    (?,?,?,"Statement",1,"Q12","",null),
    (?,?,?,"Statement",1,"Q13","",null),
    (?,?,?,"Statement",1,"Q14","",null),
    (?,?,?,"Statement",1,"Q15","",null),
    (?,?,?,"Statement",1,"Q16","",null),
    (?,?,?,"Statement",1,"Q17","",null),
    (?,?,?,"Statement",1,"Q18","",null),
    (?,?,?,"Statement",1,"Q19","",null),
    (?,?,?,"Statement",1,"Q20","",null),
    (?,?,?,"Statement",1,"Q21","",null),
    (?,?,?,"Statement",1,"Q22","",null),
    (?,?,?,"Statement",1,"Q23","",null),
    (?,?,?,"Statement",1,"Q24","",null),
    (?,?,?,"Statement",1,"Q25","",null),
    (?,?,?,"Statement",1,"Q26","",null),
    (?,?,?,"Statement",1,"Q27","",null),
    (?,?,?,"Statement",1,"Q28","",null),
    (?,?,?,"Statement",1,"Q29","",null),
    (?,?,?,"Statement",1,"Q30","",null),
    (?,?,?,"Statement",1,"Q31","",null),
    (?,?,?,"Statement",1,"Q32","",null),
    (?,?,?,"Statement",1,"Q33","",null),
    (?,?,?,"Statement",1,"Q34","",null),
    (?,?,?,"Statement",1,"Q35","",null),
    (?,?,?,"Statement",1,"Q36","",null),
    (?,?,?,"Statement",1,"Q37","",null),
    (?,?,?,"Statement",1,"Q38","",null),
    (?,?,?,"Statement",1,"Q39","",null),
    (?,?,?,"Statement",1,"Q40","",null),
    (?,?,?,"Statement",1,"Q41","",null),
    (?,?,?,"Statement",1,"Q42","",null),
    (?,?,?,"Statement",1,"Q43","",null),
    (?,?,?,"Statement",1,"Q44","",null),
    (?,?,?,"Statement",1,"Q45","",null),
    (?,?,?,"Statement",1,"Q46","",null),
    (?,?,?,"Statement",1,"Q47","",null),
    (?,?,?,"Statement",1,"Q48","",null),
    (?,?,?,"Statement",1,"Q49","",null),
    (?,?,?,"Statement",1,"Q50","",null),
    (?,?,?,"Statement",1,"Q51","",null),
    (?,?,?,"Statement",1,"Q52","",null),
    (?,?,?,"Statement",1,"Q53","",null),
    (?,?,?,"Statement",1,"Q54","",null),
    (?,?,?,"Statement",1,"Q55","",null),
    (?,?,?,"Statement",1,"Q56","",null),
    (?,?,?,"Statement",1,"Q57","No","0"),
    (?,?,?,"Statement",1,"Q58","No","0"),
    (?,?,?,"Statement",1,"Q59","No","0")
  `
  db.query(query1,
    [
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id,
      data.survey_assignment_id, data.org_id, data.suborg_id
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

export const surveyBuilderPrepopulateM = (survey_assignment_id, org_id, suborg_id, data, result) => {
  // Construct the SQL query dynamically
  let query = 'INSERT INTO survey_result (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) VALUES ';
  data.forEach(record => {
    const { RecordType, RecordId, StatementNum, Answer, Score } = record;
    query += `(${survey_assignment_id}, ${org_id}, ${suborg_id}, '${RecordType}', ${RecordId}, '${StatementNum}', '${Answer}', ${Score}), `;
  });

  // Remove the trailing comma and space
  query = query.slice(0, -2);

  db.query(query, [],
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