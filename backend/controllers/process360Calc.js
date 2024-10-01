import {
  Get360SurveyResultM,
  teamLeaderInsertSurveyResultTraitsM,
  generalManagerInsertSurveyResultTraitsM,
  seniorExecProgramInsertSurveyResultTraitsM,
  talensageInsertSurveyResultTraitsM,
  generalManagerInsertRawCalcM,
  teamLeaderInsertRawCalcM,
  seniorExecProgramInsertRawCalcM,
  talentSageInsertRawCalcM,
  helpInsertRawCalcM,
  euroNavInsertRawCalcM,
  delete360RawM,
  surveyBuilderCalcM,
  smartCollabCalcM, //! USED ONLY FOR SMART COLLAB
} from '../models/calculation360M.js'
import axios, * as others from 'axios'
import db from "../config/database.js";
import check_token from './functions.js'

//data fix survey result
export const Get360SurveyResult = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const surveyAssignmentId = req.params.survey_assignment_id
  Get360SurveyResultM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const teamLeaderInsertSurveyResultTraits = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const data = req.body
  teamLeaderInsertSurveyResultTraitsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const generalManagerInsertSurveyResultTraits = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const data = req.body
  generalManagerInsertSurveyResultTraitsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const seniorExecProgramInsertSurveyResultTraits = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const data = req.body
  seniorExecProgramInsertSurveyResultTraitsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const talentsageInsertSurveyResultTraits = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const data = req.body
  talensageInsertSurveyResultTraitsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//TODO re-architecture
