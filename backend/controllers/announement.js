import {
  getAllAnnouncement,
  showAnnouncementByGOSPIandRoleM,
  insertAnnouncementM,
  updateAnnouncementM,
  deleteAnnouncementById,
  getLastestOrgId,
  updateReadAnnouncementsM,
  updateUnReadAnnouncementsM,
  deleteAnnouncementsM
} from '../models/Announcement.js'

// import function to check token
import check_token from "./functions.js";

// Get All Announcement
export const showAllAnnouncement = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllAnnouncement((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get Single Announcement
export const showAnnouncementByGOSPIandRole = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  showAnnouncementByGOSPIandRoleM(req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Update Unread to 0
export const updateReadAnnouncements = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  updateReadAnnouncementsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Update Unread to 1
export const updateUnReadAnnouncements = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  updateUnReadAnnouncementsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Delete an announcement
export const deleteAnnouncements = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  deleteAnnouncementsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Create New Announcement
export const insertAnnouncement = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertAnnouncementM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Update Announcement
export const updateAnnouncement = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  updateAnnouncementM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete Announcement
export const deleteAnnouncement = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id
  deleteAnnouncementById(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// get latest org_id
export const showLatestOrgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getLastestOrgId((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}