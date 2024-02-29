const server_host = process.env.SERVER_HOST || 'localhost'
const server_port = process.env.SERVER_PORT || '5000'
const server_protocol = process.env.SERVER_PROTOCOL || 'http'

const http = require('http')
const Koa = require('koa')
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')

const { CommonApi } = require('../routes/CommonApi.js')
const log = require('../server/log.js')

// ****************** dependencies END ******************

const RestWebServer = () => {
	const app = new Koa()

	app
		.use(async (ctx, next) => {
			const start = Date.now()
			await next()
			const ms = Date.now() - start
			log.endpoint(`${ctx.method} ${ctx.url} - ${ms}ms`)
		})
		.use(
			cors({
				origin: '*',
				methods: ['GET', 'POST'],
			}),
		)
		.use(
			koaBody({
				// formidable:{uploadDir: './uploads'},
				multipart: true,
				urlencoded: true,
			}),
		)
		.use(CommonApi.routes())
		.use(async (ctx, next) => {
			ctx.status = 404
			ctx.body = '{"msg":"not found"}'
			return
		})
		// .use(CommonApi.allowedMethods())

	log.i(`Server running at ${server_protocol}://${server_host}:${server_port}`)

	http.createServer(app.callback()).listen(server_port, server_host)
}

module.exports = { RestWebServer }
