const setHeaderForCORS = (request, response, next) =>{
    
    ///var allowOrigins = ['http://192.168.43.254:3000'']
    
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next()
}

module.exports = {setHeaderForCORS}
