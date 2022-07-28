let { groupStats } = require('./groupStatUtils')
let { buildResultQuery, filter } = require('../filters/tagsQuery')

// node = { field, tags, join, exact }

module.exports = {
  ...groupStats(buildResultQuery),
  drilldown: filter,
}
