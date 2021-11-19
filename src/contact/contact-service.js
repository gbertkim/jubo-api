const ContactService = {
  getAllContacts(knex) {
    return knex.select('*').from('contact')
  },
  insertContact(knex, newContact) {
    return knex
      .insert(newContact)
      .into('contact')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, event_id) {
    return knex
      .from('contact')
      .select('*')
      .where('contact_events_id', event_id)
      .first()
  },
  updateContact(knex, contact_events_id, newContactFields) {
    return knex('contact')
      .where({ contact_events_id })
      .update(newContactFields)
    },
}
module.exports = ContactService
