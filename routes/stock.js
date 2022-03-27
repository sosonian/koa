const { HeaderForCORS} = require('../middleware/corsHeader')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)

    router.get('/stock/test', ctx=>(ctx.body = 'Stock Test'))

    return router
}