import {
  findIndividualById,
  insertIndividual,
  updateIndividualById,
  updateIndividualNameById,
  updateIndividualEmailById,
  findIndividualByEmail,
  updateIndividualPasswordById,
  updateIndividualProgramIterationByIndGroupIndId,
  updateIndividualStreamGroupByIndGroupIndId,
  updateIndividualSuppressEmailSendingById,
  deleteIndividualById,
  getAllIndividuals,
  insertIndividualMakeNomination,
  getAllIndividualsByIndGroupOrgSuborg,
  getAllIndividualsByIndGroupOrgSuborgProgram,
  getAllIndividualsByIndGroupOrgSuborgProgramIteration,
  getAllIndividualsByIndGroup,
  getAllIndividualsByOrgId,
  findIndividualEmailExist,
  findSingleIndividualById,
  findEmailDetailsById,
  getAllIndividualsByIndGroupOrg,
  addIndividualAndProgram,
  getAllCoach,
  updateindividualTimezoneById,
  getIndividualDetailsFromIndGroup,
  getSitemanagerEmails,
  checkUserLoggedInM,
  updateUserLoggedInM

} from "../models/Individual.js";

// import function to check token
import check_token from "./functions.js";

// Get All Individual
export const showAllIndividual = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllIndividuals((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllCoach = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  getAllCoach(orgId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllIndividualByIndGroupOrg = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  getAllIndividualsByIndGroupOrg(orgId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllIndividualByIndGroupOrgSuborg = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  getAllIndividualsByIndGroupOrgSuborg(orgId, suborgId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllIndividualByIndGroupOrgSuborgProgram = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  getAllIndividualsByIndGroupOrgSuborgProgram(orgId, suborgId, programId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllIndividualByIndGroupOrgSuborgProgramIteration = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  getAllIndividualsByIndGroupOrgSuborgProgramIteration(orgId, suborgId, programId, iterationId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllIndividualByIndGroup = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  const streamId = req.params.stream_id
  getAllIndividualsByIndGroup(orgId, suborgId, programId, iterationId, streamId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showAllIndividualByOrgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const orgId = req.params.org_id
  getAllIndividualsByOrgId(orgId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get Individual by Email
export const showIndividualByEmail = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.params
  findIndividualByEmail(data.email, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get Single Organisation
export const showIndividualById = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findIndividualById(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Create New Individual
export const createIndividual = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body;
  insertIndividual(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//create new individual with program
export const createIndividualAndProgram = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body;
  addIndividualAndProgram(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Update Organisation
export const updateIndividual = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualById(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const updateIndividualName = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualNameById(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const updateIndividualProgramIterationByIndGroup = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualProgramIterationByIndGroupIndId(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const updateIndividualStreamGroupByIndGroup = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualStreamGroupByIndGroupIndId(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const updateIndividualEmail = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualEmailById(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const updateIndividualPassword = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualPasswordById(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const updateIndividualSuppressEmailSending = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateIndividualSuppressEmailSendingById(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Delete Organisation
export const deleteIndividual = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  deleteIndividualById(id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// create an individual for making nomination 
export const createIndividualMakeNomination = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  insertIndividualMakeNomination(req.body, (err, results) => {
    if (err) return res.json(err)
    res.json(results)
  });
};

// Get Single Email - check email if already exist
export const showIndividualEmailExist = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findIndividualEmailExist(req.params.email, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};

// view single individual by id
export const showSingleIndividualById = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findSingleIndividualById(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};
//view single individual email details by id
export const showEmailDetailsById = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findEmailDetailsById(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};
export const updateindividualTimezone = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateindividualTimezoneById(id, data, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};

//get individual details from ind group, using ind_id
export const showIndividualDetailsFromIndGroup = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const indId = req.params.id
  getIndividualDetailsFromIndGroup(indId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// get sitemanager emails
export const showSitemanagerEmails = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const id = req.params.id
  getSitemanagerEmails(id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};

// check if user is logged in to access reports and surveys
export const checkUserLoggedIn = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const id = req.params.id
    checkUserLoggedInM(id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};

// update individual status when the user is logged in or logged out
export const updateUserLoggedIn = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const id = req.params.id
    const status = req.params.status
    updateUserLoggedInM(id, status, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};