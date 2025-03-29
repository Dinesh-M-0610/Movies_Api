module.exports = (func) => {
    return (erq,res,next) => {
        func(req,res,next).catch(err => next(err));
    }
}