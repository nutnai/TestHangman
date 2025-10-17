// Hangman class manages the hangman drawing based on remaining attempts

const stages = [
  `
    +---+
    |   |
    O   |
   /|\\  |
   / \\  |
        |
  =========`,
  `
    +---+
    |   |
    O   |
   /|\\  |
   /    |
        |
  =========`,
  `
    +---+
    |   |
    O   |
   /|\\  |
        |
        |
  =========`,
  `
    +---+
    |   |
    O   |
   /|   |
        |
        |
  =========`,
  `
    +---+
    |   |
    O   |
    |   |
        |
        |
  =========`,
  `
    +---+
    |   |
    O   |
        |
        |
        |
  =========`,
  `
    +---+
    |   |
        |
        |
        |
        |
  =========`,
]

class Hangman {
  remainingAttempts = null
  maxAttempts = null

  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts
    this.remainingAttempts = maxAttempts
  }

  reset() {
    this.remainingAttempts = this.maxAttempts
  }

  wrongAttempt() {
    this.remainingAttempts -= 1
  }

  getImage() {
    // Determine which stage to show based on remaining attempts
    const percent = this.remainingAttempts / this.maxAttempts
    const index = Math.round((stages.length - 1) * percent)
    return stages[index]
  }
}

export default Hangman
