const {cardSuits, cardType, cardTypes} = require('./card')

const handType = {
  HighCard: 0,
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
  this.type = handType.HighCard
  this.threeOfAKind = undefined
  this.fourOfAKind = undefined
  this.pair1 = undefined
  this.pair2 = undefined
  this.highCard = -1
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

const numericSort = (a, b) => {
  return a - b
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

  flushCards.sort(numericSort)

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
    if (card.type > hand.highCard) {
      hand.highCard = card.type
    }
    hand.typeCount[card.type]++
    hand.suitCount[card.suit]++
  })

  hand.checkForPairs()
  hand.checkForFlush(cards)
  hand.checkForStraight()

  return hand
}

const getCardTypes = function (hand) {
  const cards = []
  hand.typeCount.map((value, index, array) => {
    for (var i = 0; i < value; i++) {
      cards.push(index)
    }
  })
  cards.sort(numericSort)
  return cards
}

const compareCardTypes = function (cards1, cards2) {
  // TODO: this should check isArray / length for both
  // TODO: this should only do best of 5
  for (let i = (cards1.length - 1); i >= 0; i--) {
    if (cards1[i] > cards2[i]) return 1
    if (cards1[i] < cards2[i]) return -1
  }
  return 0
}

const compareHand = function (hand1, hand2) {
  if (hand1.type > hand2.type) return 1
  if (hand1.type < hand2.type) return -1

  let cards1 = getCardTypes(hand1)
  let cards2 = getCardTypes(hand2)

  switch (hand1.type) {
    case handType.HighCard:
      if (hand1.highCard > hand2.highCard) return 1
      if (hand1.highCard < hand2.highCard) return -1
      break

    case handType.Pair:
      if (hand1.pair1 > hand2.pair1) return 1
      if (hand1.pair1 < hand2.pair1) return -1
      // compare the remaining cards (filter out pair)
      cards1 = cards1.filter((card) => ![hand1.pair1].includes(card))
      cards2 = cards2.filter((card) => ![hand2.pair1].includes(card))
      return compareCardTypes(cards1, cards2)

    case handType.TwoPair:
      if (hand1.pair1 > hand2.pair1) return 1
      if (hand1.pair1 < hand2.pair1) return -1
      if (hand1.pair2 > hand2.pair2) return 1
      if (hand1.pair2 < hand2.pair2) return -1
      // compare the remaining cards (filter out both pairs)
      cards1 = cards1.filter((card) => ![hand1.pair1, hand1.pair2].includes(card))
      cards2 = cards2.filter((card) => ![hand2.pair1, hand2.pair2].includes(card))
      return compareCardTypes(cards1, cards2)

    case handType.ThreeOfAKind:
      if (hand1.threeOfAKind > hand2.threeOfAKind) return 1
      if (hand1.threeOfAKind < hand2.threeOfAKind) return -1
      // compare the remaining cards (filter out the three of a kind)
      cards1 = cards1.filter((card) => ![hand1.fourOfAKind].includes(card))
      cards2 = cards2.filter((card) => ![hand2.fourOfAKind].includes(card))
      return compareCardTypes(cards1, cards2)

    case handType.Straight:
    case handType.StraightFlush:
      if (hand1.straightHighCard > hand2.straightHighCard) return 1
      if (hand1.straightHighCard < hand2.straightHighCard) return -1
      break

    case handType.Flush:
      if (hand1.flushHighCard > hand2.flushHighCard) return 1
      if (hand1.flushHighCard < hand2.flushHighCard) return -1
      break

    case handType.FullHouse:
      if (hand1.fullHouse3 > hand2.fullHouse3) return 1
      if (hand1.fullHouse3 < hand2.fullHouse3) return -1
      if (hand1.fullHouse2 > hand2.fullHouse2) return 1
      if (hand1.fullHouse2 < hand2.fullHouse2) return -1
      break

    case handType.FourOfAKind:
      if (hand1.fourOfAKind > hand2.fourOfAKind) return 1
      if (hand1.fourOfAKind < hand2.fourOfAKind) return -1
      // compare the remaining cards (filter out the four of a kind)
      cards1 = cards1.filter((card) => ![hand1.fourOfAKind].includes(card))
      cards2 = cards2.filter((card) => ![hand2.fourOfAKind].includes(card))
      return compareCardTypes(cards1, cards2)

    case handType.RoyalFlush:
      break
  }

  return 0
}

Hand.prototype.toString = function () {
  switch (this.type) {
    case handType.HighCard: return 'High Card'
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
  compareHand,
  handType
}
