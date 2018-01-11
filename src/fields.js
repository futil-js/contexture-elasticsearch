let _ = require('lodash/fp')
let rawFieldName = _.replace(/(\.untouched)|(\.shingle)/g, '')
let modeMap = {
  word: '',
  autocomplete: '.untouched',
  suggest: '.shingle',
}
module.exports = {
  getField: (schema, field, fieldMode = 'autocomplete') =>
    schema.getField
      ? schema.getField(schema, field, fieldMode)
      : (schema.rawFieldName || rawFieldName)(field) +
        (schema.modeMap || modeMap)[fieldMode],
}