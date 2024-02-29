require('dotenv').config()
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

// const log = require('./server/log.js')


// const tokenHandler = require('./server/TokenHandler.js')

// const tokens = {
// 	date: parseInt(Date.now() / 1000, 10),
// 	user_tg_id: 5574257118,
// 	// server_name: 'preland_builder',
// 	// server_name: 'tg_land',
// 	server_name: 'stats_server',
// 	// server_name: 'stream',
// }
// const token = tokenHandler.encrypt(tokens, '7d')
// log(token);

// let token_ = 'eyJhb.hj.hjj'
// let token2 = TokenHandler.decrypt(token_)
// log.i(token2);

// ****************** dependencies END ******************

// const { WebSocketServer } = require('./server/WebSocketServer.js')
const { RestWebServer } = require('./server/RestWebServer.js')

RestWebServer()
// WebSocketServer()

