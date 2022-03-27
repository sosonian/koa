const { MongoAtlas } = require('./connectionInfo')
const { MongoClient } = require('mongodb')



let dbConn = new Promise(async(resolve,reject)=>{
    let conn = new MongoClient(`mongodb+srv://${MongoAtlas.Account}:${MongoAtlas.Password}@${MongoAtlas.Url}/?retryWrites=true&w=majority`)
    await conn.connect();
    resolve (conn)
    
})

module.exports = {dbConn}
