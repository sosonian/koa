const jwt = require('jsonwebtoken')

let accountID = ''

verifyToken = async(ctx, next) =>{
    let msg = {}
    
    let authHeader = ctx.get('authorization')
    let token = authHeader && authHeader.split(' ')[1]
    if(token === null || token === '' )
    {
        msg= {status:401, body:'No LoginToken' }
    }
    else
    {
        jwt.verify(token, process.env.ACCESS_HASH_KEY, function(err, decoded) {
            if(err){msg= {status:403, body:'Invalid loginToken' }}
            else
            {
                accountID = decoded.accountID
            }
        });
    }

    ctx.set('User-AccountID',accountID)

    if(msg.status)
    {
        ctx.status = msg.status
        ctx.body = msg.body
    }
    else
    {
        await next()
    }
}

module.exports = {verifyToken}