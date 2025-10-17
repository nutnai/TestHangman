// Score class calculates the score based on attempts and time taken

class Score {
  #ATTEMPT_WEIGHT = 0.75
  #TIME_WEIGHT = 0.25
  #BASE_SCORE = 200
  #TIME_USE_PER_CHAR = 3 * 1000 // 3 seconds per character

  #score = null

  constructor() {
    this.score = 0
  }

  #getAttemptFactor(remainingAttempts, maxAttempts) {
    // Linear scaling based on remaining attempts
    const attemptFactor = remainingAttempts / maxAttempts
    return attemptFactor
  }

  #getTimeFactor(timeTaken, charDiffCountInWord) {
    const expectedTime = this.#TIME_USE_PER_CHAR * charDiffCountInWord
    const ratio = timeTaken / expectedTime
    let timeFactor = 0
    if (ratio <= 1) {
      // Use Parabolic decay before expected time
      timeFactor = 1 - 0.2 * Math.pow(ratio, 2)
    } else {
      // Use Exponential decay after expected time
      timeFactor = 0.8 * Math.exp(-0.5 * (ratio - 1))
    }
    timeFactor = Math.max(0, Math.min(1, timeFactor))
    return timeFactor
  }

  calculateScore(remainingAttempts, maxAttempts, timeTaken, charDiffCountInWord) {
    if (remainingAttempts <= 0) {
      this.#score = 0
      return this.#score
    }
    const attemptFactor = this.#getAttemptFactor(remainingAttempts, maxAttempts)
    const timeFactor = this.#getTimeFactor(timeTaken, charDiffCountInWord)
    const scoreFactor = attemptFactor * this.#ATTEMPT_WEIGHT + timeFactor * this.#TIME_WEIGHT
    this.#score = this.#BASE_SCORE * scoreFactor
    return this.#score
  }
}

export default Score
