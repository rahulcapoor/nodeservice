const { executeQuery, executeTransactions } = require("./sql/db");
const { getCurrencyRate } = require("../services/service");
const { sql } = require("./sql/pool-manager");

async function deleteEntity(product_id) {
    try {
        const query = 'delete from dbo.products where id = @product_id';
        const inputParams = [{
            name: 'product_id',
            type: sql.Int,
            value: product_id
        }];
        return executeQuery(query, inputParams);
    }
    catch (err) {
        console.log(err);
    }
}

async function createEntity(name, price, description) {
    try {
        const inputParams = [{ name: 'product_name', type: sql.VarChar, value: name },
        { name: 'product_price', type: sql.Int, value: price },
        { name: 'product_description', type: sql.VarChar, value: description }];
        const query = 'insert into dbo.products Values (@product_name, @product_price, @product_description)';

        return executeQuery(query, inputParams);
    }
    catch (err) {
        console.log(err);
    }
}

async function fetchRecentEnities(requestedCurrencyCode, countOfRecentlyViewed) {
    const query = `select top ${countOfRecentlyViewed} pr.id, pr.product_name, 
        pr.product_description, pr.product_price, re.read_count
        from dbo.products pr
        join dbo.recent re on pr.id = re.product_id
        where re.read_count > 0 
        order by  re.read_count desc`;

    const result = await executeQuery(query);

    //const currencyRate = await getCurrencyRate(requestedCurrencyCode);
    const records = result.recordset;
    const newRecords = [];
    for (let index = 0; index < records.length; index++) {
        const element = records[index];
        const newPrice = await getCurrencyRate(element.product_price, requestedCurrencyCode);
        newRecords = [...element, {product_price : newPrice, currency: requestedCurrencyCode}]
    }

    return newRecords;
}

async function getEntities(productName, currencyCode) {
    const fetchRecords = {
        reqName: 'fetchRecords',
        query: 'select * from dbo.products where product_name = @product_name',
        params: [{ name: 'product_name', type: sql.VarChar, value: productName }]
    };
    const updateRecentRecords = {
        reqName: 'updateRecentRecords',
        query: `if (select read_count from dbo.recent where product_name = @product_name) > 0
        update dbo.recent  set read_count = read_count+1 where product_name = @product_name
        else
        if EXISTS(select id from dbo.products where product_name = @product_name)
        insert into [dbo].[recent] (product_id, product_name, read_count) 
        values((select id from dbo.products where product_name = @product_name), @product_name, 1)`,
        params: [{ name: 'product_name', type: sql.VarChar, value: productName }]
    }
    const result = await executeTransactions(fetchRecords, updateRecentRecords);
    const currencyRate = await getCurrencyRate(currencyCode);
    console.log(result);
    const newRecords =
        result['fetchRecords'].map(object => ({
            ...object, product_price: object.product_price * currencyRate,
            currency_code: currencyCode
        }));
    return newRecords;
}

module.exports = { deleteEntity, createEntity, fetchRecentEnities, getEntities };