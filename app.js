//Import package
const express = require('express');
const morgan = require('morgan');

const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');

const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')

let app = express();

app.use(express.json());

app.use(express.static('./public'));

app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);
app.use('/api/v1/admin/users', userRouter);

app.all('*', (req,res,next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cant find ${req.originalUrl} on the server!`
    // })

    // const err = new Error(`Cant find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    const err = new CustomError(`Cant find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;