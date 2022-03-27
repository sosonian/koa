const { HeaderForCORS} = require('../middleware/corsHeader')
const { verifyToken } = require('../middleware/verifyToken')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)
    router.use(verifyToken)

    router.get('/stock/test', ctx=>(ctx.body = 'Stock Test'))
    .get('/stock/list', async(ctx, next)=>{
            
        
         //.project({ticker:1, name:1, currentPrice:1})

           
                let fResult = await dbConn.then(async(conn)=>{
                    try {
                        let result = await conn.db('StockTrading').collection('CompanyProfile').find().project({ticker:1, name:1, currentPrice:1}).toArray()

                        if(result && result !== null && result.length >0)
                        {
                            return {status:200, msg:result}
                        }
                        else
                        {
                           return {status:404, msg:'incorrect acccount or password'}
                        }
                    }
                    catch (e){
                        console.log(e)
                        return {status:500, msg:'db error'}
                    }
                })

                console.log('fResult')

                console.log(fResult)
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