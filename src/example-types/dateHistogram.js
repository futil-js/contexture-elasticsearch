let _ = require('lodash/fp')
let F = require('futil-js')
let moment = require('moment')
let dateMath = require('@elastic/datemath')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: context =>
    context.config.key_field && context.config.value_field,
  result: (context, search) => {
    let payload = {
      config: {
        key_type: 'date_histogram',
        key_data: {
          interval: context.config.interval || 'year',
          min_doc_count: 0,
        },
        value_type: 'stats',
        extraAggs: [
          {
            key: 'max_date',
            config: {
              value_field: 'value',
              data: {
                max: {
                  field: 'PO.IssuedDate',
                },
              },
            },
          },
          {
            key: 'min_date',
            config: {
              value_field: 'value',
              data: {
                min: {
                  field: 'PO.IssuedDate',
                },
              },
            },
          },
        ],
      },
    }

    if (context.config.boundsRange_min && context.config.boundsRange_max) {
      let useDateMath = context.config.boundsRange_useDateMath
      let min = context.config.boundsRange_min
      let max = context.config.boundsRange_max
      F.extendOn(payload.config.key_data, {
        extended_bounds: {
          min: useDateMath
            ? dateMath.parse(min)
            : moment(new Date(min)).format('YYYY-MM-DD'),
          max: useDateMath
            ? dateMath.parse(max)
            : moment(new Date(max)).format('YYYY-MM-DD'),
        },
      })
    }

    return esTwoLevel(_.merge(payload, context), search).then(x => ({
      entries: x.results,
      minDate: x.min_date,
      maxDate: x.max_date,
    }))
  },
}
