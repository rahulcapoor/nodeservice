const Joi = require('Joi');
const { getProduct, createProduct,  getRecentProducts, deleteProduct} = require('../controllers/product.controller');
module.exports = [
  {
    method: 'GET',
    path: '/product',
    handler: getProduct,
    config: {
      description: 'get all products.',
      tags: ['api'],
      notes: 'get product with the given id',
      validate: {
        query: Joi.object({
            name: Joi.string().required(),
            currency_code: Joi.string().max(3)
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/product',
    handler: createProduct,
    config: {
      description: 'create a product.',
      tags: ['api'],
      notes: 'create a product',
      validate: {
        payload: Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            description: Joi.string()
        })
      }
    },
  },
  {
    method: 'GET',
    path: '/recent',
    handler: getRecentProducts,
    config: {
      description: 'fetch recent products.',
      tags: ['api'],
      notes: 'get the recent products, default value is 5 but can be customized',
      validate: {
        query: Joi.object({
            currency_code: Joi.string().max(3),
            recent_count: Joi.number()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/product/{id}',
    handler: deleteProduct,
    config: {
      description: 'delete given product',
      tags: ['api'],
      notes: 'get the product for the given product id',
      validate: {
        query: Joi.object({
            id: Joi.number().required()
        })
      }
    }
  },
];