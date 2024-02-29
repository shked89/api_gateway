const Router = require('@koa/router')
// const Joi = require('@hapi/joi')
const Response = require('../server/Response.js')
const log = require('../server/log.js')
const axios = require('axios');

// const { hasWSUser, getWSUser, deleteWSUser } = require('../server/WebSocketServer.js')


const TokenHandler = require('../server/TokenHandler.js')

// let fffffff = TokenHandler.encrypt({
//    // date: parseInt(Date.now() / 1000, 10),
//    user_tg_id: 25243,
//    session: 'test_1Ui',
//    type:"accesstoken",

// }, '12h')

// console.log(TokenHandler.decrypt(fffffff));

const ValidateHeaders = async (ctx, next) => {
   // const auth_token = ctx.request.header?.localauth
   // const tg_user_id = ctx.request.header?.tgid
   const token = ctx.cookies.get('auth') || ctx.request.header?.auth
   // if (!hasWSUser(uuid))
   //    return Response(ctx, 404, 'Wrong uuid')

   if (!token)
      return Response(ctx, 401, "There is no 'Auth' in headers")

   const tokenData = TokenHandler.decrypt(token)

   if (tokenData?.tokentype !== 'accesstoken')
      return Response(ctx, 401, "Wrong token type")

   if (!tokenData?.person_id)
      return Response(ctx, 401, "Wrong token")

   ctx.tpid = tokenData?.person_id // token person ID
   ctx.tsession = tokenData?.session // token session

   await next()
}

const targetBase_USER_URL = process.env.TARGET_SERVICE_PERSON_URL;


const CommonApi = new Router({ prefix: '/api' })


CommonApi
   .post('/auth/v1/login', async (ctx) => {

      const queryParams = await getAllQueryParams(ctx)

      if (queryParams === null)
         return Response(ctx, 400, "Wrong parameter 'tpid'")

      if (!queryParams?.login)
         return Response(ctx, 400, "'login' parameter not passed")

      if (!queryParams?.password)
         return Response(ctx, 400, "'password' parameter not passed")

      const accesstoken = TokenHandler.encrypt({
         // date: parseInt(Date.now() / 1000, 10),
         person_id: 12,
         session: 'test_1Ui',
         tokentype: 'accesstoken',
      }, '12h')
      const refreshtoken = TokenHandler.encrypt({
         // date: parseInt(Date.now() / 1000, 10),
         person_id: 12,
         session: 'test_1Ui',
         tokentype: 'refreshtoken',
      }, '15d')

      if (queryParams.login === 'test@test.com' && queryParams.password === 'test') {

         return Response(ctx, 200, {
            accesstoken: accesstoken,
            refreshtoken: refreshtoken,
         })
      } else
         return Response(ctx, 400, "wrong login or password")

   })
   .all('/test/v1/data', ValidateHeaders, async (ctx) => {

      const queryParams = await getAllQueryParams(ctx)

      if (queryParams === null)
         return Response(ctx, 400, "Wrong parameter 'tpid'")

      if (!queryParams?.tpid)
         return Response(ctx, 400, "'person_id' parameter not passed")

      console.log(await getAllQueryParams(ctx));
      return Response(ctx, 200, await getAllQueryParams(ctx))
   })
   .all('/person/:version/:servicePath*', ValidateHeaders, async (ctx) => {

      const queryParams = await getAllQueryParams(ctx)

      if (queryParams === null)
         return Response(ctx, 400, "Wrong parameter 'tpid'")

      // if (!queryParams?.person_id)
      //    return Response(ctx, 400, "'person_id' parameter not passed")

      // Получаем путь и параметры запроса
      const servicePath = ctx.params.servicePath;
      const fullPath = ctx.path

      const queryString = (new URLSearchParams(queryParams)).toString();


      // const fullPath = ctx.path.replace('/api/', '');

      // Определяем целевой URL из переменных окружения

      // return Response(ctx, 400,
      //    {
      //       servicePath,
      //       targetUrl,
      //       fullPath,
      //       targetBase_USER_URL
      //    })

      const targetUrl = `${targetBase_USER_URL}${fullPath}${queryString ? `?${queryString}` : ''}`

      console.log(targetUrl);

      // const headers = { ...ctx.request.headers };

      // // Удаляем заголовки, которые не должны быть переданы
      // delete headers['host'];
      // delete headers['content-length'];
      // delete headers['connection'];

      try {
         // Перенаправляем запрос с использованием Axios
         const response = await axios({
            method: ctx.method,
            url: targetUrl,
            // headers: headers,
            // params: queryParams,
            // data: ctx.request.body,
            // headers: ctx.request.headers,
            // params: ctx.request.query,
         })

         // Устанавливаем статус ответа и возвращаем данные
         // ctx.status = await response.status;

         return Response(
            ctx,
            response?.status || 500,
            await response.data,
         )

      } catch (error) {
         // if (error.response) {
         // Передаем статус ошибки и сообщение, если оно есть
         return Response(
            ctx,
            error.response?.status || 500,
            await error.response?.data
            // error.response?.status || 500,
            // {
            //    url: targetUrl,
            //    data: await error.response?.data,
            // }
         )

         // } else {
         //    // Ошибка соединения или истекло время ожидания
         //    ctx.status = 500;
         //    ctx.body = { message: 'Internal Server Error' };
         // }
      }


   });


