// Timer class to track elapsed time between start and stop

class Timer {
  startTime = null
  endTime = null

  start() {
    if (this.startTime === null) {
      this.startTime = Date.now()
    }
  }

  stop() {
    if (this.endTime === null) {
      this.endTime = Date.now()
    }
  }

  reset() {
    this.startTime = null
    this.endTime = null
  }

  getElapsedTime() {
    if (this.startTime === null || this.endTime === null) {
      return 0
    }
    return this.endTime - this.startTime
  }
}

export default Timer
