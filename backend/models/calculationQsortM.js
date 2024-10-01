import db from "../config/database.js"
import Statistics from "statistics.js"

export const getQsortSurveyResultsM = (survey_assignment_id, result) => {
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

export const deleteQsortRawM = (survey_assignment_id, result) => {
  db.query('DELETE FROM qsort_raw WHERE survey_assignment_id = ?',
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

export const insertQsortRawCalcM = (qsort_type, survey_assignment_id, data, result) => {
  // console.log(data[0].ReportScale1[0].Scales[0].ScaleName)

  db.query('SELECT * FROM survey_result WHERE survey_assignment_id = ?',
    [survey_assignment_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        let reportScales = []
        let scales = []

        data.forEach(res => {
          // console.log(res)
          res.ReportScales.forEach(res2 => {
            // console.log(res2)
            scales = []
            res2.Scales.forEach(res3 => {
              // console.log(res3)
              let scaleName = res3.ScaleName
              let scores = []
              let sum = null
              for (let i = 0; i < res3.ScaleCards.length; i++) {
                const res4 = res3.ScaleCards[i];
                // console.log(res4.CardNumber + res4.Reversed)

                let cardNumber = results.map(function (e) { return e.statement_num; }).indexOf(res4.CardNumber);
                let cardScore = results[cardNumber]['score'];

                if (res4.Reversed === 'Yes' && cardScore === 5) {
                  cardScore = 1
                  scores.push(cardScore)
                } else if (res4.Reversed === 'Yes' && cardScore === 4) {
                  cardScore = 2
                  scores.push(cardScore)
                } else if (res4.Reversed === 'Yes' && cardScore === 2) {
                  cardScore = 4
                  scores.push(cardScore)
                } else if (res4.Reversed === 'Yes' && cardScore === 1) {
                  cardScore = 5
                  scores.push(cardScore)
                } else {
                  scores.push(cardScore)
                }
              }
              // console.log(scores)

              sum = scores.reduce(function (a, b) {
                return a + b;
              });

              sum = sum / scores.length
              sum = parseFloat(sum).toFixed(2)

              let scaleFinalData = { ScaleName: scaleName, ScaleValue: sum }

              scales.push(scaleFinalData)
            });
            // console.log(scales)

            // console.log("end")

            let scaleGroup = { Scales: scales }
            reportScales.push(scaleGroup)
          });
        });

        let finalScale = JSON.stringify(reportScales)
        // console.log(finalScale)

        let individualSurveyAnswer = []

        results.forEach((res) => {
          let card = res.statement_num
          let value = res.score
          let stmtAnswer = { CardNumber: card, CardValue: value }
          individualSurveyAnswer.push(stmtAnswer)
        })

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
                  const surveyAnswer = individualSurveyAnswer;

                  const combinedBenchmarkData = normData.map((data1, index) => {
                    const data2 = surveyAnswer[index];
                    return {
                      Norm: data1.CardValue,
                      Raw: data2.CardValue
                    };
                  });

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

                const benchmarkForInd = { sortedBenchmarkHistorical, sortedBenchmarkHypothetical }
                // console.log(benchmarkForInd)
                let finalBenchmarkForInd = JSON.stringify(benchmarkForInd)

                let finalSurveyAnswer = JSON.stringify(individualSurveyAnswer)
                // console.log(surveyAnswer)


                let query1 = `
                  INSERT INTO qsort_raw 
                    (
                      survey_assignment_id,
                      ind_id, org_id, suborg_id, program_id, iteration_id,
                      qsort_type, scales, coefficient_correlation, survey_answer,
                      created_by, modified_by
                    ) 
                  VALUES
                    (
                      ${survey_assignment_id},
                      (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
                      (SELECT org_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
                      (SELECT suborg_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
                      (SELECT program_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
                      (SELECT iteration_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
                      ?,
                      ?,
                      ?,
                      ?,
                      (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
                      (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id})
                    )
                `
                db.query(query1,
                  [qsort_type, finalScale, finalBenchmarkForInd, finalSurveyAnswer],
                  (err, results) => {
                    if (err) {
                      console.log(err)
                      result(err, null)
                    } else {
                      let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${survey_assignment_id}`

                      db.query(
                        query2,
                        [],
                        (err, results) => {
                          if (err) {
                            console.log(err)
                            //result(err, null)
                          } else {
                            // console.log(query2)
                            //result(null, results)

                            let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${survey_assignment_id}`

                            db.query
                              (
                                query3,
                                [],
                                (err, results) => {
                                  if (err) {
                                    console.log(err)
                                    //result(err, null)
                                  } else {
                                    // console.log(query3)
                                    //result(null, results)
                                  }
                                }
                              )
                          }
                        }
                      )
                      console.log(results)
                      result(null, results)
                    }
                  }
                )
                //         // result(null, {
                //         //   // "raw_scale_data": raw_scale_data,
                //         //   // "cohort_scale_data": cohort_scale_data,
                //         //   "sorted_correlation_historical": sorted_correlation_historical,
                //         //   "sorted_correlation_hypothetical": sorted_correlation_hypothetical
                //         // })
              }
            }
          })
        // console.log(results)
        // result(null, results)
      }
    })

  // db.query('SELECT * FROM survey_result WHERE survey_assignment_id = ?',
  //   [survey_assignment_id],
  //   (err, results) => {
  //     if (err) {
  //       console.log(err)
  //       result(err, null)
  //     } else {

  //       let sample = []
  //       let scales = []

  //       Object.entries(data).forEach(([key, value]) => {
  //         let name = value[0]
  //         let sum = ''
  //         sample = []

  //         for (let i = 1; i < value.length; i++) {
  //           const res = value[i];

  //           let cardNumber = results.map(function (e) { return e.statement_num; }).indexOf(res);
  //           let cardScore = results[cardNumber]['score'];

  //           sample.push(cardScore)

  //           sum = sample.reduce(function (a, b) {
  //             return a + b;
  //           });

  //           sum = sum / sample.length
  //           sum = parseFloat(sum).toFixed(2)
  //         }

  //         let scaleFinalData = { ScaleName: name, ScaleValue: sum }

  //         scales.push(scaleFinalData)
  //       });
  //       let finalScale = JSON.stringify(scales)
  //       console.log(finalScale)

  //       let surveyAnswer = []

  //       results.forEach((res) => {
  //         let card = res.statement_num
  //         let label = res.answer
  //         let value = res.score
  //         let stmtAnswer = { CardNumber: card, CardLabel: label, CardValue: value }
  //         surveyAnswer.push(stmtAnswer)
  //       })

  //       let finalSurveyAnswer = JSON.stringify(surveyAnswer)
  //       console.log(finalSurveyAnswer)

  // let query1 = `
  //   INSERT INTO qsort_raw 
  //     (
  //       survey_assignment_id,
  //       ind_id, org_id, suborg_id, program_id, iteration_id,
  //       scales, survey_answer,
  //       created_by, modified_by
  //     ) 
  //   VALUES
  //     (
  //       ${survey_assignment_id},
  //       (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
  //       (SELECT org_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
  //       (SELECT suborg_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
  //       (SELECT program_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
  //       (SELECT iteration_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
  //       '${finalScale}',
  //       '${finalSurveyAnswer}',
  //       (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
  //       (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id})
  //     )
  // `
  // db.query(query1,
  //   [],
  //   (err, results) => {
  //     if (err) {
  //       console.log(err)
  //       result(err, null)
  //     } else {
  //       let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${survey_assignment_id}`

  //       db.query(
  //         query2,
  //         [],
  //         (err, results) => {
  //           if (err) {
  //             console.log(err)
  //             //result(err, null)
  //           } else {
  //             console.log(query2)
  //             //result(null, results)

  //             let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${survey_assignment_id}`

  //             db.query
  //               (
  //                 query3,
  //                 [],
  //                 (err, results) => {
  //                   if (err) {
  //                     console.log(err)
  //                     //result(err, null)
  //                   } else {
  //                     console.log(query3)
  //                     //result(null, results)
  //                   }
  //                 }
  //               )
  //           }
  //         }
  //       )
  //       result(null, results)
  //     }
  //   }
  // )
  // console.log(results)
  // result(null, results)
  //   }
  // })
}

