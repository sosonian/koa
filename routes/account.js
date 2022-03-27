const { HeaderForCORS} = require('../middleware/corsHeader')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)

    router.get('/account/test', ctx=>(ctx.body = 'Account Test'))

    return router
}