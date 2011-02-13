/**
 * Top level namespace for daycount.js, a general purpose calendar
 * and date calculations library.
 */
var daycount = {};

/**
 * The Day type, which may include associated information from any calendar system.
 */
daycount.day = (function() {
  function day(arg) {
    if(!arg || arg === null)
      arg = new Date();
    var builder_name = 'from_' + arg.constructor.name;
    this[arg.constructor.name] = arg;
    var done = [arg.constructor.name];
    var todo = []
    for(var name in daycount.counts)
      if(!this.hasOwnProperty(name))
        todo.push(name);
    var finished = false;
    while(!finished) {
      finished = true;
      for (var indexTodo = todo.length-1; indexTodo >= 0; --indexTodo) {
        var nameTodo = todo[indexTodo];
        var countTodo = daycount.counts[nameTodo];
        for (var indexDone = 0; indexDone < done.length; ++indexDone) {
          var nameDone = done[indexDone];
          var builderNameTodo = 'from_' + nameDone;
          if(!countTodo.hasOwnProperty(builderNameTodo)) continue;
          var builder = countTodo[builderNameTodo];
          this[nameTodo] = builder(this[nameDone]);
          done.push(nameTodo);
          todo.splice(indexTodo, 1)
          finished = false;
          break;
        }
      }
    }
  };
  return day;
})();

/**
 * A collection of counts i.e. calendar systems.  Each calendar system should be added to this object.
 */
daycount.counts = {};

daycount.version_ = {
  major: 0,
  minor: 0,
  build: 1,
  revision: 1,
};

