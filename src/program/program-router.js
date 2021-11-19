const path = require('path')
const express = require('express')
const ProgramService = require('./program-service')
const programRouter = express.Router()
const jsonParser = express.json()

const serializeProgram = program => ({
  id: program.id,
  program_events_id: program.program_events_id,
  call_desc: program.call_desc,
  call_leader: program.call_leader,
  call_passage: program.call_passage,
  song_desc: program.song_desc,
  song_leader: program.song_leader,
  confession_desc: program.confession_desc,
  confession_leader: program.confession_leader,
  sermon_desc: program.sermon_desc,
  sermon_series: program.sermon_series,
  sermon_title: program.sermon_title,
  sermon_speaker: program.sermon_speaker,
  sermon_passage: program.sermon_passage,
  offering_desc: program.offering_desc,
  offering: program.offering,
  benediction_desc: program.benediction_desc,
  benediction_speaker: program.benediction_speaker,
  modified: program.modified
})
programRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ProgramService.getAllPrograms(knexInstance)
      .then(program => {
        res.json(program.map(serializeProgram))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { program_events_id, call_desc, call_leader, call_passage, song_desc, song_leader, confession_desc, confession_leader, sermon_desc, sermon_series, sermon_title, sermon_speaker, sermon_passage, offering_desc, offering, benediction_desc, benediction_speaker, modified  } = req.body
    const newProgram = { program_events_id, call_desc, call_leader, call_passage, song_desc, song_leader, confession_desc, confession_leader, sermon_desc, sermon_series, sermon_title, sermon_speaker, sermon_passage, offering_desc, offering, benediction_desc, benediction_speaker, modified }
    for (const [key, value] of Object.entries(newProgram))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    ProgramService.insertProgram(
      req.app.get('db'),
      newProgram
    )
      .then(program => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${program.id}`))
          .json(serializeProgram(program))
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { program_events_id, call_desc, call_leader, call_passage, song_desc, song_leader, confession_desc, confession_leader, sermon_desc, sermon_series, sermon_title, sermon_speaker, sermon_passage, offering_desc, offering, benediction_desc, benediction_speaker, modified  } = req.body
    const eventToUpdate = { program_events_id, call_desc, call_leader, call_passage, song_desc, song_leader, confession_desc, confession_leader, sermon_desc, sermon_series, sermon_title, sermon_speaker, sermon_passage, offering_desc, offering, benediction_desc, benediction_speaker, modified  }
    for (const [key, value] of Object.entries(eventToUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    ProgramService.updateProgram(
      req.app.get('db'),
      program_events_id,
      eventToUpdate
    )
      .then(event => {
        res.status(204).end()
      })
      .catch(next)
  })
programRouter
  .route('/:event_id')
  .all((req, res, next) => {
    ProgramService.getById(
      req.app.get('db'),
      req.params.event_id
    )
      .then(program => {
        if (!program) {
          return res.status(404).json({
            error: { message: `Program doesn't exist` }
          })
        }
        res.json(serializeProgram(program))
        next()
      })
      .catch(next)
  })
module.exports = programRouter
