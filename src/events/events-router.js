const path = require('path')
const express = require('express')
const EventsService = require('./events-service')
const eventsRouter = express.Router()
const jsonParser = express.json()

const serializeEvents = event => ({
  id: event.id,
  events_creator_id: event.events_creator_id,
  "event_date": event.event_date,
  "event_name": event.event_name,
  active: event.active,
  modified: event.modified
})
eventsRouter
  .route('/:user_identifier')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    EventsService.getUsersEvents(knexInstance, req.params.user_identifier)
    .then(events => {
      res.json(events.map(serializeEvents))
    })
    .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { event_date, modified, events_creator_id, active, event_name } = req.body 
    const newEvent = { event_date, modified, events_creator_id, active, event_name }
    for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    EventsService.insertEvent(
      req.app.get('db'),
      newEvent,
      req.params.user_identifier
    )
    .then(event => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${event.id}`))
        .json(serializeEvents(event))
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { id, event_name, event_date } = req.body
    const newEvent = { id, event_name, event_date }
    for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      EventsService.updateTitle(
        req.app.get('db'),
        newEvent,
        newEvent.id
      )        
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })

eventsRouter
  .route('/:user_identifier/:event_id')
  .delete((req, res, next) => {
    EventsService.deleteEvent(
      req.app.get('db'),
      req.params.event_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch((req, res, next) => {
    EventsService.notLive(
      req.app.get('db')
    )
    .then( () => { 
      return EventsService.goLive(
        req.app.get('db'),
        req.params.event_id
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })
    .catch(next)
  })
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    EventsService.getById(knexInstance, req.params.event_id)
    .then(event => {
      if (!event) {
        return res.status(404).json({
          error: { message: `Event doesn't exist` }
        })
      }
      return res.json(serializeEvents(event))
    })
    .catch(next)
  })
module.exports = eventsRouter
