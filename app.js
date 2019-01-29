const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://AhmedRaza:' + process.env.MONGO_ATLAS_PW + '@raza-shop-iadez.mongodb.net/test?retryWrites=true',{useNewUrlParser: true})

mongoose.Promise = global.Promise;

// app.use((req, res, next) => {
//     res.status(200).json({
//         name: 'Ahmed Raza Qadri',
//         fatherName: 'Muhammad Abbas Qadri',
//         phoneNumber: '03152228510'
//     })
// })

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     if (req.method == 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({})
//     }
// })

app.use(('/products'), productRoutes);
app.use(('/orders'), orderRoutes);

//Error Handling

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})



module.exports = app;