// this is not using - Charles code
export const getQsortRawM = (survey_assignment_id, result) => {
  db.query('SELECT scales FROM qsort_raw WHERE survey_assignment_id = ?',
    [survey_assignment_id],
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

// this is not using - Charles code
export const getQsortCoefficientCorrelationM = (survey_assignment_id, result) => {
  db.query('SELECT company_name, benchmark_type, benchmark_data FROM qsort_norm',
    [],
    (err, results1) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        db.query('SELECT survey_answer FROM qsort_raw WHERE survey_assignment_id = ?',
          [survey_assignment_id],
          (err, results2) => {
            if (err) {
              console.log(err)
              result(err, null)
            } else {
              const combinedData = [];
              for (let i = 0; i < results1.length; i++) {
                const normData = JSON.parse(results1[i].benchmark_data);
                const surveyAnswer = JSON.parse(results2[0].survey_answer);

                const combinedBenchmarkData = normData.map((data1, index) => {
                  const data2 = surveyAnswer[index];
                  return {
                    // CardNumber: data1.CardNumber,
                    Norm: data1.CardValue,
                    Raw: data2.CardValue
                  };
                });

                combinedData.push({
                  CompanyName: results1[i].company_name,
                  BenchmarkType: results1[i].benchmark_type,
                  Correlation: combinedBenchmarkData
                });
              }

              result(null, combinedData)
            }
          }
        )
        // console.log(results)
        // result(null, results)
      }
    }
  )
}

