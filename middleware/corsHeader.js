const HeaderForCORS = async(ctx, next) =>{

    ///var allowOrigins = ['http://192.168.43.254:3000'']
    
    ctx.response.setHeader('Access-Control-Allow-Origin', '*')
    ctx.response.setHeader("Access-Control-Allow-Credentials", "true");
    ctx.response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    ctx.response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    await next()
}

module.exports = {HeaderForCORS}
