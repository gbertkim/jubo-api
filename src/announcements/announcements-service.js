const AnnouncementsService = {
  getAllAnnouncements(knex) {
    return knex.select('*').from('announcements')
  },
  insertAnnouncement(knex, newAnnouncement) {
    return knex
      .insert(newAnnouncement)
      .into('announcements')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getByEventId(knex, id) {
    return knex
      .from('announcements')
      .select('*')
      .where('announcement_events_id', id)
  },
  getById(knex, id) {
    return knex
      .from('announcements')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteAnnouncement(knex, id) {
    return knex('announcements')
      .where({ id })
      .delete()
  },
  updateAnnouncement(knex, id, newAnnouncementFields) {
    return knex('announcements')
      .where({ id })
      .update(newAnnouncementFields)
    },
}
module.exports = AnnouncementsService
