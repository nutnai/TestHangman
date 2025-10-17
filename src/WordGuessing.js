// WordGuessing class manages the word to be guessed and player guesses

class WordGuessing {
  originalWord = null
  hint = null
  letters = null
  guessedLetters = null
  incorrectGuessesLetters = null
  remainingUnrevealed = null
  charDiffInWord = null
  charDiffCountInWord = null

  constructor(word, hint) {
    this.originalWord = word
    this.hint = hint
    this.letters = []
    this.guessedLetters = []
    this.incorrectGuessesLetters = []
    this.remainingUnrevealed = 0
    this.charDiffInWord = [
      ...new Set(
        this.originalWord
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .split("")
      ),
    ]
    this.charDiffCountInWord = this.charDiffInWord.length

    this.#init()
  }

  #init() {
    for (const char of this.originalWord) {
      if (char.match(/[a-zA-Z]/)) {
        this.letters.push("_")
        this.remainingUnrevealed += 1
      } else {
        this.letters.push(char)
      }
    }
  }

  display() {
    return this.letters.join(" ")
  }

  guess(letter) {
    letter = letter.toLowerCase()
    if (this.guessedLetters.includes(letter)) {
      return -1 // Letter has already been guessed
    }

    this.guessedLetters.push(letter)
    this.guessedLetters.sort()

    let found = 0
    for (let i = 0; i < this.originalWord.length; i++) {
      if (this.letters[i] === "_" && this.originalWord[i].toLowerCase() === letter) {
        this.letters[i] = this.originalWord[i] // Reveal the letter
        found += 1
        this.remainingUnrevealed -= 1
      }
    }
    if (found === 0) {
      this.incorrectGuessesLetters.push(letter)
      this.incorrectGuessesLetters.sort()
    }
    return found
  }
}

export default WordGuessing
