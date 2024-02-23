function generateRandomId() {
    // Generate a random number between  0 (inclusive) and  1 (exclusive)
    // Multiply by  100000 to get a number between  0 and  99999
    // Use Math.floor() to round down to the nearest whole number
    // Add  10000 to ensure the result is always a  5-digit number
    const randomNumber = Math.floor(Math.random() *  100000) +  10000;
    return randomNumber;
  }

  module.exports = generateRandomId
  