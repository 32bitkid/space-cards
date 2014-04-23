var defineCard = (function() {
  return function(title, description) {
    var requirements = [];
    var consequences = [];
    
    var card = {
      requires: function(fn) { requirements.push(fn); return card; },
      does: function(fn) { consequences.push(fn); return card; },
      play: function(source, target) {
        var requirementChecker = function(requirement) { return requirement.call(card, source, target); };
        var valid = _.all(requirements,  requirementChecker);
        if (!valid) return console.log("Could not apply \"" + title +"\"", source, "to", target), false;
        var consequencePerformer = function(fn) { fn.call(card, source, target); };
        _.each(consequences, consequencePerformer);
      },
    };
    
    return card;
  };
}).call(this);

var getArg = _.memoize(function(index) { return function() { return arguments[index]; } });

var source = getArg(0);
var target = getArg(1);

var addOf = function(fn) {
  fn.of = function(who) { return _.compose(fn, who) };
  return fn;
}

var mutate = function(property) {
  
  var set = function(value) {
    return addOf(function(player) {
      player[property] = value;
    });
  };
  
  var add = function(amount) {
    return addOf(function(player) {
      player[property] += amount;
    });
  };
  
  var remove = function(amount) { return add(-amount); };
  
  return {
    add: add,
    charge: add,
    increase: add,
    remove: remove,
    drain: remove,
    decrease: remove,
    set: set
  };
};

var check = (function() {
  var comps = {
    eq  : function(a,b) { return a === b; },
    ne  : function(a,b) { return a !== b; },
    gt  : function(a,b) { return a >   b; },
    gte : function(a,b) { return a >=  b; },
    lt  : function(a,b) { return a <   b; },
    lte : function(a,b) { return a <=  b; }
  };
  
  return function(property) {
    var propertyChecks = {};
    _.each(comps, function(fn, key) {
      propertyChecks[key] = function(amount) {
        return addOf(function(player) {
          return fn(player[property], amount);
        });
      };
    });
    return propertyChecks;
  };
}).call(this);



var thrusters = defineCard("Thusters", "Move forward one space")
  .requires(check("battery").gte(1).of(source))
  .does(mutate("battery").drain(1).of(source));
  
var lasers = defineCard("Lasers", "Shoot some lasers!")
  .requires(check("battery").gte(2).of(source))
  .does(mutate("battery").drain(2).of(source))
  .does(mutate("shields").drain(1).of(target))
  
var player1 = {battery: 1, shields: 2};
var player2 = {battery: 5, shields: 1};

thrusters.play(player1);
lasers.play(player2, player1);

console.log(player1,player2);