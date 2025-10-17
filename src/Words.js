// Words class loads word categories and provides random words

import fs from "fs"

class Words {
  #FOLDER_PATH = "./words"

  words = null

  constructor() {
    this.words = {}
  }

  async init() {
    const folderPath = this.#FOLDER_PATH
    const files = await fs.promises.readdir(folderPath)
    for (const file of files) {
      if (file.endsWith(".json")) {
        const categoryName = file.slice(0, -5) // Remove the .json extension
        const filePath = `${folderPath}/${file}`
        const data = await fs.promises.readFile(filePath, "utf-8")
        this.words[categoryName] = JSON.parse(data)
      }
    }
  }

  randomWord(category) {
    const wordsInCategory = this.words[category]
    if (!wordsInCategory || wordsInCategory.length === 0) {
      throw new Error(`No words found for category: ${category}`)
    }
    const randomIndex = Math.floor(Math.random() * wordsInCategory.length)
    const selectedWord = wordsInCategory[randomIndex]
    return { word: selectedWord.word, hint: selectedWord.hint }
  }
}

export default Words
