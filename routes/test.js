const { HeaderForCORS} = require('../middleware/corsHeader')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)

    router.get('/', ctx=>(ctx.body = "Welcome! It's Koa-Stock-Trade-Demo API"))

    router.get('/test', ctx=>(ctx.body = 'Test'))

    return router
}