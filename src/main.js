import GameCore from "./GameCore.js"

async function main() {
  try {
    const game = new GameCore()
    await game.init()
    await game.start()
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

main().finally(() => {
  process.exit(0)
})