async function getAllQueryParams(ctx) {

   const data = {
      ...ctx.request.body,
      ...ctx.query,
      // tpid: ctx.tpid,
   }
   if (data?.tpid)
      return null
   data.tpid = ctx.tpid
   return data
}

// .all('/set_user', ValidateHeaders, async (ctx, next) => {

//    const tg_user_id = parseInt(ctx.request.header?.tgid, 10)
//    if (!tg_user_id)
//       return Response(ctx, 404, 'Wrong tg_user_id')

//    const user_id = parseInt(ctx.request.header?.userid, 10)
//    if (!user_id)
//       return Response(ctx, 404, 'Wrong user_id')

//    const uuid = ctx.request.header?.uuid

//    const userData = getWSUser(uuid)


//    const accesstoken = TokenHandler.encrypt({
//       // date: parseInt(Date.now() / 1000, 10),
//       user_tg_id: tg_user_id,
//       user_id: user_id,
//       session: 'test_1Ui',
//       server_name: 'stream',
//       // server_name: 'tg_lang',
//    }, '12h')
//    const refreshtoken = TokenHandler.encrypt({
//       // date: parseInt(Date.now() / 1000, 10),
//       user_tg_id: tg_user_id,
//       user_id: user_id,
//       session: 'test_1Ui',
//       server_name: 'refresh_stream',
//       // server_name: 'tg_lang',
//    }, '12h')


//    console.log(userData);
//    // console.log(TokenHandler.decrypt);

//    const tokens = {
//       accesstoken: accesstoken,
//       refreshtoken: refreshtoken,
//    }
//    await userData.send(JSON.stringify(tokens))

//    deleteWSUser(uuid)

//    return Response(ctx, 200, userData.headers)
// })
// .all('/get_user', ValidateHeaders, async (ctx, next) => {
//    const uuid = ctx.request.header?.uuid

//    const userData = getWSUser(uuid)

//    return Response(ctx, 200, userData.headers)
// })


// .all('/auth', ValidateHeaders, async (ctx, next) => {

//    const uuid = ctx.request.headers?.uuid

//    ctx.status = 200
//    ctx.body = {
//       ok: true,
//       uuid: uuid,
//       headers: {
//          client_ip: ctx.request.ip,
//          'sec-ch-ua': ctx.request.header?.['sec-ch-ua'] || null,
//          'sec-ch-ua-platform': ctx.request.header?.['sec-ch-ua-platform'] || null,
//          'user-agent': ctx.request.header?.['user-agent'] || null,
//          'accept-language': ctx.request.header?.['accept-language'] || null,
//       },
//    }
// })
// .all('/auth404', async (ctx, next) => {
//    ctx.status = 404
//    ctx.body = {
//       ok: true,
//       headers: {
//          client_ip: ctx.request.ip,
//          'sec-ch-ua': ctx.request.header?.['sec-ch-ua'] || null,
//          'sec-ch-ua-platform': ctx.request.header?.['sec-ch-ua-platform'] || null,
//          'user-agent': ctx.request.header?.['user-agent'] || null,
//          'accept-language': ctx.request.header?.['accept-language'] || null,
//       },
//    }
//    return true
// })
// .all('/auth/:code', async (ctx, next) => {

//    const code = parseInt(ctx.params?.code)

//    ctx.status = code || 404
//    ctx.body = {
//       ok: true,
//       headers: ctx
//    }
//    return true
// })

module.exports = {
   CommonApi
}