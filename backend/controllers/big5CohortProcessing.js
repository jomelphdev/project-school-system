import {
  deleteBig5CohortM,
  getBig5FinalDeadlineDateM,
  insertBig5CohortM,
  forceDeleteBig5CohortM,
  forceGetBig5IterationListM,
} from '../models/big5CohortProcessingM.js'

import check_token from "./functions.js"
import axios from 'axios'

//todo Delete Big5 cohort record
export const deleteBig5Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  deleteBig5CohortM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//todo Delete Big5 cohort record
export const forceDeleteBig5Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceDeleteBig5CohortM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//todo Get Final deadline date
export const getBig5FinalDeadlineDate = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getBig5FinalDeadlineDateM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Get Final deadline date
export const forceGetBig5IterationList = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceGetBig5IterationListM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//todo Insert Big5 cohort record
export const insertBig5Cohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertBig5CohortM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//todo Process iteration by final_deadline date 
export const big5CohortProcessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let check_date_field = 'final_deadline_date'

  //todo STEP 1: DELETE EXISTING RECORD
  let step1_url = node_baseurl + 'delete-cohort/big5/' + check_date_field
  console.log("step 1 URL: " + step1_url)
  axios.delete(step1_url, { headers: { "token": valid_token } })
    .then((resp) => {
      console.log("step1 delete: " + JSON.stringify(resp.data))

      // //todo STEP 2: select list of surveys to be processed based on iteration where final_deadline_date
      let step2_url = node_baseurl + 'get-final-deadline-date/big5/' + check_date_field
      console.log("step 2 URL: " + step2_url)
      axios.get(step2_url, { headers: { "token": valid_token } })
        .then(resp => {
          console.log(resp.data)
          let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
          let iteration_log_data = resp.data[0]

          console.log(ctr)

          //console log if no final_deadline_date found
          if (ctr == 0) {
            let myResp = {}
            myResp = { 'big5 surveys processed': ctr }
            res.json(myResp)
            console.log("no valid submitted surveys found for big5 report processing")
          }
          for (let i = 0; i < ctr; i++) {
            console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id)
            //define variable values from step1
            let s1_survey_assignment_id = resp.data[i].survey_assignment_id
            let s1_ind_id = resp.data[i].ind_id
            let s1_org_id = resp.data[i].org_id
            let s1_suborg_id = resp.data[i].suborg_id
            let s1_program_id = resp.data[i].program_id
            let s1_iteration_id = resp.data[i].iteration_id

            console.log("big5 array values checking i: [" + i + "] " + s1_survey_assignment_id)

            //todo STEP 3: Insert data to b5 cohort table
            if (i == (ctr - 1)) {
              let step3_url = node_baseurl + 'insert-cohort/big5'
              console.log("step3 url: " + step3_url)
              axios.post(step3_url, { org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id }, { headers: { "token": valid_token } })
                .then(resp => {
                  console.log("step3 insert cohort: " + JSON.stringify(resp.data))

                  let myResp = {}
                  myResp = { 'Big5 cohort surveys processed': ctr }
                  res.json(myResp)
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

          //todo: STEP 4: INSERT DATA into iteration_log table after succesful inserting
          let step4url = node_baseurl + "iteration-log"
          console.log("step4 url: " + step4url)
          axios.post(step4url, {
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
              console.log(JSON.stringify(res.data))
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
//todo Force Process iteration
export const forceBig5CohortProcessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let iterationId = req.body.iteration_id
  console.log(iterationId)
  //todo STEP 1: DELETE EXISTING RECORD
  let step1_url = node_baseurl + 'force-delete-cohort/big5/' + iterationId
  console.log("step 1 URL: " + step1_url)
  axios.delete(step1_url, { headers: { "token": valid_token } })
    .then((resp) => {
      console.log("step1 delete: " + JSON.stringify(resp.data))

      // //todo STEP 2: select list of surveys to be processed based on iteration where final_deadline_date
      let step2_url = node_baseurl + 'force-get-list/big5/' + iterationId
      console.log("step 2 URL: " + step2_url)
      axios.get(step2_url, { headers: { "token": valid_token } })
        .then(resp => {
          console.log(resp.data)
          let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)

          console.log(ctr)

          //console log if no final_deadline_date found
          if (ctr == 0) {
            let myResp = {}
            myResp = { 'big5 surveys processed': ctr }
            res.json(myResp)
            console.log("no valid submitted surveys found for big5 report processing")
          }
          for (let i = 0; i < ctr; i++) {
            console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id)
            //define variable values from step1
            let s1_survey_assignment_id = resp.data[i].survey_assignment_id
            let s1_ind_id = resp.data[i].ind_id
            let s1_org_id = resp.data[i].org_id
            let s1_suborg_id = resp.data[i].suborg_id
            let s1_program_id = resp.data[i].program_id
            let s1_iteration_id = resp.data[i].iteration_id

            console.log("big5 array values checking i: [" + i + "] " + s1_survey_assignment_id)

            //todo STEP 3: Insert data to b5 cohort table
            if (i == (ctr - 1)) {
              let step3_url = node_baseurl + 'insert-cohort/big5'
              console.log("step3 url: " + step3_url)
              axios.post(step3_url, { org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id }, { headers: { "token": valid_token } })
                .then(resp => {
                  console.log("step3 insert cohort: " + JSON.stringify(resp.data))

                  let myResp = {}
                  myResp = { 'Big5 cohort surveys processed': ctr }
                  res.json(myResp)
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