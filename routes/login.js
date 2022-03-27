const { HeaderForCORS} = require('../middleware/corsHeader')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)

    router.get('/login/test', ctx=>(ctx.body = 'Login Test'))

    return router
}