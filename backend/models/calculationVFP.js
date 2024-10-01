import db from "../config/database.js"

export const getVFPSurveyResultsM = (survey_assignment_id, result) => {
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

export const deleteVFPRawM = (survey_assignment_id, result) => {
  db.query('DELETE FROM vfp_raw WHERE survey_assignment_id = ?',
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

export const insertVFPRawCalcM = (survey_assignment_id, data, result) => {
  db.query('SELECT * FROM survey_result WHERE survey_assignment_id = ?',
    [survey_assignment_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        let scales = []
        let overallValues = [] //? stores culturalValues and personalValues

        let culturalValues = []
        data.forEach(res => { //TODO CulturalValues
          // console.log(res)
          res.CulturalValues.forEach(res2 => {
            // console.log(res2)
            const culturalValuesName = res2.Name
            const culturalValuesLetter = res2.Letter
            let scores = []
            let sum = null

            if (res2.Cards.length > 1) {
              for (let i = 0; i < res2.Cards.length; i++) {
                const response = res2.Cards[i];
                // console.log(response.CardNumber + response.Reversed)

                let cardNumber = results.map(function (e) { return e.statement_num; }).indexOf(response.CardNumber);
                let cardScore = results[cardNumber]['score'];

                // console.log(cardNumber + " " + cardScore)

                if (response.Reversed === 'Yes' && cardScore === 5) {
                  cardScore = 1
                  scores.push(cardScore)
                } else if (response.Reversed === 'Yes' && cardScore === 4) {
                  cardScore = 2
                  scores.push(cardScore)
                } else if (response.Reversed === 'Yes' && cardScore === 2) {
                  cardScore = 4
                  scores.push(cardScore)
                } else if (response.Reversed === 'Yes' && cardScore === 1) {
                  cardScore = 5
                  scores.push(cardScore)
                } else {
                  scores.push(cardScore)
                }
              }

              sum = scores.reduce(function (a, b) {
                return a + b;
              });

              sum = sum / scores.length
              sum = parseFloat(sum)

            }

            if (res2.LinkedLetter !== '') { 
              let selectedObj = overallValues.find(e => e.Letter === res2.LinkedLetter)
              let LinkedLetterValue = selectedObj.Value

              sum = 6 - LinkedLetterValue
            }
            
            let scaleFinalData = { Name: culturalValuesName, Value: sum, Letter: culturalValuesLetter }

            culturalValues.push(scaleFinalData)
            overallValues.push(scaleFinalData)
          });
        });

        let personalValues = []
        data.forEach(res => { //TODO PersonalValues
          // console.log(res)
          res.PersonalValues.forEach(res2 => {
            // console.log(res2)
            const personalValuesName = res2.Name
            const personalValuesLetter = res2.Letter
            let scores = []
            let sum = null

            for (let i = 0; i < res2.Cards.length; i++) {
              const response = res2.Cards[i];
              // console.log(response.CardNumber + response.Reversed)

              let cardNumber = results.map(function (e) { return e.statement_num; }).indexOf(response.CardNumber);
              let cardScore = results[cardNumber]['score'];

              // console.log(cardNumber + " " + cardScore)

              if (response.Reversed === 'Yes' && cardScore === 5) {
                cardScore = 1
                scores.push(cardScore)
              } else if (response.Reversed === 'Yes' && cardScore === 4) {
                cardScore = 2
                scores.push(cardScore)
              } else if (response.Reversed === 'Yes' && cardScore === 2) {
                cardScore = 4
                scores.push(cardScore)
              } else if (response.Reversed === 'Yes' && cardScore === 1) {
                cardScore = 5
                scores.push(cardScore)
              } else {
                scores.push(cardScore)
              }
            }

            sum = scores.reduce(function (a, b) {
              return a + b;
            });

            sum = sum / scores.length
            sum = parseFloat(sum)

            let scaleFinalData = { Name: personalValuesName, Value: sum, Letter: personalValuesLetter }

            personalValues.push(scaleFinalData)
            overallValues.push(scaleFinalData)
          });
        });

        let superValues = []
        data.forEach(res => { //TODO SuperValues
          let finalAverage = []
          res.SuperValues.forEach(res2 => {
            // console.log(res2)
            let scoresA = []
            let sumA = null
            let scoresB = []
            let sumB = null
            let values = []
            res2.ScaleA.forEach(res3 => {
              // console.log(res3)
              let selectedObj = overallValues.find(e => e.Letter === res3)
              if (selectedObj.Letter === res3) {
                let parsedScore = parseFloat(selectedObj.Value)
                scoresA.push(parsedScore)
              }
            })
            sumA = scoresA.reduce(function (a, b) {
              return a + b;
            });

            sumA = sumA / scoresA.length
            sumA = parseFloat(sumA)
            res2.ScaleB.forEach(res3 => {
              // console.log(res3)
              let selectedObj = overallValues.find(e => e.Letter === res3)
              if (selectedObj.Letter === res3) {
                let parsedScore = parseFloat(selectedObj.Value)
                scoresB.push(parsedScore)
              }
            })
            sumB = scoresB.reduce(function (a, b) {
              return a + b;
            });

            sumB = sumB / scoresB.length
            sumB = parseFloat(sumB)


            values.push(parseFloat(sumA))
            values.push(parseFloat(sumB))

            finalAverage = values.reduce(function (a, b) {
              return a + b;
            });

            finalAverage = finalAverage / values.length
            finalAverage = parseFloat(finalAverage)

            let superValuesObj = { Name: res2.Name, Value: finalAverage }
            superValues.push(superValuesObj)
          })
        });

        let superScales = []
        data.forEach(res => { //TODO SuperScales
          let finalAverage = []
          res.SuperScale.forEach(res2 => {
            // console.log(res2)
            let scoresA = []
            let scoresB = []
            let values = []
            let culturalNames = []

            res2.ScaleA.forEach(res3 => {
              // console.log(res3)
              let selectedObj = overallValues.find(e => e.Letter === res3)
              if (selectedObj.Letter === res3) {
                let parsedScore = parseFloat(selectedObj.Value)
                scoresA.push(parsedScore)
                culturalNames.push(selectedObj.Name)
              }
            })

            res2.ScaleB.forEach(res3 => {
              // console.log(res3)
              let selectedObj = overallValues.find(e => e.Letter === res3)
              if (selectedObj.Letter === res3) {
                let parsedScore = parseFloat(selectedObj.Value)
                scoresB.push(parsedScore)
                culturalNames.push(selectedObj.Name)
              }
            })

            values.push(parseFloat(scoresA))
            values.push(parseFloat(scoresB))

            finalAverage = values.reduce(function (a, b) {
              return a - b;
            });

            let superScalesObj = { Name: res2.Name, Value: finalAverage, CulturalNames: culturalNames}
            superScales.push(superScalesObj)
          })
        });
        let finalOutput = { CulturalValues: culturalValues, PersonalValues: personalValues, SuperValues: superValues, SuperScales: superScales }
        scales.push(finalOutput)

        let finalScales = JSON.stringify(scales)

        // console.log(scales)
        // result(null, scales)

        let query1 = `
          INSERT INTO vfp_raw 
            (
              survey_assignment_id,
              ind_id, org_id, suborg_id, program_id, iteration_id, stream_id, group_id,
              calcs,
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
              (SELECT stream_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
              (SELECT group_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
              ?,
              (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id}),
              (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${survey_assignment_id})
            )
        `
        db.query(query1,
          [finalScales],
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
      }
    })
}