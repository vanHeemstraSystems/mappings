exports.host = process.env['WERCKER_RETHINKDB_HOST'] || 'localhost';
exports.port = process.env['WERCKER_RETHINKDB_PORT'] || 28015;
exports.db = 'test'; //WAS 'thinky_test';
exports.authKey = '';
