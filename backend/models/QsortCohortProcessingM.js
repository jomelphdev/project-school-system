import db from "../config/database.js";
import Statistics from "statistics.js"

//todo Delete Qsort Cohort by final_deadline_date
export const deleteQsortCohortM = (id, result) => {
  let qry = `
    DELETE c
    FROM qsort_cohort c
    JOIN iteration i ON i.org_id = c.org_id 
      AND i.suborg_id = c.suborg_id
      AND i.program_id = c.program_id
      AND i.iteration_id = c.iteration_id
    WHERE 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
    AND i.never_run_iteration = 0
  `
  // console.log(qry)
  db.query(
    qry,
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
//todo Get Qsort final_deadline_date
export const getQsortFinalDeadlineDateM = (id, result) => {
  let qry = `
    SELECT 
      sa.survey_assignment_id,
      sa.org_id,
      sa.suborg_id,
      sa.program_id,
      sa.iteration_id,
      sa.stream_id,
      sa.group_id,
      q.scales
      q.survey_answer
    FROM survey_assignment sa
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN qsort_raw q ON q.survey_assignment_id = sa.survey_assignment_id
    WHERE
      sa.dropped_status = 0 AND
      sa.submitted_status = 1 AND
      st.survey_type = 4 AND
      DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
      AND i.never_run_iteration = 0
  `
  // console.log(qry)
  db.query(
    qry,
    [],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        // console.log(results)
      }
    }
  )
}

