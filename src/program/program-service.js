const ProgramService = {
  getAllPrograms(knex) {
    return knex.select('*').from('program')
  },
  insertProgram(knex, newProgram) {
    return knex
      .insert(newProgram)
      .into('program')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, event_id) {
    return knex
      .from('program')
      .select('*')
      .where('program_events_id', event_id)
      .first()
  },
  updateProgram(knex, program_events_id, newEventFields) {
    return knex('program')
      .where({ program_events_id })
      .update(newEventFields)
    },
}

module.exports = ProgramService
