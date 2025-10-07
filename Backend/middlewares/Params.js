function getRequestData(req) {
    return {
        body: req.body,
        query: req.query,
        params: req.params
    };
}

module.exports = (req, res, next) => {
    console.log("Data:", JSON.stringify(getRequestData(req)));
    next();
};