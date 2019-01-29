const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('seqeulize', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});


router.get("/", (req, res, next) => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
            res.status(200).json({ message: "Connected To MySql Database" });
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            res.status(500).json({ message: "Unable to connect to the database", error: err });

        });
});


router.post("/create", (req, res, next) => {
    User.sync({ force: false }).then(() => {
        res.status(200).json({ message: "User Created Successfully" });
        return User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
    }).catch(err => res.status(500).json({ message: "User doesn't created" }));
});
router.get("/getUser", (req, res, next) => {
    // return User.all().then(user => {
    //     res.status(200).json({ message: "User Found", user: user });
    // });
    sequelize.query("SELECT * FROM users").then(myTableRows => {
        return res.status(200).json({ message: "User Found with Quick Query", user: myTableRows });
    })
});

module.exports = router;