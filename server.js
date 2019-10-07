const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    db.select('*').from('accounts')
    .then(accounts => {
        res.status(200).json(accounts)
    }).catch(error => {
        res.status(500).json(error)
    })
    
});

server.get('/:id', validateAccountId, (req, res) => {
    db.select('*').from('accounts')
    .where('id', '=', req.params.id)
    .first()
    .then(account => {
        res.status(200).json(account)
    }).catch(error => {
        res.status(500).json(error)
    })
    
});

function validateAccountId(req, res, next) {
    db.select('*').from('accounts')
    .where('id', '=', req.params.id)
    .first()
    .then(account => {
        if(account) {
            next();
        } else {
            res.status(404).json({Messgae: "invalid accountt id"})
        }
    }).catch (error =>
        res.status(500).json({error: `Server error: ${error}`})
    )
};

module.exports = server;