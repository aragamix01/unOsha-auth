var redis = require("./redis");

var DAL = /** @class */ (function () {
    function DAL() {
        try {
            DAL.redisClient = new redis();
        }
        catch (err) {
            console.error(err);
        }
    }
    return DAL;
}());
exports.DAL = DAL;
