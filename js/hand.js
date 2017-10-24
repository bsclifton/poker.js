const {cardSuits, cardType, cardTypes} = require('./card')

const handType = {
  Highcard: 0,
  Pair: 1,
  TwoPair: 2,
  ThreeOfAKind: 3,
  Straight: 4,
  Flush: 5,
  FullHouse: 6,
  FourOfAKind: 7,
  StraightFlush: 8,
  RoyalFlush: 9
}

const Hand = function () {
  this.type = handType.Highcard
  this.threeOfAKind = undefined
  this.fourOfAKind = undefined
  this.pair1 = undefined
  this.pair2 = undefined
  this.highCard = undefined
  this.straightHighCard = undefined
  this.flushHighCard = undefined
  this.fullHouse3 = undefined
  this.fullHouse2 = undefined
  this.flushSuit = undefined
  this.typeCount = []
  this.suitCount = []
  cardTypes.forEach((type) => this.typeCount.push(0))
  cardSuits.forEach((suit) => this.suitCount.push(0))
}

Hand.prototype.clear = function () {
  Hand()
}

Hand.prototype.checkForFlush = function (cards) {
  for (var i = 0; i < this.suitCount.length; i++) {
    if (this.suitCount[i] >= 5) {
      this.flushSuit = i
      break
    }
  }

  if ((typeof this.flushSuit !== 'number') || (this.type > handType.Flush)) {
    return
  }

  this.type = handType.Flush

  const flushCards = []
  cards.forEach((card) => {
    if (card.suit === this.flushSuit) {
      flushCards.push(card.type)
      if (card.type > this.flushHighCard) {
        this.flushHighCard = card.type
      }
    }
  })

  flushCards.sort((a, b) => {
    return a - b
  })

  for (i = 1, this.straightHighCard = flushCards[0]; i < flushCards.length; i++) {
    if (flushCards[i] !== (this.straightHighCard + 1)) {
      return
    }
    this.straightHighCard = flushCards[i]
  }

  this.type = (this.straightHighCard === cardType.Ace)
    ? handType.RoyalFlush
    : handType.StraightFlush
}

Hand.prototype.checkForStraight = function () {
  let cardsInaRow = 0
  let straightHigh = -1
  let straight = false

  for (let i = 0; i < this.typeCount.length; i++) {
    if (this.typeCount[i] > 0) {
      if (++cardsInaRow >= 5) {
        straight = true
        straightHigh = i
      } else {
        // Ace exception in A,2,3,4,5
        if ((cardsInaRow === 4) && (i === cardType.Five)) {
          if (this.typeCount[cardType.Ace] > 0) {
            cardsInaRow++
            straight = true
            // high card is 5, not ace
            straightHigh = i
          }
        }
      }
    } else {
      cardsInaRow = 0
    }
  }

  if (straight && (this.type < handType.Straight)) {
    this.type = handType.Straight
    this.straightHighCard = straightHigh
  }
}

Hand.prototype.checkForPairs = function () {
  for (let i = 0; i < this.typeCount.length; i++) {
    switch (this.typeCount[i]) {
      case 4:
        this.type = handType.FourOfAKind
        this.fourOfAKind = i
        break

      case 3:
        if (this.type === handType.Pair) {
          this.type = handType.FullHouse
          this.fullHouse3 = i
          this.fullHouse2 = this.pair1
        } else if (this.type === handType.TwoPair) {
          this.type = handType.FullHouse
          this.fullHouse3 = i
          if (this.pair1 > this.pair2) {
            this.fullHouse2 = this.pair1
          } else {
            this.fullHouse2 = this.pair2
          }
        } else if (this.type < handType.ThreeOfAKind) {
          this.type = handType.ThreeOfAKind
          this.threeOfAKind = i
        } else if (this.type === handType.ThreeOfAKind) {
          // full house
          this.type = handType.FullHouse
          if (i > this.threeOfAKind) {
            this.fullHouse3 = i
            this.fullHouse2 = this.threeOfAKind
          } else {
            this.fullHouse3 = this.threeOfAKind
            this.fullHouse2 = i
          }
        }
        break

      case 2:
        if (this.type === handType.FullHouse) {
          // check the 2nd pair
          if (i > this.fullHouse2) {
            this.fullHouse2 = i
          }
        }
        if (this.type === handType.ThreeOfAKind) {
          this.type = handType.FullHouse
          this.fullHouse2 = i
        } else if (this.type === handType.TwoPair) {
          if (i > this.pair1) {
            this.pair2 = this.pair1
            this.pair1 = i
          } else if (i > this.pair2) {
            this.pair2 = i
          }
        } else if (this.type === handType.Pair) {
          this.type = handType.TwoPair

          if (this.pair1 > i) {
            this.pair2 = i
          } else {
            this.pair2 = this.pair1
            this.pair1 = i
          }
        } else {
          if (this.type < handType.Pair) {
            this.type = handType.Pair
            this.pair1 = i
          }
        }
        break
    }
  }
}

const evaluateHand = function (cards) {
  const hand = new Hand()

  cards.forEach((card) => {
    hand.typeCount[card.type]++
    hand.suitCount[card.suit]++
  })

  hand.checkForPairs()
  hand.checkForFlush(cards)
  hand.checkForStraight()

  return hand
}

Hand.prototype.toString = function () {
  switch (this.type) {
    case handType.Highcard: return 'High Card'
    case handType.Pair: return 'Pair'
    case handType.TwoPair: return 'Two Pairs'
    case handType.ThreeOfAKind: return 'Three of a Kind'
    case handType.Straight: return 'Straight'
    case handType.Flush: return 'Flush'
    case handType.FullHouse: return 'Full House'
    case handType.FourOfAKind:return 'Four of a Kind'
    case handType.StraightFlush: return 'Straight Flush'
    case handType.RoyalFlush: return 'Royal Flush'
  }
}

module.exports = {
  evaluateHand,
  Hand,
  handType
}
