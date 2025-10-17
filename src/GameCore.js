// GameCore class manages the main game loop and state transitions

import Words from "./Words.js"
import Interface from "./Interface.js"
import WordGuessing from "./WordGuessing.js"
import Hangman from "./Hangman.js"
import Timer from "./Timer.js"
import Score from "./Score.js"
import { checkSingleLowercaseAlphabet, checkUppercaseYesNo, checkIntegerInRange } from "./utils.js"

class GameCore {
  #MAX_ATTEMPTS = 6

  #interface = null
  #words = null
  #wordGuessing = null
  #hangman = null
  #timer = null
  #score = null

  #state = null
  #categoryName = null
  #annotation = null

  #getGameDetailsText() {
    let text = ""
    const hangmanImage = this.#hangman.getImage()
    text += hangmanImage + "\n\n"
    const wordDisplay = this.#wordGuessing.display()
    text += wordDisplay + "\n\n"
    text += `Category: ${this.#categoryName}\n`
    text += `Hint: ${this.#wordGuessing.hint}\n`
    text += `Incorrect Guessed Letters: ${this.#wordGuessing.incorrectGuessesLetters.join(", ")}\n\n`
    return text
  }

  async #state_EXIT() {}

  async #state_FINISH() {
    // Stop timer
    this.#timer.stop()

    // Show game details
    let text = this.#getGameDetailsText()
    this.#interface.console(text)

    // Show final results
    text = ""
    const elapsed = this.#timer.getElapsedTime()
    text += `The word was: ${this.#wordGuessing.originalWord}\n`
    text += `Time taken: ${(elapsed / 1000).toFixed(2)} seconds\n`
    text += `Total wrong attempts: ${this.#hangman.maxAttempts - this.#hangman.remainingAttempts}/${
      this.#hangman.maxAttempts
    }\n`
    const score = this.#score.calculateScore(
      this.#hangman.remainingAttempts,
      this.#hangman.maxAttempts,
      elapsed,
      this.#wordGuessing.charDiffCountInWord
    )
    text += `Your score: ${Math.round(score)}\n\n`
    this.#interface.console(text)

    // Ask to play again
    const question = "Do you want to play again? (Y/N): "
    const answer = await this.#interface.question(question)
    if (!checkUppercaseYesNo(answer)) {
      this.#annotation = "Invalid choice. Please enter 'Y' or 'N'."
      return
    }
    if (answer === "Y") {
      this.#state = "INIT"
    } else if (answer === "N") {
      this.#state = "EXIT"
    }
    return
  }

  async #state_PLAY() {
    // Show game details
    let text = this.#getGameDetailsText()
    this.#interface.console(text)

    // Ask for a letter
    const question = "Enter a letter to guess (a-z): "
    const answer = await this.#interface.question(question)
    const letter = answer.trim().toLowerCase()
    if (!checkSingleLowercaseAlphabet(letter)) {
      this.#annotation = "Please enter a single letter (a-z)."
      return
    }
    const result = this.#wordGuessing.guess(letter)
    if (result === -1) {
      // Already guessed
      this.#annotation = `You already guessed the letter '${letter}'. Try again.`
      return
    } else if (result === 0) {
      // Wrong guess
      this.#annotation = `The letter '${letter}' is not in the word.`
      this.#hangman.wrongAttempt()
    } else {
      // Correct guess
      this.#annotation = `Good job! The letter '${letter}' appears ${result} time(s) in the word.`
    }

    // Check for loss
    if (this.#hangman.remainingAttempts <= 0) {
      this.#annotation = "Game Over! You've been hanged!"
      this.#state = "FINISH"
    }
    // Check for win
    if (this.#wordGuessing.remainingUnrevealed === 0) {
      this.#annotation = "Congratulations! You've guessed the word!"
      this.#state = "FINISH"
    }
    return
  }

  async #state_INIT() {
    // Reset variables
    this.#categoryName = null
    this.#annotation = null
    this.#wordGuessing = null
    this.#hangman.reset()
    this.#timer.reset()

    // Show category selection
    let text = "Select a category:\n"
    const categories = Object.keys(this.#words.words)
    categories.forEach((category, index) => {
      text += `${index + 1}. ${category}\n`
    })
    this.#interface.console(text)

    // Ask for category choice
    const question = `Enter the number of your choice (1-${categories.length}): `
    const answer = await this.#interface.question(question)
    const choice = parseInt(answer)
    if (!checkIntegerInRange(choice, 1, categories.length)) {
      this.#annotation = "Invalid choice. Please try again."
      return
    } else {
      this.#categoryName = categories[choice - 1]
    }

    if (!this.#categoryName) {
      return
    }

    // Initialize game components
    const { word, hint } = this.#words.randomWord(this.#categoryName)
    this.#wordGuessing = new WordGuessing(word, hint)
    this.#timer.start()
    this.#state = "PLAY"
    return
  }

  async #loopGame() {
    let loopCounter = 0
    while (true) {
      this.#interface.clearConsole()
      if (this.#annotation) {
        this.#interface.console("-- " + this.#annotation + " --\n")
        this.#annotation = null
      }
      if (this.#state === "INIT") {
        await this.#state_INIT()
        loopCounter = 0
      } else if (this.#state === "PLAY") {
        await this.#state_PLAY()
        loopCounter = 0
      } else if (this.#state === "FINISH") {
        await this.#state_FINISH()
        loopCounter = 0
      } else if (this.#state === "EXIT") {
        await this.#state_EXIT()
        break
      }
      loopCounter += 1
      if (loopCounter > 100) {
        throw new Error("Infinite loop detected")
      }
    }
  }

  async #prepare() {
    this.#interface.clearConsole()
    this.#interface.console("<> This Recommends Terminal's height <>\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n")
    this.#interface.console("Welcome to the Word Guessing Game with Hangman!\n")
    this.#interface.console("Try to guess the word by suggesting letters.\n")
    this.#interface.console(`You have a maximum of ${this.#MAX_ATTEMPTS} wrong attempts.\n`)
    this.#interface.console(`\nDon't forget to resize your console!\n\n`)
    this.#interface.console("Good luck!\n")
    await this.#interface.question("Press Enter to start...")
  }

  constructor() {
    this.#state = "CREATED"
  }

  async init() {
    this.#state = "INIT"
    this.#timer = new Timer()
    this.#hangman = new Hangman(this.#MAX_ATTEMPTS)
    this.#score = new Score()
    this.#interface = new Interface()
    this.#words = new Words()
    await this.#words.init()
  }

  async start() {
    this.#state = "INIT"
    await this.#prepare()
    await this.#loopGame()
  }
}

export default GameCore
