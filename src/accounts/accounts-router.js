const path = require('path')
const express = require('express')
const AccountsService = require('./accounts-service')
const accountsRouter = express.Router()
const jsonParser = express.json()

const serializeAccounts = account => ({
  id: account.id,
  user_identifier: account.user_identifier,
  user_name: account.user_name,
  user_pass: account.user_pass,
  modified: account.modified
})
const serializeName = account => ({
  user_name: account.user_name,
})
const serializeId = account => ({
  user_identifier: account.user_identifier,
})
const userIdentifier = account => ({
    user_identifier: account.user_identifier,
    user_name: account.user_name,
    modified: account.modified
})
accountsRouter
  .route('/check')
  .post(jsonParser, (req, res, next) => {
    const {user_name, user_pass} = req.body
    const checkAccount = {user_name, user_pass}
    const knexInstance = req.app.get('db')
    for (const [key, value] of Object.entries(checkAccount))
    if (value == null)
        return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
        })
    AccountsService.getUsernames(knexInstance, checkAccount.user_name, checkAccount.user_pass)
      .then(account => {
          if (account === undefined){
            res.status(400).json({
            error: { message: `Username and Password are not found`}                
          })
          } else {
          res
            .status(201)
            .json(userIdentifier(account))
          }
      })
      .catch(next)
  })
accountsRouter
  .route(`/check/:user_name`)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    AccountsService.getByJuboName(
      knexInstance,
      req.params.user_name
    )
    .then(account => {
      res.json(serializeId(account))
    })
    .catch(next)
  })
accountsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    AccountsService.getAllAccounts(knexInstance)
    .then(accounts => {
      res.json(accounts.map(serializeName))
    })
    .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_identifier, user_name, user_pass } = req.body
    const newAccount = { user_identifier, user_name, user_pass }
    for (const [key, value] of Object.entries(newAccount))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        }) 
    AccountsService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })
      return AccountsService.insertAccounts(
        req.app.get('db'),
        newAccount
      )
      .then(account => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${account.id}`))
          .json(serializeAccounts(account))
      })
      .catch(next)
    })
  })
  .delete(jsonParser, (req, res, next) => {
    const { user_identifier, user_name, user_pass } = req.body
    const accountToUpdate = { user_identifier, user_name, user_pass }
    const knexInstance = req.app.get('db')
    for (const [key, value] of Object.entries(accountToUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    AccountsService.getUsernames(knexInstance, user_name, user_pass)
    .then(account => {
        if (account === undefined){
          return res.status(400).json({ error: { message: `Username and Password are not found`}})
        } 
        return AccountsService.deleteAccount(
          req.app.get('db'),
          user_identifier
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
      })
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_identifier, old_pass, user_name, user_pass, modified } = req.body
    const accountToUpdate = { user_identifier, user_name, user_pass, modified }
    const knexInstance = req.app.get('db')
    for (const [key, value] of Object.entries(accountToUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    AccountsService.getUsernames(knexInstance, user_name, old_pass)
    .then(account => {
        if (account === undefined){
          return res.status(400).json({ error: { message: `Username and Password are not found`}})
        } 
        return AccountsService.updateAccount(knexInstance, old_pass, user_name, user_pass)
        .then(account => {
          res.status(204).end()
          })
          .catch(next)
      })
  })
module.exports = accountsRouter
