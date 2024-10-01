import db from "../config/database.js"

export const get360SharingOptionsM = (data, result) => {
  db.query(`SELECT * FROM 360_sharing_options WHERE org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ?`,
    [data.org_id, data.suborg_id, data.program_id, data.iteration_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}

export const insert360SharingOptionsM = (data, result) => {
  db.query(
    'INSERT INTO 360_sharing_options (question, tag_id, source, language, added_by, global, org_id, suborg_id, program_id, iteration_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      data.question,
      data.tag_id,
      data.source,
      data.language,
      data.added_by,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
    ],
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

export const update360SharingOptionsM = (id, data, result) => {
  db.query(
    'UPDATE 360_sharing_options SET question = ?, tag_id = ?, source = ?, language = ?, added_by = ?, global = ?, org_id = ?, suborg_id = ?, program_id = ?, iteration_id = ? WHERE sharing_options_id = ?',
    [
      data.question,
      data.tag_id,
      data.source,
      data.language,
      data.added_by,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      id
    ],
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

export const borrowSharingOptionsM = (data, result) => {
  db.query(
    `SELECT * FROM 360_sharing_options WHERE sharing_options_id = ?`,
    [data.sharing_options_id],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.log(selectErr);
        result(selectErr, null);
      } else {
        const selectedRow = selectResults[0];

        // Exclude the columns from data and set status to 'Borrowed'
        const {
          global,
          org_id,
          suborg_id,
          program_id,
          iteration_id,
          sharing_options_code,
          for_participant,
          ...insertData
        } = selectedRow;
        
        db.query(
          `INSERT INTO 360_sharing_options (question, tag_id, source, language, added_by, global, org_id, suborg_id, program_id, iteration_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            insertData.question,
            insertData.tag_id,
            insertData.source,
            insertData.language,
            insertData.added_by,
            data.global,
            data.org_id,
            data.suborg_id,
            data.program_id,
            data.iteration_id,
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.log(insertErr);
              result(insertErr, null);
            } else {
              const insertedSharingOptionsId = insertResults.insertId;
              console.log("Inserted SharingOptions ID:", insertedSharingOptionsId);
              result(null, { insertedSharingOptionsId }); // Pass insertedSharingOptionsId in the result callback
            }
          }
        );
      }
    }
  );
};