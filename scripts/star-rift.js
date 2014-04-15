var defineGame = (function() {
  
  var defineCard = function() {
    
    var consequences = [];
    var countersCards = [];
    
    var card = {
      does: function(consequence) { consequences.push(consequence); },
      counters: function(card) { countersCards.push(card); },
      counteredBy: function(card) { card.counters(this); }
    };
    return card;
  };
  
  var shuffledDeck = (function() {
    var extensions = {
      
    };
    
    return function(target) {
      return _.defaults(target, extensions);
    };
  }).call(this);
  
  var createDeck = (function() {
    var cards = [];
    return {
      add: function(count, card) {
        _.times(count, function() { cards.push(card); });
      },
      shuffle: function() {
        return shuffledDeck(_.shuffle(cards));
      }
    };
  });
  
  var staticHelpers = {
    defineCard: defineCard
  };
  
  var fn = function(init) {
    var gameRules = {
      deck: createDeck()
    };
    _.defaults(gameRules, staticHelpers);
    init.call(null, gameRules);
    
    var gameInProgress = function(players) {
      this.deck = gameRules.deck.shuffle();
      this.players = players;
    };
    
    gameInProgress.prototype.deal = function() {
      console.log(this.deck);
      console.log("Dealing!");
    }
    
    return gameInProgress;
  };
  
  return fn;
}).call(this);

var starRift = defineGame(function(game) {
  var attackCard = game.defineCard();
  var evadeCard = game.defineCard();
  
  attackCard.does(function(source, target) { target.damage(); });
  evadeCard.counters(attackCard);
  
  game.deck.add(1, attackCard);
  game.deck.add(1, evadeCard);
});

var currentGame = new starRift();
currentGame.deal();

