import db from "../config/database.js";

//? Get All Individuals
export const getAllRelationships = (result) => {
    db.query(
        "SELECT * FROM relationship",
        (err, results) => {
            if (err) return result(err, null)
            result(null, results)
        }
    );
};
