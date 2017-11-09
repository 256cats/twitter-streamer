const elastic = require('elasticsearch');
const client = new elastic.Client({
  host: 'localhost:9201',
  log: 'trace'
});

const indexName = 'tweets';

function deleteIndex() {
  return client.indices.delete({
    index: indexName,
    ignore: [404]
  });
}

function initIndex() {
  return client.indices.create({
    index: indexName
  });
}

function initMapping() {
  return client.indices.putMapping({
    index: indexName,
    type: 'tweet',
    body: {
      _all : { enabled : false },
      properties: {
        id: { type: 'long'},
        id_str: { type: 'string' },
        coordinates: {
          properties: {
            coordinates: { type: 'geo_point'}
          }
        },
        text: { type: 'string' },
        source: { type: 'string' },
        timestamp_ms: {type: 'date', format: 'epoch_millis'}
      }
    }
  });
}

console.log('started');
deleteIndex()
  .then(initIndex, function () {})
  .then(initMapping)
  .then(function () {
    console.log('done, added');
    process.exit();
  })