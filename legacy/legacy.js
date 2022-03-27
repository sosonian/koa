CompanyList.forEach(async (c) =>{
    console.log(`${Finnhub.CompanyProfile.Url}?symbol=${c.Symbol}&token=${Finnhub.Token}`)
    let companyProfile = new Promise(async(resolve,reject)=>{
        let result = await fetch(`${Finnhub.CompanyProfile.Url}?symbol=${c.Symbol}&token=${Finnhub.Token}`)
        let data = await result.json()
        resolve(data)
    })

    let companyPrice = new Promise(async(resolve,reject)=>{
        let result = await fetch(`${Finnhub.StockLastPrice.Url}?symbol=${c.Symbol}&token=${Finnhub.Token}`)
        let data = await result.json()
        resolve(data)
    })

    let [cData, cPrice] = await Promise.all([companyProfile,companyPrice])
    let iData = {...cData}
    iData['currentPrice'] = cPrice.c

    dbConn.then(async(conn)=>{
        let result = await conn.db('StockTrading').collection('CompanyProfile').insertOne(iData)
        console.log(result)
    })
})