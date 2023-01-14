import F from 'futil'
import _ from 'lodash/fp.js'
import { rollingRangeToDates, getDateIfValid } from '../../utils/dateUtil.js'

export let hasValue = ({ from, to, range }) =>
  range &&
  range !== 'allDates' &&
  ((range === 'exact' && (from || to)) || range !== 'exact')

export let filter = ({
  field,
  range,
  isDateTime,
  // NOTE: timezone is only used for rolling dates
  timezone = 'UTC',
  ...node
}) => {
  let { from, to } = _.includes(range, ['exact', 'allDates'])
    ? node
    : rollingRangeToDates(range, timezone)

  // If isDateTime we do not format but rely on the input to be in ES date & time format currently
  if (!isDateTime) {
    from = getDateIfValid(from)
    to = getDateIfValid(to)
  }

  return {
    range: {
      [field]: F.compactObject({
        gte: from,
        lte: to,
        format: 'date_optional_time',
      }),
    },
  }
}
