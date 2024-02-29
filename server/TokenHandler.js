const jwt = require('jsonwebtoken')
const log = require('./log.js')

const jwtKey = process.env.KEY_JWT

const tokenHandler = {}

tokenHandler.decrypt = (token) => {
	try {
		const data = jwt.verify(token, jwtKey)
		return data
	} catch (err) {
		log.e(err)
		return null
	}
}

tokenHandler.encrypt = (data, expiresIn = '12h') => {
	return jwt.sign(data, jwtKey, { expiresIn })
}

module.exports = tokenHandler
