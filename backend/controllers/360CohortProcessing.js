import {
  delete360CohortM,
  updateIsProcessedM,
  get360FinalDeadlineDateM,
  generate360DataM,
  forceDelete360CohortM,
  forceUpdateIsProcessedM,
  forceGet360IterationListM,
  forceGenerate360DataM,
  insert360CohortM,
  forceInsert360CohortM,
  CalculateParticipantSelectScoresM,
  CalculateParticipantInsertM,
  delete360CohortPriorDaysM,
  updateIsProcessedByIterationM,
  forceGenerateInsert360DataM
} from '../models/360CohortProcessingM.js'

import check_token from "./functions.js"
import axios from 'axios'

import db from "../config/database.js";

//todo Delete 360 cohort record
export const delete360Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  delete360CohortM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Update is_processed
export const updateIsProcessed = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  updateIsProcessedM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Get Final deadline date
export const get360FinalDeadlineDate = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  get360FinalDeadlineDateM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Generate 360 cohort data
export const generate360Data = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  generate360DataM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Insert 360 cohort record
export const insert360Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insert360CohortM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


//todo FORCE Delete 360 cohort record
export const forceDelete360Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceDelete360CohortM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo FORCE Update is_processed
export const forceUpdateIsProcessed = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceUpdateIsProcessedM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo FORCE Get Final deadline date
export const forceGet360IterationList = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceGet360IterationListM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo FORCE Generate 360 Data
export const forceGenerate360Data = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceGenerate360DataM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo FORCE Insert 360 cohort record
export const forceInsert360Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  forceInsert360CohortM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


