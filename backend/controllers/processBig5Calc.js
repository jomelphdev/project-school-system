import {
  GetBig5SurveyResultM,
  big5InsertSurveyResultTraitsM,
  big5InsertRawCalcM,
  getAllSurveyAssignmentBig5M,
  deleteBig5RawM,
  big5InsertRawCalcModifiedM,
  big5UpdateSurveyResultM,
} from '../models/calculationBig5M.js'
import axios, * as others from 'axios';
import check_token from "./functions.js";

//data fix survey result
export const GetBig5SurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id 
  GetBig5SurveyResultM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const big5InsertSurveyResultTraits = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  big5InsertSurveyResultTraitsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const big5InsertRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  big5InsertRawCalcM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const big5SurveyResultReprocessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  //! step0
  let surveyAssignmentList = [];

  for (let i = 0; i < surveyAssignmentList.length; i++) {
    let step1_url = node_baseurl + 'big5-get-survey-result/' + surveyAssignmentList[i]
    console.log(step1_url)
    //axios.get(step1_url, { headers: {"token" : valid_token} })      

    axios({
      method: 'get',
      url: step1_url,
      headers: {
        'token': valid_token,
        'Content-Type': 'application/json'
      },
    })


      .then(resp => {
        console.log("step1 get: " + JSON.stringify(resp.data));
        let s2_data = resp.data

        /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
        let step2_url = node_baseurl + 'big5-insert-survey-result-traits/big5'
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: {
            'token': valid_token,
            'Content-Type': 'application/json'
          },
        })
          .then
          (resp => {
            console.log("step2", resp.data);
            res.json(resp.data);
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
                
          }
          )
          .catch(function (error) {
            if (error.response) {
              // Request made and server responded
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
          });
      }
      )
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  }
}
export const big5Calculation = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  console.log(req.body)
  //! step0
  // let surveyAssignmentList = [3327];

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
    // let step1_url = node_baseurl + 'big5-get-survey-result/' + surveyAssignmentList[i]
    let step1_url = node_baseurl + 'big5-get-survey-result/' + s1_survey_assignment_id
    console.log(step1_url)
    axios.get(step1_url, { headers: {"token" : valid_token} })      
      .then(resp => {
        console.log("step1 get: " + JSON.stringify(resp.data));
        let s2_data = resp.data

        let step2_url = node_baseurl + 'big5-insert-raw-calculation/big5'
        console.log(step2_url)
        axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
          .then(resp => {
            console.log("step2", resp.data);
            res.json(resp.data)
          })
          .catch(function (error) {
            if (error.response) {
              // Request made and server responded
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
          })
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  // }
}

// get all survey_assingment with big5 survey
export const getAllSurveyAssignmentBig5 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getAllSurveyAssignmentBig5M((err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.json(results)
        }
    })
}
// delete big5 raw
export const deleteBig5Raw = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const surveyAssignmentId = req.params.survey_assignment_id
    deleteBig5RawM(surveyAssignmentId, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.json(results)
        }
    })
}
export const big5InsertRawCalcModified = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    big5InsertRawCalcModifiedM(data, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.json(results)
        }
    })
}
// recalculate big5 with reversed 53, 98 and 113
export const modifiedBig5Calculation = async (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    let surveyAssignmentList = []
    let results = 0 

    for (let i = 0; i < surveyAssignmentList.length; i++) {
        const survey_assignment_id = surveyAssignmentList[i];

        try {
            let step1_url = `${node_baseurl}delete-raw-calculation/big5/${survey_assignment_id}`
            const res1 = await axios.delete(step1_url, { headers: { "token": valid_token } })
            if (res1.status === 200) { 
                try {
                    let step2_url = `${node_baseurl}big5-get-survey-result/${survey_assignment_id}`
                    const res2 = await axios.get(step2_url, { headers: { "token": valid_token } })
                    if (res2.status === 200) { 
                        try {
                            let step3_url = `${node_baseurl}insert-raw-calculation/modified/big5`
                            const res3 = await axios.post(step3_url, res2.data, { headers: { "token": valid_token } })
                            results++
                        } catch (error) {
                            console.log(error)
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    res.json({SurveyAssignmentUpdated: results})
}

// Update survey_result table for Big 5 survey
export const big5UpdateSurveyResult = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    big5UpdateSurveyResultM(data, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.json(results)
        }
    })
}

// Update survey_result table for 53, 98 and 113 Big 5 survey
export const updateSurveyResultBig5 = async (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    let surveyAssignmentList = []
    let results = 0 

    for (let i = 0; i < surveyAssignmentList.length; i++) {
        const survey_assignment_id = surveyAssignmentList[i];
        try {
            let step2_url = `${node_baseurl}big5-get-survey-result/${survey_assignment_id}`
            const res2 = await axios.get(step2_url, { headers: { "token": valid_token } })
            if (res2.status === 200) { 
                try {
                    let step3_url = `${node_baseurl}survey-result/update/big5`
                    const res3 = await axios.post(step3_url, res2.data, { headers: { "token": valid_token } })
                    // res.json(res3.data)
                    results++
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }        
    }
    res.json({SurveyAssignmentUpdated: results})
}