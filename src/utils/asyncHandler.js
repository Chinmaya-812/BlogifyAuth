// Higher Order Function , which will handle the error 

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).
            catch((err) => next(err))
    }
}

export default asyncHandler



/* 
It takes a function (fn) as an argument. This function is expected to be asynchronous (either returning a Promise or using async/await).
It returns a new function, which is the actual middleware for Express (with parameters req, res, and next).
Inside the returned function:

    It calls Promise.resolve(fn(req, res, next)) to ensure that if the function (fn) is a promise, it will resolve properly.
    If fn resolves (i.e., the asynchronous code runs successfully), nothing happens.
    If fn rejects (i.e., an error occurs), the .catch() block catches the error and passes it to the next error-handling middleware by calling next(err).

*/


/* 
i.e :- getAllPost---> (req, res, next) => {
        Promise.resolve(fn(req, res, next)).
            catch((err) => next(err))
    }

    i.e Whenever getAllPost is called, Express will automatically pass (req, res, next) to it. These parameters are then passed to the async function 
    inside asyncHandler. This way, the async function can use (req, res, next) just like any normal Express route handler. asyncHandler essentially 
    ensures that the async function has access to these parameters and also handles any errors that might occur during the async operation.


    When getAllPost is called (which is an async function wrapped by asyncHandler), Express will automatically pass (req, res, next) to it. 
    The asyncHandler will then pass these parameters to the async function (fn), allowing the function to access the request, response,
    and next middleware as expected.


*/