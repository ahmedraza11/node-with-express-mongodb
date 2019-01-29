const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const Order = require('../models/orders');
const Products = require('../models/products');



router.get("/", (req, res, next) => {
    Order.find()
        .populate('product','name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }

                })
            })
        })
        .catch(err => res.status(500).json({ error: err }));
});


router.post("/", (req, res, next) => {
    Products.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product Not Found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            })
            return order.save();
        })
        .then(result => res.status(201).json({
            message: 'Order Stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'POST',
                url: "http://localhost:3000/orders" + result._id
            }
        }))
        .catch(err => res.status(500).json({ error: "Error Message From Order Creation::" + err }))
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId).populate('product').exec().then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order Not Found',
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    }).catch(err => res.status(500).json({ error: err }));
});

router.patch("/:orderId", (req, res, next) => {
    res.status(200).json({
        messge: "The Order Updated!.."
    });
});

router.delete("/:orderId", (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId }).exec().then(result => {
        res.status(200).json({
            message: 'Order Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: 'id',
                    quantity: 'Number'
                }
            }
        })
    }).catch(err => res.status(500).json({ error: err }));
});


module.exports = router;