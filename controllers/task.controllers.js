const redis = require('redis');
const { promisify } = require('util');
const { Client } = require('@elastic/elasticsearch');

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const elasticClient = new Client({ node: 'http://localhost:9200' });
