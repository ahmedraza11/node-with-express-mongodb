const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./../models/products');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
    Product.find()
        .select('_id name price')
        .exec()
        .then(docs => {
            if (docs.length <= 0) {
                res.status(404).json({ message: "No Entries Found!" });
            } else {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/products/" + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            }
        })
        .catch(err => res.status(500).json({ error: err }))
});


router.post("/", upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    // console.log(req.file);
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            messge: "Handling Post Request To Products",
            createdProduct: product
        });

    }).catch(err => console.log(err));
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs) {
                res.status(200).json(docs)
            } else {
                res.status(404).json({ message: "Not Valid information Entered to get product data" });
            }
        }).catch(err => {
            console.log("err", err);
            res.status(500).json({ error: err });

        })
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps }).then(result => {
        res.status(200).json(result);
    }).catch(err => res.status(500).json({ error: err }));
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })

});


module.exports = router;