import db from "../config/database.js";

// Get All SubOrganization
export const getAllSubOrganization = (result) => {
  db.query("SELECT * FROM suborg", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// Get all Suborganization by org_id
export const findSubOrganizationByOrgId = (id, result) => {
  db.query("SELECT * FROM suborg WHERE org_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// Get Single SubOrganization
export const findSubOrganizationBySubOrgId = (id, result) => {
  db.query("SELECT * FROM suborg WHERE suborg_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// Create New SubOrganization
export const insertSubOrganization = (data, result) => {
  db.query(
    "INSERT INTO suborg (suborg_name, org_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, NOW(), ?, NOW(), ?)",
    [data.suborg_name, data.org_id, data.created_by, data.modified_by],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};
// Update SubOrganization
export const updateSubOrganizationById = (id, data, result) => {
  db.query(
    "UPDATE suborg SET suborg_name = ?, modified_at = NOW(), modified_by = ? WHERE suborg_id = ?",
    [data.suborg_name, data.modified_by, id],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};
// Delete SubOrganization
export const deleteSubOrganizationById = (id, result) => {
  db.query("DELETE FROM suborg WHERE suborg_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};
// Get last suborg_id
export const getLastestSuborgId = (result) => {
  db.query('SELECT MAX(suborg_id) AS latest_suborg_id FROM suborg', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

// Get SubOrganization in ()
export const getSuborgForEmailm = (suborg_id, result) => {
  db.query("SELECT * FROM suborg WHERE suborg_id IN (?)",
    [suborg_id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

export const findMultipleSubOrganizationByOrgId = (id, result) => {
  let query1 = `SELECT * FROM suborg WHERE suborg_id IN(${id})`
  console.log(query1)
  db.query(query1, [], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};