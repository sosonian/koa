const { HeaderForCORS} = require('../middleware/corsHeader')
const { verifyToken } = require('../middleware/verifyToken')

module.exports = function(dbConn, router) {
    router.use(HeaderForCORS)
    router.use(verifyToken)

    router.get('/stock/test', ctx=>(ctx.body = 'Stock Test'))
    .get('/stock/list', async(ctx, next)=>{
                     
        let fResult = await dbConn.then(async(conn)=>{
            try {
                let result = await conn.db('StockTrading').collection('CompanyProfile').find().project({ticker:1, name:1, currentPrice:1}).toArray()

                if(result && result !== null && result.length >0)
                {
                    return {status:200, msg:result}
                }
                else
                {
                    return {status:404, msg:'None Company Profile'}
                }
            }
            catch (e){
                console.log(e)
                return {status:500, msg:'db error'}
            }
        })
     
        if(fResult.status === 200)
        {
            ctx.status = fResult.status
            ctx.body = fResult.msg
        }
        else
        {
            ctx.status = fResult.status
            ctx.body = fResult.msg
        }
    })

    .get('/stock/detail/:symbol', async(ctx, next)=>{
        let symbol = ctx.params.symbol
        let fResult = await dbConn.then(async(conn)=>{
            try {
                let result = await conn.db('StockTrading').collection('CompanyProfile').findOne({"ticker":symbol})
                if(result && result !== null)
                {
                    return {status:200, msg:result}
                }
                else
                {
                    return {status:404, msg:'None Company Profile'}
                }
            }
            catch (e){
                console.log(e)
                return {status:500, msg:'db error'}
            }
        })
     
        if(fResult.status === 200)
        {
            ctx.status = fResult.status
            ctx.body = fResult.msg
        }
        else
        {
            ctx.status = fResult.status
            ctx.body = fResult.msg
        }
    })

    .post('/stock/trade', async(ctx, next)=>{

        let symbol = ctx.request.body.symbol
        let tradeUnit = ctx.request.body.tradeUnit
        let method = ctx.request.body.method

        let accountID = ctx.response.get('User-AccountID')
        
        if(!symbol || !tradeUnit || !method)
        {
            ctx.status = 400
            ctx.body = 'Lock any of those params: symbol, tradeUnit, method.'
        }
        else
        {
            console.log(tradeUnit)
            console.log(isNaN(tradeUnit))
            let falseToken = false
            if(symbol === ''){falseToken = true}
            if(isNaN(tradeUnit)){falseToken = true}
            if(method !== 'buy' && method !== 'sell'){falseToken = true}

            if(falseToken)
            {
                ctx.status = 400
                ctx.body = 'Values of params are not correct.'
            }
            else
            {
                let rInfo = await getAccountBalanceAndStockPrice(accountID)
                if(rInfo[0].status === 200 && rInfo[1].status ==200)
                {
                    let balance = rInfo[0].msg.balance
                    let holdingStock = rInfo[0].msg.holdingStock
                    let companyPrice = rInfo[1].msg.companyPrice
                    let targetStock = {ticker:symbol, holdingUnit:0}
                    

                    if(method === 'buy'){
                        let fHoldingStock = updateOrInsert(holdingStock,symbol, tradeUnit, true)
                        if(balance < (tradeUnit*companyPrice)+10)
                        {
                            ctx.status = 200
                            ctx.body = "Balance is not enough, transaction cancelled"
                        }
                        else
                        {
                            let fBalance = balance - 10 - (tradeUnit*companyPrice)
                            let fResult =  updateAccountBalanceAndStockPrice (accountID, fBalance, fHoldingStock)
                        }
                    }
                    else if(method === 'sell'){
                        let fHoldingStock = updateOrInsert(holdingStock,symbol, tradeUnit, false)
                        if(fHoldingStock)
                        {
                            let fResult =  updateAccountBalanceAndStockPrice (accountID, fBalance, fHoldingStock, )
                        }
                        else
                        {
                            ctx.status = 200
                            ctx.body = "Holding unit is not enough, transaction cancelled"
                        }
                    }
                }
                else
                {
                    ctx.status = 404
                    ctx.body = "Data not found, couldn't solve transcation"
                }
            }

        }
    })

    async function getAccountBalanceAndStockPrice (accountID, symbol) {
        
        let account = new Promise(async(resolve,reject)=>{
            let qResult = await dbConn.then(async(conn)=>{
                try {
                    let result = await conn.db('StockTrading').collection('Account').findOne({"accountID":accountID})
                    if(result && result !== null)
                    {
                        return {status:200, msg:result}
                    }
                    else
                    {
                        return {status:404, msg:'None User Profile'}
                    }
                }
                catch (e){
                    console.log(e)
                    return {status:500, msg:'db error'}
                }
            })
            resolve(qResult)
        })

        let companyPrice = new Promise(async(resolve,reject)=>{
            let qResult = await dbConn.then(async(conn)=>{
                try {
                    let result = await conn.db('StockTrading').collection('CompanyProfile').findOne({"ticker":symbol})
                    if(result && result !== null)
                    {
                        return {status:200, msg:result}
                    }
                    else
                    {
                        return {status:404, msg:'None Company Profile'}
                    }
                }
                catch (e){
                    console.log(e)
                    return {status:500, msg:'db error'}
                }
            })
            
            resolve(qResult)
        })

        let [aData, cPrice] = await Promise.all([account,companyPrice])       
        return [aData, cPrice]      
    }

    async function updateAccountBalanceAndStockPrice (accountID, fBalance, fHoldingStock) {
        
        let accountUpdateResult = new Promise(async(resolve,reject)=>{
            let aResult = await dbConn.then(async(conn)=>{
                try {
                    let bResult = await conn.db('StockTrading').collection('Account').updateOne({accountID:accountID},{$set:{balance:fBalance,holdingStock:fHoldingStock}})
                    if(bResult && bResult !== null)
                    {

                        return {status:200, msg:'update account success'}
                    }
                    else
                    {
                        return {status:404, msg:'Update DB Failed'}
                    }
                }
                catch (e){
                    console.log(e)
                    return {status:500, msg:'db error'}
                }
            })
            resolve(aResult)
        })

        let companyPrice = new Promise(async(resolve,reject)=>{
            let qResult = await dbConn.then(async(conn)=>{
                try {
                    let result = await conn.db('StockTrading').collection('CompanyProfile').findOne({"ticker":symbol})
                    if(result && result !== null)
                    {
                        return {status:200, msg:result}
                    }
                    else
                    {
                        return {status:404, msg:'None Company Profile'}
                    }
                }
                catch (e){
                    console.log(e)
                    return {status:500, msg:'db error'}
                }
            })
            
            resolve(qResult)
        })

        let [aData, cPrice] = await Promise.all([account,companyPrice])       
        return [aData, cPrice]      
    }

    function updateOrInsert(tArray, symbol, tradeUnit, buy){
        let fArray = []
        if(tArray.length>0)
        {
            let existToken = false
            tArray.forEach(s=>{
                let tS = {...s}
                if(s.ticker === symbol){
                    if(buy)
                    {
                        tS.holdingUnit = s.holdingUnit+tradeUnit
                    }
                    else
                    {
                        if(s.holdingUnit-tradeUnit < 0)
                        {
                            return false
                        }

                        tS.holdingUnit = s.holdingUnit-tradeUnit
                        
                    }
                    existToken = true
                }
                
                fArray.push(tS)
            })

            if(!existToken)
            {
                if(buy)
                {
                    fArray.push({ticker:symbol,holdingUnit:tradeUnit})
                }
                else
                {
                    return false
                }
            }
        }
        else
        {
            if(buy)
            {
                fArray.push({ticker:symbol,holdingUnit:tradeUnit})
            }
            else
            {
                return false
            }
            
        }

        return fArray

    }

    return router
}