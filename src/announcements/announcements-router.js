const path = require('path')
const express = require('express')
const AnnouncementsService = require('./announcements-service')
const announcementsRouter = express.Router()
const jsonParser = express.json()

const serializeAnnouncement = announcement => ({
  id: announcement.id,
  announcement_events_id: announcement.announcement_events_id,
  date: announcement.date,
  time: announcement.time,
  title: announcement.title,
  location: announcement.location,
  address: announcement.address,
  description: announcement.description,
  url: announcement.url,
  modified: announcement.modified,
})
announcementsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    AnnouncementsService.getAllAnnouncements(knexInstance)
      .then(announcement => {
        res.json(announcement.map(serializeAnnouncement))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { announcement_events_id, date, time, title, location, address, description, url } = req.body
    const newAnnouncement = { announcement_events_id, date, time, title, location, address, description, url  }
      for (const [key, value] of Object.entries(newAnnouncement))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    AnnouncementsService.insertAnnouncement(
      req.app.get('db'),
      newAnnouncement
    )
      .then(announcement => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${announcement.id}`))
          .json(serializeAnnouncement(announcement))
      })
      .catch(next)
  })
announcementsRouter
  .route('/:announcement_events_id')
  .get((req, res, next) => {
    AnnouncementsService.getByEventId(
      req.app.get('db'),
      req.params.announcement_events_id
    )
      .then(announcement => {
        if (!announcement) {
          return res.status(404).json({
            error: { message: `Announcement doesn't exist` }
          })
        }
        res.json(announcement.map(serializeAnnouncement))
        next()
      })
      .catch(next)
    })
announcementsRouter
  .route('/:announcement_event_id/:id')
  .get((req, res, next) => {
    AnnouncementsService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(announcement => {
        if (!announcement) {
          return res.status(404).json({
            error: { message: `Announcement doesn't exist` }
          })
        }
        res.json(serializeAnnouncement(announcement))
        next()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { announcement_events_id, date, time, title, location, address, description, url } = req.body
    const announcementToUpdate = { announcement_events_id, date, time, title, location, address, description, url  }
    for (const [key, value] of Object.entries(announcementToUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    AnnouncementsService.updateAnnouncement(
      req.app.get('db'),
      req.params.id,
      announcementToUpdate
    )
      .then(announcement => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    AnnouncementsService.deleteAnnouncement(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  

module.exports = announcementsRouter
