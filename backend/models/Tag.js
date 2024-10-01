import db from "../config/database.js";

export const getAllTag = (result) => {
    db.query(
      "SELECT * FROM tag",
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