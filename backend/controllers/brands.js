import {
  getAllBrand,
  getAllBrandWithSuborgByOrg,
  findBrandMaxLimitByOrgId,
  insertBrandByOrg,
  updateBrandsById,
  findBrandByDomain
} from '../models/Brand.js'

// import function to check token
import check_token from './functions.js'

// Get All Brand
export const showAllBrand = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllBrand((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//get brand by domain name
export const showBrandByDomain = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findBrandByDomain(req.params.domain, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// get max search results
export const getBrandMaxLimitByOrgId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findBrandMaxLimitByOrgId(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// create new brand by org creation
export const createBrandByOrg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const data = req.body
  insertBrandByOrg(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Update brand by Id
export const updateBrandById = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  updateBrandsById(req.params.id, req.body, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Get all brands with suborg by org
export const showAllBrandWithSuborgByOrg = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  getAllBrandWithSuborgByOrg(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}
