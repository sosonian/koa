const {Finnhub} = require('./connectionInfo')
const {CompanyList, CurrencyRateList} = require('./symbolList')

const nodeProcess = require('process')
//let fetch = require('node-fetch')

const Koa = require('koa')
const Router = require('koa-router')
const WebSocket = require('ws')
//const { dbConn } = require('./mongoConnection')
const response = require('koa/lib/response')

let socketUrl = `${Finnhub.StockRealTimeSocket.Url}?token=${Finnhub.Token}`
console.log(socketUrl)


const socket = new WebSocket('wss://ws.finnhub.io?token=c8up83qad3ibdduenmsg')





//服務中斷前先停止跟Finnhub的websocket連線
//如果不停止直接中斷服務，服務馬上重啟的話，Finnhub 的 websocket 要等一段時間才會回應
nodeProcess.on('SIGINT',()=>{
    //socket.close()
    console.log('socket close...')
    nodeProcess.exit()
})



// socket.addEventListener('open',()=>{
//     CurrencyRateList.forEach(c=>{
//         socket.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}))
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