const redis = require("redis");

function RedisConnector() {
    if (this.client !==  undefined && this.client.connected) {
        this.client.end(false);
    }

    this.client = redis.createClient();
    this.client.on('connect', function () { console.info('Redis connected'); });
    this.client.on('error', function (err) { console.error('Redis error'); console.error(err); });
    this.client.on('end', function () { console.info('Redis ends the connection'); });
    this.client.on('reconnecting', function () { console.info('Redis is reconnecting'); });
    this.client.on('ready', function () { console.info('Redis is ready!'); });
}

module.exports = RedisConnector;