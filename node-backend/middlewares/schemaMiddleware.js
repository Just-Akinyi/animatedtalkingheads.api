const { ValidationError } = require('joi');
const schemaMiddleware = (schema) =>
  (validator = async (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.log(error instanceof ValidationError);
      error.statusCode = 400;
      return next(error);
    }
    next();
  });
module.exports = schemaMiddleware;