//todo Automatic processing based on iteration final deadline date
export const c360CohortProcessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let check_date_field = 'final_deadline_date'

  //todo STEP 1: DELETE EXISTING RECORD
  let step1_url = node_baseurl + 'delete-cohort/360/' + check_date_field
  console.log("step 1 URL: " + step1_url)
  axios.delete(step1_url, { headers: { "token": valid_token } })
    .then((resp) => {
      console.log("step1 delete: " + JSON.stringify(resp.data))

      //todo STEP 2: Update is_processed in 360 raw table
      let step2_url = node_baseurl + 'update-is-processed/360/' + check_date_field
      console.log("step 2 URL: " + step2_url)
      // axios.put(step2_url, { headers: {"token" : valid_token} })
      axios({
        method: 'put',
        url: step2_url,
        headers: {
          'token': valid_token
        },
      })
        .then((resp) => {
          console.log("step2 update: " + JSON.stringify(resp.data))

          //todo STEP 3: select list of surveys to be processed based on iteration where final_deadline_date
          let step3_url = node_baseurl + 'get-final-deadline-date/360/' + check_date_field
          console.log("step 3 URL: " + step3_url)
          axios.get(step3_url, { headers: { "token": valid_token } })
            .then((resp) => {
              // console.log(resp.data)
              let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if 
              let iteration_log_data = resp.data[0]

              console.log("Number of surveys: ", ctr)

              //console log if no final_deadline_date found
              if (ctr == 0) {
                let myResp = {}
                myResp = { '360 surveys processed': ctr }
                res.json(myResp)
                console.log("no valid submitted surveys found for 360 report processing")
              } else {
                for (let i = 0; i < ctr; i++) {
                  //todo STEP 4: run after all i for R360-raw-insert3 finished , generate R360 cohort data
                  if (ctr == (i + 1)) {
                    let step4_url = node_baseurl + 'generate-360-data/' + check_date_field
                    console.log("step4 url: " + step4_url);
                    // axios.post(step4_url, { headers: {"token" : valid_token} })
                    axios({
                      method: 'post',
                      url: step4_url,
                      headers: {
                        'token': valid_token
                      },
                    })
                      .then((resp) => {
                        let r360_cohort_data = resp.data
                        // console.log("step3 generate cohort data resp.data: " + JSON.stringify(resp.data))

                        //todo STEP 5: insert r360 cohort data
                        let step5_url = node_baseurl + 'insert-cohort/360'
                        console.log("step 5 url : " + step5_url)
                        axios.post(step5_url, r360_cohort_data, { headers: { "token": valid_token } })
                          .then((resp) => {
                            console.log("step5 insert cohort: " + JSON.stringify(resp.data))

                            let myResp = {}
                            myResp = { '360 cohort surveys processed': ctr }
                            res.json(myResp)

                            let query1 = `
                            SELECT iteration_id 
                            FROM iteration 
                            WHERE DATE_FORMAT(final_deadline_date, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', time_zone), '%Y-%m-%d %H:%i') 
                            `;

                            let setItrationId = ''

                            db.query(query1, [], (err, res) => {
                              if (err) {
                                console.log(err)
                              } else {
                                console.log(res[0].iteration_id)
                                setItrationId = res[0].iteration_id


                                let step6_url = node_baseurl + 'r360-histogram1/' + setItrationId

                                axios({
                                  method: 'post',
                                  url: step6_url,
                                  headers: {
                                    'token': valid_token
                                  },
                                })
                                  .then((resp) => {
                                    console.log("step6 insert histogram data: " + JSON.stringify(resp.data))

                                    let myResp = {}
                                    myResp = { '360 histogram processed': ctr }
                                  }).catch((error) => {
                                    if (error.response) {
                                      // Request made and server responded
                                      console.log(error.response.data)
                                      console.log(error.response.status)
                                      console.log(error.response.headers)
                                    } else if (error.request) {
                                      // The request was made but no response was received
                                      console.log(error.request)
                                    } else {
                                      // Something happened in setting up the request that triggered an Error
                                      console.log('Error', error.message)
                                    }
                                  });
                              }
                            })


                          })
                          .catch((error) => {
                            if (error.response) {
                              // Request made and server responded
                              console.log(error.response.data)
                              console.log(error.response.status)
                              console.log(error.response.headers)
                            } else if (error.request) {
                              // The request was made but no response was received
                              console.log(error.request)
                            } else {
                              // Something happened in setting up the request that triggered an Error
                              console.log('Error', error.message)
                            }
                          })
                      })
                      .catch((error) => {
                        if (error.response) {
                          // Request made and server responded
                          console.log(error.response.data)
                          console.log(error.response.status)
                          console.log(error.response.headers)
                        } else if (error.request) {
                          // The request was made but no response was received
                          console.log(error.request)
                        } else {
                          // Something happened in setting up the request that triggered an Error
                          console.log('Error', error.message)
                        }
                      })
                  }
                }
                let step7url = node_baseurl + "iteration-log"
                console.log(step7url)
                axios.post(step7url, {
                  iteration_id: iteration_log_data.iteration_id,
                  action_made: 25,
                  action_by: "Automated iteration run.",
                  action_by_id: 0,
                  status: "Success",
                  org_id: iteration_log_data.org_id,
                  suborg_id: iteration_log_data.suborg_id,
                  program_id: iteration_log_data.program_id,
                  created_by: 0,
                  modified_by: 0,
                }, { headers: { "token": valid_token } })
                  .then((res) => {
                    console.log(res.data)
                  }).catch((error) => {
                    if (error.response) {
                      // Request made and server responded
                      console.log(error.response.data)
                      console.log(error.response.status)
                      console.log(error.response.headers)
                    } else if (error.request) {
                      // The request was made but no response was received
                      console.log(error.request)
                    } else {
                      // Something happened in setting up the request that triggered an Error
                      console.log('Error', error.message)
                    }
                  });
              }
            })
            .catch((error) => {
              if (error.response) {
                // Request made and server responded
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
              } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request)
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
              }
            })
        })
        .catch((error) => {
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
        })
    })
    .catch((error) => {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    })
}
//todo Force process using batch action run iteration
export const force360CohortProcessing = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let iterationId = req.body.iteration_id

    try {
        //todo STEP 1: DELETE EXISTING RECORD
        let step1_url = node_baseurl + 'force-delete-cohort/360/' + iterationId
        console.log("STEP 1: ", step1_url)
        const res1 = await axios.delete(step1_url, { headers: { "token": valid_token } })
        if (res1.status === 200) {
            try {
                //todo STEP 2: Update is_processed in 360 raw table
                let step2_url = node_baseurl + 'force-update-is-processed/360/' + iterationId
                console.log("STEP 2: ", step2_url)
                // const res2 = await axios.put(step2_url, { headers: { "token": valid_token } })
                const res2 = await axios({
                    method: 'put',
                    url: step2_url,
                    headers: {
                      'token': valid_token
                    },
                  })
                if (res2.status === 200) {
                    //todo STEP 3: select list of surveys to be processed based on iteration where final_deadline_date
                    let step3_url = node_baseurl + 'force-get-list/360/' + iterationId
                    console.log("STEP 3: ", step3_url)
                    const res3 = await axios.get(step3_url, { headers: { "token": valid_token } })
                    if (res3.status === 200) { 
                        let ctr = res3.data.length;
                        if (ctr === 0) {
                            res.json({ '360 surveys processed': ctr })
                            console.log("no valid submitted surveys found for 360 report processing")
                        } 
                        for (let i = 0; i < ctr; i++) {
                            //todo STEP 4: run after all i for R360-raw-insert3 finished , generate R360 cohort data
                            if (ctr == (i + 1)) {
                                try {
                                    let step4_url = node_baseurl + 'force-generate-data/360/' + iterationId;
                                    console.log("STEP 4: ", step4_url)
                                    // const res4 = await axios.post(step4_url, { headers: { "token": valid_token } })
                                    const res4 = await axios({
                                        method: 'post',
                                        url: step4_url,
                                        headers: {
                                          'token': valid_token
                                        },
                                      })
                                    if (res4.status === 200) { 
                                        console.log("step3 generate cohort data resp.data: " + JSON.stringify(res4.data))
                                        try {

                                            const largeData = res4.data; // Get the large data from the request body

                                            // Set appropriate headers for chunked transfer encoding
                                            res.setHeader('Content-Type', 'application/json');
                                            res.setHeader('Transfer-Encoding', 'chunked');

                                            const chunkSize = 100; // Adjust the chunk size as needed
                                            let currentIndex = 0;

                                            async function sendChunks() {
                                                const endIndex = Math.min(currentIndex + chunkSize, largeData.length);
                                                if (currentIndex < largeData.length) {
                                                    const chunk = largeData.slice(currentIndex, endIndex);
                                                    try {
                                                        let step5_url = node_baseurl + 'force-insert-cohort/360'
                                                        const response = await axios.post(step5_url, chunk, { headers: { "token": valid_token } });
                                                        console.log(response)
                                                        console.log('Chunk sent:', currentIndex, '-', endIndex);
                                                        currentIndex = endIndex;
                                                        setTimeout(sendChunks, 10); // Simulate asynchronous streaming
                                                    } catch (error) {
                                                        console.error('Error sending chunk:', error.message);
                                                        res.status(500).json({ error: 'An error occurred' });
                                                    }
                                                } else {
                                                    res.json({ '360 cohort surveys processed': largeData.length });
                                                }
                                            }

                                            sendChunks();
                                            try {
                                                let step6_url = node_baseurl + 'r360-histogram1/' + iterationId
                                                console.log("STEP 6: ", step6_url)
                                                // const res6 = await axios.post(step6_url, { headers: { "token": valid_token } })
                                                const res6 = await axios({
                                                    method: 'post',
                                                    url: step6_url,
                                                    headers: {
                                                        'token': valid_token
                                                    },
                                                })
                                                if (res6.status === 200) { 
                                                    let myResp = {}
                                                    myResp = { '360 histogram processed': ctr }
                                                    res.json(myResp)
                                                }
                                            } catch (error) {
                                                if (error.response) {
                                                    // The request was made and the server responded with a status code
                                                    console.error('Status code:', error.response.status);
                                                    console.error('Response data:', error.response.data);
                                                } else if (error.request) {
                                                    // The request was made but no response was received
                                                    console.error('Request made, but no response received.');
                                                } else {
                                                    // An error occurred during the request setup
                                                    console.error('Error setting up request:', error.message);
                                                }
                                            }




                                            // //todo STEP 5: insert r360 cohort data
                                            // let step5_url = node_baseurl + 'force-insert-cohort/360'
                                            // console.log("STEP 5: ", step5_url)
                                            // const res5 = await axios.post(step5_url, res4.data, { headers: { "token": valid_token } })
                                            // res.json({ '360 cohort surveys processed': ctr })
                                            // if (res5.status === 200) {
                                            //     try {
                                            //         let step6_url = node_baseurl + 'r360-histogram1/' + iterationId
                                            //         console.log("STEP 6: ", step6_url)
                                            //         // const res6 = await axios.post(step6_url, { headers: { "token": valid_token } })
                                            //         const res6 = await axios({
                                            //             method: 'post',
                                            //             url: step6_url,
                                            //             headers: {
                                            //               'token': valid_token
                                            //             },
                                            //           })
                                            //         if (res6.status === 200) { 
                                            //             myResp = { '360 histogram processed': ctr }
                                            //             res.json(myResp)
                                            //         }
                                            //     } catch (error) {
                                            //         if (error.response) {
                                            //             // The request was made and the server responded with a status code
                                            //             console.error('Status code:', error.response.status);
                                            //             console.error('Response data:', error.response.data);
                                            //         } else if (error.request) {
                                            //             // The request was made but no response was received
                                            //             console.error('Request made, but no response received.');
                                            //         } else {
                                            //             // An error occurred during the request setup
                                            //             console.error('Error setting up request:', error.message);
                                            //         }
                                            //     }
                                            // }
                                        } catch (error) {
                                            if (error.response) {
                                                // The request was made and the server responded with a status code
                                                console.error('Status code:', error.response.status);
                                                console.error('Response data:', error.response.data);
                                            } else if (error.request) {
                                                // The request was made but no response was received
                                                console.error('Request made, but no response received.');
                                                console.log(error.request)
                                            } else {
                                                // An error occurred during the request setup
                                                console.error('Error setting up request:', error.message);
                                            }
                                        }
                                    }
                                } catch (error) {
                                    if (error.response) {
                                        // The request was made and the server responded with a status code
                                        console.error('Status code:', error.response.status);
                                        console.error('Response data:', error.response.data);
                                    } else if (error.request) {
                                        // The request was made but no response was received
                                        console.error('Request made, but no response received.');
                                    } else {
                                        // An error occurred during the request setup
                                        console.error('Error setting up request:', error.message);
                                    }
                                }
                            }
                        }
                        
                    }
                }
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.error('Status code:', error.response.status);
                    console.error('Response data:', error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Request made, but no response received.');
                } else {
                    // An error occurred during the request setup
                    console.error('Error setting up request:', error.message);
                }
            }
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Status code:', error.response.status);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request made, but no response received.');
        } else {
            // An error occurred during the request setup
            console.error('Error setting up request:', error.message);
        }
    }
}




