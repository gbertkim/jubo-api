const path = require('path')
const express = require('express')
const ContactService = require('./contact-service')
const contactRouter = express.Router()
const jsonParser = express.json()

const serializeContact = contact => ({
  id: contact.id,
  contact_events_id: contact.contact_events_id,
  logo: contact.logo,
  church: contact.church,
  connect: contact.connect,
  address: contact.address,
  website: contact.website,
  pastor_name: contact.pastor_name,
  pastor_title: contact.pastor_title,
  pastor_email: contact.pastor_email,
  associate_name: contact.associate_name,
  associate_title: contact.associate_title,
  associate_email: contact.associate_email,
  modified: contact.modified
})
contactRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ContactService.getAllContacts(knexInstance)
      .then(contact => {
        res.json(contact.map(serializeContact))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { contact_events_id, logo, church, connect, address, website, pastor_name, pastor_title, pastor_email, associate_name, associate_title, associate_email, modified } = req.body 
    const newContact = { contact_events_id, logo, church, connect, address, website, pastor_name, pastor_title, pastor_email, associate_name, associate_title, associate_email, modified }
    for (const [key, value] of Object.entries(newContact))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    ContactService.insertContact(
      req.app.get('db'),
      newContact
    )
      .then(contact => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${contact.id}`))
          .json(serializeContact(contact))
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { contact_events_id, church, logo, connect, address, website, pastor_name, pastor_title, pastor_email, associate_name, associate_title, associate_email, modified  } = req.body
    const contactToUpdate = { contact_events_id, church, logo, connect, address, website, pastor_name, pastor_title, pastor_email, associate_name, associate_title, associate_email, modified }
    for (const [key, value] of Object.entries(contactToUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    ContactService.updateContact(
      req.app.get('db'),
      contact_events_id,
      contactToUpdate
    )
      .then(event => {
        res.status(204).end()
      })
      .catch(next)
  })
contactRouter
  .route('/:event_id')
  .all((req, res, next) => {
    ContactService.getById(
      req.app.get('db'),
      req.params.event_id
    )
      .then(contact => {
        if (!contact) {
          return res.status(404).json({
            error: { message: `Contact doesn't exist` }
          })
        }
        res.json(serializeContact(contact))
        next()
      })
      .catch(next)
  })
module.exports = contactRouter
