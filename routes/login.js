const { HeaderForCORS} = require('../middleware/corsHeader')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)

    router
        .get('/login/test', ctx=>(ctx.body = 'Login Test'))

        .post('/login/', ctx=>{
            //console.log('login')
            //console.log(ctx.request.body)
            let account = ctx.request.body.account
            let password = ctx.request.body.password
            let resMsg = ''

            if(account && password)
            {
                dbConn.then(async(conn)=>{
                    let result = await conn.db('StockTrading').collection('Account').findOne({"account":account, "password":password})
                    
                    if(result.account)
                    {
                        
                    }
                    else
                    {
                        ctx.status = 404
                        ctx.body = "incorrect account or password"
                    }
                })
            }
            else
            {
                ctx.status = 400
                if(!account )
                {
                    resMsg = resMsg+' need field : account ; '
                }

                if(!password)
                {
                    resMsg = resMsg+' need field : password ; '
                }

                ctx.body = resMsg
            }
        })

    

    return router
}