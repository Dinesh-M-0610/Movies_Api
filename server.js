const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const app = require('./app.js');

// console.log(app.get('env'));
console.log(process.env);

//Create a server
const port = 3000;

app.listen(port, () =>{
    console.log("server has started...");
})