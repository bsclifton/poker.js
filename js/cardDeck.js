const {cardSuits, cardTypes, Card} = require('./card')
const randoms = new Set()

const getUniqueRandom = () => {
  let random = Math.random()
  while (randoms.has(random)) {
    random = Math.random()
  }
  randoms.add(random)
  return random
}

const cardDeck = {
  create: () => {
    const cards = []
    randoms.clear()
    for (let index = 0; index < (cardSuits.length * cardTypes.length); index++) {
      cards.push(new Card(index, getUniqueRandom))
    }
    return cards
  },
  shuffle: () => {
    const cards = cardDeck.create()

    cards.sort((a, b) => {
      if (a.randomIndex < b.randomIndex) {
        return -1
      }
      if (a.randomIndex > b.randomIndex) {
        return 1
      }
      return 0
    })

    return cards
  }
}

module.exports = cardDeck
