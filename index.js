const { GraphQLScalarType } = require('graphql')
const { Kind: { INT } } = require('graphql/language/kinds')

const MAX_INT = Number.MAX_SAFE_INTEGER
const MIN_INT = Number.MIN_SAFE_INTEGER
const invalidValueMessage = 'BigInt cannot represent non 53-bit signed integer value'
const invalidTypeMessage = 'BigInt cannot represent non 53-bit signed integer type'

module.exports = new GraphQLScalarType({
  name: 'BigInt',
  description:
    'The `BigInt` scalar type represents non-fractional signed whole numeric ' +
    'values. BigInt can represent values between -(2^53) + 1 and 2^53 - 1. ',
  serialize: coerceBigInt,
  parseValue: coerceBigInt,
  parseLiteral(ast) {
    if (ast.kind !== INT) {
      throw new TypeError(`${invalidTypeMessage}: ${ast.kind}`)
    }
    const num = parseInt(ast.value, 10)
    if (num > MAX_INT || num < MIN_INT) {
      throw new TypeError(`${invalidValueMessage}: ${ast.value}`)
    }
    return num
  }
})

function coerceBigInt(value) {
  if (value === '') {
    throw new TypeError(`${invalidValueMessage}: (empty string)`)
  }
  const num = Number(value)
  if (num !== num || num > MAX_INT || num < MIN_INT) {
    throw new TypeError(`${invalidValueMessage}: ${value}`)
  }
  const int = Math.floor(num)
  if (int !== num) {
    throw new TypeError(`${invalidValueMessage}: ${value}`)
  }
  return int
}

