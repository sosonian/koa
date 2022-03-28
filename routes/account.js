



const { HeaderForCORS} = require('../middleware/corsHeader')
const { verifyToken } = require('../middleware/verifyToken')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)
    router.use(verifyToken)

    router.get('/api/account/test', ctx=>(ctx.body = 'Account Test'))
    .get('/api/account/profile', async(ctx, next)=>{
        console.log('/account/profile')
        let accountID = ctx.response.get('User-AccountID')
        let verificationStatus = ctx.response.get('Verification-Status')
        let verificationBody = ctx.response.get('Verification-Body')

        if(Number(verificationStatus) !== 200)
        {
            ctx.status = verificationStatus
            ctx.body = verificationBody
        }
                     
        let fResult = await dbConn.then(async(conn)=>{
            try {
                let result = await conn.db('StockTrading').collection('Account').findOne({"accountID":accountID})
                if(result && result !== null)
                {
                    return {status:200, msg:result}
                }
                else
                {
                    return {status:404, msg:'None Account Profile'}
                }
            }
            catch (e){
                console.log(e)
                return {status:500, msg:'db error'}
            }
        })
     
        if(fResult.status === 200)
        {
            ctx.status = fResult.status
            ctx.body = fResult.msg
        }
        else
        {
            ctx.status = fResult.status
            ctx.body = fResult.msg
        }
    })

    return router
}