// Individual Qsort Report
export const getQsortReportDataM = (survey_assignment_id, iteration_id, qsort_type, result) => {
  db.query(`SELECT scales, coefficient_correlation, survey_answer FROM qsort_raw WHERE survey_assignment_id = ? AND qsort_type = '${qsort_type}' `,
    [survey_assignment_id],
    (err, resultsRawData) => {
      let raw_scale_data = []
      let coefficient_correlation = []
      let individual_survey_answer = []
      if (err) {
        result(err, null)
      }
      else {
        if (resultsRawData.length == 0) {
          result(null, [])
        }
        else {
          // for BEP and GDP remove "Scales" array of object
          if(resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[0].NormScale.length == 1) {
            for(let i=0; i<resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical.length; i++) {
              resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale = resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale[0].Scales
            }
            for(let i=0; i<resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical.length; i++) {
              resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale = resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale[0].Scales
            }
          }
          // for OCM, merge 2 scales
          else if(resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[0].NormScale.length == 2) {
            for(let i=0; i<resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical.length; i++) {
              resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale = resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale[0].Scales.concat(resultsRawData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale[1].Scales)
            }
            for(let i=0; i<resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical.length; i++) {
              resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale = resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale[0].Scales.concat(resultsRawData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale[1].Scales)
            }
          }

          // for BEP and GDP
          if(resultsRawData[0].scales.length == 1) {
            raw_scale_data = resultsRawData[0].scales[0].Scales
          }
          // for OCM
          else if(resultsRawData[0].scales.length == 2) {
            // merge two scales 
            raw_scale_data = [...resultsRawData[0].scales[0].Scales, ...resultsRawData[0].scales[1].Scales]
          }

          coefficient_correlation = resultsRawData[0].coefficient_correlation
          individual_survey_answer = resultsRawData[0].survey_answer
          getQsortCohortRaw(iteration_id, raw_scale_data, coefficient_correlation, individual_survey_answer, qsort_type, result)

        }
      }
    })
}

// this function called by function above getQsortReportDataM
export const getQsortCohortRaw = (iteration_id, raw_scale_data, coefficient_correlation, individual_survey_answer, qsort_type, result) => {
  db.query(`SELECT scales, survey_answer FROM qsort_cohort WHERE iteration_id = ? AND qsort_type = '${qsort_type}' `,
    [iteration_id],
    (err, resultsCohortData) => {
      let cohort_scale_data = []
      let cohort_survey_answer = []
      const cards = resultsCohortData[0].survey_answer
      if (err) {
        result(err, null)
      } else {
        if (resultsCohortData.length == 0) {
          result(null, [])
        }
        else {
          cohort_scale_data = resultsCohortData[0].scales
          cohort_survey_answer = resultsCohortData[0].survey_answer

          // cohort characteristics section 2
          const cohortCharacteristics = getCohortCharacteristics(cards)

          //section 2 correlation
          const section2Correlation = getSection2Correlation(individual_survey_answer, cohort_survey_answer)

          getNormBenchMarkData(raw_scale_data, cohort_scale_data, coefficient_correlation, cohort_survey_answer, cohortCharacteristics, section2Correlation, qsort_type, result)
        }
      }
    })
}

