import {
  getAllSubOrganization,
  findSubOrganizationBySubOrgId,
  findSubOrganizationByOrgId,
  insertSubOrganization,
  updateSubOrganizationById,
  deleteSubOrganizationById,
  getLastestSuborgId,
  getSuborgForEmailm,
  findMultipleSubOrganizationByOrgId,
} from "../models/SubOrganization.js";

// import function to check token
import check_token from "./functions.js";

// Get All SubOrganization
export const showAllSubOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllSubOrganization((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get Single SubOrganization
export const showSubOrganizationBySubOrgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findSubOrganizationBySubOrgId(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get SubOrganization by org_id
export const showSubOrganizationByOrgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findSubOrganizationByOrgId(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Create New SubOrganization
export const createSubOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertSubOrganization(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Update SubOrganization
export const updateSubOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateSubOrganizationById(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
// Delete SubOrganization
export const deleteSubOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  deleteSubOrganizationById(id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// get latest suborg_id
export const showLatestSuborgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getLastestSuborgId((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Get SubOrganization for email
export const getSuborgForEmail = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getSuborgForEmailm(req.body.suborg_id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showMultipleSubOrganizationByOrgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findMultipleSubOrganizationByOrgId(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};