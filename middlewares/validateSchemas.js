const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((details) => details.message);
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        errors: errorMessages,
      });
    }
    req.body = value;
    next();
  };
};


module.exports = validateRequest