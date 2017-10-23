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

const hand = function () {
  this.type = -1
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
}

hand.prototype.clear = function () {
  hand()
}

hand.prototype.checkPairs = function (typeCount) {
  for (let i = 0; i < cardTypes.length; i++) {
    switch (typeCount[i]) {
      case 4:
        this.type = handType.FourOfAKind
        this.fourOfAKind = i
        break

      case 3:
        if (this.type === handType.Pair) {
          this.type = handType.FullHouse
          this.FullHouse3 = i
          this.FullHouse2 = this.Pair1
        } else if (this.type === handType.TwoPair) {
          this.type = handType.FullHouse
          this.FullHouse3 = i
          if (this.Pair1 > this.Pair2) {
            this.FullHouse2 = this.Pair1
          } else {
            this.FullHouse2 = this.Pair2
          }
        } else if (this.type < handType.ThreeOfAKind) {
          this.type = handType.ThreeOfAKind
          this.ThreeOfAKind = i
        } else if (this.type === handType.ThreeOfAKind) {
          // full house
          this.type = handType.FullHouse
          if (i > this.ThreeOfAKind) {
            this.FullHouse3 = i
            this.FullHouse2 = this.ThreeOfAKind
          } else {
            this.FullHouse3 = this.ThreeOfAKind
            this.FullHouse2 = i
          }
        }
        break

      case 2:
        if (this.type === handType.FullHouse) {
          // check the 2nd pair
          if (i > this.FullHouse2) {
            this.FullHouse2 = i
          }
        }
        if (this.type === handType.ThreeOfAKind) {
          this.type = handType.FullHouse
          this.FullHouse2 = i
        } else if (this.type === handType.TwoPair) {
          if (i > this.Pair1) {
            this.Pair2 = this.Pair1
            this.Pair1 = i
          } else if (i > this.Pair2) {
            this.Pair2 = i
          }
        } else if (this.type === handType.Pair) {
          this.type = handType.TwoPair

          if (this.Pair1 > i) {
            this.Pair2 = i
          } else {
            this.Pair2 = this.Pair1
            this.Pair1 = i
          }
        } else {
          if (this.type < handType.Pair) {
            this.type = handType.Pair
            this.Pair1 = i
          }
        }
        break
    }
  }
}

hand.prototype.evaluateHand = function (cards) {
  // TODO: make this work with either 5 OR 7
  // const totalCards = 7

  // non-flush card count
  const highCard = []
  const typeCount = []
  const suitCount = []

  cardTypes.forEach((type) => typeCount.push(0))
  cardSuits.forEach((suit) => suitCount.push(0))

  this.clear()

  cards.forEach((card) => {
    highCard.push(card)
    typeCount[card.type]++
    suitCount[card.suit]++
  })

  this.checkPairs(typeCount)

  // look for a straight
  let cardsInaRow = 0
  let straightHigh = -1
  let straight = false
  for (var i = 0; i < cardTypes.length; i++) {
    if (typeCount[i] > 0) {
      if (++cardsInaRow >= 5) {
        straight = true
        straightHigh = i
      } else {
        // Ace exception in A,2,3,4,5
        if ((cardsInaRow === 4) && (i === cardType.Five)) {
          if (typeCount[cardType.Ace] > 0) {
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
    this.StraightHighCard = straightHigh
  }

  // check for same suit
  let flush = false
  let flushtype = 0

  for (i = 0; i < suitCount.length; i++) {
    if (suitCount[i] >= 5) {
      flush = true
      flushtype = i
      break
    }
  }

  if (flush && (this.type < handType.Flush)) {
    this.type = handType.Flush
    this.FlushSuit = flushtype
    // find the flush high card
    cards.forEach((card) => {
      if (card.suit === flushtype) {
        if (card.type > this.FlushHighCard) {
          this.FlushHighCard = card.type
        }
      }
    })
  }

  // check for straight flush & royal flush
  if (flush && straight) {
  //   let count3 = []
  //   // [cardTypes.length * cardSuits.length]

    // gather info; Suit count per card type
  //   for (i = 0; i < totalCards; i++) {
  //     count3[(int)p[i].Type, (int)p[i].Suit]++
  //   }

    // check for royal / straight flush
    cardsInaRow = 0
    straightHigh = -1
    let straightflush = false
    for (i = 0; i < cardTypes.length; i++) {
  //     //remember.. the person can have a straight flush
  //     //& a straight with a high card at the same time
  //     if (count3[i,(int)flushtype] > 0) {
  //       if (++cardsInaRow >= 5) {
  //         straightflush = true
  //         straightHigh = i
  //       } else {
  //         // ace exception in A,2,3,4,5
  //         if((cardsInaRow === 4) && (i === cardType.Five)){
  //           if(typeCount[cardType.Ace] > 0){
  //             cardsInaRow++
  //             straightflush = true
  //             straightHigh = i
  //           }
  //         }
  //       }
  //     } else {
  //       cardsInaRow = 0
  //     }
    }

    if (straightflush) {
      this.type = handType.StraightFlush
      this.StraightHighCard = straightHigh

      // royal flush
      if (this.StraightHighCard === cardType.Ace) {
        this.type = handType.RoyalFlush
      }
    }
  }
}

hand.prototype.toString = function () {
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

module.exports = hand
