const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})

const app = require('./app.js');

// console.log(app.get('env'));
// console.log(process.env);

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    // console.log(conn);
    console.log('DB Connection successfull');
}).catch((error) => {
    console.log('Some error has occurred');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started ...`);
});