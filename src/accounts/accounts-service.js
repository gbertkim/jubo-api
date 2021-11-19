const AccountsService = {
    getAllAccounts(knex) {
      return knex.select('user_name').from('accounts')
    },
    hasUserWithUserName(db, user_name) {
      return db('accounts')
        .where({ user_name })
        .first()
        .then(user => !!user)
    },
    getByJuboName(knex, user_name) {
      return knex.from('accounts')
      .where('user_name', user_name)
      .first()
    },
    getUsernames(knex, username, password) {
        return knex.from('accounts')
        .select('user_identifier', 'user_name', 'modified')
        .where('user_name', username)
        .andWhere('user_pass', password)
        .first()
    },
    insertAccounts(knex, newAccounts) {
      return knex
        .insert(newAccounts)
        .into('accounts')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    updateAccount(knex, old_pass, user_name, user_pass) {
      return knex.from('accounts')
        .select('user_name','user_pass')
        .where('user_name', user_name)
        .andWhere('user_pass', old_pass)
        .update({ user_pass })
    },
    deleteAccount(knex, user_id) {
      return knex.from('accounts')
        .where('user_identifier', user_id)
        .delete()
    },
    getById(knex, id) {
      return knex.from('accounts').select('*').where('id', id).first()
    }, 
  }
  module.exports = AccountsService
  