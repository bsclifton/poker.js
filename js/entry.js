const cardDeck = require('./cardDeck')
const {evaluateHand} = require('./hand')

window.shuffle = function () {
  const cards = cardDeck.shuffle()
  const temp = cards.slice(0, 7)
  const h = evaluateHand(temp)

  console.log(h.toString())
  console.log('cards=', temp)
  console.log('hand=', h)
}

window.shuffle()
