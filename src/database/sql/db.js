const { dbConnection, sql } = require('./pool-manager');

async function executeQuery(query, sqlInput) {
    try {
        const dbConn = await dbConnection
        const request = await dbConn.request();
        if (sqlInput) {
            sqlInput.forEach(param => {
                request.input(param.name, param.type, param.value)
            });
        }
        const result = await request.query(query);
        return result;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function executeQueryTxn(transaction, queryParams) {
    try {
        const request = new sql.Request(transaction);
        if (queryParams && queryParams.params) {
            queryParams.params.forEach(param => {
                request.input(param.name, param.type, param.value)
            });
        }
        const result = await request.query(queryParams.query);
        return result.recordset;
    } catch (error) {
        console.log(error);
    }
}

async function executeTransactions(...requestsToExecute) {
    const dbConn = await dbConnection

    let transaction;
    try {
        transaction = new sql.Transaction(dbConn);
        await transaction.begin();
        const results = {};
        for (let index = 0; index < requestsToExecute.length; index++) {
            const element = requestsToExecute[index];

            const requestResult = await executeQueryTxn(transaction, element);
            results[element.reqName]  = requestResult;
        }
       
        await transaction.commit();
        return results;
    }
    catch (err) {
        console.log(err);
        await transaction.rollback();
        throw err;
    }
}

module.exports = { executeQuery, executeTransactions };