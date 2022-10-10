const { deleteEntity, createEntity, getEntities, fetchRecentEnities } = require('../database/product-db');

async function getProduct(req, res) {

    const requestedCurrency = req.query.currency_code || 'USD';
    const productName = req.query.name;

    return await getEntities(productName, requestedCurrency);
}

async function createProduct(req, res) {
    try {
        return await createEntity(req.payload.name, req.payload.price, req.payload.description);
    }
    catch (err) {
        console.log(err);
        res.response(500);
        res.response(err.message);
    }
};

async function getRecentProducts(req, res) {
    try {
        const countOfRecentlyViewed = req.query.recent_count || 5;
        const requestedCurrencyCode = req.query.currency_code || 'USD';
        return await fetchRecentEnities(requestedCurrencyCode, countOfRecentlyViewed);
    }
    catch (err) {
        console.log(err);
        res.response(500);
        res.response(err.message);
    }
};

async function deleteProduct(req, res) {
    return await deleteEntity(req.query.id); 
}


module.exports = { getProduct, createProduct, getRecentProducts, deleteProduct };