/*
 * daycount.js v0.0.2
 * http://yellowseed.org/daycount.js/
 *
 * Copyright 2011, Joshua Tacoma
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

// All other globals defined in this module are stored within this object:
var daycount = {};

// The 'moment' type, which may include associated information from any calendar system:
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

    // Store argument as the only known property of this:
    this[arg.constructor.name] = arg;

    var finished = false;
    while(!finished) {

      // Assume that there is nothing left to do, then try to prove
      // that assumption incorrect:
      finished = true;

      // Iterate through counts in 'todo'.  Since we're going to remove
      // them as we go, iterate backwards to keep remaining indices
      // from shifting:
      for (var indexTodo = todo.length - 1; indexTodo >= 0; --indexTodo) {
        var nameTodo = todo[indexTodo];
        var countTodo = daycount.counts[nameTodo];

        // Iterate through known counts in 'done', looking for something
        // we can calculate 'countTodo' from:
        for (var indexDone = 0; indexDone < done.length; ++indexDone) {
          var nameDone = done[indexDone];
          var builderNameTodo = 'from_' + nameDone;
          if(!countTodo.hasOwnProperty(builderNameTodo)) continue;

          // Found one!  Calculate the value for 'countTodo' and remove
          // it from 'done':
          var builder = countTodo[builderNameTodo];
          this[nameTodo] = builder(this[nameDone]);
          done.push(nameTodo);
          todo.splice(indexTodo, 1)

          // Since we've just calculated another count, any remaining
          // counts must be recalculated, meaning we're not finished:
          finished = false;
          break;
        }
      }
    }
  };

  moment.prototype.incrementEarthSolarDays = function(days) {
    if (this['Date'])
      this.set(new Date(this.Date.getFullYear(), this.Date.getMonth(), this.Date.getDate() + days));
    else if (this['gregorian'])
      this.set(this.gregorian.plusDays(days));
    else if(this['julianDay'])
      this.set(this.julianDay.plusDays(days));
    else
      throw 'this moment has no counts that support the specified increment.';
  };

  moment.prototype.increment = moment.prototype.incrementEarthSolarDays;

  return moment;
})();

daycount.day = daycount.moment;

// A collection of counts i.e. calendar systems.
// Each calendar system should be added to this object.
daycount.counts = {};

daycount.version_ = {
  major: 0,
  minor: 0,
  build: 2,
};

