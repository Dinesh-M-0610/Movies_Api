const app = require('./app.js');

//Create a server
const port = 3000;

app.listen(port, () =>{
    console.log("server has started...");
})