export const generalManagerInsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  generalManagerInsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const teamLeaderInsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  teamLeaderInsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const seniorExecProgramInsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  seniorExecProgramInsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const talentSageInsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  talentSageInsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const helpInsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  helpInsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const euroNavInsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  euroNavInsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const teamLeaderSurveyResultReprocessing = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  let surveyAssignmentList = []

  for (let i = 0; i < surveyAssignmentList.length; i++) {
    let step1_url = node_baseurl + 'c360-get-survey-result/' + surveyAssignmentList[i]
    console.log(step1_url)
    //axios.get(step1_url, { headers: {"token" : valid_token} })

    axios({
      method: 'get',
      url: step1_url,
      headers: {
        token: valid_token,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        console.log('step1 get: ' + JSON.stringify(resp.data))
        let s2_data = resp.data

        /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
        let step2_url = node_baseurl + 'teamleader-insert-survey-result-traits/teamleader'
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: {
            token: valid_token,
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => {
            console.log('step2', resp.data)
            res.json(resp.data)
            //     // let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)

            //     // console.log(ctr);

            //     // //console log if no final_deadline_date found
            //     // if (ctr == 0){
            //     //   //res.json({processed: true});
            //     //   let myResp = {};
            //     //   myResp = {'big5 surveys processed' : ctr};
            //     //   res.json(myResp);
            //     //   //res.json({processed: `$(ctr)`});
            //     //   //to add later minimum # of surveys to be eligible for big5 report processing
            //     //   console.log("no valid submitted surveys found for big5 report processing");
            //     // }

            //     // for(let i = 0; i < ctr; i++)
            //     // {
            //     //   console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
            //     //   //define variable values from step1///////
            //     //   let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
            //     //   let s1_ind_id = resp.data[i].ind_id;
            //     //   let s1_org_id = resp.data[i].org_id;
            //     //   let s1_suborg_id = resp.data[i].suborg_id;
            //     //   let s1_program_id = resp.data[i].program_id;
            //     //   let s1_iteration_id = resp.data[i].iteration_id;

            //     //   //let s1_is_nomination = resp.data[i].is_nomination;

            //     //   console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);

            //     //       ////////////step 2 - insert b5 norm raw///////////////////
            //     //       let step2_url = node_baseurl + 'b5-norm-raw-insert';
            //     //       axios.post(step2_url, {survey_assignment_id: s1_survey_assignment_id}, { headers: {"token" : valid_token} })
            //     //       .then(resp => {
            //     //           console.log(resp.data);

            //     //           ///////////step 3 - if all b5-norm-raw-insert complete, insert b5 cohort table////////////////////////
            //     //           if ( i == (ctr - 1) )
            //     //           {
            //     //             let step3_url = node_baseurl + 'b5-cohort-insert';
            //     //             console.log("step3 url: "+step3_url);
            //     //             axios.post(step3_url, {org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id }, { headers: {"token" : valid_token} })
            //     //             .then(resp => {
            //     //                   console.log("step3 insert cohort: " + JSON.stringify(resp.data));

            //     //                   // ///////////step4 send email//////////
            //     //                   // let step4_url = node_baseurl + 'sendemail';
            //     //                   // axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list,
            //     //                   // send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
            //     //                   // org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
            //     //                   //   .then(resp => {
            //     //                   //       //console.log(i);
            //     //                   //       console.log("ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
            //     //                   //       //res.json(resp.data);
            //     //                   //   })
            //     //                   //   .catch(function (error) {
            //     //                   //     if (error.response) {
            //     //                   //       // Request made and server responded
            //     //                   //       console.log(error.response.data);
            //     //                   //       console.log(error.response.status);
            //     //                   //       console.log(error.response.headers);
            //     //                   //     } else if (error.request) {
            //     //                   //       // The request was made but no response was received
            //     //                   //       console.log(error.request);
            //     //                   //     } else {
            //     //                   //       // Something happened in setting up the request that triggered an Error
            //     //                   //       console.log('Error', error.message);
            //     //                   //     }
            //     //                   //   });
            //     //                   let myResp = {};
            //     //                   myResp = {'Big5 cohort surveys processed' : ctr};
            //     //                   res.json(myResp)
            //     //                 //res.json(resp.data);
            //     //                 //res.json(s2_subject);
            //     //             })
            //     //             .catch(function (error) {
            //     //               if (error.response) {
            //     //                 // Request made and server responded
            //     //                 console.log(error.response.data);
            //     //                 console.log(error.response.status);
            //     //                 console.log(error.response.headers);
            //     //               } else if (error.request) {
            //     //                 // The request was made but no response was received
            //     //                 console.log(error.request);
            //     //               } else {
            //     //                 // Something happened in setting up the request that triggered an Error
            //     //                 console.log('Error', error.message);
            //     //               }

            //     //             });

            //     //           }

            //     //           //res.json(resp.data);
            //     //       })
            //     //       .catch(function (error) {
            //     //         if (error.response) {
            //     //           // Request made and server responded
            //     //           console.log(error.response.data);
            //     //           console.log(error.response.status);
            //     //           console.log(error.response.headers);
            //     //         } else if (error.request) {
            //     //           // The request was made but no response was received
            //     //           console.log(error.request);
            //     //         } else {
            //     //           // Something happened in setting up the request that triggered an Error
            //     //           console.log('Error', error.message);
            //     //         }
            //     //       });
            //     //   //step 2 ///////////////////////////////////
            //     //   }
            //     // //res.json(resp.data);
          })
          .catch(function (error) {
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
      .catch(function (error) {
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

export const generalManagerSurveyResultReprocessing = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  let surveyAssignmentList = []

  for (let i = 0; i < surveyAssignmentList.length; i++) {
    let step1_url = node_baseurl + 'c360-get-survey-result/' + surveyAssignmentList[i]
    console.log(step1_url)
    //axios.get(step1_url, { headers: {"token" : valid_token} })

    axios({
      method: 'get',
      url: step1_url,
      headers: {
        token: valid_token,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        console.log('step1 get: ' + JSON.stringify(resp.data))
        let s2_data = resp.data

        /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
        let step2_url = node_baseurl + 'general-manager-insert-survey-result-traits/general-manager'
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: {
            token: valid_token,
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => {
            console.log('step2', resp.data)
            res.json(resp.data)

          })
          .catch(function (error) {
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
      .catch(function (error) {
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

export const seniorExecProgramSurveyResultReprocessing = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  let surveyAssignmentList = []

  for (let i = 0; i < surveyAssignmentList.length; i++) {
    let step1_url = node_baseurl + 'c360-get-survey-result/' + surveyAssignmentList[i]
    console.log(step1_url)
    //axios.get(step1_url, { headers: {"token" : valid_token} })

    axios({
      method: 'get',
      url: step1_url,
      headers: {
        token: valid_token,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        console.log('step1 get: ' + JSON.stringify(resp.data))
        let s2_data = resp.data

        /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
        let step2_url = node_baseurl + 'senior-Exec-Program-insert-survey-result-traits/senior-Exec-Program'
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: {
            token: valid_token,
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => {
            console.log('step2', resp.data)
            res.json(resp.data)
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

export const talentsageSurveyResultReprocessing = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  let surveyAssignmentList = []

  for (let i = 0; i < surveyAssignmentList.length; i++) {
    let step1_url = node_baseurl + 'c360-get-survey-result/' + surveyAssignmentList[i]
    console.log(step1_url)
    //axios.get(step1_url, { headers: {"token" : valid_token} })

    axios({
      method: 'get',
      url: step1_url,
      headers: {
        token: valid_token,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        console.log('step1 get: ' + JSON.stringify(resp.data))
        let s2_data = resp.data

        /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
        let step2_url = node_baseurl + 'talentsage-insert-survey-result-traits/talentsage'
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: {
            token: valid_token,
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => {
            console.log('step2', resp.data)
            res.json(resp.data)
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

export const generalManagerCalculation = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = []

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  let step1_url = node_baseurl + 'c360-get-survey-result/' + s1_survey_assignment_id
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })

  axios({
    method: 'get',
    url: step1_url,
    headers: {
      token: valid_token,
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      console.log('step1 get: ' + JSON.stringify(resp.data))
      let s2_data = resp.data

      let step2_url = node_baseurl + 'insert-raw-calculation/general-manager'
      // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
      console.log(step2_url)
      axios({
        method: 'post',
        url: step2_url,
        data: s2_data,
        headers: {
          token: valid_token,
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          console.log('step2', resp.data)
          res.json(resp.data)

        })
        .catch(function (error) {
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
    .catch(function (error) {
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
  // }
}
export const teamLeaderCalculation = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = []

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  let step1_url = node_baseurl + 'c360-get-survey-result/' + s1_survey_assignment_id
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })

  axios({
    method: 'get',
    url: step1_url,
    headers: {
      token: valid_token,
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      console.log('step1 get: ' + JSON.stringify(resp.data))
      let s2_data = resp.data

      let step2_url = node_baseurl + 'insert-raw-calculation/team-leader'
      // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
      console.log(step2_url)
      axios({
        method: 'post',
        url: step2_url,
        data: s2_data,
        headers: {
          token: valid_token,
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          console.log('step2', resp.data)
          res.json(resp.data)

        })
        .catch(function (error) {
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
    .catch(function (error) {
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
  // }
}
export const seniorExecProgramCalculation = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = []

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  let step1_url = node_baseurl + 'c360-get-survey-result/' + s1_survey_assignment_id
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })

  axios({
    method: 'get',
    url: step1_url,
    headers: {
      token: valid_token,
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      console.log('step1 get: ' + JSON.stringify(resp.data))
      let s2_data = resp.data

      let step2_url = node_baseurl + 'insert-raw-calculation/senior-exec-program'
      // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
      console.log(step2_url)
      axios({
        method: 'post',
        url: step2_url,
        data: s2_data,
        headers: {
          token: valid_token,
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          console.log('step2', resp.data)
          res.json(resp.data)

        })
        .catch(function (error) {
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
    .catch(function (error) {
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
  // }
}
export const talentSageCalculation = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = []

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  let step1_url = node_baseurl + 'c360-get-survey-result/' + s1_survey_assignment_id
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })

  axios({
    method: 'get',
    url: step1_url,
    headers: {
      token: valid_token,
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      console.log('step1 get: ' + JSON.stringify(resp.data))
      let s2_data = resp.data

      let step2_url = node_baseurl + 'insert-raw-calculation/talentsage'
      // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
      console.log(step2_url)
      axios({
        method: 'post',
        url: step2_url,
        data: s2_data,
        headers: {
          token: valid_token,
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          console.log('step2', resp.data)
          res.json(resp.data)

        })
        .catch(function (error) {
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
    .catch(function (error) {
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
  // }
}
export const helpCalculation = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = []

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  let step1_url = node_baseurl + 'c360-get-survey-result/' + s1_survey_assignment_id
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })

  axios({
    method: 'get',
    url: step1_url,
    headers: {
      token: valid_token,
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      console.log('step1 get: ' + JSON.stringify(resp.data))
      let s2_data = resp.data

      let step2_url = node_baseurl + 'insert-raw-calculation/help'
      // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
      console.log(step2_url)
      axios({
        method: 'post',
        url: step2_url,
        data: s2_data,
        headers: {
          token: valid_token,
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          console.log('step2', resp.data)
          res.json(resp.data)

        })
        .catch(function (error) {
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
    .catch(function (error) {
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
  // }
}
export const euroNavCalculation = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = []

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  let step1_url = node_baseurl + 'c360-get-survey-result/' + s1_survey_assignment_id
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })

  axios({
    method: 'get',
    url: step1_url,
    headers: {
      token: valid_token,
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      console.log('step1 get: ' + JSON.stringify(resp.data))
      let s2_data = resp.data

      let step2_url = node_baseurl + 'insert-raw-calculation/EURONAV'
      // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
      console.log(step2_url)
      axios({
        method: 'post',
        url: step2_url,
        data: s2_data,
        headers: {
          token: valid_token,
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          console.log('step2', resp.data)
          res.json(resp.data)

        })
        .catch(function (error) {
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
    .catch(function (error) {
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
  // }
}

//! do not use 
export const forceCalulation360 = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  // let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  let surveyAssignmentList = [] // insert survey_assignment_id you want to re calculate

  for (let i = 0; i < surveyAssignmentList.length; i++) {
    let step1_url = node_baseurl + 'c360-get-survey-result/' + surveyAssignmentList[i]
    console.log(step1_url)
    //axios.get(step1_url, { headers: {"token" : valid_token} })

    axios({
      method: 'get',
      url: step1_url,
      headers: {
        token: valid_token,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        console.log('step1 get: ' + JSON.stringify(resp.data))
        let s2_data = resp.data

        let step2_url = node_baseurl + 'insert-raw-calculation/EURONAV' //put the survey you want to recalculate
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: {
            token: valid_token,
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => {
            console.log('step2', resp.data)
            res.json(resp.data)

          })
          .catch(function (error) {
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
      .catch(function (error) {
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

//TODO SURVEY BUILDER
export const delete360Raw = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  delete360RawM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const surveyBuilderCalc = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const surveyAssignmentId = req.params.survey_assignment_id
  const body = req.body
  surveyBuilderCalcM(surveyAssignmentId, body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const calculate360 = async (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const surveyAssignmentId = req.params.survey_assignment_id
  try {
    let step1_url = `${node_baseurl}delete360Raw/${surveyAssignmentId}`
    const res = await axios.delete(step1_url, { headers: { "token": valid_token } })
    console.log("Delete", res.data)
  } catch (error) {
    console.log(error)
  }

  try {
    let step2_url = `${node_baseurl}surveyBuilderCalc/${surveyAssignmentId}`
    const response = await axios.post(step2_url, req.body, { headers: { "token": valid_token } })
    console.log("Calculate", response.data)
    res.json(response.data);
  } catch (error) {
    console.log(error)
  }
}

//Manually reCalc r360Raw Table
export const reCalculate360Raw = async (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  // const surveyAssignmentId = req.params.survey_assignment_id
  // Demo Iteration
  // let surveyAssignmentList = [33033,33034,33035,33036,33037,33038,33039,33040,33041,33042]
  // SDevanny2023 IDs new
  // let surveyAssignmentList = [32140, 32141, 32142, 32143, 32144, 32145, 32146, 32147, 32148, 32149, 32150, 32151, 32152, 32234, 32636, 32658, 32575, 32589, 32443, 32472, 32495, 32556, 32597, 32648, 32791, 32431, 32459, 32488, 32442, 32505, 32558, 32646, 32430, 32482, 32553, 32583, 32591, 32640, 32794, 32797, 32223, 32436, 32460, 32554, 32641, 32788, 32798, 32218, 32457, 32485, 32548, 32555, 32576, 32590, 32639, 32801, 32222, 32433, 32458, 32483, 32600, 32793, 32795, 32221, 32437, 32547, 32647, 32226, 32438, 32462, 32439, 32470, 32497, 32568, 32638, 32802, 32225, 32429, 32464, 32487, 32644, 32513, 32219, 32435, 32511, 32584, 32598, 32651, 32512, 32432, 32599, 32643, 32441, 32570, 32217, 32559, 32804, 32562, 32445, 32657, 32224, 32805, 32227, 32563, 32446, 32474, 32473, 32465, 32466, 32467, 32469, 32593, 32471, 32490, 32491, 32492, 32507, 32508, 32594, 32564, 32567, 32654, 32579, 32581, 32588, 32655, 32807, 33070, 32510, 32551, 32552, 32509, 32545, 32220, 32565, 32228, 32229, 32447, 32585, 32601, 32231, 32603, 32448, 32571, 32569, 32586, 32602, 32604]
  // SDevanny2023 IDs old
  // let surveyAssignmentList = [32140, 32141, 32142, 32143, 32144, 32145, 32146, 32148, 32150, 32151, 32443, 32472, 32495, 32431, 32459, 32488, 32442, 32505, 32558, 32646, 32430, 32482, 32223, 32436, 32460, 32554, 32222, 32433, 32547, 32439, 32470, 32497, 32568, 32513, 32219, 32432, 32599, 32643, 32441, 32570, 32217, 32559, 32224, 32227, 32563, 32474, 32473, 32465, 32466, 32467, 32469, 32593, 32471, 32490, 32491, 32492, 32507, 32508, 32594, 32564, 32579, 32581, 32588, 32655, 32510, 32551, 32552, 32509, 32545, 32229, 32447, 32231, 32603, 32448, 32571, 32586, 32602, 32604]
  // July 2023 Iteration
  // let surveyAssignmentList = [21743, 25298, 25294, 25296, 25304]
  // August 2023 Iteration
  // let surveyAssignmentList = [27010, 27318, 27311, 27314, 27319, 27316, 27308, 28474, 29620, 29801, 28475, 29626, 28479, 29806, 30133, 31088, 29804, 30136, 27167, 27168, 27170, 31206, 28476, 28477, 29621, 29622, 29802, 29808, 31096, 30130, 29814, 31090, 31203, 29815, 31204, 28480, 28483, 28484]
  // August 2023 Iteration - Run November 28
    let surveyAssignmentList = [27010, 27318, 27311, 27314, 27319, 27316, 27308, 28474, 29620, 29801, 28475, 29626, 28479, 29806, 30133, 31088, 29804, 30136, 27167, 27168, 27170, 31206, 28476, 28477, 29621, 29622, 29802, 29808, 31096, 30130, 29814, 31090, 31203, 29815, 31204, 28480, 28483, 28484]
  let results = 0 
  for (let i = 0; i < surveyAssignmentList.length; i++) {

      // let query1 = `
      // UPDATE survey_result AS sr
      //     JOIN (
      //         SELECT 'Q42' AS statement_num, possible_scores.score AS missing_score
      //         FROM (
      //             SELECT 1 AS score UNION ALL
      //             SELECT 2 UNION ALL
      //             SELECT 3 UNION ALL
      //             SELECT 4 UNION ALL
      //             SELECT 5 UNION ALL
      //             SELECT 6
      //         ) AS possible_scores
      //         LEFT JOIN (
      //             SELECT statement_num, score
      //             FROM survey_result
      //             WHERE survey_assignment_id IN (${surveyAssignmentList[i]}) 
      //             AND record_type = 'Ranking'
      //         ) AS existing_scores
      //         ON possible_scores.score = existing_scores.score
      //         WHERE existing_scores.statement_num IS NULL
      //     ) AS missing_scores
      //     ON sr.statement_num = missing_scores.statement_num
      //     AND sr.survey_assignment_id IN (${surveyAssignmentList[i]}) 
      //     SET sr.score = missing_scores.missing_score,
      //         sr.answer = 'Leads with Digital Fluency - integrate technology to improve and develop the team or the business manage an effective online presence and hire others who do the same.'
      //     WHERE sr.statement_num = 'Q42'
      //     AND sr.record_type = 'Ranking'
      //     AND sr.survey_assignment_id IN (${surveyAssignmentList[i]})
      // `;
      // db.query(query1, [], (err, results) => {
      //   if (err) {
      //     console.log(err)
      //   } else {
      //     console.log(results);
      //     results++
      //   }
      // })  
      try {
          // let step1_url = `${node_baseurl}delete360Raw/${surveyAssignmentId}`
          let step1_url = `${node_baseurl}delete360Raw/${surveyAssignmentList[i]}`
          const res = await axios.delete(step1_url, { headers: { "token": valid_token } })
          console.log("Delete", res.data)
      } catch (error) {
          console.log(error)
      }

      try {
          // let step2_url = `${node_baseurl}surveyBuilderCalc/${surveyAssignmentId}`
          let step2_url = `${node_baseurl}calculate/SmartCollab/${surveyAssignmentList[i]}`
          const response = await axios.post(step2_url, req.body, { headers: { "token": valid_token } })
          console.log("Calculate", response.data)
          results++
      } catch (error) {
          console.log(error)
      }
  }
  res.json({R360RawSurveyAssignmentUpdated: results})
}

//! USED ONLY FOR SMART COLLAB
export const smartCollabCalc = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const surveyAssignmentId = req.params.survey_assignment_id
  const body = req.body
  smartCollabCalcM(surveyAssignmentId, body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//! USED ONLY FOR SMART COLLAB
export const calculateSmartCollab360 = async (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const surveyAssignmentId = req.params.survey_assignment_id

  try {
    let step1_url = `${node_baseurl}delete360Raw/${surveyAssignmentId}`
    const response = await axios.delete(step1_url, { headers: { "token": valid_token } })
    console.log("Delete", response.data)
  } catch (error) {
    console.log(error)
  }

  try {
    let step2_url = `${node_baseurl}calculate/SmartCollab/${surveyAssignmentId}`
    const response = await axios.post(step2_url, req.body, { headers: { "token": valid_token } })
    console.log("Calculate", response.data)
    res.json(response.data);
  } catch (error) {
    console.log(error)
  }
}