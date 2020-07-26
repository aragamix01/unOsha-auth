const redis = require("redis");

function RedisConnector() {
    if (this.client !== undefined && this.client.connected) {
        this.client.end(false);
    }

    this.client = redis.createClient();
    this.client.on('connect', function () { console.info('Redis connected'); });
    this.client.on('error', function (err) { console.error('Redis error'); console.error(err); });
    this.client.on('end', function () { console.info('Redis ends the connection'); });
    this.client.on('reconnecting', function () { console.info('Redis is reconnecting'); });
    this.client.on('ready', function () { console.info('Redis is ready!'); });
}

RedisConnector.prototype.GetDataFromKey = function (key) {
    return new Promise((resolve, reject) => {
        // console.log(key);
        this.client.mget(key, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
};

RedisConnector.prototype.SetDataFromKey = function (key, data, timeoutSec) {
    return new Promise((resolve, reject) => {
        if (!timeoutSec) {
            timeoutSec = 54000;
        }
        this.client.set(key, data, 'EX', timeoutSec, (data) => {
            return resolve(data);
        });
    });
};

RedisConnector.prototype.GetKey = function (key) {
    return new Promise((resolve, reject) => {
        this.client.keys(key, (err, data) => {
            if (err) {
                return reject(err);
            }
            if (data)
                return resolve(data);
            return resolve([]);
        });
    });
}

module.exports = RedisConnector;