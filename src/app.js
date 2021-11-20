require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const eventsRouter = require('./events/events-router')
const programRouter = require('./program/program-router')
const accountsRouter = require('./accounts/accounts-router')
const announcementsRouter = require('./announcements/announcements-router')
const contactRouter = require('./contact/contact-router')

const app = express()
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(helmet())

app.use('/api/accounts', accountsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/program', programRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/contact', contactRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
