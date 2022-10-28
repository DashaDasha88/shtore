const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../respositories/users');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation } = require('./validators')

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post('/signup', [
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
]   , async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.send(signUpTemplate({ req, errors }));
    }

    const {email, password, passwordConfirmation} = req.body;

    // Create a user in our repo to represent this person
    const user = await usersRepo.create({ email, password});

    // Store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.send('Account created!!!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) =>{
    res.send(signInTemplate());
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );

    if (!validPassword) {
        return res.send('Email not found');
    }

    req.session.userId = user.id;

    res.send('You are signed in!!!')
});

module.exports = router;