import db from "../config/database.js"

export const Get360SurveyResultM = (survey_assignment_id, result) => {
  db.query(`
    SELECT
      sa.program_id,
      sa.iteration_id,
      sa.is_nomination,
      sa.parent_survey_assignment_id,
      sa.relationship_id,
      sa.survey_template_id,
      sa.ind_id,
      sa.coach_id,
      sa.coach_access_granted,
      sa.coach_group_access_granted,
      sa.hr_access_granted,
      sa.report_eligible_number_of_respondents,
      sr.*
    FROM survey_result sr
    LEFT JOIN survey_assignment sa
    ON sa.survey_assignment_id = sr.survey_assignment_id
    WHERE sr.survey_assignment_id = ?`,
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

export const teamLeaderInsertSurveyResultTraitsM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  let s1_org_id = data[0]['org_id'];
  let s1_suborg_id = data[0]['suborg_id'];

  //let pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
  //console.log ("pos value: " + pos );
  //console.log ("Q1_pos : "+ Q1_pos);
  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1');
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2');
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3');
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4');
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5');
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6');

  console.log("data Q1 pos score: " + data[Q1_pos]['score']);
  console.log("data Q2 pos score: " + data[Q2_pos]['score']);
  console.log("data Q3 pos score: " + data[Q3_pos]['score']);
  console.log("data Q4 pos score: " + data[Q4_pos]['score']);
  console.log("data Q5 pos score: " + data[Q5_pos]['score']);
  console.log("data Q6 pos score: " + data[Q6_pos]['score']);

  let Q1_score = data[Q1_pos]['score'];
  let Q2_score = data[Q2_pos]['score'];
  let Q3_score = data[Q3_pos]['score'];
  let Q4_score = data[Q4_pos]['score'];
  let Q5_score = data[Q5_pos]['score'];
  let Q6_score = data[Q6_pos]['score'];

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  // let KDY = ( Q1_score + Q2_score + Q3_score + Q4_score + Q5_score + Q6_score);
  // console.log("KDY Total:" + KDY);
  // KDY = KDY / 6;
  // console.log("KDY AVG:" + KDY);

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7');
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8');
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9');
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10');
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11');
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12');

  console.log("data Q7 pos score: " + data[Q7_pos]['score']);
  console.log("data Q8 pos score: " + data[Q8_pos]['score']);
  console.log("data Q9 pos score: " + data[Q9_pos]['score']);
  console.log("data Q10 pos score: " + data[Q10_pos]['score']);
  console.log("data Q11 pos score: " + data[Q11_pos]['score']);
  console.log("data Q12 pos score: " + data[Q12_pos]['score']);

  let Q7_score = data[Q7_pos]['score'];
  let Q8_score = data[Q8_pos]['score'];
  let Q9_score = data[Q9_pos]['score'];
  let Q10_score = data[Q10_pos]['score'];
  let Q11_score = data[Q11_pos]['score'];
  let Q12_score = data[Q12_pos]['score'];

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  // let DTO = (Q7_score + Q8_score + Q9_score + Q10_score + Q11_score + Q12_score);
  // console.log("DTO Total:" + DTO);
  // DTO = DTO / 6;
  // console.log("DTO AVG:" + DTO);


  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13');
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14');
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15');
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16');
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17');
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18');

  console.log("data Q13 pos score: " + data[Q13_pos]['score']);
  console.log("data Q14 pos score: " + data[Q14_pos]['score']);
  console.log("data Q15 pos score: " + data[Q15_pos]['score']);
  console.log("data Q16 pos score: " + data[Q16_pos]['score']);
  console.log("data Q17 pos score: " + data[Q17_pos]['score']);
  console.log("data Q18 pos score: " + data[Q18_pos]['score']);

  let Q13_score = data[Q13_pos]['score'];
  let Q14_score = data[Q14_pos]['score'];
  let Q15_score = data[Q15_pos]['score'];
  let Q16_score = data[Q16_pos]['score'];
  let Q17_score = data[Q17_pos]['score'];
  let Q18_score = data[Q18_pos]['score'];

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  // let CP = (Q13_score + Q14_score + Q15_score + Q16_score + Q17_score + Q18_score);
  // console.log("CP Total:" + CP);
  // CP = CP / 6;
  // console.log("CP AVG:" + CP);

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19');
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20');
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21');
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22');
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23');
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24');

  console.log("data Q19 pos score: " + data[Q19_pos]['score']);
  console.log("data Q20 pos score: " + data[Q20_pos]['score']);
  console.log("data Q21 pos score: " + data[Q21_pos]['score']);
  console.log("data Q22 pos score: " + data[Q22_pos]['score']);
  console.log("data Q23 pos score: " + data[Q23_pos]['score']);
  console.log("data Q24 pos score: " + data[Q24_pos]['score']);

  let Q19_score = data[Q19_pos]['score'];
  let Q20_score = data[Q20_pos]['score'];
  let Q21_score = data[Q21_pos]['score'];
  let Q22_score = data[Q22_pos]['score'];
  let Q23_score = data[Q23_pos]['score'];
  let Q24_score = data[Q24_pos]['score'];

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }


  // let SCP = ( Q19_score + Q20_score + Q21_score + Q22_score + Q23_score + Q24_score);
  // console.log("SCP Total:" + SCP);
  // SCP = SCP / 6;
  // console.log("SCP AVG:" + SCP);

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25');
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26');
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27');
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28');
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29');
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30');

  console.log("data Q25 pos score: " + data[Q25_pos]['score']);
  console.log("data Q26 pos score: " + data[Q26_pos]['score']);
  console.log("data Q27 pos score: " + data[Q27_pos]['score']);
  console.log("data Q28 pos score: " + data[Q28_pos]['score']);
  console.log("data Q29 pos score: " + data[Q29_pos]['score']);
  console.log("data Q30 pos score: " + data[Q30_pos]['score']);

  let Q25_score = data[Q25_pos]['score'];
  let Q26_score = data[Q26_pos]['score'];
  let Q27_score = data[Q27_pos]['score'];
  let Q28_score = data[Q28_pos]['score'];
  let Q29_score = data[Q29_pos]['score'];
  let Q30_score = data[Q30_pos]['score'];

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  // let LIC = ( Q25_score + Q26_score + Q27_score + Q28_score + Q29_score + Q30_score);
  // console.log("LIC Total:" + LIC);
  // LIC = LIC / 6;
  // console.log("LIC AVG:" + LIC);

  //! LDF
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31');
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32');
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33');
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34');
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35');
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36');

  console.log("data Q31 pos score: " + data[Q31_pos]['score']);
  console.log("data Q32 pos score: " + data[Q32_pos]['score']);
  console.log("data Q33 pos score: " + data[Q33_pos]['score']);
  console.log("data Q34 pos score: " + data[Q34_pos]['score']);
  console.log("data Q35 pos score: " + data[Q35_pos]['score']);
  console.log("data Q36 pos score: " + data[Q36_pos]['score']);

  let Q31_score = data[Q31_pos]['score'];
  let Q32_score = data[Q32_pos]['score'];
  let Q33_score = data[Q33_pos]['score'];
  let Q34_score = data[Q34_pos]['score'];
  let Q35_score = data[Q35_pos]['score'];
  let Q36_score = data[Q36_pos]['score'];

  let LDF = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LDFfinalDataset = arrayRemove(LDF, 0)
  let LDFsum = LDFfinalDataset.reduce((a, b) => a + b, 0)
  let LDFresult = LDFsum / LDFfinalDataset.length

  if (LDFsum === 0) {
    LDFresult = 0
  }

  // let LDF = ( Q31_score + Q32_score + Q33_score + Q34_score + Q35_score + Q36_score);
  // console.log("LDF Total:" +LDF);
  // LDF = LDF / 6;
  // console.log("LDF AVG:" + LDF);

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37');
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38');
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39');
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40');
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41');
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42');
  console.log("data Q37 pos score: " + data[Q37_pos]['score']);
  console.log("data Q38 pos score: " + data[Q38_pos]['score']);
  console.log("data Q39 pos score: " + data[Q39_pos]['score']);
  console.log("data Q40 pos score: " + data[Q40_pos]['score']);
  console.log("data Q41 pos score: " + data[Q41_pos]['score']);
  console.log("data Q42 pos score: " + data[Q42_pos]['score']);

  let CII1 = data[Q37_pos]['score'];
  let CII2 = data[Q38_pos]['score'];
  let CII3 = data[Q39_pos]['score'];
  let CII4 = data[Q40_pos]['score'];
  let CII5 = data[Q41_pos]['score'];
  let CII6 = data[Q42_pos]['score'];

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43');
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44');
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45');
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46');
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47');
  console.log("data Q43 pos answer: " + data[Q43_pos]['answer']);
  console.log("data Q44 pos answer: " + data[Q44_pos]['answer']);
  console.log("data Q45 pos answer: " + data[Q45_pos]['answer']);
  console.log("data Q46 pos answer: " + data[Q46_pos]['answer']);
  console.log("data Q47 pos answer: " + data[Q47_pos]['answer']);

  let OEQ1 = data[Q43_pos]['answer'];
  let OEQ2 = data[Q44_pos]['answer'];
  let OEQ3 = data[Q45_pos]['answer'];
  let OEQ4 = data[Q46_pos]['answer'];
  let OEQ5 = data[Q47_pos]['answer'];

  //! ERX | EX | OX | AX | CX
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48');
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49');
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50');
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51');
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52');

  let ERX
  if (Q48_pos == -1) {
    ERX = 0
    console.log("ERX -1");
  } else {
    ERX = data[Q48_pos]['score'];
    console.log("ERX +1");
  }

  let EX
  if (Q49_pos == -1) {
    EX = 0
    console.log("EX -1");
  } else {
    EX = data[Q49_pos]['score'];
    console.log("ERX +1");
  }

  let OX
  if (Q50_pos == -1) {
    OX = 0
    console.log("OX -1");
  } else {
    OX = data[Q50_pos]['score'];
  }

  let AX
  if (Q51_pos == -1) {
    AX = 0
  } else {
    AX = data[Q51_pos]['score'];
  }

  let CX
  if (Q52_pos == -1) {
    CX = 0
  } else {
    CX = data[Q52_pos]['score'];
  }

  let KDY1 = data[Q1_pos]['score'];
  let KDY2 = data[Q2_pos]['score'];
  let KDY3 = data[Q3_pos]['score'];
  let KDY4 = data[Q4_pos]['score'];
  let KDY5 = data[Q5_pos]['score'];
  let KDY6 = data[Q6_pos]['score'];

  let DTO1 = data[Q7_pos]['score'];
  let DTO2 = data[Q8_pos]['score'];
  let DTO3 = data[Q9_pos]['score'];
  let DTO4 = data[Q10_pos]['score'];
  let DTO5 = data[Q11_pos]['score'];
  let DTO6 = data[Q12_pos]['score'];

  let CP1 = data[Q13_pos]['score'];
  let CP2 = data[Q14_pos]['score'];
  let CP3 = data[Q15_pos]['score'];
  let CP4 = data[Q16_pos]['score'];
  let CP5 = data[Q17_pos]['score'];
  let CP6 = data[Q18_pos]['score'];

  let SCP1 = data[Q19_pos]['score'];
  let SCP2 = data[Q20_pos]['score'];
  let SCP3 = data[Q21_pos]['score'];
  let SCP4 = data[Q22_pos]['score'];
  let SCP5 = data[Q23_pos]['score'];
  let SCP6 = data[Q24_pos]['score'];

  let LIC1 = data[Q25_pos]['score'];
  let LIC2 = data[Q26_pos]['score'];
  let LIC3 = data[Q27_pos]['score'];
  let LIC4 = data[Q28_pos]['score'];
  let LIC5 = data[Q29_pos]['score'];
  let LIC6 = data[Q30_pos]['score'];

  let LDF1 = data[Q31_pos]['score'];
  let LDF2 = data[Q32_pos]['score'];
  let LDF3 = data[Q33_pos]['score'];
  let LDF4 = data[Q34_pos]['score'];
  let LDF5 = data[Q35_pos]['score'];
  let LDF6 = data[Q36_pos]['score'];


  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) 
  VALUES 
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY",
      "",
      ${KDYresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO",
      "",
      ${DTOresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP",
      "",
      ${CPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP",
      "",
      ${SCPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC",
      "",
      ${LICresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF",
      "",
      ${LDFresult}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY1",
      "",
      ${KDY1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY2",
      "",
      ${KDY2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY3",
      "",
      ${KDY3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY4",
      "",
      ${KDY4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY5",
      "",
      ${KDY5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY6",
      "",
      ${KDY6}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO1",
      "",
      ${DTO1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO2",
      "",
      ${DTO2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO3",
      "",
      ${DTO3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO4",
      "",
      ${DTO4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO5",
      "",
      ${DTO5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO6",
      "",
      ${DTO6}
    ),
   
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP1",
      "",
      ${CP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP2",
      "",
      ${CP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP3",
      "",
      ${CP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP4",
      "",
      ${CP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP5",
      "",
      ${CP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP6",
      "",
      ${CP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP1",
      "",
      ${SCP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP2",
      "",
      ${SCP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP3",
      "",
      ${SCP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP4",
      "",
      ${SCP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP5",
      "",
      ${SCP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP6",
      "",
      ${SCP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC1",
      "",
      ${LIC1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC2",
      "",
      ${LIC2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC3",
      "",
      ${LIC3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC4",
      "",
      ${LIC4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC5",
      "",
      ${LIC5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC6",
      "",
      ${LIC6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF1",
      "",
      ${LDF1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF2",
      "",
      ${LDF2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF3",
      "",
      ${LDF3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF4",
      "",
      ${LDF4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF5",
      "",
      ${LDF5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF6",
      "",
      ${LDF6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII1",
      "",
      ${CII1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII2",
      "",
      ${CII2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII3",
      "",
      ${CII3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII4",
      "",
      ${CII4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII5",
      "",
      ${CII5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII6",
      "",
      ${CII6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ1",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ2",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ3",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ4",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ5",
      ?,
      0
    ),
    

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "ERX",
      "",
      ${ERX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EX",
      "",
      ${EX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OX",
      "",
      ${OX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "AX",
      "",
      ${AX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CX",
      "",
      ${CX}
    )

  `
  console.log(query1)



  db.query(query1,
    [OEQ1, OEQ2, OEQ3, OEQ4, OEQ5],
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

export const generalManagerInsertSurveyResultTraitsM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q7_score = data[Q7_pos]['score']
  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']
  let Q30_score = data[Q30_pos]['score']

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! LDF
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')

  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']
  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']

  let LDF = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LDFfinalDataset = arrayRemove(LDF, 0)
  let LDFsum = LDFfinalDataset.reduce((a, b) => a + b, 0)
  let LDFresult = LDFsum / LDFfinalDataset.length

  if (LDFsum === 0) {
    LDFresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')

  let CII1 = data[Q37_pos]['score']
  let CII2 = data[Q38_pos]['score']
  let CII3 = data[Q39_pos]['score']
  let CII4 = data[Q40_pos]['score']
  let CII5 = data[Q41_pos]['score']
  let CII6 = data[Q42_pos]['score']

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')

  let OEQ1 = data[Q43_pos]['answer']
  let OEQ2 = data[Q44_pos]['answer']
  let OEQ3 = data[Q45_pos]['answer']
  let OEQ4 = data[Q46_pos]['answer']
  let OEQ5 = data[Q47_pos]['answer']

  //! ERX | EX | OX | AX | CX
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52')

  let ERX
  if (Q48_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q48_pos]['score']
  }

  let EX
  if (Q49_pos == -1) {
    EX = 0
  } else {
    EX = data[Q49_pos]['score']
  }

  let OX
  if (Q50_pos == -1) {
    OX = 0
  } else {
    OX = data[Q50_pos]['score']
  }

  let AX
  if (Q51_pos == -1) {
    AX = 0
  } else {
    AX = data[Q51_pos]['score']
  }

  let CX
  if (Q52_pos == -1) {
    CX = 0
  } else {
    CX = data[Q52_pos]['score']
  }

  let KDY1 = data[Q1_pos]['score']
  let KDY2 = data[Q2_pos]['score']
  let KDY3 = data[Q3_pos]['score']
  let KDY4 = data[Q4_pos]['score']
  let KDY5 = data[Q5_pos]['score']
  let KDY6 = data[Q6_pos]['score']

  let DTO1 = data[Q7_pos]['score']
  let DTO2 = data[Q8_pos]['score']
  let DTO3 = data[Q9_pos]['score']
  let DTO4 = data[Q10_pos]['score']
  let DTO5 = data[Q11_pos]['score']
  let DTO6 = data[Q12_pos]['score']

  let CP1 = data[Q13_pos]['score']
  let CP2 = data[Q14_pos]['score']
  let CP3 = data[Q15_pos]['score']
  let CP4 = data[Q16_pos]['score']
  let CP5 = data[Q17_pos]['score']
  let CP6 = data[Q18_pos]['score']

  let SCP1 = data[Q19_pos]['score']
  let SCP2 = data[Q20_pos]['score']
  let SCP3 = data[Q21_pos]['score']
  let SCP4 = data[Q22_pos]['score']
  let SCP5 = data[Q23_pos]['score']
  let SCP6 = data[Q24_pos]['score']

  let LIC1 = data[Q25_pos]['score']
  let LIC2 = data[Q26_pos]['score']
  let LIC3 = data[Q27_pos]['score']
  let LIC4 = data[Q28_pos]['score']
  let LIC5 = data[Q29_pos]['score']
  let LIC6 = data[Q30_pos]['score']

  let LDF1 = data[Q31_pos]['score']
  let LDF2 = data[Q32_pos]['score']
  let LDF3 = data[Q33_pos]['score']
  let LDF4 = data[Q34_pos]['score']
  let LDF5 = data[Q35_pos]['score']
  let LDF6 = data[Q36_pos]['score']


  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) 
  VALUES 
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY",
      "",
      ${KDYresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO",
      "",
      ${DTOresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP",
      "",
      ${CPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP",
      "",
      ${SCPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC",
      "",
      ${LICresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF",
      "",
      ${LDFresult}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY1",
      "",
      ${KDY1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY2",
      "",
      ${KDY2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY3",
      "",
      ${KDY3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY4",
      "",
      ${KDY4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY5",
      "",
      ${KDY5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY6",
      "",
      ${KDY6}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO1",
      "",
      ${DTO1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO2",
      "",
      ${DTO2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO3",
      "",
      ${DTO3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO4",
      "",
      ${DTO4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO5",
      "",
      ${DTO5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO6",
      "",
      ${DTO6}
    ),
   
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP1",
      "",
      ${CP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP2",
      "",
      ${CP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP3",
      "",
      ${CP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP4",
      "",
      ${CP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP5",
      "",
      ${CP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP6",
      "",
      ${CP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP1",
      "",
      ${SCP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP2",
      "",
      ${SCP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP3",
      "",
      ${SCP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP4",
      "",
      ${SCP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP5",
      "",
      ${SCP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP6",
      "",
      ${SCP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC1",
      "",
      ${LIC1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC2",
      "",
      ${LIC2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC3",
      "",
      ${LIC3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC4",
      "",
      ${LIC4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC5",
      "",
      ${LIC5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC6",
      "",
      ${LIC6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF1",
      "",
      ${LDF1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF2",
      "",
      ${LDF2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF3",
      "",
      ${LDF3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF4",
      "",
      ${LDF4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF5",
      "",
      ${LDF5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF6",
      "",
      ${LDF6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII1",
      "",
      ${CII1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII2",
      "",
      ${CII2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII3",
      "",
      ${CII3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII4",
      "",
      ${CII4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII5",
      "",
      ${CII5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII6",
      "",
      ${CII6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ1",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ2",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ3",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ4",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ5",
      ?,
      0
    ),
    

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "ERX",
      "",
      ${ERX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EX",
      "",
      ${EX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OX",
      "",
      ${OX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "AX",
      "",
      ${AX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CX",
      "",
      ${CX}
    )

  `

  db.query(query1,
    [OEQ1, OEQ2, OEQ3, OEQ4, OEQ5],
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

export const seniorExecProgramInsertSurveyResultTraitsM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  let s1_org_id = data[0]['org_id'];
  let s1_suborg_id = data[0]['suborg_id'];

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1');
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2');
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3');
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4');
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5');
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6');

  let Q1_score = data[Q1_pos]['score'];
  let Q2_score = data[Q2_pos]['score'];
  let Q3_score = data[Q3_pos]['score'];
  let Q4_score = data[Q4_pos]['score'];
  let Q5_score = data[Q5_pos]['score'];
  let Q6_score = data[Q6_pos]['score'];

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7');
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8');
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9');
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10');
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11');
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12');

  let Q7_score = data[Q7_pos]['score'];
  let Q8_score = data[Q8_pos]['score'];
  let Q9_score = data[Q9_pos]['score'];
  let Q10_score = data[Q10_pos]['score'];
  let Q11_score = data[Q11_pos]['score'];
  let Q12_score = data[Q12_pos]['score'];

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13');
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14');
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15');
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16');
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17');
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18');

  let Q13_score = data[Q13_pos]['score'];
  let Q14_score = data[Q14_pos]['score'];
  let Q15_score = data[Q15_pos]['score'];
  let Q16_score = data[Q16_pos]['score'];
  let Q17_score = data[Q17_pos]['score'];
  let Q18_score = data[Q18_pos]['score'];

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19');
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20');
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21');
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22');
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23');
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24');

  let Q19_score = data[Q19_pos]['score'];
  let Q20_score = data[Q20_pos]['score'];
  let Q21_score = data[Q21_pos]['score'];
  let Q22_score = data[Q22_pos]['score'];
  let Q23_score = data[Q23_pos]['score'];
  let Q24_score = data[Q24_pos]['score'];

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25');
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26');
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27');
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28');
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29');
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30');

  let Q25_score = data[Q25_pos]['score'];
  let Q26_score = data[Q26_pos]['score'];
  let Q27_score = data[Q27_pos]['score'];
  let Q28_score = data[Q28_pos]['score'];
  let Q29_score = data[Q29_pos]['score'];
  let Q30_score = data[Q30_pos]['score'];

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! LDF
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31');
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32');
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33');
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34');
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35');
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36');

  let Q31_score = data[Q31_pos]['score'];
  let Q32_score = data[Q32_pos]['score'];
  let Q33_score = data[Q33_pos]['score'];
  let Q34_score = data[Q34_pos]['score'];
  let Q35_score = data[Q35_pos]['score'];
  let Q36_score = data[Q36_pos]['score'];

  let LDF = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LDFfinalDataset = arrayRemove(LDF, 0)
  let LDFsum = LDFfinalDataset.reduce((a, b) => a + b, 0)
  let LDFresult = LDFsum / LDFfinalDataset.length

  if (LDFsum === 0) {
    LDFresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37');
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38');
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39');
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40');
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41');
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42');

  let CII1 = data[Q37_pos]['score'];
  let CII2 = data[Q38_pos]['score'];
  let CII3 = data[Q39_pos]['score'];
  let CII4 = data[Q40_pos]['score'];
  let CII5 = data[Q41_pos]['score'];
  let CII6 = data[Q42_pos]['score'];

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43');
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44');
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45');
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46');
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47');
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48');
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49');

  let OEQ1 = data[Q43_pos]['answer'];
  let OEQ2 = data[Q44_pos]['answer'];
  let OEQ3 = data[Q45_pos]['answer'];
  let OEQ4 = data[Q46_pos]['answer'];
  let OEQ5 = data[Q47_pos]['answer'];
  let OEQ6 = data[Q48_pos]['answer'];
  let OEQ7 = data[Q49_pos]['answer'];

  //! ERX | EX | OX | AX | CX
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50');
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51');
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52');
  let Q53_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q53');
  let Q54_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q54');

  let ERX
  if (Q50_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q50_pos]['score'];
  }

  let EX
  if (Q51_pos == -1) {
    EX = 0
  } else {
    EX = data[Q51_pos]['score'];
  }

  let OX
  if (Q52_pos == -1) {
    OX = 0
  } else {
    OX = data[Q52_pos]['score'];
  }

  let AX
  if (Q53_pos == -1) {
    AX = 0
  } else {
    AX = data[Q53_pos]['score'];
  }

  let CX
  if (Q54_pos == -1) {
    CX = 0
  } else {
    CX = data[Q54_pos]['score'];
  }

  let KDY1 = data[Q1_pos]['score'];
  let KDY2 = data[Q2_pos]['score'];
  let KDY3 = data[Q3_pos]['score'];
  let KDY4 = data[Q4_pos]['score'];
  let KDY5 = data[Q5_pos]['score'];
  let KDY6 = data[Q6_pos]['score'];

  let DTO1 = data[Q7_pos]['score'];
  let DTO2 = data[Q8_pos]['score'];
  let DTO3 = data[Q9_pos]['score'];
  let DTO4 = data[Q10_pos]['score'];
  let DTO5 = data[Q11_pos]['score'];
  let DTO6 = data[Q12_pos]['score'];

  let CP1 = data[Q13_pos]['score'];
  let CP2 = data[Q14_pos]['score'];
  let CP3 = data[Q15_pos]['score'];
  let CP4 = data[Q16_pos]['score'];
  let CP5 = data[Q17_pos]['score'];
  let CP6 = data[Q18_pos]['score'];

  let SCP1 = data[Q19_pos]['score'];
  let SCP2 = data[Q20_pos]['score'];
  let SCP3 = data[Q21_pos]['score'];
  let SCP4 = data[Q22_pos]['score'];
  let SCP5 = data[Q23_pos]['score'];
  let SCP6 = data[Q24_pos]['score'];

  let LIC1 = data[Q25_pos]['score'];
  let LIC2 = data[Q26_pos]['score'];
  let LIC3 = data[Q27_pos]['score'];
  let LIC4 = data[Q28_pos]['score'];
  let LIC5 = data[Q29_pos]['score'];
  let LIC6 = data[Q30_pos]['score'];

  let LDF1 = data[Q31_pos]['score'];
  let LDF2 = data[Q32_pos]['score'];
  let LDF3 = data[Q33_pos]['score'];
  let LDF4 = data[Q34_pos]['score'];
  let LDF5 = data[Q35_pos]['score'];
  let LDF6 = data[Q36_pos]['score'];


  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) 
  VALUES 
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY",
      "",
      ${KDYresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO",
      "",
      ${DTOresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP",
      "",
      ${CPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP",
      "",
      ${SCPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC",
      "",
      ${LICresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF",
      "",
      ${LDFresult}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY1",
      "",
      ${KDY1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY2",
      "",
      ${KDY2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY3",
      "",
      ${KDY3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY4",
      "",
      ${KDY4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY5",
      "",
      ${KDY5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY6",
      "",
      ${KDY6}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO1",
      "",
      ${DTO1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO2",
      "",
      ${DTO2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO3",
      "",
      ${DTO3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO4",
      "",
      ${DTO4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO5",
      "",
      ${DTO5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO6",
      "",
      ${DTO6}
    ),
   
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP1",
      "",
      ${CP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP2",
      "",
      ${CP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP3",
      "",
      ${CP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP4",
      "",
      ${CP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP5",
      "",
      ${CP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP6",
      "",
      ${CP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP1",
      "",
      ${SCP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP2",
      "",
      ${SCP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP3",
      "",
      ${SCP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP4",
      "",
      ${SCP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP5",
      "",
      ${SCP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP6",
      "",
      ${SCP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC1",
      "",
      ${LIC1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC2",
      "",
      ${LIC2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC3",
      "",
      ${LIC3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC4",
      "",
      ${LIC4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC5",
      "",
      ${LIC5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC6",
      "",
      ${LIC6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF1",
      "",
      ${LDF1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF2",
      "",
      ${LDF2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF3",
      "",
      ${LDF3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF4",
      "",
      ${LDF4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF5",
      "",
      ${LDF5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LDF6",
      "",
      ${LDF6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII1",
      "",
      ${CII1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII2",
      "",
      ${CII2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII3",
      "",
      ${CII3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII4",
      "",
      ${CII4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII5",
      "",
      ${CII5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII6",
      "",
      ${CII6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ1",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ2",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ3",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ4",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ5",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ6",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ7",
      ?,
      0
    ),
    

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "ERX",
      "",
      ${ERX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EX",
      "",
      ${EX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OX",
      "",
      ${OX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "AX",
      "",
      ${AX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CX",
      "",
      ${CX}
    )

  `
  console.log(query1)

  db.query(query1,
    [OEQ1, OEQ2, OEQ3, OEQ4, OEQ5, OEQ6, OEQ7],
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

export const talensageInsertSurveyResultTraitsM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  let s1_org_id = data[0]['org_id'];
  let s1_suborg_id = data[0]['suborg_id'];

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1');
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2');
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3');
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4');
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5');
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6');

  let Q1_score = data[Q1_pos]['score'];
  let Q2_score = data[Q2_pos]['score'];
  let Q3_score = data[Q3_pos]['score'];
  let Q4_score = data[Q4_pos]['score'];
  let Q5_score = data[Q5_pos]['score'];
  let Q6_score = data[Q6_pos]['score'];

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7');
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8');
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9');
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10');
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11');
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12');

  let Q7_score = data[Q7_pos]['score'];
  let Q8_score = data[Q8_pos]['score'];
  let Q9_score = data[Q9_pos]['score'];
  let Q10_score = data[Q10_pos]['score'];
  let Q11_score = data[Q11_pos]['score'];
  let Q12_score = data[Q12_pos]['score'];

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13');
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14');
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15');
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16');
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17');
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18');

  let Q13_score = data[Q13_pos]['score'];
  let Q14_score = data[Q14_pos]['score'];
  let Q15_score = data[Q15_pos]['score'];
  let Q16_score = data[Q16_pos]['score'];
  let Q17_score = data[Q17_pos]['score'];
  let Q18_score = data[Q18_pos]['score'];

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19');
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20');
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21');
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22');
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23');
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24');

  let Q19_score = data[Q19_pos]['score'];
  let Q20_score = data[Q20_pos]['score'];
  let Q21_score = data[Q21_pos]['score'];
  let Q22_score = data[Q22_pos]['score'];
  let Q23_score = data[Q23_pos]['score'];
  let Q24_score = data[Q24_pos]['score'];

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25');
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26');
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27');
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28');
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29');
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30');

  let Q25_score = data[Q25_pos]['score'];
  let Q26_score = data[Q26_pos]['score'];
  let Q27_score = data[Q27_pos]['score'];
  let Q28_score = data[Q28_pos]['score'];
  let Q29_score = data[Q29_pos]['score'];
  let Q30_score = data[Q30_pos]['score'];

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! EUSO
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31');
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32');
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33');
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34');
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35');
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36');

  let Q31_score = data[Q31_pos]['score'];
  let Q32_score = data[Q32_pos]['score'];
  let Q33_score = data[Q33_pos]['score'];
  let Q34_score = data[Q34_pos]['score'];
  let Q35_score = data[Q35_pos]['score'];
  let Q36_score = data[Q36_pos]['score'];

  let EUSO = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let EUSOfinalDataset = arrayRemove(EUSO, 0)
  let EUSOsum = EUSOfinalDataset.reduce((a, b) => a + b, 0)
  let EUSOresult = EUSOsum / EUSOfinalDataset.length

  if (EUSOsum === 0) {
    EUSOresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37');
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38');
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39');
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40');
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41');
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42');

  let CII1 = data[Q37_pos]['score'];
  let CII2 = data[Q38_pos]['score'];
  let CII3 = data[Q39_pos]['score'];
  let CII4 = data[Q40_pos]['score'];
  let CII5 = data[Q41_pos]['score'];
  let CII6 = data[Q42_pos]['score'];

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43');
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44');
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45');
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46');

  let OEQ1 = data[Q43_pos]['answer'];
  let OEQ2 = data[Q44_pos]['answer'];
  let OEQ3 = data[Q45_pos]['answer'];
  let OEQ4 = data[Q46_pos]['answer'];

  //! ERX | EX | OX | AX | CX
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47');
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48');
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49');
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50');
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51');

  let ERX
  if (Q47_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q47_pos]['score'];
  }

  let EX
  if (Q48_pos == -1) {
    EX = 0
  } else {
    EX = data[Q48_pos]['score'];
  }

  let OX
  if (Q49_pos == -1) {
    OX = 0
  } else {
    OX = data[Q49_pos]['score'];
  }

  let AX
  if (Q50_pos == -1) {
    AX = 0
  } else {
    AX = data[Q50_pos]['score'];
  }

  let CX
  if (Q51_pos == -1) {
    CX = 0
  } else {
    CX = data[Q51_pos]['score'];
  }

  let KDY1 = data[Q1_pos]['score'];
  let KDY2 = data[Q2_pos]['score'];
  let KDY3 = data[Q3_pos]['score'];
  let KDY4 = data[Q4_pos]['score'];
  let KDY5 = data[Q5_pos]['score'];
  let KDY6 = data[Q6_pos]['score'];

  let DTO1 = data[Q7_pos]['score'];
  let DTO2 = data[Q8_pos]['score'];
  let DTO3 = data[Q9_pos]['score'];
  let DTO4 = data[Q10_pos]['score'];
  let DTO5 = data[Q11_pos]['score'];
  let DTO6 = data[Q12_pos]['score'];

  let CP1 = data[Q13_pos]['score'];
  let CP2 = data[Q14_pos]['score'];
  let CP3 = data[Q15_pos]['score'];
  let CP4 = data[Q16_pos]['score'];
  let CP5 = data[Q17_pos]['score'];
  let CP6 = data[Q18_pos]['score'];

  let SCP1 = data[Q19_pos]['score'];
  let SCP2 = data[Q20_pos]['score'];
  let SCP3 = data[Q21_pos]['score'];
  let SCP4 = data[Q22_pos]['score'];
  let SCP5 = data[Q23_pos]['score'];
  let SCP6 = data[Q24_pos]['score'];

  let LIC1 = data[Q25_pos]['score'];
  let LIC2 = data[Q26_pos]['score'];
  let LIC3 = data[Q27_pos]['score'];
  let LIC4 = data[Q28_pos]['score'];
  let LIC5 = data[Q29_pos]['score'];
  let LIC6 = data[Q30_pos]['score'];

  let EUSO1 = data[Q31_pos]['score'];
  let EUSO2 = data[Q32_pos]['score'];
  let EUSO3 = data[Q33_pos]['score'];
  let EUSO4 = data[Q34_pos]['score'];
  let EUSO5 = data[Q35_pos]['score'];
  let EUSO6 = data[Q36_pos]['score'];


  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) 
  VALUES 
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY",
      "",
      ${KDYresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO",
      "",
      ${DTOresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP",
      "",
      ${CPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP",
      "",
      ${SCPresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC",
      "",
      ${LICresult}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO",
      "",
      ${EUSOresult}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY1",
      "",
      ${KDY1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY2",
      "",
      ${KDY2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY3",
      "",
      ${KDY3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY4",
      "",
      ${KDY4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY5",
      "",
      ${KDY5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "KDY6",
      "",
      ${KDY6}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO1",
      "",
      ${DTO1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO2",
      "",
      ${DTO2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO3",
      "",
      ${DTO3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO4",
      "",
      ${DTO4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO5",
      "",
      ${DTO5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "DTO6",
      "",
      ${DTO6}
    ),
   
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP1",
      "",
      ${CP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP2",
      "",
      ${CP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP3",
      "",
      ${CP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP4",
      "",
      ${CP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP5",
      "",
      ${CP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CP6",
      "",
      ${CP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP1",
      "",
      ${SCP1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP2",
      "",
      ${SCP2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP3",
      "",
      ${SCP3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP4",
      "",
      ${SCP4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP5",
      "",
      ${SCP5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "SCP6",
      "",
      ${SCP6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC1",
      "",
      ${LIC1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC2",
      "",
      ${LIC2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC3",
      "",
      ${LIC3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC4",
      "",
      ${LIC4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC5",
      "",
      ${LIC5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "LIC6",
      "",
      ${LIC6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO1",
      "",
      ${EUSO1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO2",
      "",
      ${EUSO2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO3",
      "",
      ${EUSO3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO4",
      "",
      ${EUSO4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO5",
      "",
      ${EUSO5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EUSO6",
      "",
      ${EUSO6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII1",
      "",
      ${CII1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII2",
      "",
      ${CII2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII3",
      "",
      ${CII3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII4",
      "",
      ${CII4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII5",
      "",
      ${CII5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CII6",
      "",
      ${CII6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ1",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ2",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ3",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OEQ4",
      ?,
      0
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "ERX",
      "",
      ${ERX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "EX",
      "",
      ${EX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "OX",
      "",
      ${OX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "AX",
      "",
      ${AX}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Cohort",
      4,
      "CX",
      "",
      ${CX}
    )

  `
  console.log(query1)

  db.query(query1,
    [OEQ1, OEQ2, OEQ3, OEQ4],
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

//TODO RE-ARCHITECTURE
export const generalManagerInsertRawCalcM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value
    })
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_is_nomination = data[0]['is_nomination']
  let s1_survey_template_id = data[0]['survey_template_id']
  let s1_coach_id = data[0]['coach_id']
  let s1_coach_access_granted = data[0]['coach_access_granted']
  let s1_coach_group_access_granted = data[0]['coach_group_access_granted']
  let s1_hr_access_granted = data[0]['hr_access_granted']
  let s1_report_eligible_number_of_respondents = data[0]['survey_template_id']
  let s1_ind_id = data[0]['ind_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  let s1_program_id = data[0]['program_id']
  let s1_iteration_id = data[0]['iteration_id']
  let s1_nomination_survey_assignment_id = 0
  let s1_relationship_id = 0
  let s1_parent_survey_assignment_id = 0
  let main_survey_assignment_id = data[0]['survey_assignment_id']

  if (s1_is_nomination === 1) {
    s1_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_nomination_survey_assignment_id = data[0]['survey_assignment_id']
    s1_parent_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_relationship_id = data[0]['relationship_id']
  }

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q7_score = data[Q7_pos]['score']
  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']
  let Q30_score = data[Q30_pos]['score']

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! LDF
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')

  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']
  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']

  let LDF = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LDFfinalDataset = arrayRemove(LDF, 0)
  let LDFsum = LDFfinalDataset.reduce((a, b) => a + b, 0)
  let LDFresult = LDFsum / LDFfinalDataset.length

  if (LDFsum === 0) {
    LDFresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')

  let CII1 = data[Q37_pos]['score']
  let CII2 = data[Q38_pos]['score']
  let CII3 = data[Q39_pos]['score']
  let CII4 = data[Q40_pos]['score']
  let CII5 = data[Q41_pos]['score']
  let CII6 = data[Q42_pos]['score']

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')

  let OEQ1 = data[Q43_pos]['answer']
  let OEQ2 = data[Q44_pos]['answer']
  let OEQ3 = data[Q45_pos]['answer']
  let OEQ4 = data[Q46_pos]['answer']
  let OEQ5 = data[Q47_pos]['answer']

  //! ERX | EX | OX | AX | CX
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52')

  let ERX
  if (Q48_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q48_pos]['score']
  }

  let EX
  if (Q49_pos == -1) {
    EX = 0
  } else {
    EX = data[Q49_pos]['score']
  }

  let OX
  if (Q50_pos == -1) {
    OX = 0
  } else {
    OX = data[Q50_pos]['score']
  }

  let AX
  if (Q51_pos == -1) {
    AX = 0
  } else {
    AX = data[Q51_pos]['score']
  }

  let CX
  if (Q52_pos == -1) {
    CX = 0
  } else {
    CX = data[Q52_pos]['score']
  }

  let KDY1 = data[Q1_pos]['score']
  let KDY2 = data[Q2_pos]['score']
  let KDY3 = data[Q3_pos]['score']
  let KDY4 = data[Q4_pos]['score']
  let KDY5 = data[Q5_pos]['score']
  let KDY6 = data[Q6_pos]['score']

  let DTO1 = data[Q7_pos]['score']
  let DTO2 = data[Q8_pos]['score']
  let DTO3 = data[Q9_pos]['score']
  let DTO4 = data[Q10_pos]['score']
  let DTO5 = data[Q11_pos]['score']
  let DTO6 = data[Q12_pos]['score']

  let CP1 = data[Q13_pos]['score']
  let CP2 = data[Q14_pos]['score']
  let CP3 = data[Q15_pos]['score']
  let CP4 = data[Q16_pos]['score']
  let CP5 = data[Q17_pos]['score']
  let CP6 = data[Q18_pos]['score']

  let SCP1 = data[Q19_pos]['score']
  let SCP2 = data[Q20_pos]['score']
  let SCP3 = data[Q21_pos]['score']
  let SCP4 = data[Q22_pos]['score']
  let SCP5 = data[Q23_pos]['score']
  let SCP6 = data[Q24_pos]['score']

  let LIC1 = data[Q25_pos]['score']
  let LIC2 = data[Q26_pos]['score']
  let LIC3 = data[Q27_pos]['score']
  let LIC4 = data[Q28_pos]['score']
  let LIC5 = data[Q29_pos]['score']
  let LIC6 = data[Q30_pos]['score']

  let LDF1 = data[Q31_pos]['score']
  let LDF2 = data[Q32_pos]['score']
  let LDF3 = data[Q33_pos]['score']
  let LDF4 = data[Q34_pos]['score']
  let LDF5 = data[Q35_pos]['score']
  let LDF6 = data[Q36_pos]['score']


  let query1 = `
    INSERT INTO r360_raw 
      (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,

        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6,
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6,
        CP, CP1, CP2, CP3, CP4, CP5, CP6,
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6,
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6,
        LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6,
        CII1, CII2, CII3, CII4, CII5, CII6, 
        ERX, EX, OX, AX, CX, 
        OEQ1, OEQ2, OEQ3, OEQ4, OEQ5
      ) 
    VALUES
      (
        ${s1_survey_assignment_id},
        ${s1_is_nomination},
        ${s1_nomination_survey_assignment_id},
        ${s1_relationship_id},
        ${s1_parent_survey_assignment_id},
        ${s1_survey_template_id},
        ${s1_ind_id},
        ${s1_coach_id},
        ${s1_coach_access_granted},
        ${s1_coach_group_access_granted},
        ${s1_hr_access_granted},
        ${s1_report_eligible_number_of_respondents},
        
        ${s1_org_id},
        ${s1_suborg_id},
        ${s1_program_id},
        ${s1_iteration_id},
        
        ${KDYresult},
        ${KDY1},
        ${KDY2},
        ${KDY3},
        ${KDY4},
        ${KDY5},
        ${KDY6},
        
        ${DTOresult},
        ${DTO1},
        ${DTO2},
        ${DTO3},
        ${DTO4},
        ${DTO5},
        ${DTO6},
        
        ${CPresult},
        ${CP1},
        ${CP2},
        ${CP3},
        ${CP4},
        ${CP5},
        ${CP6},
        
        ${SCPresult},
        ${SCP1},
        ${SCP2},
        ${SCP3},
        ${SCP4},
        ${SCP5},
        ${SCP6},
        
        ${LICresult},
        ${LIC1},
        ${LIC2},
        ${LIC3},
        ${LIC4},
        ${LIC5},
        ${LIC6},
        
        ${LDFresult},
        ${LDF1},
        ${LDF2},
        ${LDF3},
        ${LDF4},
        ${LDF5},
        ${LDF6},
        
        ${CII1},
        ${CII2},
        ${CII3},
        ${CII4},
        ${CII5},
        ${CII6},
        
        ${ERX},
        ${EX},
        ${OX},
        ${AX},
        ${CX},
        
        ?,
        ?,
        ?,
        ?,
        ?
      ) 
  `

  console.log(query1)
  db.query
    (
      query1,
      [OEQ1, OEQ2, OEQ3, OEQ4, OEQ5],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
          console.log(query2)

          db.query
            (
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2)
                  //result(null, results)

                  let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                  db.query
                    (
                      query3,
                      [],
                      (err, results) => {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                    )
                }
              }
            )
          result(null, results)
        }
      }
    )
}

export const teamLeaderInsertRawCalcM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value
    })
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_is_nomination = data[0]['is_nomination']
  let s1_survey_template_id = data[0]['survey_template_id']
  let s1_coach_id = data[0]['coach_id']
  let s1_coach_access_granted = data[0]['coach_access_granted']
  let s1_coach_group_access_granted = data[0]['coach_group_access_granted']
  let s1_hr_access_granted = data[0]['hr_access_granted']
  let s1_report_eligible_number_of_respondents = data[0]['survey_template_id']
  let s1_ind_id = data[0]['ind_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  let s1_program_id = data[0]['program_id']
  let s1_iteration_id = data[0]['iteration_id']
  let s1_nomination_survey_assignment_id = 0
  let s1_relationship_id = 0
  let s1_parent_survey_assignment_id = 0
  let main_survey_assignment_id = data[0]['survey_assignment_id']

  if (s1_is_nomination === 1) {
    s1_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_nomination_survey_assignment_id = data[0]['survey_assignment_id']
    s1_parent_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_relationship_id = data[0]['relationship_id']
  }

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q7_score = data[Q7_pos]['score']
  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']
  let Q30_score = data[Q30_pos]['score']

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! LDF
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')

  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']
  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']

  let LDF = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LDFfinalDataset = arrayRemove(LDF, 0)
  let LDFsum = LDFfinalDataset.reduce((a, b) => a + b, 0)
  let LDFresult = LDFsum / LDFfinalDataset.length

  if (LDFsum === 0) {
    LDFresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')

  let CII1 = data[Q37_pos]['score']
  let CII2 = data[Q38_pos]['score']
  let CII3 = data[Q39_pos]['score']
  let CII4 = data[Q40_pos]['score']
  let CII5 = data[Q41_pos]['score']
  let CII6 = data[Q42_pos]['score']

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')

  let OEQ1 = data[Q43_pos]['answer']
  let OEQ2 = data[Q44_pos]['answer']
  let OEQ3 = data[Q45_pos]['answer']
  let OEQ4 = data[Q46_pos]['answer']
  let OEQ5 = data[Q47_pos]['answer']

  //! ERX | EX | OX | AX | CX
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52')

  let ERX
  if (Q48_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q48_pos]['score']
  }

  let EX
  if (Q49_pos == -1) {
    EX = 0
  } else {
    EX = data[Q49_pos]['score']
  }

  let OX
  if (Q50_pos == -1) {
    OX = 0
  } else {
    OX = data[Q50_pos]['score']
  }

  let AX
  if (Q51_pos == -1) {
    AX = 0
  } else {
    AX = data[Q51_pos]['score']
  }

  let CX
  if (Q52_pos == -1) {
    CX = 0
  } else {
    CX = data[Q52_pos]['score']
  }

  let KDY1 = data[Q1_pos]['score']
  let KDY2 = data[Q2_pos]['score']
  let KDY3 = data[Q3_pos]['score']
  let KDY4 = data[Q4_pos]['score']
  let KDY5 = data[Q5_pos]['score']
  let KDY6 = data[Q6_pos]['score']

  let DTO1 = data[Q7_pos]['score']
  let DTO2 = data[Q8_pos]['score']
  let DTO3 = data[Q9_pos]['score']
  let DTO4 = data[Q10_pos]['score']
  let DTO5 = data[Q11_pos]['score']
  let DTO6 = data[Q12_pos]['score']

  let CP1 = data[Q13_pos]['score']
  let CP2 = data[Q14_pos]['score']
  let CP3 = data[Q15_pos]['score']
  let CP4 = data[Q16_pos]['score']
  let CP5 = data[Q17_pos]['score']
  let CP6 = data[Q18_pos]['score']

  let SCP1 = data[Q19_pos]['score']
  let SCP2 = data[Q20_pos]['score']
  let SCP3 = data[Q21_pos]['score']
  let SCP4 = data[Q22_pos]['score']
  let SCP5 = data[Q23_pos]['score']
  let SCP6 = data[Q24_pos]['score']

  let LIC1 = data[Q25_pos]['score']
  let LIC2 = data[Q26_pos]['score']
  let LIC3 = data[Q27_pos]['score']
  let LIC4 = data[Q28_pos]['score']
  let LIC5 = data[Q29_pos]['score']
  let LIC6 = data[Q30_pos]['score']

  let LDF1 = data[Q31_pos]['score']
  let LDF2 = data[Q32_pos]['score']
  let LDF3 = data[Q33_pos]['score']
  let LDF4 = data[Q34_pos]['score']
  let LDF5 = data[Q35_pos]['score']
  let LDF6 = data[Q36_pos]['score']


  let query1 = `
    INSERT INTO r360_raw 
      (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,

        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6,
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6,
        CP, CP1, CP2, CP3, CP4, CP5, CP6,
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6,
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6,
        LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6,
        CII1, CII2, CII3, CII4, CII5, CII6, 
        ERX, EX, OX, AX, CX, 
        OEQ1, OEQ2, OEQ3, OEQ4, OEQ5
      ) 
    VALUES
      (
        ${s1_survey_assignment_id},
        ${s1_is_nomination},
        ${s1_nomination_survey_assignment_id},
        ${s1_relationship_id},
        ${s1_parent_survey_assignment_id},
        ${s1_survey_template_id},
        ${s1_ind_id},
        ${s1_coach_id},
        ${s1_coach_access_granted},
        ${s1_coach_group_access_granted},
        ${s1_hr_access_granted},
        ${s1_report_eligible_number_of_respondents},
        
        ${s1_org_id},
        ${s1_suborg_id},
        ${s1_program_id},
        ${s1_iteration_id},
        
        ${KDYresult},
        ${KDY1},
        ${KDY2},
        ${KDY3},
        ${KDY4},
        ${KDY5},
        ${KDY6},
        
        ${DTOresult},
        ${DTO1},
        ${DTO2},
        ${DTO3},
        ${DTO4},
        ${DTO5},
        ${DTO6},
        
        ${CPresult},
        ${CP1},
        ${CP2},
        ${CP3},
        ${CP4},
        ${CP5},
        ${CP6},
        
        ${SCPresult},
        ${SCP1},
        ${SCP2},
        ${SCP3},
        ${SCP4},
        ${SCP5},
        ${SCP6},
        
        ${LICresult},
        ${LIC1},
        ${LIC2},
        ${LIC3},
        ${LIC4},
        ${LIC5},
        ${LIC6},
        
        ${LDFresult},
        ${LDF1},
        ${LDF2},
        ${LDF3},
        ${LDF4},
        ${LDF5},
        ${LDF6},
        
        ${CII1},
        ${CII2},
        ${CII3},
        ${CII4},
        ${CII5},
        ${CII6},
        
        ${ERX},
        ${EX},
        ${OX},
        ${AX},
        ${CX},
        
        ?,
        ?,
        ?,
        ?,
        ?
      ) 
  `

  console.log(query1)
  db.query
    (
      query1,
      [OEQ1, OEQ2, OEQ3, OEQ4, OEQ5],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
          console.log(query2)

          db.query
            (
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2)
                  //result(null, results)

                  let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                  db.query
                    (
                      query3,
                      [],
                      (err, results) => {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                    )
                }
              }
            )
          result(null, results)
        }
      }
    )
}

export const seniorExecProgramInsertRawCalcM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value
    })
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_is_nomination = data[0]['is_nomination']
  let s1_survey_template_id = data[0]['survey_template_id']
  let s1_coach_id = data[0]['coach_id']
  let s1_coach_access_granted = data[0]['coach_access_granted']
  let s1_coach_group_access_granted = data[0]['coach_group_access_granted']
  let s1_hr_access_granted = data[0]['hr_access_granted']
  let s1_report_eligible_number_of_respondents = data[0]['survey_template_id']
  let s1_ind_id = data[0]['ind_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  let s1_program_id = data[0]['program_id']
  let s1_iteration_id = data[0]['iteration_id']
  let s1_nomination_survey_assignment_id = 0
  let s1_relationship_id = 0
  let s1_parent_survey_assignment_id = 0
  let main_survey_assignment_id = data[0]['survey_assignment_id']

  if (s1_is_nomination === 1) {
    s1_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_nomination_survey_assignment_id = data[0]['survey_assignment_id']
    s1_parent_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_relationship_id = data[0]['relationship_id']
  }

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q7_score = data[Q7_pos]['score']
  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']
  let Q30_score = data[Q30_pos]['score']

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! LDF
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')

  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']
  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']

  let LDF = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LDFfinalDataset = arrayRemove(LDF, 0)
  let LDFsum = LDFfinalDataset.reduce((a, b) => a + b, 0)
  let LDFresult = LDFsum / LDFfinalDataset.length

  if (LDFsum === 0) {
    LDFresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')

  let CII1 = data[Q37_pos]['score']
  let CII2 = data[Q38_pos]['score']
  let CII3 = data[Q39_pos]['score']
  let CII4 = data[Q40_pos]['score']
  let CII5 = data[Q41_pos]['score']
  let CII6 = data[Q42_pos]['score']

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')

  let OEQ1 = data[Q43_pos]['answer']
  let OEQ2 = data[Q44_pos]['answer']
  let OEQ3 = data[Q45_pos]['answer']
  let OEQ4 = data[Q46_pos]['answer']
  let OEQ5 = data[Q47_pos]['answer']
  let OEQ6 = data[Q48_pos]['answer']
  let OEQ7 = data[Q49_pos]['answer']

  //! ERX | EX | OX | AX | CX
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52')
  let Q53_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q53')
  let Q54_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q54')

  let ERX
  if (Q50_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q50_pos]['score']
  }

  let EX
  if (Q51_pos == -1) {
    EX = 0
  } else {
    EX = data[Q51_pos]['score']
  }

  let OX
  if (Q52_pos == -1) {
    OX = 0
  } else {
    OX = data[Q52_pos]['score']
  }

  let AX
  if (Q53_pos == -1) {
    AX = 0
  } else {
    AX = data[Q53_pos]['score']
  }

  let CX
  if (Q54_pos == -1) {
    CX = 0
  } else {
    CX = data[Q54_pos]['score']
  }

  let KDY1 = data[Q1_pos]['score']
  let KDY2 = data[Q2_pos]['score']
  let KDY3 = data[Q3_pos]['score']
  let KDY4 = data[Q4_pos]['score']
  let KDY5 = data[Q5_pos]['score']
  let KDY6 = data[Q6_pos]['score']

  let DTO1 = data[Q7_pos]['score']
  let DTO2 = data[Q8_pos]['score']
  let DTO3 = data[Q9_pos]['score']
  let DTO4 = data[Q10_pos]['score']
  let DTO5 = data[Q11_pos]['score']
  let DTO6 = data[Q12_pos]['score']

  let CP1 = data[Q13_pos]['score']
  let CP2 = data[Q14_pos]['score']
  let CP3 = data[Q15_pos]['score']
  let CP4 = data[Q16_pos]['score']
  let CP5 = data[Q17_pos]['score']
  let CP6 = data[Q18_pos]['score']

  let SCP1 = data[Q19_pos]['score']
  let SCP2 = data[Q20_pos]['score']
  let SCP3 = data[Q21_pos]['score']
  let SCP4 = data[Q22_pos]['score']
  let SCP5 = data[Q23_pos]['score']
  let SCP6 = data[Q24_pos]['score']

  let LIC1 = data[Q25_pos]['score']
  let LIC2 = data[Q26_pos]['score']
  let LIC3 = data[Q27_pos]['score']
  let LIC4 = data[Q28_pos]['score']
  let LIC5 = data[Q29_pos]['score']
  let LIC6 = data[Q30_pos]['score']

  let LDF1 = data[Q31_pos]['score']
  let LDF2 = data[Q32_pos]['score']
  let LDF3 = data[Q33_pos]['score']
  let LDF4 = data[Q34_pos]['score']
  let LDF5 = data[Q35_pos]['score']
  let LDF6 = data[Q36_pos]['score']


  let query1 = `
    INSERT INTO r360_raw 
      (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,

        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6,
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6,
        CP, CP1, CP2, CP3, CP4, CP5, CP6,
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6,
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6,
        LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6,
        CII1, CII2, CII3, CII4, CII5, CII6, 
        ERX, EX, OX, AX, CX, 
        OEQ1, OEQ2, OEQ3, OEQ4, OEQ5, OEQ6, OEQ7
      ) 
    VALUES
      (
        ${s1_survey_assignment_id},
        ${s1_is_nomination},
        ${s1_nomination_survey_assignment_id},
        ${s1_relationship_id},
        ${s1_parent_survey_assignment_id},
        ${s1_survey_template_id},
        ${s1_ind_id},
        ${s1_coach_id},
        ${s1_coach_access_granted},
        ${s1_coach_group_access_granted},
        ${s1_hr_access_granted},
        ${s1_report_eligible_number_of_respondents},
        
        ${s1_org_id},
        ${s1_suborg_id},
        ${s1_program_id},
        ${s1_iteration_id},
        
        ${KDYresult},
        ${KDY1},
        ${KDY2},
        ${KDY3},
        ${KDY4},
        ${KDY5},
        ${KDY6},
        
        ${DTOresult},
        ${DTO1},
        ${DTO2},
        ${DTO3},
        ${DTO4},
        ${DTO5},
        ${DTO6},
        
        ${CPresult},
        ${CP1},
        ${CP2},
        ${CP3},
        ${CP4},
        ${CP5},
        ${CP6},
        
        ${SCPresult},
        ${SCP1},
        ${SCP2},
        ${SCP3},
        ${SCP4},
        ${SCP5},
        ${SCP6},
        
        ${LICresult},
        ${LIC1},
        ${LIC2},
        ${LIC3},
        ${LIC4},
        ${LIC5},
        ${LIC6},
        
        ${LDFresult},
        ${LDF1},
        ${LDF2},
        ${LDF3},
        ${LDF4},
        ${LDF5},
        ${LDF6},
        
        ${CII1},
        ${CII2},
        ${CII3},
        ${CII4},
        ${CII5},
        ${CII6},
        
        ${ERX},
        ${EX},
        ${OX},
        ${AX},
        ${CX},
        
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      ) 
  `

  console.log(query1)
  db.query
    (
      query1,
      [OEQ1, OEQ2, OEQ3, OEQ4, OEQ5, OEQ6, OEQ7],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
          console.log(query2)

          db.query
            (
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2)
                  //result(null, results)

                  let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                  db.query
                    (
                      query3,
                      [],
                      (err, results) => {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                    )
                }
              }
            )
          result(null, results)
        }
      }
    )
}

export const talentSageInsertRawCalcM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value
    })
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_is_nomination = data[0]['is_nomination']
  let s1_survey_template_id = data[0]['survey_template_id']
  let s1_coach_id = data[0]['coach_id']
  let s1_coach_access_granted = data[0]['coach_access_granted']
  let s1_coach_group_access_granted = data[0]['coach_group_access_granted']
  let s1_hr_access_granted = data[0]['hr_access_granted']
  let s1_report_eligible_number_of_respondents = data[0]['survey_template_id']
  let s1_ind_id = data[0]['ind_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  let s1_program_id = data[0]['program_id']
  let s1_iteration_id = data[0]['iteration_id']
  let s1_nomination_survey_assignment_id = 0
  let s1_relationship_id = 0
  let s1_parent_survey_assignment_id = 0
  let main_survey_assignment_id = data[0]['survey_assignment_id']

  if (s1_is_nomination === 1) {
    s1_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_nomination_survey_assignment_id = data[0]['survey_assignment_id']
    s1_parent_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_relationship_id = data[0]['relationship_id']
  }

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q7_score = data[Q7_pos]['score']
  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! CP
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let CP = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let SCP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LIC
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']
  let Q30_score = data[Q30_pos]['score']

  let LIC = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let LICfinalDataset = arrayRemove(LIC, 0)
  let LICsum = LICfinalDataset.reduce((a, b) => a + b, 0)
  let LICresult = LICsum / LICfinalDataset.length

  if (LICsum === 0) {
    LICresult = 0
  }

  //! EUSO
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')

  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']
  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']

  let EUSO = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let EUSOfinalDataset = arrayRemove(EUSO, 0)
  let EUSOsum = EUSOfinalDataset.reduce((a, b) => a + b, 0)
  let EUSOresult = EUSOsum / EUSOfinalDataset.length

  if (EUSOsum === 0) {
    EUSOresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')

  let CII1 = data[Q37_pos]['score']
  let CII2 = data[Q38_pos]['score']
  let CII3 = data[Q39_pos]['score']
  let CII4 = data[Q40_pos]['score']
  let CII5 = data[Q41_pos]['score']
  let CII6 = data[Q42_pos]['score']

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')

  let OEQ1 = data[Q43_pos]['answer']
  let OEQ2 = data[Q44_pos]['answer']
  let OEQ3 = data[Q45_pos]['answer']
  let OEQ4 = data[Q46_pos]['answer']

  //! ERX | EX | OX | AX | CX
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')

  let ERX
  if (Q47_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q47_pos]['score']
  }

  let EX
  if (Q48_pos == -1) {
    EX = 0
  } else {
    EX = data[Q48_pos]['score']
  }

  let OX
  if (Q49_pos == -1) {
    OX = 0
  } else {
    OX = data[Q49_pos]['score']
  }

  let AX
  if (Q50_pos == -1) {
    AX = 0
  } else {
    AX = data[Q50_pos]['score']
  }

  let CX
  if (Q51_pos == -1) {
    CX = 0
  } else {
    CX = data[Q51_pos]['score']
  }

  let KDY1 = data[Q1_pos]['score']
  let KDY2 = data[Q2_pos]['score']
  let KDY3 = data[Q3_pos]['score']
  let KDY4 = data[Q4_pos]['score']
  let KDY5 = data[Q5_pos]['score']
  let KDY6 = data[Q6_pos]['score']

  let DTO1 = data[Q7_pos]['score']
  let DTO2 = data[Q8_pos]['score']
  let DTO3 = data[Q9_pos]['score']
  let DTO4 = data[Q10_pos]['score']
  let DTO5 = data[Q11_pos]['score']
  let DTO6 = data[Q12_pos]['score']

  let CP1 = data[Q13_pos]['score']
  let CP2 = data[Q14_pos]['score']
  let CP3 = data[Q15_pos]['score']
  let CP4 = data[Q16_pos]['score']
  let CP5 = data[Q17_pos]['score']
  let CP6 = data[Q18_pos]['score']

  let SCP1 = data[Q19_pos]['score']
  let SCP2 = data[Q20_pos]['score']
  let SCP3 = data[Q21_pos]['score']
  let SCP4 = data[Q22_pos]['score']
  let SCP5 = data[Q23_pos]['score']
  let SCP6 = data[Q24_pos]['score']

  let LIC1 = data[Q25_pos]['score']
  let LIC2 = data[Q26_pos]['score']
  let LIC3 = data[Q27_pos]['score']
  let LIC4 = data[Q28_pos]['score']
  let LIC5 = data[Q29_pos]['score']
  let LIC6 = data[Q30_pos]['score']

  let EUSO1 = data[Q31_pos]['score']
  let EUSO2 = data[Q32_pos]['score']
  let EUSO3 = data[Q33_pos]['score']
  let EUSO4 = data[Q34_pos]['score']
  let EUSO5 = data[Q35_pos]['score']
  let EUSO6 = data[Q36_pos]['score']


  let query1 = `
    INSERT INTO r360_raw 
      (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,

        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6,
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6,
        CP, CP1, CP2, CP3, CP4, CP5, CP6,
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6,
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6,
        EUSO, EUSO1, EUSO2, EUSO3, EUSO4, EUSO5, EUSO6,
        CII1, CII2, CII3, CII4, CII5, CII6, 
        ERX, EX, OX, AX, CX, 
        OEQ1, OEQ2, OEQ3, OEQ4
      ) 
    VALUES
      (
        ${s1_survey_assignment_id},
        ${s1_is_nomination},
        ${s1_nomination_survey_assignment_id},
        ${s1_relationship_id},
        ${s1_parent_survey_assignment_id},
        ${s1_survey_template_id},
        ${s1_ind_id},
        ${s1_coach_id},
        ${s1_coach_access_granted},
        ${s1_coach_group_access_granted},
        ${s1_hr_access_granted},
        ${s1_report_eligible_number_of_respondents},
        
        ${s1_org_id},
        ${s1_suborg_id},
        ${s1_program_id},
        ${s1_iteration_id},
        
        ${KDYresult},
        ${KDY1},
        ${KDY2},
        ${KDY3},
        ${KDY4},
        ${KDY5},
        ${KDY6},
        
        ${DTOresult},
        ${DTO1},
        ${DTO2},
        ${DTO3},
        ${DTO4},
        ${DTO5},
        ${DTO6},
        
        ${CPresult},
        ${CP1},
        ${CP2},
        ${CP3},
        ${CP4},
        ${CP5},
        ${CP6},
        
        ${SCPresult},
        ${SCP1},
        ${SCP2},
        ${SCP3},
        ${SCP4},
        ${SCP5},
        ${SCP6},
        
        ${LICresult},
        ${LIC1},
        ${LIC2},
        ${LIC3},
        ${LIC4},
        ${LIC5},
        ${LIC6},
        
        ${EUSOresult},
        ${EUSO1},
        ${EUSO2},
        ${EUSO3},
        ${EUSO4},
        ${EUSO5},
        ${EUSO6},
        
        ${CII1},
        ${CII2},
        ${CII3},
        ${CII4},
        ${CII5},
        ${CII6},
        
        ${ERX},
        ${EX},
        ${OX},
        ${AX},
        ${CX},
        
        ?,
        ?,
        ?,
        ?
      ) 
  `

  console.log(query1)
  db.query
    (
      query1,
      [OEQ1, OEQ2, OEQ3, OEQ4],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
          db.query
            (
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2)
                  //result(null, results)

                  let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                  db.query
                    (
                      query3,
                      [],
                      (err, results) => {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                    )
                }
              }
            )
          result(null, results)
        }
      }
    )
}

export const helpInsertRawCalcM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value
    })
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_is_nomination = data[0]['is_nomination']
  let s1_survey_template_id = data[0]['survey_template_id']
  let s1_coach_id = data[0]['coach_id']
  let s1_coach_access_granted = data[0]['coach_access_granted']
  let s1_coach_group_access_granted = data[0]['coach_group_access_granted']
  let s1_hr_access_granted = data[0]['hr_access_granted']
  let s1_report_eligible_number_of_respondents = data[0]['survey_template_id']
  let s1_ind_id = data[0]['ind_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  let s1_program_id = data[0]['program_id']
  let s1_iteration_id = data[0]['iteration_id']
  let s1_nomination_survey_assignment_id = 0
  let s1_relationship_id = 0
  let s1_parent_survey_assignment_id = 0
  let main_survey_assignment_id = data[0]['survey_assignment_id']

  if (s1_is_nomination === 1) {
    s1_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_nomination_survey_assignment_id = data[0]['survey_assignment_id']
    s1_parent_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_relationship_id = data[0]['relationship_id']
  }

  //! SA
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']
  let Q7_score = data[Q7_pos]['score']

  let SA = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score, Q7_score]
  let SAfinalDataset = arrayRemove(SA, 0)
  let SAsum = SAfinalDataset.reduce((a, b) => a + b, 0)
  let SAresult = SAsum / SAfinalDataset.length

  if (SAsum === 0) {
    SAresult = 0
  }

  //! ISR
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let ISR = [Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let ISRfinalDataset = arrayRemove(ISR, 0)
  let ISRsum = ISRfinalDataset.reduce((a, b) => a + b, 0)
  let ISRresult = ISRsum / ISRfinalDataset.length

  if (ISRsum === 0) {
    ISRresult = 0
  }

  //! OAW
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let OAW = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let OAWfinalDataset = arrayRemove(OAW, 0)
  let OAWsum = OAWfinalDataset.reduce((a, b) => a + b, 0)
  let OAWresult = OAWsum / OAWfinalDataset.length

  if (OAWsum === 0) {
    OAWresult = 0
  }

  //! EI
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let EI = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let EIfinalDataset = arrayRemove(EI, 0)
  let EIsum = EIfinalDataset.reduce((a, b) => a + b, 0)
  let EIresult = EIsum / EIfinalDataset.length

  if (EIsum === 0) {
    EIresult = 0
  }

  //! GP
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']

  let GP = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score]
  let GPfinalDataset = arrayRemove(GP, 0)
  let GPsum = GPfinalDataset.reduce((a, b) => a + b, 0)
  let GPresult = GPsum / GPfinalDataset.length

  if (GPsum === 0) {
    GPresult = 0
  }

  //! CLD
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')

  let Q30_score = data[Q30_pos]['score']
  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']

  let CLD = [Q30_score, Q31_score, Q32_score, Q33_score]
  let CLDfinalDataset = arrayRemove(CLD, 0)
  let CLDsum = CLDfinalDataset.reduce((a, b) => a + b, 0)
  let CLDresult = CLDsum / CLDfinalDataset.length

  if (CLDsum === 0) {
    CLDresult = 0
  }

  //! LA
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')

  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']
  let Q37_score = data[Q37_pos]['score']
  let Q38_score = data[Q38_pos]['score']

  let LA = [Q34_score, Q35_score, Q36_score, Q37_score, Q38_score]
  let LAfinalDataset = arrayRemove(LA, 0)
  let LAsum = LAfinalDataset.reduce((a, b) => a + b, 0)
  let LAresult = LAsum / LAfinalDataset.length

  if (LAsum === 0) {
    LAresult = 0
  }

  //! CE
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')

  let Q39_score = data[Q39_pos]['score']
  let Q40_score = data[Q40_pos]['score']
  let Q41_score = data[Q41_pos]['score']
  let Q42_score = data[Q42_pos]['score']
  let Q43_score = data[Q43_pos]['score']

  let CE = [Q39_score, Q40_score, Q41_score, Q42_score, Q43_score]
  let CEfinalDataset = arrayRemove(CE, 0)
  let CEsum = CEfinalDataset.reduce((a, b) => a + b, 0)
  let CEresult = CEsum / CEfinalDataset.length

  if (CEsum === 0) {
    CEresult = 0
  }

  //! LC
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')

  let Q44_score = data[Q44_pos]['score']
  let Q45_score = data[Q45_pos]['score']
  let Q46_score = data[Q46_pos]['score']
  let Q47_score = data[Q47_pos]['score']
  let Q48_score = data[Q48_pos]['score']
  let Q49_score = data[Q49_pos]['score']

  let LC = [Q44_score, Q45_score, Q46_score, Q47_score, Q48_score, Q49_score]
  let LCfinalDataset = arrayRemove(LC, 0)
  let LCsum = LCfinalDataset.reduce((a, b) => a + b, 0)
  let LCresult = LCsum / LCfinalDataset.length

  if (LCsum === 0) {
    LCresult = 0
  }

  //! LS
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')
  let Q52_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q52')
  let Q53_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q53')
  let Q54_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q54')

  let Q50_score = data[Q50_pos]['score']
  let Q51_score = data[Q51_pos]['score']
  let Q52_score = data[Q52_pos]['score']
  let Q53_score = data[Q53_pos]['score']
  let Q54_score = data[Q54_pos]['score']

  let LS = [Q50_score, Q51_score, Q52_score, Q53_score, Q54_score]
  let LSfinalDataset = arrayRemove(LS, 0)
  let LSsum = LSfinalDataset.reduce((a, b) => a + b, 0)
  let LSresult = LSsum / LSfinalDataset.length

  if (LSsum === 0) {
    LSresult = 0
  }

  //! DTO
  let Q55_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q55')
  let Q56_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q56')
  let Q57_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q57')
  let Q58_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q58')

  let Q55_score = data[Q55_pos]['score']
  let Q56_score = data[Q56_pos]['score']
  let Q57_score = data[Q57_pos]['score']
  let Q58_score = data[Q58_pos]['score']

  let LTO = [Q55_score, Q56_score, Q57_score, Q58_score]
  let LTOfinalDataset = arrayRemove(LTO, 0)
  let LTOsum = LTOfinalDataset.reduce((a, b) => a + b, 0)
  let LTOresult = LTOsum / LTOfinalDataset.length

  if (LTOsum === 0) {
    LTOresult = 0
  }

  //! LO
  let Q59_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q59')
  let Q60_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q60')
  let Q61_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q61')
  let Q62_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q62')
  let Q63_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q63')
  let Q64_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q64')

  let Q59_score = data[Q59_pos]['score']
  let Q60_score = data[Q60_pos]['score']
  let Q61_score = data[Q61_pos]['score']
  let Q62_score = data[Q62_pos]['score']
  let Q63_score = data[Q63_pos]['score']
  let Q64_score = data[Q64_pos]['score']

  let LO = [Q59_score, Q60_score, Q61_score, Q62_score, Q63_score, Q64_score]
  let LOfinalDataset = arrayRemove(LO, 0)
  let LOsum = LOfinalDataset.reduce((a, b) => a + b, 0)
  let LOresult = LOsum / LOfinalDataset.length

  if (LOsum === 0) {
    LOresult = 0
  }

  let Q65_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q65')
  let Q66_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q66')
  let Q67_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q67')

  let SA1 = data[Q1_pos]['score']
  let SA2 = data[Q2_pos]['score']
  let SA3 = data[Q3_pos]['score']
  let SA4 = data[Q4_pos]['score']
  let SA5 = data[Q5_pos]['score']
  let SA6 = data[Q6_pos]['score']
  let SA7 = data[Q7_pos]['score']

  let ISR1 = data[Q8_pos]['score']
  let ISR2 = data[Q9_pos]['score']
  let ISR3 = data[Q10_pos]['score']
  let ISR4 = data[Q11_pos]['score']
  let ISR5 = data[Q12_pos]['score']

  let OAW1 = data[Q13_pos]['score']
  let OAW2 = data[Q14_pos]['score']
  let OAW3 = data[Q15_pos]['score']
  let OAW4 = data[Q16_pos]['score']
  let OAW5 = data[Q17_pos]['score']
  let OAW6 = data[Q18_pos]['score']

  let EI1 = data[Q19_pos]['score']
  let EI2 = data[Q20_pos]['score']
  let EI3 = data[Q21_pos]['score']
  let EI4 = data[Q22_pos]['score']
  let EI5 = data[Q23_pos]['score']
  let EI6 = data[Q24_pos]['score']

  let GP1 = data[Q25_pos]['score']
  let GP2 = data[Q26_pos]['score']
  let GP3 = data[Q27_pos]['score']
  let GP4 = data[Q28_pos]['score']
  let GP5 = data[Q29_pos]['score']

  let CLD1 = data[Q30_pos]['score']
  let CLD2 = data[Q31_pos]['score']
  let CLD3 = data[Q32_pos]['score']
  let CLD4 = data[Q33_pos]['score']

  let LA1 = data[Q34_pos]['score']
  let LA2 = data[Q35_pos]['score']
  let LA3 = data[Q36_pos]['score']
  let LA4 = data[Q37_pos]['score']
  let LA5 = data[Q38_pos]['score']

  let CE1 = data[Q39_pos]['score']
  let CE2 = data[Q40_pos]['score']
  let CE3 = data[Q41_pos]['score']
  let CE4 = data[Q42_pos]['score']
  let CE5 = data[Q43_pos]['score']

  let LC1 = data[Q44_pos]['score']
  let LC2 = data[Q45_pos]['score']
  let LC3 = data[Q46_pos]['score']
  let LC4 = data[Q47_pos]['score']
  let LC5 = data[Q48_pos]['score']
  let LC6 = data[Q49_pos]['score']

  let LS1 = data[Q50_pos]['score']
  let LS2 = data[Q51_pos]['score']
  let LS3 = data[Q52_pos]['score']
  let LS4 = data[Q53_pos]['score']
  let LS5 = data[Q54_pos]['score']

  let LTO1 = data[Q55_pos]['score']
  let LTO2 = data[Q56_pos]['score']
  let LTO3 = data[Q57_pos]['score']
  let LTO4 = data[Q58_pos]['score']

  let LO1 = data[Q59_pos]['score']
  let LO2 = data[Q60_pos]['score']
  let LO3 = data[Q61_pos]['score']
  let LO4 = data[Q62_pos]['score']
  let LO5 = data[Q63_pos]['score']
  let LO6 = data[Q64_pos]['score']

  let OEQ1 = data[Q65_pos]['answer']
  let OEQ2 = data[Q66_pos]['answer']
  let OEQ3 = data[Q67_pos]['answer']


  let query1 = `
    INSERT INTO r360_raw 
      (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,

        SA, SA1, SA2, SA3, SA4, SA5, SA6, SA7,
        ISR, ISR1, ISR2, ISR3, ISR4, ISR5,
        OAW, OAW1, OAW2, OAW3, OAW4, OAW5, OAW6,
        EI, EI1, EI2, EI3, EI4, EI5, EI6,
        GP, GP1, GP2, GP3, GP4, GP5,
        CLD, CLD1, CLD2, CLD3, CLD4,
        LA, LA1, LA2, LA3, LA4, LA5,
        CE, CE1, CE2, CE3, CE4, CE5,
        LC, LC1, LC2, LC3, LC4, LC5, LC6,
        LS, LS1, LS2, LS3, LS4, LS5,
        LTO, LTO1, LTO2, LTO3, LTO4,
        LO, LO1, LO2, LO3, LO4, LO5, LO6,
        OEQ1, OEQ2, OEQ3
      ) 
    VALUES
      (
        ${s1_survey_assignment_id},
        ${s1_is_nomination},
        ${s1_nomination_survey_assignment_id},
        ${s1_relationship_id},
        ${s1_parent_survey_assignment_id},
        ${s1_survey_template_id},
        ${s1_ind_id},
        ${s1_coach_id},
        ${s1_coach_access_granted},
        ${s1_coach_group_access_granted},
        ${s1_hr_access_granted},
        ${s1_report_eligible_number_of_respondents},
        
        ${s1_org_id},
        ${s1_suborg_id},
        ${s1_program_id},
        ${s1_iteration_id},
        
        ${SAresult},
        ${SA1},
        ${SA2},
        ${SA3},
        ${SA4},
        ${SA5},
        ${SA6},
        ${SA7},
        
        ${ISRresult},
        ${ISR1},
        ${ISR2},
        ${ISR3},
        ${ISR4},
        ${ISR5},
        
        ${OAWresult},
        ${OAW1},
        ${OAW2},
        ${OAW3},
        ${OAW4},
        ${OAW5},
        ${OAW6},
        
        ${EIresult},
        ${EI1},
        ${EI2},
        ${EI3},
        ${EI4},
        ${EI5},
        ${EI6},
        
        ${GPresult},
        ${GP1},
        ${GP2},
        ${GP3},
        ${GP4},
        ${GP5},
        
        ${CLDresult},
        ${CLD1},
        ${CLD2},
        ${CLD3},
        ${CLD4},

        ${LAresult},
        ${LA1},
        ${LA2},
        ${LA3},
        ${LA4},
        ${LA5},

        ${CEresult},
        ${CE1},
        ${CE2},
        ${CE3},
        ${CE4},
        ${CE5},

        ${LCresult},
        ${LC1},
        ${LC2},
        ${LC3},
        ${LC4},
        ${LC5},
        ${LC6},

        ${LSresult},
        ${LS1},
        ${LS2},
        ${LS3},
        ${LS4},
        ${LS5},

        ${LTOresult},
        ${LTO1},
        ${LTO2},
        ${LTO3},
        ${LTO4},

        ${LOresult},
        ${LO1},
        ${LO2},
        ${LO3},
        ${LO4},
        ${LO5},
        ${LO6},      
        
        ?,
        ?,
        ?
      ) 
  `

  console.log(query1)
  db.query
    (
      query1,
      [OEQ1, OEQ2, OEQ3],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
          db.query
            (
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2)
                  //result(null, results)

                  let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                  db.query
                    (
                      query3,
                      [],
                      (err, results) => {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                    )
                }
              }
            )
          result(null, results)
        }
      }
    )
}

export const euroNavInsertRawCalcM = (data, result) => {
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value
    })
  }

  let s1_survey_assignment_id = data[0]['survey_assignment_id']
  let s1_is_nomination = data[0]['is_nomination']
  let s1_survey_template_id = data[0]['survey_template_id']
  let s1_coach_id = data[0]['coach_id']
  let s1_coach_access_granted = data[0]['coach_access_granted']
  let s1_coach_group_access_granted = data[0]['coach_group_access_granted']
  let s1_hr_access_granted = data[0]['hr_access_granted']
  let s1_report_eligible_number_of_respondents = data[0]['survey_template_id']
  let s1_ind_id = data[0]['ind_id']
  let s1_org_id = data[0]['org_id']
  let s1_suborg_id = data[0]['suborg_id']
  let s1_program_id = data[0]['program_id']
  let s1_iteration_id = data[0]['iteration_id']
  let s1_nomination_survey_assignment_id = 0
  let s1_relationship_id = 0
  let s1_parent_survey_assignment_id = 0
  let main_survey_assignment_id = data[0]['survey_assignment_id']

  if (s1_is_nomination === 1) {
    s1_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_nomination_survey_assignment_id = data[0]['survey_assignment_id']
    s1_parent_survey_assignment_id = data[0]['parent_survey_assignment_id']
    s1_relationship_id = data[0]['relationship_id']
  }

  //! KDY
  let Q1_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q1')
  let Q2_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q2')
  let Q3_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q3')
  let Q4_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q4')
  let Q5_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q5')
  let Q6_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q6')

  let Q1_score = data[Q1_pos]['score']
  let Q2_score = data[Q2_pos]['score']
  let Q3_score = data[Q3_pos]['score']
  let Q4_score = data[Q4_pos]['score']
  let Q5_score = data[Q5_pos]['score']
  let Q6_score = data[Q6_pos]['score']

  let KDY = [Q1_score, Q2_score, Q3_score, Q4_score, Q5_score, Q6_score]
  let KDYfinalDataset = arrayRemove(KDY, 0)
  let KDYsum = KDYfinalDataset.reduce((a, b) => a + b, 0)
  let KDYresult = KDYsum / KDYfinalDataset.length

  if (KDYsum === 0) {
    KDYresult = 0
  }

  //! DTO
  let Q7_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q7')
  let Q8_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q8')
  let Q9_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q9')
  let Q10_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q10')
  let Q11_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q11')
  let Q12_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q12')

  let Q7_score = data[Q7_pos]['score']
  let Q8_score = data[Q8_pos]['score']
  let Q9_score = data[Q9_pos]['score']
  let Q10_score = data[Q10_pos]['score']
  let Q11_score = data[Q11_pos]['score']
  let Q12_score = data[Q12_pos]['score']

  let DTO = [Q7_score, Q8_score, Q9_score, Q10_score, Q11_score, Q12_score]
  let DTOfinalDataset = arrayRemove(DTO, 0)
  let DTOsum = DTOfinalDataset.reduce((a, b) => a + b, 0)
  let DTOresult = DTOsum / DTOfinalDataset.length

  if (DTOsum === 0) {
    DTOresult = 0
  }

  //! AEI
  let Q13_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q13')
  let Q14_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q14')
  let Q15_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q15')
  let Q16_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q16')
  let Q17_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q17')
  let Q18_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q18')

  let Q13_score = data[Q13_pos]['score']
  let Q14_score = data[Q14_pos]['score']
  let Q15_score = data[Q15_pos]['score']
  let Q16_score = data[Q16_pos]['score']
  let Q17_score = data[Q17_pos]['score']
  let Q18_score = data[Q18_pos]['score']

  let AEI = [Q13_score, Q14_score, Q15_score, Q16_score, Q17_score, Q18_score]
  let AEIfinalDataset = arrayRemove(AEI, 0)
  let AEIsum = AEIfinalDataset.reduce((a, b) => a + b, 0)
  let AEIresult = AEIsum / AEIfinalDataset.length

  if (AEIsum === 0) {
    AEIresult = 0
  }

  //! CP
  let Q19_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q19')
  let Q20_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q20')
  let Q21_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q21')
  let Q22_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q22')
  let Q23_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q23')
  let Q24_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q24')

  let Q19_score = data[Q19_pos]['score']
  let Q20_score = data[Q20_pos]['score']
  let Q21_score = data[Q21_pos]['score']
  let Q22_score = data[Q22_pos]['score']
  let Q23_score = data[Q23_pos]['score']
  let Q24_score = data[Q24_pos]['score']

  let CP = [Q19_score, Q20_score, Q21_score, Q22_score, Q23_score, Q24_score]
  let CPfinalDataset = arrayRemove(CP, 0)
  let CPsum = CPfinalDataset.reduce((a, b) => a + b, 0)
  let CPresult = CPsum / CPfinalDataset.length

  if (CPsum === 0) {
    CPresult = 0
  }

  //! SCP
  let Q25_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q25')
  let Q26_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q26')
  let Q27_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q27')
  let Q28_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q28')
  let Q29_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q29')
  let Q30_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q30')

  let Q25_score = data[Q25_pos]['score']
  let Q26_score = data[Q26_pos]['score']
  let Q27_score = data[Q27_pos]['score']
  let Q28_score = data[Q28_pos]['score']
  let Q29_score = data[Q29_pos]['score']
  let Q30_score = data[Q30_pos]['score']

  let SCP = [Q25_score, Q26_score, Q27_score, Q28_score, Q29_score, Q30_score]
  let SCPfinalDataset = arrayRemove(SCP, 0)
  let SCPsum = SCPfinalDataset.reduce((a, b) => a + b, 0)
  let SCPresult = SCPsum / SCPfinalDataset.length

  if (SCPsum === 0) {
    SCPresult = 0
  }

  //! LOC
  let Q31_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q31')
  let Q32_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q32')
  let Q33_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q33')
  let Q34_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q34')
  let Q35_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q35')
  let Q36_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q36')

  let Q31_score = data[Q31_pos]['score']
  let Q32_score = data[Q32_pos]['score']
  let Q33_score = data[Q33_pos]['score']
  let Q34_score = data[Q34_pos]['score']
  let Q35_score = data[Q35_pos]['score']
  let Q36_score = data[Q36_pos]['score']

  let LOC = [Q31_score, Q32_score, Q33_score, Q34_score, Q35_score, Q36_score]
  let LOCfinalDataset = arrayRemove(LOC, 0)
  let LOCsum = LOCfinalDataset.reduce((a, b) => a + b, 0)
  let LOCresult = LOCsum / LOCfinalDataset.length

  if (LOCsum === 0) {
    LOCresult = 0
  }

  //! CII
  let Q37_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q37')
  let Q38_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q38')
  let Q39_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q39')
  let Q40_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q40')
  let Q41_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q41')
  let Q42_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q42')

  let CII1 = data[Q37_pos]['score']
  let CII2 = data[Q38_pos]['score']
  let CII3 = data[Q39_pos]['score']
  let CII4 = data[Q40_pos]['score']
  let CII5 = data[Q41_pos]['score']
  let CII6 = data[Q42_pos]['score']

  //! OEQ
  let Q43_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q43')
  let Q44_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q44')
  let Q45_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q45')
  let Q46_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q46')

  let OEQ1 = data[Q43_pos]['answer']
  let OEQ2 = data[Q44_pos]['answer']
  let OEQ3 = data[Q45_pos]['answer']
  let OEQ4 = data[Q46_pos]['answer']

  //! ERX | EX | OX | AX | CX
  let Q47_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q47')
  let Q48_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q48')
  let Q49_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q49')
  let Q50_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q50')
  let Q51_pos = data.map(function (e) { return e.statement_num; }).indexOf('Q51')

  let ERX
  if (Q47_pos == -1) {
    ERX = 0
  } else {
    ERX = data[Q47_pos]['score']
  }

  let EX
  if (Q48_pos == -1) {
    EX = 0
  } else {
    EX = data[Q48_pos]['score']
  }

  let OX
  if (Q49_pos == -1) {
    OX = 0
  } else {
    OX = data[Q49_pos]['score']
  }

  let AX
  if (Q50_pos == -1) {
    AX = 0
  } else {
    AX = data[Q50_pos]['score']
  }

  let CX
  if (Q51_pos == -1) {
    CX = 0
  } else {
    CX = data[Q51_pos]['score']
  }

  let KDY1 = data[Q1_pos]['score']
  let KDY2 = data[Q2_pos]['score']
  let KDY3 = data[Q3_pos]['score']
  let KDY4 = data[Q4_pos]['score']
  let KDY5 = data[Q5_pos]['score']
  let KDY6 = data[Q6_pos]['score']

  let DTO1 = data[Q7_pos]['score']
  let DTO2 = data[Q8_pos]['score']
  let DTO3 = data[Q9_pos]['score']
  let DTO4 = data[Q10_pos]['score']
  let DTO5 = data[Q11_pos]['score']
  let DTO6 = data[Q12_pos]['score']

  let AEI1 = data[Q13_pos]['score']
  let AEI2 = data[Q14_pos]['score']
  let AEI3 = data[Q15_pos]['score']
  let AEI4 = data[Q16_pos]['score']
  let AEI5 = data[Q17_pos]['score']
  let AEI6 = data[Q18_pos]['score']

  let CP1 = data[Q19_pos]['score']
  let CP2 = data[Q20_pos]['score']
  let CP3 = data[Q21_pos]['score']
  let CP4 = data[Q22_pos]['score']
  let CP5 = data[Q23_pos]['score']
  let CP6 = data[Q24_pos]['score']

  let SCP1 = data[Q25_pos]['score']
  let SCP2 = data[Q26_pos]['score']
  let SCP3 = data[Q27_pos]['score']
  let SCP4 = data[Q28_pos]['score']
  let SCP5 = data[Q29_pos]['score']
  let SCP6 = data[Q30_pos]['score']

  let LOC1 = data[Q31_pos]['score']
  let LOC2 = data[Q32_pos]['score']
  let LOC3 = data[Q33_pos]['score']
  let LOC4 = data[Q34_pos]['score']
  let LOC5 = data[Q35_pos]['score']
  let LOC6 = data[Q36_pos]['score']


  let query1 = `
    INSERT INTO r360_raw 
      (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,

        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6,
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6,
        AEI, AEI1, AEI2, AEI3, AEI4, AEI5, AEI6,
        CP, CP1, CP2, CP3, CP4, CP5, CP6,
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6,
        LOC, LOC1, LOC2, LOC3, LOC4, LOC5, LOC6,
        CII1, CII2, CII3, CII4, CII5, CII6, 
        ERX, EX, OX, AX, CX, 
        OEQ1, OEQ2, OEQ3, OEQ4
      ) 
    VALUES
      (
        ${s1_survey_assignment_id},
        ${s1_is_nomination},
        ${s1_nomination_survey_assignment_id},
        ${s1_relationship_id},
        ${s1_parent_survey_assignment_id},
        ${s1_survey_template_id},
        ${s1_ind_id},
        ${s1_coach_id},
        ${s1_coach_access_granted},
        ${s1_coach_group_access_granted},
        ${s1_hr_access_granted},
        ${s1_report_eligible_number_of_respondents},
        
        ${s1_org_id},
        ${s1_suborg_id},
        ${s1_program_id},
        ${s1_iteration_id},
        
        ${KDYresult},
        ${KDY1},
        ${KDY2},
        ${KDY3},
        ${KDY4},
        ${KDY5},
        ${KDY6},
        
        ${DTOresult},
        ${DTO1},
        ${DTO2},
        ${DTO3},
        ${DTO4},
        ${DTO5},
        ${DTO6},
        
        ${AEIresult},
        ${AEI1},
        ${AEI2},
        ${AEI3},
        ${AEI4},
        ${AEI5},
        ${AEI6},
        
        ${CPresult},
        ${CP1},
        ${CP2},
        ${CP3},
        ${CP4},
        ${CP5},
        ${CP6},
        
        ${SCPresult},
        ${SCP1},
        ${SCP2},
        ${SCP3},
        ${SCP4},
        ${SCP5},
        ${SCP6},
        
        ${LOCresult},
        ${LOC1},
        ${LOC2},
        ${LOC3},
        ${LOC4},
        ${LOC5},
        ${LOC6},
        
        ${CII1},
        ${CII2},
        ${CII3},
        ${CII4},
        ${CII5},
        ${CII6},
        
        ${ERX},
        ${EX},
        ${OX},
        ${AX},
        ${CX},
        
        ?,
        ?,
        ?,
        ?
      ) 
  `

  console.log(query1)
  db.query
    (
      query1,
      [OEQ1, OEQ2, OEQ3, OEQ4],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
          db.query
            (
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  //result(err, null)
                } else {
                  console.log(query2)
                  //result(null, results)

                  let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                  db.query
                    (
                      query3,
                      [],
                      (err, results) => {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                    )
                }
              }
            )
          result(null, results)
        }
      }
    )
}

export const delete360RawM = (survey_assignment_id, result) => {
    const surveyResult = `
  SELECT
    sa.program_id,
    sa.iteration_id,
    sa.is_nomination,
    sa.parent_survey_assignment_id,
    sa.relationship_id,
    sa.survey_template_id,
    sa.ind_id,
    sa.coach_id,
    sa.coach_access_granted,
    sa.coach_group_access_granted,
    sa.hr_access_granted,
    sa.report_eligible_number_of_respondents,
    sr.*
  FROM survey_result sr
  LEFT JOIN survey_assignment sa
  ON sa.survey_assignment_id = sr.survey_assignment_id
  WHERE sr.survey_assignment_id = ?`
    
    db.query(surveyResult, [survey_assignment_id], (err, results) => {
        if (err) {
            console.log(err)
            result(err, null)
        } else { 
            let survey_assignment_id = results[0]['survey_assignment_id']
            let is_nomination = results[0]['is_nomination']
            let survey_template_id = results[0]['survey_template_id']
            let coach_id = results[0]['coach_id']
            let coach_access_granted = results[0]['coach_access_granted']
            let coach_group_access_granted = results[0]['coach_group_access_granted']
            let hr_access_granted = results[0]['hr_access_granted']
            let report_eligible_number_of_respondents = results[0]['survey_template_id']
            let ind_id = results[0]['ind_id']
            let org_id = results[0]['org_id']
            let suborg_id = results[0]['suborg_id']
            let program_id = results[0]['program_id']
            let iteration_id = results[0]['iteration_id']
            let nomination_survey_assignment_id = 0
            let relationship_id = 0
            let parent_survey_assignment_id = 0
            let main_survey_assignment_id = results[0]['survey_assignment_id']

            if (is_nomination === 1) {
                survey_assignment_id = results[0]['parent_survey_assignment_id']
                nomination_survey_assignment_id = results[0]['survey_assignment_id']
                parent_survey_assignment_id = results[0]['parent_survey_assignment_id']
                relationship_id = results[0]['relationship_id']

                db.query('DELETE FROM r360_raw WHERE nomination_survey_assignment_id = ?', [nomination_survey_assignment_id], (err, results) => {
                    if (err) {
                        console.log(err)
                        result(err, null)
                    } else {
                        result(null, results)
                    }
                })
            } else { 
                db.query('DELETE FROM r360_raw WHERE survey_assignment_id = ? AND is_nomination = 0', [survey_assignment_id], (err, results) => {
                    if (err) {
                        console.log(err)
                        result(err, null)
                    } else {
                        result(null, results)
                    }
                })
            }
        }
    })

  
}

export const surveyBuilderCalcM = (survey_assignment_id, data, result) => {
  const surveyResult = `
  SELECT
    sa.program_id,
    sa.iteration_id,
    sa.is_nomination,
    sa.parent_survey_assignment_id,
    sa.relationship_id,
    sa.survey_template_id,
    sa.ind_id,
    sa.coach_id,
    sa.coach_access_granted,
    sa.coach_group_access_granted,
    sa.hr_access_granted,
    sa.report_eligible_number_of_respondents,
    sr.*
  FROM survey_result sr
  LEFT JOIN survey_assignment sa
  ON sa.survey_assignment_id = sr.survey_assignment_id
  WHERE sr.survey_assignment_id = ?`

  db.query(surveyResult, [survey_assignment_id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
          return ele != value
        })
      }
      let survey_assignment_id = results[0]['survey_assignment_id']
      let is_nomination = results[0]['is_nomination']
      let survey_template_id = results[0]['survey_template_id']
      let coach_id = results[0]['coach_id']
      let coach_access_granted = results[0]['coach_access_granted']
      let coach_group_access_granted = results[0]['coach_group_access_granted']
      let hr_access_granted = results[0]['hr_access_granted']
      let report_eligible_number_of_respondents = results[0]['survey_template_id']
      let ind_id = results[0]['ind_id']
      let org_id = results[0]['org_id']
      let suborg_id = results[0]['suborg_id']
      let program_id = results[0]['program_id']
      let iteration_id = results[0]['iteration_id']
      let nomination_survey_assignment_id = 0
      let relationship_id = 0
      let parent_survey_assignment_id = 0
      let main_survey_assignment_id = results[0]['survey_assignment_id']

      if (is_nomination === 1) {
        survey_assignment_id = results[0]['parent_survey_assignment_id']
        nomination_survey_assignment_id = results[0]['survey_assignment_id']
        parent_survey_assignment_id = results[0]['parent_survey_assignment_id']
        relationship_id = results[0]['relationship_id']
      }

      if (data.CompetenciesList) {
        data.CompetenciesList.forEach((competency) => {
          let behaviorsScoreList = []
          competency.Behaviors.forEach((behavior) => {
            let questionNumber = results.map(e => e.statement_num).indexOf(behavior.QuestionNumber)
            let score = results[questionNumber]['score']
            behavior.Score = score
            behaviorsScoreList.push(score)
          })
            let finalDataset = arrayRemove(behaviorsScoreList, 0)
            if (finalDataset.length > 0) {
                let sum = finalDataset.reduce((a, b) => a + b, 0)
                let result = sum / finalDataset.length
                competency.Score = result
            } else { 
                competency.Score = 0
            }
        })
      }
      if (data.CompRankingList) {
        data.CompRankingList.forEach((ranking) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(ranking.QuestionNumber)
          let score = results[questionNumber]['score']
          ranking.Score = score
        })
      }
      if (data.OpenEndedList) {
        data.OpenEndedList.forEach((openEnded) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(openEnded.QuestionNumber)
          let answer = results[questionNumber]['answer']
          openEnded.Answer = answer
        })
      }
      if (data.OrgClimateList) {
        data.OrgClimateList.forEach((climate) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(climate.QuestionNumber)
          let score = results[questionNumber]['score']
          climate.Score = score
        })
      }
      if (data.NetPromoterList) {
        data.NetPromoterList.forEach((netPromoter) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(netPromoter.QuestionNumber)
          let score = results[questionNumber]['score']
          netPromoter.Score = score
        })
      }


      const competenciesList = data.CompetenciesList || [];
      const compRankingList = data.CompRankingList || [];
      const openEndedList = data.OpenEndedList || [];
      const orgClimateList = data.OrgClimateList || [];
      const netPromoterList = data.NetPromoterList || [];

      // Generate the column names for the insert query
      const competencyColumns = competenciesList.reduce((columns, competency) => {
        if (competency.Behaviors) {
          const behaviorCodes = competency.Behaviors.map(behavior => behavior.Code);
          return [...columns, competency.Code, ...behaviorCodes];
        }
        return columns;
      }, []);

      const columns = [
        ...competencyColumns,
        ...compRankingList.map(compRanking => compRanking.Code),
        ...openEndedList.map(openEnded => openEnded.Code),
        ...orgClimateList.map(orgClimate => orgClimate.Code),
        ...netPromoterList.map(netPromoter => netPromoter.Code),
      ];

      // Generate the values for the insert query
      const competencyValues = competenciesList.reduce((values, competency) => {
        if (competency.Behaviors) {
          const behaviorScores = competency.Behaviors.map(behavior => behavior.Score);
          return [...values, competency.Score, ...behaviorScores];
        }
        return values;
      }, []);

      const values = [
        ...competencyValues,
        ...compRankingList.map(compRanking => compRanking.Score),
        ...openEndedList.map(openEnded => openEnded.Answer),
        ...orgClimateList.map(orgClimate => orgClimate.Score),
        ...netPromoterList.map(netPromoter => netPromoter.Score),
      ];

      const placeholders = Array(values.length).fill('?').join(', ');

      let qry = `
      INSERT INTO r360_raw (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,
        ${columns.join(', ')}
      ) VALUES (
        ${survey_assignment_id},
        ${is_nomination},
        ${nomination_survey_assignment_id},
        ${relationship_id},
        ${parent_survey_assignment_id},
        ${survey_template_id},
        ${ind_id},
        ${coach_id},
        ${coach_access_granted},
        ${coach_group_access_granted},
        ${hr_access_granted},
        ${report_eligible_number_of_respondents},
        
        ${org_id},
        ${suborg_id},
        ${program_id},
        ${iteration_id},
        ${placeholders}
      )`

      db.query
        (
          qry,
          values,
          (err, results) => {
            if (err) {
              console.log(err)
              result(err, null)
            } else {
                let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
                db.query
                    (
                    query2,
                    [],
                    (err, results) => {
                        if (err) {
                        console.log(err)
                        //result(err, null)
                        } else {
                        console.log(query2)
                        //result(null, results)

                        let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                        db.query
                            (
                            query3,
                            [],
                            (err, results) => {
                                if (err) {
                                console.log(err)
                                //result(err, null)
                                } else {
                                console.log(query3)
                                //result(null, results)
                                }
                            }
                            )
                        }
                    }
                    )
                result(null, results)
            }
          }
        )
    }
  })
}

//! USED ONLY FOR SMART COLLAB
export const smartCollabCalcM = (survey_assignment_id, data, result) => {
  const surveyResult = `
  SELECT
    sa.program_id,
    sa.iteration_id,
    sa.is_nomination,
    sa.parent_survey_assignment_id,
    sa.relationship_id,
    sa.survey_template_id,
    sa.ind_id,
    sa.coach_id,
    sa.coach_access_granted,
    sa.coach_group_access_granted,
    sa.hr_access_granted,
    sa.report_eligible_number_of_respondents,
    sr.*
  FROM survey_result sr
  LEFT JOIN survey_assignment sa
  ON sa.survey_assignment_id = sr.survey_assignment_id
  WHERE sr.survey_assignment_id = ?`

  db.query(surveyResult, [survey_assignment_id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
          return ele != value
        })
      }
      let survey_assignment_id = results[0]['survey_assignment_id']
      let is_nomination = results[0]['is_nomination']
      let survey_template_id = results[0]['survey_template_id']
      let coach_id = results[0]['coach_id']
      let coach_access_granted = results[0]['coach_access_granted']
      let coach_group_access_granted = results[0]['coach_group_access_granted']
      let hr_access_granted = results[0]['hr_access_granted']
      let report_eligible_number_of_respondents = results[0]['survey_template_id']
      let ind_id = results[0]['ind_id']
      let org_id = results[0]['org_id']
      let suborg_id = results[0]['suborg_id']
      let program_id = results[0]['program_id']
      let iteration_id = results[0]['iteration_id']
      let nomination_survey_assignment_id = 0
      let relationship_id = 0
      let parent_survey_assignment_id = 0
      let main_survey_assignment_id = results[0]['survey_assignment_id']

      if (is_nomination === 1) {
        survey_assignment_id = results[0]['parent_survey_assignment_id']
        nomination_survey_assignment_id = results[0]['survey_assignment_id']
        parent_survey_assignment_id = results[0]['parent_survey_assignment_id']
        relationship_id = results[0]['relationship_id']
      }

      if (data.CompetenciesList) {
        data.CompetenciesList.forEach((competency) => {
          let behaviorsScoreList = []
          competency.Behaviors.forEach((behavior) => {
            let questionNumber = results.map(e => e.statement_num).indexOf(behavior.QuestionNumber)
            let score = results[questionNumber]['score']
            let realQuiestionNumber = questionNumber + 1
            if (
              [47].includes(realQuiestionNumber)
            ) {
              if (score === 1) {
                score = 5;
              } else if (score === 2) {
                score = 4;
              } else if (score === 4) {
                score = 2;
              } else if (score === 5) {
                score = 1;
              }
            }
            behavior.Score = score
            behaviorsScoreList.push(score)
          })
            let finalDataset = arrayRemove(behaviorsScoreList, 0)
            if (finalDataset.length > 0) {
                let sum = finalDataset.reduce((a, b) => a + b, 0)
                let result = sum / finalDataset.length
                competency.Score = result
            } else { 
                competency.Score = 0
            }
        })
      }
      if (data.CompRankingList) {
        data.CompRankingList.forEach((ranking) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(ranking.QuestionNumber)
          let score = results[questionNumber]['score']
          ranking.Score = score
        })
      }
      if (data.OpenEndedList) {
        data.OpenEndedList.forEach((openEnded) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(openEnded.QuestionNumber)
          let answer = results[questionNumber]['answer']
          openEnded.Answer = answer
        })
      }
      if (data.OrgClimateList) {
        data.OrgClimateList.forEach((climate) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(climate.QuestionNumber)
          let score = results[questionNumber]['score']
          climate.Score = score
        })
      }
      if (data.NetPromoterList) {
        data.NetPromoterList.forEach((netPromoter) => {
          let questionNumber = results.map(e => e.statement_num).indexOf(netPromoter.QuestionNumber)
          let score = results[questionNumber]['score']
          netPromoter.Score = score
        })
      }

      const competenciesList = data.CompetenciesList || [];
      const compRankingList = data.CompRankingList || [];
      const openEndedList = data.OpenEndedList || [];
      const orgClimateList = data.OrgClimateList || [];
      const netPromoterList = data.NetPromoterList || [];

      // Generate the column names for the insert query
      const competencyColumns = competenciesList.reduce((columns, competency) => {
        if (competency.Behaviors) {
          const behaviorCodes = competency.Behaviors.map(behavior => behavior.Code);
          return [...columns, competency.Code, ...behaviorCodes];
        }
        return columns;
      }, []);

      const columns = [
        ...competencyColumns,
        ...compRankingList.map(compRanking => compRanking.Code),
        ...openEndedList.map(openEnded => openEnded.Code),
        ...orgClimateList.map(orgClimate => orgClimate.Code),
        ...netPromoterList.map(netPromoter => netPromoter.Code),
      ];

      // Generate the values for the insert query
      const competencyValues = competenciesList.reduce((values, competency) => {
        if (competency.Behaviors) {
          const behaviorScores = competency.Behaviors.map(behavior => behavior.Score);
          return [...values, competency.Score, ...behaviorScores];
        }
        return values;
      }, []);

      const values = [
        ...competencyValues,
        ...compRankingList.map(compRanking => compRanking.Score),
        ...openEndedList.map(openEnded => openEnded.Answer),
        ...orgClimateList.map(orgClimate => orgClimate.Score),
        ...netPromoterList.map(netPromoter => netPromoter.Score),
      ];

      const placeholders = Array(values.length).fill('?').join(', ');

      let qry = `
      INSERT INTO r360_raw (
        survey_assignment_id, 
        is_nomination, 
        nomination_survey_assignment_id, 
        relationship_id, 
        parent_survey_assignment_id, 
        survey_template_id, 
        ind_id,
        coach_id,
        coach_access_granted,
        coach_group_access_granted,
        hr_access_granted,
        report_eligible_number_of_respondents,

        org_id, suborg_id, program_id, iteration_id,
        ${columns.join(', ')}
      ) VALUES (
        ${survey_assignment_id},
        ${is_nomination},
        ${nomination_survey_assignment_id},
        ${relationship_id},
        ${parent_survey_assignment_id},
        ${survey_template_id},
        ${ind_id},
        ${coach_id},
        ${coach_access_granted},
        ${coach_group_access_granted},
        ${hr_access_granted},
        ${report_eligible_number_of_respondents},

        ${org_id},
        ${suborg_id},
        ${program_id},
        ${iteration_id},
        ${placeholders}
      )`     

      db.query
        (
          qry,
          values,
          (err, results) => {
            if (err) {
              console.log(err)
              result(err, null)
            } else {
                let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`
                db.query
                    (
                    query2,
                    [],
                    (err, results) => {
                        if (err) {
                        console.log(err)
                        //result(err, null)
                        } else {
                        console.log(query2)
                        //result(null, results)

                        let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${main_survey_assignment_id}`

                        db.query
                            (
                            query3,
                            [],
                            (err, results) => {
                                if (err) {
                                console.log(err)
                                //result(err, null)
                                } else {
                                console.log(query3)
                                //result(null, results)
                                }
                            }
                            )
                        }
                    }
                    )
                    result(null, results)
            }
          }
        )
    }
  })
}