//vty 2024-01-05 CalculateThisParticipantScores processing (calls CalculateParticipantSelectScores, CalculatePartiicpantInsert)
export const CalculateParticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
	  //console.log(req.body);
  let ctr = req.body.length; //use this to trigger execution of insert cohort endpoint if 
    //console.log("length: "+ ctr);
	
	if (ctr == 0) {
		let myResp = {}
		myResp = {'no objects passed to the endpoint': ctr }
		res.json(myResp)
		console.log("no objects passed to the endpoint")
	} 
	else {
		let survey_assignment_id_list = "";
		for (let i = 0; i < ctr; i++) {
		  let survey_assignment_id_i = req.body[i].survey_assignment_id;

      ////CalculateParticipantSelectScores////
      //console.log(survey_assignment_id_i)
      
      let url1 = node_baseurl + 'CalculateParticipantSelectScores/' + survey_assignment_id_i
      //step1 select
      axios({
        method: 'post',
        url: url1,
        headers: {
          'token': valid_token
        },
      })
        .then((resp) => {
          //console.log("survey_assignment_id: "+survey_assignment_id_i+" CalculateParticipantSelectScores data: " + JSON.stringify(resp.data));

          //let myResp = {}
          //myResp = { '360 histogram processed': ctr }

          let url2 = node_baseurl + 'CalculateParticipantInsert'
          let participant_cohort_data = resp.data
           // console.log("participant_cohort_data " + JSON.stringify(participant_cohort_data))

          //step2 insert
          axios.post(url2, participant_cohort_data, { headers: { "token": valid_token } })
          
          .then((resp) => {
            //console.log("Insert Participant complete: " + JSON.stringify(resp.data));
  
      //step3 histogram
            let url3 = node_baseurl + 'r360-histogram-persa/' + survey_assignment_id_i
          axios({
            method: 'post',
            url: url3,
            headers: {
              'token': valid_token
            },
          })
            .then((resp) => {
              console.log("histogram complete for sa: " + survey_assignment_id_i);
      
        
            }).catch((error) => {
              if (error.response) {
                // Request made and server responded
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
              } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request)
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
              }
            });
      
            }).catch((error) => {
              if (error.response) {
                // Request made and server responded
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
              } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request)
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
              }
            });



        }).catch((error) => {
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
        });



		  survey_assignment_id_list =  (survey_assignment_id_list + survey_assignment_id_i);
		  if (ctr > (i + 1)) {
  			survey_assignment_id_list = (survey_assignment_id_list + ",");
		  }
		
		
		//console.log("processing i: " + i + "survey_assignment_id: " + survey_assignment_id_i) ;
		
		if (ctr == (i + 1)) {
			let c360response = (ctr + " objects have been submitted for processing");
			//console.log(c360response);
			//console.log("survey_assignment_id_list: " + survey_assignment_id_list);
			res.json(c360response);
		}
		// axios.post(step4_url, { headers: {"token" : valid_token} })
		/*axios({
			method: 'post',
			url: step4_url,
			headers: {
			'token': valid_token
			},
		})*/
				
				
    // res.json(req.body);
		}
	}
}


