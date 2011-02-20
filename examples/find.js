var sys = require('sys');
var daycount = require('./daycount');

function for_each(start, days, predicate, action) {
  var moment = new daycount.moment(start);
  sys.puts('starting: '); print_moment(moment);
  for(var i = 0; i < days; ++i) {
    if(predicate(moment))
      action(moment);
    moment.increment(1);
  }
  sys.puts('done: '); print_moment(moment);
}

function print_moment(m) {
  sys.puts(m.gregorian + ' ' + m.localJulianDay + ' ' + m.mars + ' ' + m.venus);
}

function mcIsCenter(m) {
  return 340 < m.mars.dayOfYear && m.mars.dayOfYear < 348;
}

function vcIsLeaping(m) {
  return isNaN(m.venus.year);
}

function vcmcSync(m) {
  return vcIsLeaping(m) && mcIsCenter(m);
}

for_each('3304-09-01', 366*5000, vcmcSync, print_moment);
