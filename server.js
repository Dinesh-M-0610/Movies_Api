const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})

const app = require('./app.js');

// console.log(app.get('env'));
console.log(process.env);

console.log("MongoDB Connection String:", process.env.CONN_STR);

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    console.log(conn);
    console.log('DB Connection successfull')
})

//Create a server
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log("server has started...");
})