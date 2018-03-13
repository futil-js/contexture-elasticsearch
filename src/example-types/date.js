let _ = require('lodash/fp')
let moment = require('moment')
let datemath = require('@elastic/datemath')

module.exports = {
  hasValue: context => context.from || context.to,
  filter(context) {
    let from = context.from
    let to = context.to
    let format = 'YYYY-MM-DD'

    if (context.useDateMath) {
      if (from === 'thisQuarter') {
        from = moment()
          .quarter(moment().quarter())
          .startOf('quarter')
          .format(format)
        to = `${from}||+3M-1d/d`
      } else if (from === 'lastQuarter') {
        from = moment()
          .quarter(moment().quarter() - 1)
          .startOf('quarter')
          .format(format)
        to = `${from}||+3M-1d/d`
      } else if (from === 'nextQuarter') {
        from = moment()
          .quarter(moment().quarter() + 1)
          .startOf('quarter')
          .format(format)
        to = `${from}||+3M-1d/d`
      }
      from = datemath.parse(from)
      to = datemath.parse(to)
    }
    let gte = from
    let lte = to

    let getDateIfValid = x => {
      let isValid = moment.utc(new Date(x)).isValid();
      if (isValid) {
        return context.isoFormat ? moment.utc(new Date(x)).toISOString() : moment.utc(new Date(x)).format(format)
      }
      return false
    }

    if (!context.useRaw) {
      gte = getDateIfValid(from)
      lte = getDateIfValid(to)
    }
    return {
      range: {
        [context.field]: _.pickBy(_.identity, {
          gte,
          lte,
          // Only force date formatting on the date range filter.
          format: 'dateOptionalTime',
        }),
      },
    }
  },
}
