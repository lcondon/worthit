var _ = require('lodash')

var string = 'i am a route NAME';
console.log(string);
string = _.camelCase(string)
console.log(string);
string = _.camelCase(_.toLower('bbq BURGER with avocADO on THE Side'));
console.log(string);