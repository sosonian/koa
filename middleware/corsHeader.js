
// --------------------------------------- CORS middleware ------------------------------- 
// 這個 demo 是純粹後端API, 為讓前端 Web APP 可以不受 CORS 影響，大部分的 route 都會先經過這個中介，加上 CORS 相關的 header.
// API限制IP連線的白名單, 也可以先利用這邊初步實現. (如果前面可以再加上 Niginx 等的代理伺服器)


const HeaderForCORS = async(ctx, next) =>{

    ///let allowOrigins = ['http://192.168.43.254:3000'']
    
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set("Access-Control-Allow-Credentials", "true");
    ctx.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    ctx.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    await next()
}

module.exports = {HeaderForCORS}
