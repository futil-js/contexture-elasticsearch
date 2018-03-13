let date = require('../../src/example-types/date')
let moment = require('moment')
let datemath = require('@elastic/datemath')
let { expect } = require('chai')

describe('date/filter', () => {
  it('should handle from', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: '2016-04-25',
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: '2016-04-25',
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle to', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        to: '2016-04-25',
      })
    ).to.deep.equal({
      range: {
        test: {
          lte: '2016-04-25',
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle from and to', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: '2015-04-25',
        to: '2016-04-25',
      })
    ).to.deep.equal({
      range: {
        test: {
          lte: '2016-04-25',
          gte: '2015-04-25',
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle custom dateMath', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: '2015-04-25',
        to: 'now+1M',
        useDateMath: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          lte: moment.utc(datemath.parse('now+1M')).format('YYYY-MM-DD'),
          gte: '2015-04-25',
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle dateMath thisQuarter', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: 'thisQuarter',
        useDateMath: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: moment()
            .quarter(moment().quarter())
            .startOf('quarter')
            .format('YYYY-MM-DD'),
          lte: moment
            .utc(
              datemath.parse(
                `${moment()
                  .quarter(moment().quarter())
                  .startOf('quarter')
                  .format('YYYY-MM-DD')}||+3M-1d/d`
              )
            )
            .format('YYYY-MM-DD'),
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle dateMath lastQuarter', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: 'lastQuarter',
        useDateMath: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: moment()
            .quarter(moment().quarter() - 1)
            .startOf('quarter')
            .format('YYYY-MM-DD'),
          lte: moment
            .utc(
              datemath.parse(
                `${moment()
                  .quarter(moment().quarter() - 1)
                  .startOf('quarter')
                  .format('YYYY-MM-DD')}||+3M-1d/d`
              )
            )
            .format('YYYY-MM-DD'),
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle dateMath nextQuarter', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: 'nextQuarter',
        useDateMath: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: moment()
            .quarter(moment().quarter() + 1)
            .startOf('quarter')
            .format('YYYY-MM-DD'),
          lte: moment
            .utc(
              datemath.parse(
                `${moment()
                  .quarter(moment().quarter() + 1)
                  .startOf('quarter')
                  .format('YYYY-MM-DD')}||+3M-1d/d`
              )
            )
            .format('YYYY-MM-DD'),
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle useRaw', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: 'a very specific date',
        to: 'another very specific date',
        useRaw: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: 'a very specific date',
          lte: 'another very specific date',
          format: 'dateOptionalTime',
        },
      },
    })
  })
  it('should handle isoFormat', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        from: '03/03/03 10:23',
        to: '03/03/03 11:53',
        isoFormat: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: '2003-03-03T15:23:00.000Z',
          lte: '2003-03-03T16:53:00.000Z',
          format: 'dateOptionalTime',
        },
      },
    })
  })
})
