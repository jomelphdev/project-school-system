import db from "../config/database.js"

export const get360NetPromoterScoreM = (data, result) => {
  db.query(`SELECT * FROM 360_nps WHERE org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ? AND for_participant = ?`,
    [data.org_id, data.suborg_id, data.program_id, data.iteration_id, data.for_participant],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}

export const insert360NetPromoterScoreM = (data, result) => {
  db.query(
    'INSERT INTO 360_nps (nps_name, nps_code, nps_description, nps_question, nps_left, nps_right, nps_breakpoint_1, nps_breakpoint_2, nps_breakpoint_3, source, language, participant_level, added_by, status, for_participant, global, org_id, suborg_id, program_id, iteration_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "Borrowed", ?, ?, ?, ?, ?, ?)',
    [
      data.nps_name,
      data.nps_code,
      data.nps_description,
      data.nps_question,
      data.nps_left,
      data.nps_right,
      data.nps_breakpoint_1,
      data.nps_breakpoint_2,
      data.nps_breakpoint_3,
      data.source,
      data.language,
      data.participant_level,
      data.added_by,
      data.for_participant,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

export const update360NetPromoterScoreM = (id, data, result) => {
  db.query(
    'UPDATE 360_nps SET nps_name = ?, nps_code = ?, nps_description = ?, nps_question = ?, nps_left = ?, nps_right = ?, nps_breakpoint_1 = ?, nps_breakpoint_2 = ?, nps_breakpoint_3 = ?, source = ?, language = ?, participant_level = ?, added_by = ?, for_participant = ?, global = ?, org_id = ?, suborg_id = ?, program_id = ?, iteration_id = ? WHERE nps_id = ?',
    [
      data.nps_name,
      data.nps_code,
      data.nps_description,
      data.nps_question,
      data.nps_left,
      data.nps_right,
      data.nps_breakpoint_1,
      data.nps_breakpoint_2,
      data.nps_breakpoint_3,
      data.source,
      data.language,
      data.participant_level,
      data.added_by,
      data.for_participant,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      id
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

export const borrowNetPromoterScoreM = (data, result) => {
  db.query(
    `SELECT * FROM 360_nps WHERE nps_id = ?`,
    [data.nps_id],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.log(selectErr);
        result(selectErr, null);
      } else {
        const selectedRow = selectResults[0];

        // Exclude the columns from data and set status to 'Borrowed'
        const {
          global,
          org_id,
          suborg_id,
          program_id,
          iteration_id,
          ...insertData
        } = selectedRow;

        db.query(
          `INSERT INTO 360_nps (nps_name, nps_description, nps_question, nps_left, nps_right, nps_breakpoint_1, nps_breakpoint_2, nps_breakpoint_3, source, language, participant_level, added_by, status, for_participant, global, org_id, suborg_id, program_id, iteration_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Borrowed', ?, ?, ?, ?, ?, ?)`,
          [
            insertData.nps_name,
            insertData.nps_description,
            insertData.nps_question,
            insertData.nps_left,
            insertData.nps_right,
            insertData.nps_breakpoint_1,
            insertData.nps_breakpoint_2,
            insertData.nps_breakpoint_3,
            insertData.source,
            insertData.language,
            insertData.participant_level,
            insertData.added_by,
            insertData.for_participant, // Place the value of for_participant here
            data.global, // Place the value of global here
            data.org_id,
            data.suborg_id,
            data.program_id,
            data.iteration_id,
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.log(insertErr);
              result(insertErr, null);
            } else {
              const insertedNetPromoterScoreId = insertResults.insertId;
              console.log("Inserted Net Promoter ID:", insertedNetPromoterScoreId);
              result(null, { insertedNetPromoterScoreId }); // Pass insertedNetPromoterScoreId in the result callback
            }
          }
        );
      }
    }
  );
};

// get self score nps
export const get360NetPromoterScoreByIdM = (survey_assignment_id, result) => {
  db.query(`
    SELECT nps1 FROM r360_raw 
    WHERE survey_assignment_id = ?
    AND relationship_id = 0
  `,
    [survey_assignment_id],
    (err, resultsSelfData) => {
      if (err) {
        result(err, null)
      } else {
        if(resultsSelfData.length == 0) {
          result(null, [])
        }
        else {
          const selfScore = resultsSelfData[0].nps1
          get360NPSAllOthers(selfScore, survey_assignment_id, result)
        }
      }
    })
}

export const get360NPSAllOthers = (selfScore, survey_assignment_id, result) => {
  db.query(`
    SELECT relationship_id, nps1 FROM r360_raw 
    WHERE survey_assignment_id = ?
    AND relationship_id != 0
  `,
    [survey_assignment_id],
    (err, resultsAlOthersData) => {
      if (err) {
        result(err, null)
      } else {
        if(resultsAlOthersData.length == 0) {
          result(null, [])
        }
        else {
          // get the average of all others
          // const sum = resultsAlOthersData.reduce((nominee, obj) => nominee + obj.nps1, 0);
          // const avgAllOthersScore = sum / resultsAlOthersData.length;

          let count_psup = 0, count_p = 0, count_d = 0, count_i = 0, count_e = 0
          let sum_psup = 0, sum_p = 0, sum_d = 0, sum_i = 0, sum_e = 0
          let avg_psup = 0, avg_p = 0, avg_d = 0, avg_pd = 0, avg_i = 0, avg_e = 0, avg_ie = 0, avg_pdie = 0

          // get the count of each relationship
          for (let i = 0; i < resultsAlOthersData.length; i++) {
            if (resultsAlOthersData[i].relationship_id === 1) { count_psup++ }
            if (resultsAlOthersData[i].relationship_id === 2) { count_p++ }
            if (resultsAlOthersData[i].relationship_id === 3) { count_d++ }
            if (resultsAlOthersData[i].relationship_id === 4) { count_i++ }
            if (resultsAlOthersData[i].relationship_id === 5) { count_e++ }
          }

          // get the average of each relationship
          for (let i = 0; i < resultsAlOthersData.length; i++) {
            if (resultsAlOthersData[i].relationship_id === 1) { sum_psup += resultsAlOthersData[i].nps1 }
            if (resultsAlOthersData[i].relationship_id === 2) { sum_p += resultsAlOthersData[i].nps1 }
            if (resultsAlOthersData[i].relationship_id === 3) { sum_d += resultsAlOthersData[i].nps1 }
            if (resultsAlOthersData[i].relationship_id === 4) { sum_i += resultsAlOthersData[i].nps1 }
            if (resultsAlOthersData[i].relationship_id === 5) { sum_e += resultsAlOthersData[i].nps1 }
          }
          const sumAllNom = sum_psup + sum_p + sum_d + sum_i + sum_e
          const countAllNom = count_psup + count_p + count_d + count_i + count_e

          avg_psup = sum_psup / count_psup
          avg_p = sum_p / count_p
          avg_d = sum_d / count_d
          avg_pd = (avg_p + avg_d) / 2
          avg_i = sum_i / count_i
          avg_e = sum_e / count_e
          avg_ie = (avg_i + avg_e) / 2
          avg_pdie = (avg_p + avg_d + avg_i + avg_e) / 4

          const npsCountAllOthers = {
            "psup" : count_psup,
            "p" : count_p,
            "d" : count_d,
            "pd" : count_p + count_d,
            "i" : count_i,
            "e" : count_e,
            "ie" : count_i + count_e,
            "pdie" : count_p + count_d + count_i + count_e,
          }

          const avgScoresAllOthers = {
            "psup_score" : avg_psup,
            "p_score" : avg_p,
            "d_score" : avg_d,
            "pd_score" : avg_pd,
            "i_score" : avg_i,
            "e_score" : avg_e,
            "ie_score" : avg_ie,
            "pdie_score" : avg_pdie,
          }

          // count and score, eg. peer2_N = count, psup = avg_psup
          const rolledUpData = {
            "peer2_N" : count_p,
            "direct3_N" : count_d,
            "internal4_N" : count_i,
            "external5_N" : count_e,
            "ind" : selfScore ? parseFloat(selfScore).toFixed(1) : "0.0",
            "psup1" : avg_psup,
            "peer2" : avg_p,
            "direct3" : avg_d,
            "PD996" : avg_pd,
            "internal4" : avg_i,
            "external5" : avg_e,
            "IE997" : avg_ie,
            "PDIE998" : avg_pdie,
          }

          const allOthersAvgRollUp = rolledUp(rolledUpData)

          result(null, {
            "selfScore" : selfScore ? parseFloat(selfScore).toFixed(1) : "0.0",
            "allOthersAvgRollUp" : allOthersAvgRollUp,
            "AverageAllNom" : sumAllNom / countAllNom,
            "npsCountAllOthers" : npsCountAllOthers,
            "avgScoresAllOthers" : avgScoresAllOthers,
          })
        }
      }
    })
}

export const checkGroups = (A, B, C, D) => {
  const group1 = [A, B];
  const group2 = [C, D];

  const group1HasZeroAndOne = group1.includes(0) && group1.includes(1);
  const group2HasZeroAndOne = group2.includes(0) && group2.includes(1);
  const group1HasTwoZeros = group1.every(val => val === 0);
  const group2HasTwoZeros = group2.every(val => val === 0);

  return group1HasZeroAndOne || group2HasZeroAndOne || (group1HasTwoZeros && group2HasTwoZeros);
}

// rolled up
export const rolledUp = (rolledUpData) => {
  let avgCount = 1, avgRollup = 0, isDisplay_P = 0, isDisplay_D = 0, isDisplay_PD = 0, isDisplay_I = 0, isDisplay_E = 0, isDisplay_IE = 0, isDisplay_PDIE = 0

  let roundOff_psup1 = parseFloat(rolledUpData.psup1).toFixed(1)
  let roundOff_peer2 = parseFloat(rolledUpData.peer2).toFixed(1)
  let roundOff_direct3 = parseFloat(rolledUpData.direct3).toFixed(1)
  let roundOff_PD996 = parseFloat(rolledUpData.PD996).toFixed(1)
  let roundOff_internal4 = parseFloat(rolledUpData.internal4).toFixed(1)
  let roundOff_external5 = parseFloat(rolledUpData.external5).toFixed(1)
  let roundOff_IE997 = parseFloat(rolledUpData.IE997).toFixed(1)
  let roundOff_PDIE998 = parseFloat(rolledUpData.PDIE998).toFixed(1)

  let zeroCount = 0

  // count the number if the score is zero, we do not include the zero in computation of average below
  if (roundOff_psup1 === 0) { zeroCount = zeroCount + 1 }
  if (roundOff_PD996 === 0) { zeroCount = zeroCount + 1 }
  if (roundOff_internal4 === 0) { zeroCount = zeroCount + 1 }
  if (roundOff_external5 === 0) { zeroCount = zeroCount + 1 }

  // roll up breakdown
  if (rolledUpData.peer2_N < 2 || rolledUpData.direct3_N < 2) {
    avgCount = avgCount + 1
    isDisplay_PD = 1
  } else {
    isDisplay_P = 1
    isDisplay_D = 1
    avgCount = avgCount + 2
  }

  if (rolledUpData.internal4_N < 2 || rolledUpData.external5_N < 2) {
    avgCount = avgCount + 1
    isDisplay_IE = 1
  } else {
    avgCount = avgCount + 2
    isDisplay_I = 1
    isDisplay_E = 1
  }

  if(checkGroups(rolledUpData.peer2_N, rolledUpData.direct3_N, rolledUpData.internal4_N, rolledUpData.external5_N) == true){
    avgCount = 2
    isDisplay_PDIE = 1
  }

  if(isDisplay_PD === 1 && isDisplay_IE === 0){
    console.log('PD + I + E');

    // no need to divide this in avgCount because it always have 1 whole numbers, eg. parseFloat(1 + 0 + 0 + 0)
    if (avgCount === zeroCount) {
      avgRollup = parseFloat(roundOff_psup1) + parseFloat(roundOff_PD996) + parseFloat(roundOff_internal4) + parseFloat(roundOff_external5)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    } 
    else {
      avgRollup = (parseFloat(roundOff_psup1) + parseFloat(roundOff_PD996) + parseFloat(roundOff_internal4) + parseFloat(roundOff_external5)) / (avgCount - zeroCount)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    }
  }
  else if (isDisplay_IE === 1 && isDisplay_PD === 0) {
    console.log('IE + P + D');

    // no need to divide this in avgCount because it always have 1 whole numbers, eg. parseFloat(1 + 0 + 0 + 0)
    if (avgCount === zeroCount) {
      avgRollup = parseFloat(roundOff_psup1) + parseFloat(roundOff_IE997) + parseFloat(roundOff_peer2) + parseFloat(roundOff_direct3)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    } 
    else {
      avgRollup = (parseFloat(roundOff_psup1) + parseFloat(roundOff_IE997) + parseFloat(roundOff_peer2) + parseFloat(roundOff_direct3)) / (avgCount - zeroCount)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    }
  }
  else if (isDisplay_IE === 1 && isDisplay_PD === 1 && isDisplay_PDIE === 0) {
    console.log('PD + IE');
    // no need to divide this in avgCount because it always have 1 whole numbers, eg. parseFloat(1 + 0 + 0)
    if (avgCount === zeroCount) {
      avgRollup = parseFloat(roundOff_psup1) + parseFloat(roundOff_PD996) + parseFloat(roundOff_IE997)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    } 
    else {
      avgRollup = (parseFloat(roundOff_psup1) + parseFloat(roundOff_PD996) + parseFloat(roundOff_IE997)) / (avgCount - zeroCount)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    }
  }
  
  if (isDisplay_PDIE === 1) {
    console.log('PDIE');
    // no need to divide this in avgCount because it always have 1 whole numbers, eg. parseFloat(1 + 0)
    if (avgCount === zeroCount) {
      avgRollup = parseFloat(roundOff_psup1) + parseFloat(roundOff_PDIE998)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    } 
    else {
      avgRollup = (parseFloat(roundOff_psup1) + parseFloat(roundOff_PDIE998)) / (avgCount - zeroCount)
      avgRollup = parseFloat(avgRollup).toFixed(1)
    }
  }

  return avgRollup
}