import db from "../config/database.js"

// export const insert360SectionM = (data, result) => {
//     db.query(
//         'INSERT INTO 360_section (section_name, section_description, added_by, global, org_id, suborg_id, program_id, iteration_id) VALUES (?,?,?,?,?,?,?,?)',
//         [
//             data.section_name,
//             data.section_description,
//             data.added_by,
//             data.global,
//             data.org_id,
//             data.suborg_id,
//             data.program_id,
//             data.iteration_id
//         ],
//         (err, results) => {
//             if (err) {
//               console.log(err);
//               result(err, null);
//             } else {
//               result(null, results);
//             }
//           }
//         )
// }
export const insert360SectionM = (data, result) => {
  const query = `
    SELECT section_id 
    FROM 360_section 
    WHERE section_name = ? AND global = ? AND org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ?
  `;

  db.query(
    query,
    [
      data.section_name,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id
    ],
    (err, rows) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        if (rows.length === 0) {
          // No record found, do an insert
          const insertQuery = `
            INSERT INTO 360_section 
            (section_name, section_description, added_by, global, org_id, suborg_id, program_id, iteration_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertQuery,
            [
              data.section_name,
              data.section_description,
              data.added_by,
              data.global,
              data.org_id,
              data.suborg_id,
              data.program_id,
              data.iteration_id
            ],
            (insertErr, insertResults) => {
              if (insertErr) {
                console.log(insertErr);
                result(insertErr, null);
              } else {
                result(null, insertResults);
              }
            }
          );
        } else {
          // Record found, do an update
          const updateQuery = `
            UPDATE 360_section 
            SET section_description = ?, added_by = ? 
            WHERE section_name = ? AND global = ? AND org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ?
          `;

          db.query(
            updateQuery,
            [
              data.section_description,
              data.added_by,
              data.section_name,
              data.global,
              data.org_id,
              data.suborg_id,
              data.program_id,
              data.iteration_id
            ],
            (updateErr, updateResults) => {
              if (updateErr) {
                console.log(updateErr);
                result(updateErr, null);
              } else {
                result(null, updateResults);
              }
            }
          );
        }
      }
    }
  );
};

export const get360SectionM = (org_id,suborg_id,program_id,iteration_id, result) => {
    db.query('SELECT * FROM 360_section WHERE org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ?',
      [org_id, suborg_id, program_id, iteration_id],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      })
  }

  export const get360withGlobalSectionM = (data, result) => {
    db.query('SELECT * FROM 360_section WHERE global = ? AND org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ?',
      [data.global, data.org_id, data.suborg_id, data.program_id, data.iteration_id],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      })
  }

export const getAll360SectionM = (org_id, result) => {
    db.query('SELECT * FROM 360_section WHERE org_id = ?',
      [org_id],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      })
  }

  export const update360SectionM = (data, result) => {
     db.query('UPDATE 360_section SET section_description = ? WHERE section_name = ? AND org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ?',
      [data.section_description, data.section_name, data.org_id, data.suborg_id, data.program_id, data.iteration_id],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)

        } else {
          result(null, results)

        }
      })
  }