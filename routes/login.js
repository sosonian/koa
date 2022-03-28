



const { HeaderForCORS} = require('../middleware/corsHeader')
const jwt = require('jsonwebtoken')
const {LoginKey} =require('../connectionInfo')

module.exports = function(dbConn, router) {

    router.use(HeaderForCORS)

    router
        .get('/login/test', ctx=>(ctx.body = 'Login Test'))

        .post('/login', async(ctx, next)=>{
            console.log('login')
            let account = ctx.request.body.account
            let password = ctx.request.body.password
            let resMsg = ''

            if(account && password)
            {
                console.log('A')
                
                let fResult = await dbConn.then(async(conn)=>{
                    try {
                        let result = await conn.db('StockTrading').collection('Account').findOne({"account":account, "password":password})
                           
                        if(result && result !== null && result.account)
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

                console.log(fResult)
                if(fResult.status === 200)
                {
                    let payload = {accountID:fResult.msg.accountID, userName:fResult.msg.name}
                    let accessToken = jwt.sign(payload, LoginKey)

                    ctx.body = {accessToken:accessToken}
                }
                else
                {
                    ctx.status = fResult.status
                    ctx.body = fResult.msg
                }
            }            
            else
            {
                console.log('B')
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

            console.log(ctx.body)
        })

    return router
}