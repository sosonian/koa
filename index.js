require('dotenv').config()
const {Finnhub} = require('./connectionInfo')
const {CompanyList, CurrencyRateList} = require('./symbolList')

const nodeProcess = require('process')

const Koa = require('koa')
const json = require('koa-json')
const KoaRouter = require('koa-router')
const koaBody = require('koa-body')
const WebSocket = require('ws')

//資料庫連線另外 wrapper 成一個 promise，方便各 route 模組使用
const { dbConn } = require('./mongoConnection')

//使用websocket跟 第三方服務連接，取的即時報價。
const socket = new WebSocket(`${Finnhub.StockRealTimeSocket.Url}?token=${Finnhub.Token}`)


//服務中斷前先停止跟Finnhub的websocket連線
//如果不停止直接中斷服務，服務馬上重啟的話，Finnhub 的 websocket 要等一段時間才會回應
nodeProcess.on('SIGINT',()=>{
    socket.close()
    console.log('socket close...')
    nodeProcess.exit()
})

//-----------------   WebSocket 設定 event --------------------------------------------------

socket.addEventListener('open',()=>{
    CompanyList.forEach(c=>{
        socket.send(JSON.stringify({'type':'subscribe','symbol':c.Symbol}))
    })
})


    //這邊設定當 websocket 有一檔股票報價更新時，即更新資料庫
socket.addEventListener('message',async(event)=>{
    
    if(event.data)
    {
        let cData = event.data
        let fData = JSON.parse(cData)
        console.log(fData)
        if(fData.data && Array.isArray(fData.data) && fData.data.length >0)
        {
            try {
                dbConn.then(async(conn)=>{
                    conn.db('StockTrading').collection('CompanyProfile').updateOne({"ticker":fData.data[0].s},{$set:{"currentPrice":fData.data[0].p}})
                })
            } 
            catch(e)
            {
                console.log('Update Price To DB, Error Occurred !')
                console.log(e)
            }
        }
    }
})

//--------------------------------------------------------------------------

const app = new Koa()
const router = new KoaRouter()


app.use(json())
app.use(koaBody())
app.use(router.routes()).use(router.allowedMethods())

const test = require('./routes/test')(dbConn, router)
const account = require('./routes/account')(dbConn, router)
const login = require('./routes/login')(dbConn, router)
const stock = require('./routes/stock')(dbConn, router)


app.listen(3000, ()=> console.log('Server Started...'))