//todo FORCE Delete Qsort Cohort by iteration_id
export const forceDeleteQsortCohortM = (iteration_id, result) => {
  let qry = `
    DELETE q
    FROM qsort_cohort q
    JOIN iteration i 
       ON i.org_id = q.org_id 
      AND i.suborg_id = q.suborg_id
      AND i.program_id = q.program_id
      AND i.iteration_id = q.iteration_id
    WHERE
      i.iteration_id = ?
      AND i.never_run_iteration = 0
  `
  // console.log(qry)
  db.query(
    qry,
    [iteration_id],
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
//todo FORCE Get Qsort list by iteration_id
export const forceGetQsortIterationListM = (iteration_id, result) => {
  let qry = `
    SELECT 
      sa.survey_assignment_id,
      sa.org_id,
      sa.suborg_id,
      sa.program_id,
      sa.iteration_id,
      sa.stream_id,
      sa.group_id,
      q.qsort_type,
      q.scales,
      q.survey_answer
    FROM survey_assignment sa
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    LEFT JOIN qsort_raw q ON q.survey_assignment_id = sa.survey_assignment_id
    WHERE
      sa.dropped_status = 0 AND
      sa.submitted_status = 1 AND
      st.survey_type = 4 AND
      sa.iteration_id = ?
      AND i.never_run_iteration = 0
  `
  // console.log(qry)
  db.query(
    qry,
    [iteration_id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        // console.log(results)
      }
    }
  )
}

//todo Insert Qsort Cohort Data
export const insertQsortCohortM = (data, result) => {
  const org_id = (data.res[0].org_id)
  const suborg_id = (data.res[0].suborg_id)
  const program_id = (data.res[0].program_id)
  const iteration_id = (data.res[0].iteration_id)
  const stream_id = (data.res[0].stream_id)
  const group_id = (data.res[0].group_id)
  const qsort_type = data.res[0].qsort_type

  const scaleSumMap = new Map();
  const scaleCountMap = new Map();

  data.res.forEach(obj => {
    // console.log(obj.scales)
    obj.scales.forEach(scale => {
      // console.log(scale)
      scale.Scales.forEach(res => {
        const scaleName = res.ScaleName;
        const scaleValue = parseFloat(res.ScaleValue);
        if (scaleSumMap.has(scaleName)) {
          scaleSumMap.set(scaleName, scaleSumMap.get(scaleName) + scaleValue);
          scaleCountMap.set(scaleName, scaleCountMap.get(scaleName) + 1);
        } else {
          scaleSumMap.set(scaleName, scaleValue);
          scaleCountMap.set(scaleName, 1);
        }
      })
    });
  });

  // create a new array of objects with the average ScaleValue for each ScaleName
  const finalResult = [];
  scaleSumMap.forEach((value, key) => {
    const count = scaleCountMap.get(key);
    const average = (value / count).toFixed(2);
    finalResult.push({ ScaleName: key, ScaleValue: average });
  });

  const stringifyFinalResult = JSON.stringify(finalResult)

  const indSurveyAnswer = []

  data.res.forEach(res1 => {
    indSurveyAnswer.push(res1.survey_answer)
  });

  // console.log(indSurveyAnswer)

  const cardSumMap = new Map();
  const cardCountMap = new Map();

  indSurveyAnswer.forEach(res => {
    // console.log(res)
    for (let i = 0; i < res.length; i++) {
      const data = res[i];
      // console.log(data)
      // console.log(data.CardNumber + data.CardValue)
      // console.log(data.CardValue) //! check the values

      const cardNumber = data.CardNumber;
      const cardValue = parseFloat(data.CardValue);
      if (cardSumMap.has(cardNumber)) {
        cardSumMap.set(cardNumber, cardSumMap.get(cardNumber) + cardValue);
        cardCountMap.set(cardNumber, cardCountMap.get(cardNumber) + 1);
      } else {
        cardSumMap.set(cardNumber, cardValue);
        cardCountMap.set(cardNumber, 1);
      }
    }
  });

  const surveyResult = [];
  cardSumMap.forEach((value, key) => {
    const count = cardCountMap.get(key);
    const average = (value / count).toFixed(2);
    surveyResult.push({ CardNumber: key, CardValue: average });
  });
  // console.log(surveyResult)
  const stringifySurveyAnswer = JSON.stringify(surveyResult)

  db.query(`SELECT company_name, benchmark_type, benchmark_scales, benchmark_data FROM qsort_norm WHERE is_active = 1 AND qsort_type = '${qsort_type}'`,
    (err, resultsCorrelationNormData) => {
      if (err) {
        result(err, null)
      } else {
        if (resultsCorrelationNormData.length == 0) {
          result(null, [])
        }
        else {
          let correlation_historical = [];
          let correlation_hypothetical = [];

          for (let i = 0; i < resultsCorrelationNormData.length; i++) {
            const normData = resultsCorrelationNormData[i].benchmark_data;
            const normScale = resultsCorrelationNormData[i].benchmark_scales;
            const surveyAnswer = surveyResult;

            const combinedBenchmarkData = normData.map((data1, index) => {
              const data2 = surveyAnswer[index];
              return {
                Norm: data1.CardValue,
                Raw: parseFloat(data2.CardValue)
              };
            });

            // console.log(combinedBenchmarkData)

            let bodyVars = { Norm: 'metric', Raw: 'metric' }
            let stats = new Statistics(combinedBenchmarkData, bodyVars)
            let r = stats.correlationCoefficient('Norm', 'Raw')

            if (resultsCorrelationNormData[i].benchmark_type == "Historical") {
              correlation_historical.push({
                CompanyName: resultsCorrelationNormData[i].company_name,
                BenchmarkType: resultsCorrelationNormData[i].benchmark_type,
                Correlation: r.correlationCoefficient,
                NormScale: normScale
              })
            }
            if (resultsCorrelationNormData[i].benchmark_type == "Hypothetical") {
              correlation_hypothetical.push({
                CompanyName: resultsCorrelationNormData[i].company_name,
                BenchmarkType: resultsCorrelationNormData[i].benchmark_type,
                Correlation: r.correlationCoefficient,
                NormScale: normScale
              })
            }
          }

          // sorted from highest to lowest
          const sortedBenchmarkHistorical = correlation_historical.sort((a, b) => b.Correlation - a.Correlation);
          const sortedBenchmarkHypothetical = correlation_hypothetical.sort((a, b) => b.Correlation - a.Correlation);

          const benchmarkForCohort = { sortedBenchmarkHistorical, sortedBenchmarkHypothetical }
          // console.log(benchmarkForCohort)
          const stringifyCorrelation = JSON.stringify(benchmarkForCohort)

          // console.log(stringifyCorrelation)


          let query1 = `
            INSERT INTO qsort_cohort 
              (
                org_id, suborg_id, program_id, iteration_id, stream_id, group_id,
                qsort_type, scales, coefficient_correlation, survey_answer, 
                created_by, modified_by
              ) 
            VALUES
              (
                ${org_id},
                ${suborg_id},
                ${program_id},
                ${iteration_id},
                ${stream_id},
                ${group_id},
                '${qsort_type}',
                ?,
                ?,
                ?,
                1,
                1
              )
          `
          // console.log(query1);
          db.query(
            query1,
            [stringifyFinalResult, stringifyCorrelation, stringifySurveyAnswer],
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
      }
    })



  // db.query(`SELECT formula FROM qsort_formula WHERE qsort_type = '${qsort_type}'`,
  //   (err, qsortFormula) => {
  //     if (err) {
  //       result(err, null)
  //     } else {
  //       // console.log(qsortFormula)

  //       if (qsort_type === 'OCM') {

  //         let firstScale = qsortFormula[0].formula[0].ReportScales[0].Scales
  //         let secondScale = qsortFormula[0].formula[0].ReportScales[1].Scales

  //         const indSurveyAnswer = []
  //         data.res.forEach(res1 => {
  //           indSurveyAnswer.push(res1.survey_answer)
  //         });

  //         let surveyAnswers = []

  //         indSurveyAnswer.forEach(answer => {
  //           // console.log(answer)
  //           let wholeGroup = []
  //           let group1 = []
  //           let group2 = []
  //           for (let i = 0; i < firstScale.length; i++) {
  //             const res = firstScale[i];
  //             // console.log(res.ScaleCards)

  //             for (let j = 0; j < res.ScaleCards.length; j++) {
  //               const card = res.ScaleCards[j];
  //               const cardNo = card.CardNumber
  //               // console.log(card)

  //               let cardNumber = answer.map(function (e) { return e.CardNumber; }).indexOf(card.CardNumber);
  //               let cardScore = answer[cardNumber]['CardValue'];

  //               if (card.Reversed === 'Yes' && cardScore === 5) {
  //                 cardScore = 1
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 4) {
  //                 cardScore = 2
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 2) {
  //                 cardScore = 4
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 1) {
  //                 cardScore = 5
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else {
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               }
  //             }
  //           }

  //           for (let i = 0; i < secondScale.length; i++) {
  //             const res = secondScale[i];
  //             // console.log(res.ScaleCards)

  //             for (let j = 0; j < res.ScaleCards.length; j++) {
  //               const card = res.ScaleCards[j];
  //               const cardNo = card.CardNumber
  //               // console.log(card)

  //               let cardNumber = answer.map(function (e) { return e.CardNumber; }).indexOf(card.CardNumber);
  //               let cardScore = answer[cardNumber]['CardValue'];

  //               if (card.Reversed === 'Yes' && cardScore === 5) {
  //                 cardScore = 1
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group2.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 4) {
  //                 cardScore = 2
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group2.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 2) {
  //                 cardScore = 4
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group2.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 1) {
  //                 cardScore = 5
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group2.push(card)
  //               } else {
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group2.push(card)
  //               }
  //             }
  //           }
  //           wholeGroup.push(group1)
  //           wholeGroup.push(group2)
  //           let answerGroup = { SurveyAnswer: wholeGroup }
  //           surveyAnswers.push(answerGroup)
  //         });

  //         const cohortSurveyAnswer = []

  //         const cardSumGroup1Map = new Map();
  //         const cardCountGroup1Map = new Map();

  //         surveyAnswers.forEach(res => {
  //           // console.log(res.SurveyAnswer[0])
  //           for (let i = 0; i < res.SurveyAnswer[0].length; i++) {
  //             const data = res.SurveyAnswer[0][i];
  //             // console.log(data.CardNumber)
  //             // console.log(data.CardValue) //! check the values

  //             const cardNumber = data.CardNumber;
  //             const cardValue = parseFloat(data.CardValue);
  //             if (cardSumGroup1Map.has(cardNumber)) {
  //               cardSumGroup1Map.set(cardNumber, cardSumGroup1Map.get(cardNumber) + cardValue);
  //               cardCountGroup1Map.set(cardNumber, cardCountGroup1Map.get(cardNumber) + 1);
  //             } else {
  //               cardSumGroup1Map.set(cardNumber, cardValue);
  //               cardCountGroup1Map.set(cardNumber, 1);
  //             }
  //           }
  //           // console.log('GROUP1')
  //         });

  //         const group1finalResult = [];
  //         cardSumGroup1Map.forEach((value, key) => {
  //           const count = cardCountGroup1Map.get(key);
  //           const average = (value / count).toFixed(2);
  //           group1finalResult.push({ CardNumber: key, CardValue: average });
  //         });
  //         // console.log(group1finalResult)


  //         const cardSumGroup2Map = new Map();
  //         const cardCountGroup2Map = new Map();

  //         surveyAnswers.forEach(res => {
  //           // console.log(res.SurveyAnswer[0])
  //           for (let i = 0; i < res.SurveyAnswer[1].length; i++) {
  //             const data = res.SurveyAnswer[1][i];
  //             // console.log(data.CardNumber)
  //             // console.log(data.CardValue) //! check the values

  //             const cardNumber = data.CardNumber;
  //             const cardValue = parseFloat(data.CardValue);
  //             if (cardSumGroup2Map.has(cardNumber)) {
  //               cardSumGroup2Map.set(cardNumber, cardSumGroup2Map.get(cardNumber) + cardValue);
  //               cardCountGroup2Map.set(cardNumber, cardCountGroup2Map.get(cardNumber) + 1);
  //             } else {
  //               cardSumGroup2Map.set(cardNumber, cardValue);
  //               cardCountGroup2Map.set(cardNumber, 1);
  //             }
  //           }
  //           // console.log('GROUP2')
  //         });

  //         const group2finalResult = [];
  //         cardSumGroup2Map.forEach((value, key) => {
  //           const count = cardCountGroup2Map.get(key);
  //           const average = (value / count).toFixed(2);
  //           group2finalResult.push({ CardNumber: key, CardValue: average });
  //         });
  //         // console.log(group1finalResult)


  //         cohortSurveyAnswer.push(group1finalResult)
  //         cohortSurveyAnswer.push(group2finalResult)
  //         // console.log(cohortSurveyAnswer)
  //         const stringifySurveyAnswer = JSON.stringify(cohortSurveyAnswer)

  //         let query1 = `
  //           INSERT INTO qsort_cohort 
  //             (
  //               org_id, suborg_id, program_id, iteration_id, stream_id, group_id,
  //               qsort_type, scales, survey_answer, 
  //               created_by, modified_by
  //             ) 
  //           VALUES
  //             (
  //               ${org_id},
  //               ${suborg_id},
  //               ${program_id},
  //               ${iteration_id},
  //               ${stream_id},
  //               ${group_id},
  //               '${qsort_type}',
  //               ?,
  //               ?,
  //               1,
  //               1
  //             )
  //         `
  //         // console.log(query1);
  //         db.query(
  //           query1,
  //           [stringifyFinalResult, stringifySurveyAnswer],
  //           (err, results) => {
  //             if (err) {
  //               result(err, null)
  //               console.log(err)
  //             } else {
  //               result(null, results)
  //               console.log(results)
  //             }
  //           }
  //         )

  //       }

  //       if (qsort_type === 'BEP' || qsort_type === 'GDP') {

  //         let firstScale = qsortFormula[0].formula[0].ReportScales[0].Scales

  //         const indSurveyAnswer = []
  //         data.res.forEach(res1 => {
  //           indSurveyAnswer.push(res1.survey_answer)
  //         });

  //         let surveyAnswers = []

  //         indSurveyAnswer.forEach(answer => {
  //           // console.log(answer)
  //           let wholeGroup = []
  //           let group1 = []
  //           let group2 = []
  //           for (let i = 0; i < firstScale.length; i++) {
  //             const res = firstScale[i];
  //             // console.log(res.ScaleCards)

  //             for (let j = 0; j < res.ScaleCards.length; j++) {
  //               const card = res.ScaleCards[j];
  //               const cardNo = card.CardNumber
  //               // console.log(card)

  //               let cardNumber = answer.map(function (e) { return e.CardNumber; }).indexOf(card.CardNumber);
  //               let cardScore = answer[cardNumber]['CardValue'];

  //               if (card.Reversed === 'Yes' && cardScore === 5) {
  //                 cardScore = 1
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 4) {
  //                 cardScore = 2
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 2) {
  //                 cardScore = 4
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else if (card.Reversed === 'Yes' && cardScore === 1) {
  //                 cardScore = 5
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               } else {
  //                 let card = { CardNumber: cardNo, CardValue: cardScore }
  //                 group1.push(card)
  //               }
  //             }
  //           }
  //           wholeGroup.push(group1)
  //           let answerGroup = { SurveyAnswer: wholeGroup }
  //           surveyAnswers.push(answerGroup)
  //         });

  //         const cohortSurveyAnswer = []

  //         const cardSumGroup1Map = new Map();
  //         const cardCountGroup1Map = new Map();

  //         surveyAnswers.forEach(res => {
  //           // console.log(res.SurveyAnswer[0])
  //           for (let i = 0; i < res.SurveyAnswer[0].length; i++) {
  //             const data = res.SurveyAnswer[0][i];
  //             // console.log(data.CardNumber)
  //             // console.log(data.CardValue) //! check the values

  //             const cardNumber = data.CardNumber;
  //             const cardValue = parseFloat(data.CardValue);
  //             if (cardSumGroup1Map.has(cardNumber)) {
  //               cardSumGroup1Map.set(cardNumber, cardSumGroup1Map.get(cardNumber) + cardValue);
  //               cardCountGroup1Map.set(cardNumber, cardCountGroup1Map.get(cardNumber) + 1);
  //             } else {
  //               cardSumGroup1Map.set(cardNumber, cardValue);
  //               cardCountGroup1Map.set(cardNumber, 1);
  //             }
  //           }
  //           // console.log('GROUP1')
  //         });

  //         const group1finalResult = [];
  //         cardSumGroup1Map.forEach((value, key) => {
  //           const count = cardCountGroup1Map.get(key);
  //           const average = (value / count).toFixed(2);
  //           group1finalResult.push({ CardNumber: key, CardValue: average });
  //         });

  //         cohortSurveyAnswer.push(group1finalResult)
  //         const stringifySurveyAnswer = JSON.stringify(cohortSurveyAnswer)

  //         let query1 = `
  //           INSERT INTO qsort_cohort 
  //             (
  //               org_id, suborg_id, program_id, iteration_id, stream_id, group_id,
  //               qsort_type, scales, survey_answer, 
  //               created_by, modified_by
  //             ) 
  //           VALUES
  //             (
  //               ${org_id},
  //               ${suborg_id},
  //               ${program_id},
  //               ${iteration_id},
  //               ${stream_id},
  //               ${group_id},
  //               '${qsort_type}',
  //               ?,
  //               ?,
  //               1,
  //               1
  //             )
  //         `
  //         // console.log(query1);
  //         db.query(
  //           query1,
  //           [stringifyFinalResult, stringifySurveyAnswer],
  //           (err, results) => {
  //             if (err) {
  //               result(err, null)
  //               console.log(err)
  //             } else {
  //               result(null, results)
  //               console.log(results)
  //             }
  //           }
  //         )
  //       }

  //     }
  // })
}

//todo Get Qsort Cohort Data
export const getQsortCohortM = (iteration_id, result) => {
  db.query('SELECT scales FROM qsort_cohort WHERE iteration_id = ?',
    [iteration_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        let res = JSON.parse(results[0].scales)
        console.log(res)
        result(null, res)
      }
    })
}