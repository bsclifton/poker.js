/* global describe, it, before */
const assert = require('assert')
const {evaluateHand, compareHand, handType} = require('../js/hand')
const {cardSuit, cardType} = require('../js/card')

describe('hand', function () {
  let highCard
  let pair
  let twoPair
  let threeOfAKind
  let fourOfAKind
  let royalFlush

  before(function () {
    highCard = evaluateHand([
      {suit: cardSuit.Spades, type: cardType.Eight},
      {suit: cardSuit.Clubs, type: cardType.Six},
      {suit: cardSuit.Hearts, type: cardType.Four},
      {suit: cardSuit.Diamonds, type: cardType.Two}
    ])
    pair = evaluateHand([
      {suit: cardSuit.Spades, type: cardType.Two},
      {suit: cardSuit.Clubs, type: cardType.Two}
    ])
    twoPair = evaluateHand([
      {suit: cardSuit.Spades, type: cardType.Two},
      {suit: cardSuit.Clubs, type: cardType.Two},
      {suit: cardSuit.Spades, type: cardType.Three},
      {suit: cardSuit.Clubs, type: cardType.Three}
    ])
    threeOfAKind = evaluateHand([
      {suit: cardSuit.Spades, type: cardType.Two},
      {suit: cardSuit.Clubs, type: cardType.Two},
      {suit: cardSuit.Hearts, type: cardType.Two}
    ])
    fourOfAKind = evaluateHand([
      {suit: cardSuit.Spades, type: cardType.Two},
      {suit: cardSuit.Clubs, type: cardType.Two},
      {suit: cardSuit.Hearts, type: cardType.Two},
      {suit: cardSuit.Diamonds, type: cardType.Two}
    ])
    royalFlush = evaluateHand([
      {suit: cardSuit.Spades, type: cardType.Ten},
      {suit: cardSuit.Spades, type: cardType.Jack},
      {suit: cardSuit.Spades, type: cardType.Queen},
      {suit: cardSuit.Spades, type: cardType.King},
      {suit: cardSuit.Spades, type: cardType.Ace}
    ])
  })

  describe('handType', function () {
    it('assigns Pair a higher value than HighCard', function () {
      assert(handType.Pair > handType.HighCard)
    })
    it('assigns TwoPair a higher value than Pair', function () {
      assert(handType.TwoPair > handType.Pair)
    })
    it('assigns ThreeOfAKind a higher value than TwoPair', function () {
      assert(handType.ThreeOfAKind > handType.TwoPair)
    })
    it('assigns Straight a higher value than ThreeOfAKind', function () {
      assert(handType.Straight > handType.ThreeOfAKind)
    })
    it('assigns Flush a higher value than Straight', function () {
      assert(handType.Flush > handType.Straight)
    })
    it('assigns FullHouse a higher value than Flush', function () {
      assert(handType.FullHouse > handType.Flush)
    })
    it('assigns FourOfAKind a higher value than FullHouse', function () {
      assert(handType.FourOfAKind > handType.FullHouse)
    })
    it('assigns StraightFlush a higher value than FourOfAKind', function () {
      assert(handType.StraightFlush > handType.FourOfAKind)
    })
    it('assigns RoyalFlush a higher value than StraightFlush', function () {
      assert(handType.RoyalFlush > handType.StraightFlush)
    })
  })

  describe('evaluateHand', function () {
    describe('with high card', function () {
      it('detects a high card', function () {
        assert(highCard.type === handType.HighCard &&
          highCard.highCard === cardType.Eight)
      })
    })

    describe('with a pair', function () {
      it('detects a pair', function () {
        assert(pair.type === handType.Pair &&
          pair.pair1 === cardType.Two)
      })
    })

    describe('with two pairs', function () {
      it('detects two pairs', function () {
        assert(twoPair.type === handType.TwoPair &&
          twoPair.pair1 === cardType.Three &&
          twoPair.pair2 === cardType.Two)
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
        assert(threeOfAKind.type === handType.ThreeOfAKind &&
          threeOfAKind.threeOfAKind === cardType.Two)
      })
    })

    describe('with four of a kind', function () {
      it('detects four of a kind', function () {
        assert(fourOfAKind.type === handType.FourOfAKind &&
          fourOfAKind.fourOfAKind === cardType.Two)
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
        assert(royalFlush.type === handType.RoyalFlush)
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

  describe('compareHand', function () {
    it('returns 1 when hand1 is better than hand2', function () {
      assert.equal(compareHand(twoPair, pair), 1)
    })
    it('returns -1 when hand1 is worse than hand2', function () {
      assert.equal(compareHand(pair, twoPair), -1)
    })

    describe('when hands are equal', function () {
      describe('high card', function () {
        let highCard2

        before(function () {
          highCard2 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Seven},
            {suit: cardSuit.Clubs, type: cardType.Six},
            {suit: cardSuit.Hearts, type: cardType.Four},
            {suit: cardSuit.Diamonds, type: cardType.Two}
          ])
        })

        it('returns 1 when hand1 has higher pair than hand2', function () {
          assert.equal(compareHand(highCard, highCard2), 1)
        })
        it('returns -1 when hand1 has lower pair than hand2', function () {
          assert.equal(compareHand(highCard2, highCard), -1)
        })
        it('returns 0 when hands are identical', function () {
          assert.equal(compareHand(highCard, highCard), 0)
        })
      })

      describe('pair', function () {
        let pair2, pair3

        before(function () {
          pair2 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Hearts, type: cardType.Ten}
          ])
          pair3 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Hearts, type: cardType.Ace}
          ])
        })

        it('returns 1 when hand1 has higher pair than hand2', function () {
          assert.equal(compareHand(pair2, pair), 1)
        })
        it('returns -1 when hand1 has lower pair than hand2', function () {
          assert.equal(compareHand(pair, pair2), -1)
        })

        describe('when pair is equal', function () {
          it('returns 1 when high card in hand1 is better than hand 2', function () {
            assert.equal(compareHand(pair3, pair2), 1)
          })
          it('returns -1 when high card in hand1 is worse than hand 2', function () {
            assert.equal(compareHand(pair2, pair3), -1)
          })
          it('returns 0 when cards are identical', function () {
            assert.equal(compareHand(pair, pair), 0)
          })
        })
      })

      describe('two pair', function () {
        let twoPair2, twoPair3, twoPair4, twoPair5

        before(function () {
          twoPair2 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Four},
            {suit: cardSuit.Clubs, type: cardType.Four}
          ])
          twoPair3 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Two},
            {suit: cardSuit.Clubs, type: cardType.Two},
            {suit: cardSuit.Spades, type: cardType.Four},
            {suit: cardSuit.Clubs, type: cardType.Four}
          ])
          twoPair4 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Four},
            {suit: cardSuit.Clubs, type: cardType.Four},
            {suit: cardSuit.Hearts, type: cardType.Ten}
          ])
          twoPair5 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Four},
            {suit: cardSuit.Clubs, type: cardType.Four},
            {suit: cardSuit.Hearts, type: cardType.Ace}
          ])
        })

        it('returns 1 when the higher pair for hand1 is better than the higher pair in hand2', function () {
          assert.equal(compareHand(twoPair2, twoPair), 1)
        })
        it('returns -1 when the higher pair for hand1 is worse than the higher pair in hand2', function () {
          assert.equal(compareHand(twoPair, twoPair2), -1)
        })

        describe('when higher pairs are equal', function () {
          it('returns 1 when the lower pair for hand1 is better than the lower pair in hand2', function () {
            assert.equal(compareHand(twoPair2, twoPair3), 1)
          })
          it('returns -1 when the lower pair for hand1 is worse than the lower pair in hand2', function () {
            assert.equal(compareHand(twoPair3, twoPair2), -1)
          })
        })

        describe('when both pairs are equal', function () {
          it('returns 1 when high card in hand1 is better than hand 2', function () {
            assert.equal(compareHand(twoPair5, twoPair4), 1)
          })
          it('returns -1 when high card in hand1 is worse than hand 2', function () {
            assert.equal(compareHand(twoPair4, twoPair5), -1)
          })
          it('returns 0 when cards are identical', function () {
            assert.equal(compareHand(twoPair, twoPair), 0)
          })
        })
      })

      describe('three of a kind', function () {
        let threeOfAKind2, threeOfAKind3

        before(function () {
          threeOfAKind2 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Hearts, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Ten},
            {suit: cardSuit.Clubs, type: cardType.Nine}
          ])
          threeOfAKind3 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Hearts, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Ace},
            {suit: cardSuit.Clubs, type: cardType.King}
          ])
        })

        it('returns 1 when hand1 has higher four of a kind than hand2', function () {
          assert.equal(compareHand(threeOfAKind2, threeOfAKind), 1)
        })
        it('returns -1 when hand1 has lower four of a kind than hand2', function () {
          assert.equal(compareHand(threeOfAKind, threeOfAKind2), -1)
        })

        describe('when three of a kind is equal', function () {
          it('returns 1 when high card in hand1 is better than hand 2', function () {
            assert.equal(compareHand(threeOfAKind3, threeOfAKind2), 1)
          })
          it('returns -1 when high card in hand1 is worse than hand 2', function () {
            assert.equal(compareHand(threeOfAKind2, threeOfAKind3), -1)
          })
          it('returns 0 when cards are identical', function () {
            assert.equal(compareHand(threeOfAKind, threeOfAKind), 0)
          })
        })
      })

      describe('straight', function () {
      })

      describe('straight flush', function () {
      })

      describe('flush', function () {
      })

      describe('full house', function () {
      })

      describe('four of a kind', function () {
        let fourOfAKind2, fourOfAKind3

        before(function () {
          fourOfAKind2 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Hearts, type: cardType.Three},
            {suit: cardSuit.Diamonds, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Ten}
          ])
          fourOfAKind3 = evaluateHand([
            {suit: cardSuit.Spades, type: cardType.Three},
            {suit: cardSuit.Clubs, type: cardType.Three},
            {suit: cardSuit.Hearts, type: cardType.Three},
            {suit: cardSuit.Diamonds, type: cardType.Three},
            {suit: cardSuit.Spades, type: cardType.Ace}
          ])
        })

        it('returns 1 when hand1 has higher four of a kind than hand2', function () {
          assert.equal(compareHand(fourOfAKind2, fourOfAKind), 1)
        })
        it('returns -1 when hand1 has lower four of a kind than hand2', function () {
          assert.equal(compareHand(fourOfAKind, fourOfAKind2), -1)
        })

        describe('when four of a kind is equal', function () {
          it('returns 1 when high card in hand1 is better than hand 2', function () {
            assert.equal(compareHand(fourOfAKind3, fourOfAKind2), 1)
          })
          it('returns -1 when high card in hand1 is worse than hand 2', function () {
            assert.equal(compareHand(fourOfAKind2, fourOfAKind3), -1)
          })
          it('returns 0 when cards are identical', function () {
            assert.equal(compareHand(fourOfAKind, fourOfAKind), 0)
          })
        })
      })

      describe('royal flush', function () {
        it('returns 0', function () {
          assert.equal(compareHand(royalFlush, royalFlush), 0)
        })
      })
    })
  })
})
