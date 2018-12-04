const app = require('express')();
const database = require('./database');

app.get('/', (req, res)=> {
    console.log('접속 탐지')
    res.send('success')
});

app.listen(80, () => {
    console.log('App listening on port 3000!');
});
