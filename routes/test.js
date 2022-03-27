const { HeaderForCORS} = require('../middleware/corsHeader')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)

    router.get('/test', ctx=>(ctx.body = 'Test'))

    return router
}