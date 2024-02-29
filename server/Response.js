const responses = new Map()

responses.set('404en', '{"msg":"Not Found"}')
responses.set('403en', '{"msg":"Forbidden"}')
responses.set('402en', '{"msg":"Payment Required"}')
responses.set('401en', '{"msg":"Unauthorized"}')
responses.set('400en', '{"msg":"Bad Request"}')

const Response = (ctx, code = 200, body = null, lang = 'en') => {
	ctx.status = code
	ctx.type = 'application/json'
	if (!body) ctx.body = responses.get(code + lang) || '{"msg":"Error ' + code + '"}'
	else {
		if (typeof body !== 'object') body = { msg: body }
		ctx.body = body
	}
	return 0
}

// Responses

module.exports = Response
