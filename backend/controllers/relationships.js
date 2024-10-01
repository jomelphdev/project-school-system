import {
    getAllRelationships,
} from "../models/Relationships.js";

// import function to check token
import check_token from "./functions.js";
  
  // Get All Individual
export const showAllRelationships = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    getAllRelationships((err, results) => {
        if (err) return res.send(err) 
        res.json(results)
    });
};
  
  