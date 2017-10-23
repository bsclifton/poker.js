const cardSuit = {
  Spades: 0,
  Clubs: 1,
  Hearts: 2,
  Diamonds: 3
}

const cardSuits = Object.keys(cardSuit)

const cardType = {
  Two: 0,
  Three: 1,
  Four: 2,
  Five: 3,
  Six: 4,
  Seven: 5,
  Eight: 6,
  Nine: 7,
  Ten: 8,
  Jack: 9,
  Queen: 10,
  King: 11,
  Ace: 12
}

const cardTypes = Object.keys(cardType)

const card = function (index, getUniqueRandom) {
  this.suit = Math.floor(index / cardTypes.length) % cardSuits.length
  this.type = index % cardTypes.length
  this.deckIndex = index
  this.randomIndex = typeof getUniqueRandom === 'function'
    ? getUniqueRandom()
    : Math.random()
}

card.prototype.toString = function () {
  return (cardTypes[this.type] + ' of ' + cardSuits[this.suit]) || ''
}

module.exports = {
  card,
  cardSuit,
  cardSuits,
  cardType,
  cardTypes
}
