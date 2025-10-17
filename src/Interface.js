// Interface class handles user input and output via the console

import readline from "readline"

class Interface {
  #rl = null

  constructor() {
    this.#rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  clearConsole() {
    process.stdout.write("\x1Bc")
  }

  console(text) {
    console.log(text)
  }

  async question(text) {
    return await new Promise((resolve) => {
      this.#rl.question(text, (answer) => {
        answer = answer.trim()
        resolve(answer)
      })
    })
  }
}

export default Interface
