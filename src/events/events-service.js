const EventsService = {
  getAllEvents(knex) {
    return knex.select('*').from('events')
  },
  getUsersEvents(knex, user_identifier) {
    return knex.select('*').from('events')
    .where('events_creator_id', user_identifier)
  },
  insertEvent(knex, newEvent) {
    return knex
      .insert(newEvent)
      .into('events')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteEvent(knex, id) {
    return knex('events')
      .where({ id })
      .delete()
  },
  notLive(knex) {
    return knex.select('*').from('events')
    .where('active', true)
    .update('active', false)
  },
  goLive(knex, id) {
    return knex.from('events')
    .select('active')
    .where('id', id)
    .update('active', true)
  },
  updateTitle(knex, event, id) {
    return knex('events')
    .where('id', id)
    .update(event)
  },
  copyEvent(knex, id) {
    return knex.select('*').from('events')
    .where('id', id)
  },
  getById(knex, id) {
    return knex
      .from('events')
      .select('*')
      .where('id', id)
      .first()
  },
}

module.exports = EventsService