// this function called by function above getQsortCohortRaw
// difference = qsort_cohort minus qsort_norm 
export const getNormBenchMarkData = (raw_scale_data, cohort_scale_data, coefficient_correlation, cohort_survey_answer, cohortCharacteristics, section2Correlation, qsort_type, result) => {
  db.query(`SELECT company_name, benchmark_type, benchmark_data FROM qsort_norm WHERE qsort_type = '${qsort_type}' AND is_active = 1 AND benchmark_data != '' `,
    (err, resultsNormData) => {
      if (err) {
        result(err, null)
      } 
      else {
        if(resultsNormData.length == 0) {
          result(null, [])
        }
        else {
          // function of section 3,4,5 in Difference Table on the Frontend 
          const [filteredHighDifferenceData, filteredLowDifferenceData] = getMaxDifferenceBetweenCohortAndNorm(resultsNormData, cohort_survey_answer)

          // section 5 get max difference between norm and cohort
          const MaxDifferentScaleHypothetical = getMaxDifferenceBetweenNormAndCohort(coefficient_correlation, cohort_scale_data)

          result(null, {
            "raw_scale_data" : raw_scale_data, 
            "cohort_scale_data" : cohort_scale_data, 
            "sorted_correlation_historical" : coefficient_correlation.sortedBenchmarkHistorical,
            "sorted_correlation_hypothetical" : coefficient_correlation.sortedBenchmarkHypothetical,
            "high_cohort_norm_difference" : filteredHighDifferenceData,
            "low_cohort_norm_difference" : filteredLowDifferenceData,
            "high_cohort_norm_difference_historical_top1" : filteredHighDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHistorical[0].CompanyName), 
            "low_cohort_norm_difference_historical_top1" : filteredLowDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHistorical[0].CompanyName), 
            "high_cohort_norm_difference_hypothetical_top1" : filteredHighDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHypothetical[0].CompanyName), 
            "low_cohort_norm_difference_hypothetical_top1" : filteredLowDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHypothetical[0].CompanyName), 
            "cohortCharacteristics" : cohortCharacteristics,
            "section2Correlation" : section2Correlation,
            "maxDifferentScaleHypothetical" : MaxDifferentScaleHypothetical,
          })
        }
      }
    })
}

// function of section 5 get max difference between norm and cohort, called below
const getMaxDifferenceBetweenNormAndCohort = (coefficient_correlation, cohort_scale_data) => {
  const mainScaleHypothetical = []
  const MaxDifferentScaleHypothetical = []
  for (let i = 0; i < coefficient_correlation.sortedBenchmarkHypothetical.length; i++) {
    const normScale = coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale
    const companyName = coefficient_correlation.sortedBenchmarkHypothetical[i].CompanyName
    
    const mainScale = normScale.map((resNorm, index) => {
      const resCohort = cohort_scale_data[index];
      const subtracted = resNorm.ScaleValue - resCohort.ScaleValue

      return { 
        "CompanyName" : companyName,
        "ScaleName" : resNorm.ScaleName,
        "Subtracted": parseFloat(subtracted).toFixed(1)
      }
    })
    
    mainScaleHypothetical.push({
      "mainScale": mainScale,
    });
  }

  for(let j=0; j<mainScaleHypothetical.length; j++) {
    const mainScaleArr = mainScaleHypothetical[j].mainScale
    // get 1 value of max number
    let max = mainScaleArr.reduce((prev, current) => {
      return (prev.Subtracted > current.Subtracted) ? prev : current
    })
    // filter all same max value
    let maxKeys = mainScaleArr.filter((obj) => obj.Subtracted === max.Subtracted).map((obj) => obj.ScaleName)
    // Join all Scale Name if More than 1 Max same value
    if (maxKeys.length === 1) {
      MaxDifferentScaleHypothetical.push({
        "CompanyName" : max.CompanyName,
        "ScaleName" : max.ScaleName
      })
    } else {
      MaxDifferentScaleHypothetical.push({
        "CompanyName" : max.CompanyName,
        "ScaleName" : maxKeys.join(', ')
      })
    }
  }

  return MaxDifferentScaleHypothetical
}

