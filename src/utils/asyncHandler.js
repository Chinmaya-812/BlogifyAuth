// Higher Order Function , which will handle the error 

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).
            catch((err) => next(err))
    }
}

export default asyncHandler