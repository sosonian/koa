const HeaderForCORS = async(ctx, next) =>{

    ///var allowOrigins = ['http://192.168.43.254:3000'']
    
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set("Access-Control-Allow-Credentials", "true");
    ctx.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    ctx.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    await next()
}

module.exports = {HeaderForCORS}
