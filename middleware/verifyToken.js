const jwt = require('jsonwebtoken')

verifyToken = async(ctx, next) =>{
    await next()
    let authHeader = ctx.get('authorization')
    let token = authHeader && authHeader.split(' ')[1]
    if(token === null)
    {
        ctx.status = 401
        ctx.body = 'No loginToken'
    }
    else
    {
        jwt.verify(token, process.env.ACCESS_HASH_KEY, async(err, payload)=>{
            if(err){
                //console.log(err)
                ctx.status = 403
                ctx.body = 'Invalid loginToken'
            }
        })
    }
}

module.exports = {verifyToken}