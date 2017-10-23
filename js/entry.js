const cardDeck = require('./cardDeck')
const Hand = require('./hand')

const cards = cardDeck.shuffle()
const h = new Hand()
const temp = cards.slice(0, 7)
h.evaluateHand(temp)

for (let i = 0; i < temp.length; i++) {
  console.log(temp[i].toString())
}
console.log(h.toString())

console.log('cards=', temp)
console.log('hand=', h)
