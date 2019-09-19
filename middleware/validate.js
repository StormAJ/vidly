module.exports = validator => {
  // validator: fct passed when called
  return (req, res, next) => {
    const { error } = validator(req.body); // function dynamically passed as parameter
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};