// function of section 3,4,5 in Difference Table on the Frontend 
const getMaxDifferenceBetweenCohortAndNorm = (resultsNormData, cohort_survey_answer) => {
  let differenceData = []
  for (let i = 0; i < resultsNormData.length; i++) {
    const normData = resultsNormData[i].benchmark_data
    
    // get difference of cohort minus norm that greater than or equal 2 
    const highDifferenceCohortAndNormData = normData.map((resNorm, index) => {
      const resCohort = cohort_survey_answer[index];
      const subtracted = resCohort.CardValue - resNorm.CardValue
      if(subtracted >= 2) {
        return { 
          NormCardNumber: resNorm.CardNumber,
          CohortCardValue: resCohort.CardValue,
          NormCardValue: resNorm.CardValue,
          Subtracted: parseFloat(subtracted).toFixed(2)
        }
      }
    })

    // get difference of cohort minus norm that less than or equal -2 
    const lowDifferenceCohortAndNormData = normData.map((resNorm, index) => {
      const resCohort = cohort_survey_answer[index];
      const subtracted = resCohort.CardValue - resNorm.CardValue
      if(subtracted <= -2) {
        return { 
          NormCardNumber: resNorm.CardNumber,
          CohortCardValue: resCohort.CardValue,
          NormCardValue: resNorm.CardValue,
          Subtracted: parseFloat(subtracted).toFixed(2)
        }
      }
    })
    
    differenceData.push({
      highDifferenceCohortAndNormData: highDifferenceCohortAndNormData,
      lowDifferenceCohortAndNormData: lowDifferenceCohortAndNormData
    });
  }

  // remove null values from an array
  let filteredHighDifferenceData = []
  let filteredLowDifferenceData = []
  for (let j = 0; j < resultsNormData.length; j++) {
    filteredHighDifferenceData.push({
      CompanyName: resultsNormData[j].company_name,
      BenchmarkType: resultsNormData[j].benchmark_type,
      FilteredhighDifferenceData: differenceData[j].highDifferenceCohortAndNormData.filter(function (el) { return el != null }).sort((a,b) => b.Subtracted - a.Subtracted)
    });
    filteredLowDifferenceData.push({
      CompanyName: resultsNormData[j].company_name,
      BenchmarkType: resultsNormData[j].benchmark_type,
      FilteredlowDifferenceData: differenceData[j].lowDifferenceCohortAndNormData.filter(function (el) { return el != null }).sort((a,b) => a.Subtracted - b.Subtracted)
    });
  }

  return[filteredHighDifferenceData, filteredLowDifferenceData]
}

// cohort characteristics section 2
const getCohortCharacteristics = (cards) => {
  // lowerThan2 = cards.filter(card => card.CardValue < 2);
  // greaterThan4 = cards.filter(card => card.CardValue > 4);
  let lowerThan2 = []
  let greaterThan4 = []
  let cohortCharacteristics = []
  cards.forEach(card => {
    if (card.CardValue > 4) {
      greaterThan4.push({...card, CardMessage: "SuggestionHigh"});
    } else if (card.CardValue < 2) {
      lowerThan2.push({...card, CardMessage: "SuggestionLow"});
    }
  });
  cohortCharacteristics = [...greaterThan4, ...lowerThan2]
  return cohortCharacteristics
}

//section 2 correlation only for individual
const getSection2Correlation = (individual_survey_answer, cohort_survey_answer) => {
  const newArr = [];
  // loop through individualData and cohortData
  for (let i = 0; i < individual_survey_answer.length; i++) {
    // check if CardNumber is between Q1 and Q40
    if (individual_survey_answer[i].CardNumber >= "Q1" && individual_survey_answer[i].CardNumber <= "Q40") {
      const matchingObj = cohort_survey_answer.find((obj) => obj.CardNumber === individual_survey_answer[i].CardNumber);
      if (matchingObj) {
        // create new object with CardValue from individual_survey_answer and cohort_survey_answer
        const newObj = {
          indData: individual_survey_answer[i].CardValue,
          cohData: parseFloat(matchingObj.CardValue),
        };
        // add new object to newArr
        newArr.push(newObj);
      }
    }
  }
  var bodyVars = {
    indData: 'metric',
    cohData: 'metric'
  };
  var stats = new Statistics(newArr, bodyVars);
  var r = stats.correlationCoefficient('indData', 'cohData');
  const section2Correlation = parseFloat(r.correlationCoefficient).toFixed(2)
  return section2Correlation
}


