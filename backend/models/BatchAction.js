import db from "../config/database.js";

export const getAllBatchAction = (result) => {
    db.query(
      // "SELECT (GROUP_CONCAT(role.role_name SEPARATOR',')) AS _roles_name, individual.* FROM individual LEFT JOIN role ON role.role_id = individual.roles GROUP BY individual.ind_id",
      "SELECT * FROM batch_action",
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