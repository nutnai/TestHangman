export function checkSingleLowercaseAlphabet(input) {
  return /^[a-z]$/.test(input)
}

export function checkUppercaseYesNo(input) {
  return /^(Y|N)$/.test(input)
}

export function checkIntegerInRange(input, min, max) {
  const num = Number(input)
  return Number.isInteger(num) && num >= min && num <= max
}
