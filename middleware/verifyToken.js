
//--------- JWT 驗證 middleware ---------------
//所有的 route 的 request, 都會經過這個中介, 由這個中介首先驗證 request 有無憑證, 憑證是否正確。
//
// 1. JWT 揷件, 很適合用來達成 OAuth 架構. 驗證 token 還可以設定過程時間, 但時間不夠, 無法在這個 demo 裡完成。 


const jwt = require('jsonwebtoken')
const {LoginKey} =require('../connectionInfo')
let accountID = ''

verifyToken = async(ctx, next) =>{
    //console.log('verify')
    let msg = {status:200,body:''}
    
    let authHeader = ctx.get('authorization')
    let token = authHeader && authHeader.split(' ')[1]
    if(token === null || token === '' )
    {
        msg= {status:401, body:'No LoginToken' }
    }
    else
    {
        jwt.verify(token, LoginKey, function(err, decoded) {
            if(err){msg= {status:403, body:'Invalid loginToken' }}
            else
            {
                accountID = decoded.accountID
            }
        });
    }

// 2. JWT Token, 可以攜帶一些 payload, 這邊我把使用者的 ID 加密在 payload 裡面, 然後在這一層中介解開後, 放到 header (response) 裡, 往 downstream 裡傳下去, 讓其其他模組利用。
    ctx.set('User-AccountID',accountID)
    ctx.set('Verification-Status', msg.status)
    ctx.set('Verification-Body',msg.body)
    await next()

    // if(msg.status)
    // {
    //     ctx.status = msg.status
    //     ctx.body = msg.body
    // }
    
}

module.exports = {verifyToken}