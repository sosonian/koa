const {MongoAtlas, Finnhub} = require('./loginInfo')
const {CompanyList} = require('./companyList')

const Process = require('process')

const Koa = require('koa')
const Router = require('koa-router')
const WebSocket = require('ws')
const Mongoose = require('mongoose')

//const socket = new WebSocket(`wss://ws.finnhub.io?token=${Finnhub.Token}`)
Mongoose.connect(`mongodb+srv://${MongoAtlas.Account}:${MongoAtlas.Password}@${MongoAtlas.Url}/${MongoAtlas.Database}?retryWrites=true&w=majority`)


//服務中斷前先停止跟Finnhub的websocket連線
//如果不停止直接中斷服務，服務馬上重啟的話，Finnhub 的 websocket 要等一段時間才會回應
Process.on('SIGINT',()=>{
    //socket.close()
    console.log('socket close...')
    process.exit()
})





// socket.addEventListener('open',()=>{
//     CompanyList.forEach(c=>{
//         socket.send(JSON.stringify({'type':'subscribe','symbol':c.Symbol}))
//     })
// })

// socket.addEventListener('message',(event)=>{
//     console.log('Message from server', event.data)
// })

const app = new Koa()
const router = new Router()

router
    .get('/test',(ctx,next)=>{
        ctx.body = 'hello world!'
    })

app.use(router.routes())
    .use(router.allowedMethods())

app.listen(3000, ()=> console.log('Server Started...'))