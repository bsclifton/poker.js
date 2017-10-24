/* global describe, it */
const assert = require('assert')
const {evaluateHand, handType} = require('../js/hand')
const {cardSuit, cardType} = require('../js/card')

describe('hand', function () {
  describe('evaluateHand', function () {
    describe('with a pair', function () {
      it('detects a pair', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Two}
        ])
        assert(h.type === handType.Pair &&
          h.pair1 === cardType.Two)
      })
    })

    describe('with two pairs', function () {
      it('detects two pairs', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Three},
          {suit: cardSuit.Clubs, type: cardType.Three}
        ])
        assert(h.type === handType.TwoPair &&
          h.pair1 === cardType.Three &&
          h.pair2 === cardType.Two)
      })

      it('returns the highest two pairs', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Three},
          {suit: cardSuit.Clubs, type: cardType.Three},
          {suit: cardSuit.Spades, type: cardType.Four},
          {suit: cardSuit.Clubs, type: cardType.Four}
        ])
        assert(h.type === handType.TwoPair &&
          h.pair1 === cardType.Four &&
          h.pair2 === cardType.Three)
      })
    })

    describe('with three of a kind', function () {
      it('detects three of a kind', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Two},
          {suit: cardSuit.Hearts, type: cardType.Two}
        ])
        assert(h.type === handType.ThreeOfAKind &&
          h.threeOfAKind === cardType.Two)
      })
    })

    describe('with four of a kind', function () {
      it('detects four of a kind', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Two},
          {suit: cardSuit.Hearts, type: cardType.Two},
          {suit: cardSuit.Diamonds, type: cardType.Two}
        ])
        assert(h.type === handType.FourOfAKind &&
          h.fourOfAKind === cardType.Two)
      })
    })

    describe('with a full house', function () {
      it('detects a full house', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Three},
          {suit: cardSuit.Clubs, type: cardType.Three},
          {suit: cardSuit.Hearts, type: cardType.Three}
        ])
        assert(h.type === handType.FullHouse &&
          h.fullHouse3 === cardType.Three &&
          h.fullHouse2 === cardType.Two)
      })
    })

    describe('with a flush', function () {
      it('detects a flush', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Four},
          {suit: cardSuit.Spades, type: cardType.Six},
          {suit: cardSuit.Spades, type: cardType.Eight},
          {suit: cardSuit.Spades, type: cardType.Ten}
        ])
        assert(h.type === handType.Flush)
      })

      it('detects a straight flush', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Three},
          {suit: cardSuit.Spades, type: cardType.Four},
          {suit: cardSuit.Spades, type: cardType.Five},
          {suit: cardSuit.Spades, type: cardType.Six}
        ])
        assert(h.type === handType.StraightFlush)
      })

      it('detects a straight flush with Ace as 1', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Ace},
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Three},
          {suit: cardSuit.Spades, type: cardType.Four},
          {suit: cardSuit.Spades, type: cardType.Five}
        ])
        assert(h.type === handType.StraightFlush)
      })

      it('detects a royal flush', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Ten},
          {suit: cardSuit.Spades, type: cardType.Jack},
          {suit: cardSuit.Spades, type: cardType.Queen},
          {suit: cardSuit.Spades, type: cardType.King},
          {suit: cardSuit.Spades, type: cardType.Ace}
        ])
        assert(h.type === handType.RoyalFlush)
      })
    })

    describe('with a straight', function () {
      it('detects a straight', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Two},
          {suit: cardSuit.Clubs, type: cardType.Three},
          {suit: cardSuit.Spades, type: cardType.Four},
          {suit: cardSuit.Clubs, type: cardType.Five},
          {suit: cardSuit.Spades, type: cardType.Six}
        ])
        assert(h.type === handType.Straight)
      })

      it('detects a straight with Ace as 1', function () {
        const h = evaluateHand([
          {suit: cardSuit.Spades, type: cardType.Ace},
          {suit: cardSuit.Clubs, type: cardType.Two},
          {suit: cardSuit.Spades, type: cardType.Three},
          {suit: cardSuit.Clubs, type: cardType.Four},
          {suit: cardSuit.Spades, type: cardType.Five}
        ])
        assert(h.type === handType.Straight)
      })
    })
  })
})
