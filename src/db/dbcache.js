var redis = require("./redis");

var DBCache = /** @class */ (function () {
    function DBCache() {
        try {
            DBCache.redisClient = new redis();
        }
        catch (err) {
            console.error(err);
        }
    }
    return DBCache;
}());
exports.DBCache = DBCache;
