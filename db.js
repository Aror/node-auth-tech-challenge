const bcrypt = require('bcrypt')
const { newDb } = require('pg-mem')

const db = newDb()

const password = `'password'`
const salt = bcrypt.genSaltSync(10)
const hash = `'${bcrypt.hashSync(password, salt)}'` //'$2b$10$N.vRU766b5uTBalrnkuH1uC9bKXDZxHlmg7BVihNN9oisDbzmoJd6'

db.public.none(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    firstName TEXT,
    lastName TEXT,
    password TEXT
  );
  insert into users values (12345, 'TonyStark2005', 'Tony', 'Start', ${password});
`)

module.exports = db