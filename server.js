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

server.post('/', validateAccount, (req, res) => {
    db('accounts').insert(req.body, 'id')
    .then(id => {
        // console.log(`id`, id)
        db.select('*').from('accounts')
        .where('id', '=', id[0])
        .then(account => {
            // console.log(`account`, account)
            res.status(201).json(account[0])
        }).catch(error => {
            res.status(500).json(error)
        })
    }).catch(error => {
        res.status(500).json(error)
    })
    
});

server.delete('/:id', validateAccountId, (req, res) => {
    db('accounts')
    .where('id', '=', req.params.id)
    .first()
    .del()
    .then(response => {
        console.log(`response`, response)
        if (response === 1) {
            res.status(204).json('account deleted')
        } else {
            res.status(500).json('server error')
        }  
    }).catch(error => {
        res.status(500).json(error)
    })
    
});

server.put('/:id', validateAccountId, (req, res) => {
    db('accounts')
    .where('id', '=', req.params.id)
    .first()
    .update(req.body)
    .then(response => {
        if (response === 1) {
            db.select('*').from('accounts')
            .where('id', '=', req.params.id)
            .first()
            .then(account => {
                res.status(200).json(account)
            }).catch(error => {
                res.status(500).json(error)
            })
        } else {
            res.status(500).json('server error')
        }
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

function validateAccount(req, res, next) {
    if (req.body) {
        if (req.body.name && req.body.budget) {
            next ();
        } else {
            res.status(400).json({ message: "missing required name or budget field"  })
        }
    } else {
        res.status(400).json({ message: "missing account data" })
    }
    
};

module.exports = server;