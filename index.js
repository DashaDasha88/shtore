const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.send("o hai");
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Account created!!!');
})

app.listen(3000, () => {
    console.log('Listening');
});