/***************************************  Coach Qsort Report ******************************************/
export const getQsortCoachReportDataM = (iteration_id, qsort_type, result) => {
  db.query(`SELECT scales, survey_answer, coefficient_correlation FROM qsort_cohort WHERE iteration_id = ? AND qsort_type = '${qsort_type}' `,
    [iteration_id],
    (err, resultsCohortData) => {
      let cohort_scale_data = []
      let cohort_survey_answer = []
      let coefficient_correlation = []
      if (err) {
        result(err, null)
      } else {
        if (resultsCohortData.length == 0) {
          result(null, [])
        }
        else {
          // for BEP and GDP remove "Scales" array of object
          if(resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[0].NormScale.length == 1) {
            for(let i=0; i<resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical.length; i++) {
              resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale = resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale[0].Scales
            }
            for(let i=0; i<resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical.length; i++) {
              resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale = resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale[0].Scales
            }
          }
          // for OCM, merge 2 scales
          else if(resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[0].NormScale.length == 2) {
            for(let i=0; i<resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical.length; i++) {
              resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale = resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale[0].Scales.concat(resultsCohortData[0].coefficient_correlation.sortedBenchmarkHistorical[i].NormScale[1].Scales)
            }
            for(let i=0; i<resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical.length; i++) {
              resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale = resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale[0].Scales.concat(resultsCohortData[0].coefficient_correlation.sortedBenchmarkHypothetical[i].NormScale[1].Scales)
            }
          }

          cohort_scale_data = resultsCohortData[0].scales
          cohort_survey_answer = resultsCohortData[0].survey_answer
          coefficient_correlation = resultsCohortData[0].coefficient_correlation
          
          // cohort characteristics section 2
          const cards = resultsCohortData[0].survey_answer
          const cohortCharacteristics = getCohortCharacteristics(cards)

          getNormBenchMarkDataForCohort(cohort_scale_data, cohort_survey_answer, cohortCharacteristics, coefficient_correlation, qsort_type, result)
        
        }
      }
    })
}

// function for cohort
const getNormBenchMarkDataForCohort = (cohort_scale_data, cohort_survey_answer, cohortCharacteristics, coefficient_correlation, qsort_type, result) => {
  db.query(`SELECT company_name, benchmark_type, benchmark_data FROM qsort_norm WHERE qsort_type = '${qsort_type}' AND is_active = 1 AND benchmark_data != '' `,
    (err, resultsNormData) => {
      if (err) {
        result(err, null)
      } 
      else {
        if(resultsNormData.length == 0) {
          result(null, [])
        }
        else {
          // function of section 3,4,5 in Difference Table on the Frontend 
          const [filteredHighDifferenceData, filteredLowDifferenceData] = getMaxDifferenceBetweenCohortAndNorm(resultsNormData, cohort_survey_answer)

          // section 5 get max difference between norm and cohort
          const MaxDifferentScaleHypothetical = getMaxDifferenceBetweenNormAndCohort(coefficient_correlation, cohort_scale_data)

          result(null, {
            "cohort_scale_data" : cohort_scale_data, 
            "sorted_correlation_historical" : coefficient_correlation.sortedBenchmarkHistorical,
            "sorted_correlation_hypothetical" : coefficient_correlation.sortedBenchmarkHypothetical,
            "high_cohort_norm_difference" : filteredHighDifferenceData,
            "low_cohort_norm_difference" : filteredLowDifferenceData,
            "high_cohort_norm_difference_historical_top1" : filteredHighDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHistorical[0].CompanyName), 
            "low_cohort_norm_difference_historical_top1" : filteredLowDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHistorical[0].CompanyName), 
            "high_cohort_norm_difference_hypothetical_top1" : filteredHighDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHypothetical[0].CompanyName), 
            "low_cohort_norm_difference_hypothetical_top1" : filteredLowDifferenceData.filter(rank => rank.CompanyName == coefficient_correlation.sortedBenchmarkHypothetical[0].CompanyName), 
            "cohortCharacteristics" : cohortCharacteristics,
            "maxDifferentScaleHypothetical" : MaxDifferentScaleHypothetical,
          })
        }
      }
    })
}


