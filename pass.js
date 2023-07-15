// Handy little helper so I can change passwords in the postgres db.
// Use kubectl port-forward -n recipesage services/postgres 5432:5432 to be able to access the db.
var crypto = require('crypto')
const salt = crypto.randomBytes(128).toString('base64');
const hash = crypto.pbkdf2Sync('changeme', salt, 10000, 512, 'sha512').toString('base64');
console.log(salt)
console.log("")
console.log(hash)