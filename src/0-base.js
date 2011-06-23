/*
 * daycount.js v0.1.6
 * http://yellowseed.org/daycount.js/
 *
 * Copyright 2011, Joshua Tacoma
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

// All other globals defined here are kept in this object:
var daycount = (typeof exports !== 'undefined' && exports !== null)
  ? exports : {};

// The 'moment' type, which may include associated information from any
// calendar system:
daycount.moment = (function() {

  // 'moment' constructor:
  function moment(arg) {
    this.set(arg);
  };

  moment.prototype.set = function(arg) {
    if(!arg || arg === null)
      arg = new Date();

    // Now, we're going to calculate as many counts as possible...

    // 'todo' lists counts to be calculated:
    var todo = []
    for(var name in daycount.counts)
    {
      todo.push(name);
      // wipe out any counts lingering from previous calculations:
      if(name in this)
        delete this[name];
    }

    // 'done' lists known counts:
    var done = [arg.constructor.name];
    // TODO: make sure that no item in 'done' is also in 'todo'.

    if (!(arg.constructor.name in daycount.counts))
      this.isUnknown = true;

    // Store argument as the only known property of this:
    this[arg.constructor.name] = arg;

    // Iterate through counts in 'done'.  We're going to add to this list as we
    // go, which makes this for loop a little more interesting:
    for (var indexDone = 0;
         indexDone < done.length && todo.length > 0;
         ++indexDone)
    {
      var nameDone = done[indexDone];
      var builderNameTodo = 'from_' + nameDone;

      // Iterate through counts in 'todo'.  Since we're going to remove
      // them as we go, iterate backwards to keep remaining indices
      // from shifting:
      for (var indexTodo = todo.length - 1; indexTodo >= 0; --indexTodo) {
        var nameTodo = todo[indexTodo];
        var countTodo = daycount.counts[nameTodo];

        if(!countTodo.hasOwnProperty(builderNameTodo)) continue;

        // Found one!  Calculate the value for 'countTodo':
        var builder = countTodo[builderNameTodo];
        var built = builder(this[nameDone]);
        if(built === null) continue;

        this[nameTodo] = built;
        done.push(nameTodo);
        todo.splice(indexTodo, 1)
        if('isUnknown' in this)
          delete this['isUnknown'];
      }
    }
  };

  moment.prototype.plusEarthSolarDays = function(days) {
    if('localJulianDay' in this)
      return new moment(
        new daycount.counts.localJulianDay(
          this.localJulianDay.number + days));
    else
      throw 'this moment has no counts that support the specified increment.';
  };

  moment.prototype.plus = moment.prototype.plusEarthSolarDays;

  return moment;
})();

// A collection of counts i.e. calendar systems.
// Each calendar system should be added to this object.
daycount.counts = {};

daycount.version_ = {
  major: 0,
  minor: 1,
  build: 6,
};

