import {
  deleteQsortCohortM,
  getQsortFinalDeadlineDateM,
  forceDeleteQsortCohortM,
  forceGetQsortIterationListM,
  insertQsortCohortM,
  getQsortCohortM,
} from '../models/QsortCohortProcessingM.js'

import check_token from "./functions.js"
import axios from 'axios'

//todo Delete qsort cohort record
export const deleteQsortCohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  deleteQsortCohortM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Get qsort Final deadline date
export const getQsortFinalDeadlineDate = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getQsortFinalDeadlineDateM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Insert qsort cohort record
export const insertQsortCohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertQsortCohortM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo Process iteration by final_deadline date 
export const qsortCohortProcessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let check_date_field = 'final_deadline_date'

  //todo STEP 1: DELETE EXISTING RECORD
  let step1_url = node_baseurl + 'delete-cohort/qsort/' + check_date_field
  axios.delete(step1_url, { headers: { "token": valid_token } })
    .then((resp) => {

      //todo STEP 2: select list of surveys to be processed based on iteration where final_deadline_date
      let step2_url = node_baseurl + 'get-final-deadline-date/qsort/' + check_date_field
      axios.get(step2_url, { headers: { "token": valid_token } })
        .then(resp => {
          let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
          let iteration_log_data = resp.data[0]
          
          if (ctr === 0) {
            let myResp = {}
            myResp = { 'qsort surveys processed': ctr }
            res.json(myResp)
            console.log("no valid submitted surveys found for qsort report processing")
          } else {
            //todo STEP 3: Insert data to b5 cohort table
            let step3_url = node_baseurl + 'insert-cohort/qsort'
            console.log("step3 url: " + step3_url)
            axios.post(step3_url, { res: resp.data }, { headers: { "token": valid_token } })
              .then(resp => {
                console.log("step3 insert cohort: " + JSON.stringify(resp.data))

                let myResp = {}
                myResp = { 'qsort cohort surveys processed': ctr }
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

//todo FORCE Delete qsort cohort record
export const forceDeleteQsortCohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceDeleteQsortCohortM(req.params.iteration_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo FORCE Get qsort Final deadline date
export const forceGetQsortIterationList = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  forceGetQsortIterationListM(req.params.iteration_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
//todo FORCE Process iteration
export const forceQsortCohortProcessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let iterationId = req.body.iteration_id

  //todo STEP 1: DELETE EXISTING RECORD
  let step1_url = node_baseurl + 'force-delete-cohort/qsort/' + iterationId
  axios.delete(step1_url, { headers: { "token": valid_token } })
    .then((resp) => {

      //todo STEP 2: select list of surveys to be processed based on iteration where final_deadline_date
      let step2_url = node_baseurl + 'force-get-list/qsort/' + iterationId
      axios.get(step2_url, { headers: { "token": valid_token } })
        .then(resp => {
          let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)

          if (ctr === 0) {
            let myResp = {}
            myResp = { 'qsort surveys processed': ctr }
            res.json(myResp)
            console.log("no valid submitted surveys found for qsort report processing")
          } else {
            //todo STEP 3: Insert data to b5 cohort table
            let step3_url = node_baseurl + 'insert-cohort/qsort'
            console.log("step3 url: " + step3_url)
            axios.post(step3_url, { res: resp.data }, { headers: { "token": valid_token } })
              .then(resp => {
                console.log("step3 insert cohort: " + JSON.stringify(resp.data))

                let myResp = {}
                myResp = { 'qsort cohort surveys processed': ctr }
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

//todo Get Qsort Cohort Data
export const getQsortCohort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const iterationId = req.params.iteration_id
  getQsortCohortM(iterationId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}