//generate CalculateParticipantSelectScores - generates participant data
export const CalculateParticipantSelectScores = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  CalculateParticipantSelectScoresM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


//calculatethisparticipantscores insert
export const CalculateParticipantInsert = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  CalculateParticipantInsertM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}



//2024-01-09 delete360CohortPriorDaysM, returns list of iteration id for cohort processing
export const delete360CohortPriorDays = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  delete360CohortPriorDaysM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//2024-01-09 updateIsProcessedByIterationM
export const updateIsProcessedByIteration = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  updateIsProcessedByIterationM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//2024-01-09 priorDays cohort processing pass number of days prior 7,6,5,4,3,2,1, if 0 process on final deadline date
export const priorDays360CohortProcessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      //console.log(req.body);
      let numPriorDays = req.params.id;
      console.log("numPriorDays: "+ numPriorDays);
   
      
      ////CalculateParticipantSelectScores////
      //console.log(survey_assignment_id_i)
      
      let url1 = node_baseurl + 'delete-360-cohort-prior-days/' + numPriorDays
      //step1 select
      axios({
        method: 'post',
        url: url1,
        headers: {
          'token': valid_token
        },
      })
        .then((resp) => 
        {
          console.log("step1 delete, select survey_assignment_id list: "+ JSON.stringify(resp.data));

          //let myResp = {}
          //myResp = { '360 histogram processed': ctr }

          
          let iteration_list = resp.data
          console.log("iteration_list: " + JSON.stringify(iteration_list))

          let ctr = iteration_list.length; //use this to trigger execution of insert cohort endpoint if 
          console.log("length: "+ ctr);

          if (ctr == 0) {
              let myResp = {}
              myResp = {'no iteration_id to process': ctr }
              res.json(myResp)
              console.log("no iteration_id to process")
          } 
          else 
          {//to terminate waay at the bottom before start of last .catch
                  
            for (let i = 0; i < ctr; i++) 
            {//terminate for loop waay at the bottom before start of last .catch
                 let iteration_id_i = iteration_list[i].iteration_id; 
                 console.log("iteration_id_i: "+ iteration_id_i)  


              //console.log("iteration_id 0: " + iteration_list[0].iteration_id)
              //// VTY for testing only to remove below iteration id assignment///////////////
              //let iterationId = 63;
      
              //supposedly put for loop here passing iteration_list[i].iteration_id:  

              let url2 = node_baseurl + 'update-is-processed-by-iteration/' + iteration_id_i
              //step2 update is process column
              //axios.post(url2, participant_cohort_data, { headers: { "token": valid_token } })
              axios({
                  method: 'post',
                  url: url2,
                  headers: {
                  'token': valid_token
                  },
              })
          
              .then((resp) => 
              { //.then of url2
                  console.log("update-is-processed output: " + JSON.stringify(resp.data));
      
                  //step3 force generate data 360
                  let url3 = node_baseurl + 'force-generate-insert360/' + iteration_id_i
                  axios({
                  method: 'post',
                  url: url3,
                  headers: {
                      'token': valid_token
                  },
                  })
                  .then((resp) => 
                  {

                      let url5 = node_baseurl + 'r360-histogram1/' + iteration_id_i
                      axios({
                          method: 'post',
                          url: url5,
                          headers: {
                          'token': valid_token
                          },
                      })
                      .then((resp) => 
                      {
                          console.log("histogram complete for iteration_id: " + iteration_id_i);
                          //res.json(resp.data);
              
                  
                      })
                      .catch((error) => 
                      {
                          if (error.response) {
                          // Request made and server responded
                          console.log(error.response.data)
                          console.log(error.response.status)
                          console.log(error.response.headers)
                          } else if (error.request) {
                          // The request was made but no response was received
                          console.log(error.request)
                          } else {
                          // Something happened in setting up the request that triggered an Error
                          console.log('Error', error.message)
                          }
                      });
              
              
              
              
                  })


                  ////////end .then resp step2
          
          
              }) //end .then of url2
              .catch((error) => 
              {
                  if (error.response) {
                      // Request made and server responded
                      console.log(error.response.data)
                      console.log(error.response.status)
                      console.log(error.response.headers)
                  } else if (error.request) {
                      // The request was made but no response was received
                      console.log(error.request)
                  } else {
                      // Something happened in setting up the request that triggered an Error
                      console.log('Error', error.message)
                  }
              });
          
            } //end for loop
          } //end else if ctr==0

        //res.json("number of iterations submitted for processing: "+ctr);
        res.json("iteration_id submitted for processing: " + JSON.stringify(iteration_list));       
        }) //end .then of url1  
        .catch((error) => 
        {
            if (error.response) {
            // Request made and server responded
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
            } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request)
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
            }
        });
 
            
}


export const forceGenerateInsert360Data = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceGenerateInsert360DataM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}