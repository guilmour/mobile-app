PhoneApp.use('PhoneApp.types.Object');
PhoneApp.pack('PhoneApp.types', function(api) {
  /*jshint camelcase:false*/
  'use strict';
  Array.prototype.replace = function(index, removeCount, adds) {
    var m;
    if (adds === undefined)
      adds = [];
    if (!adds || adds.constructor != Array)
      adds = [adds];
    m = adds.map(function(item) {return item;});
    m.unshift(removeCount);
    m.unshift(index);
    var remed = Array.prototype.splice.apply(this, m);
    if ('__hashcache__' in this)
      this.__hashcache__.forEach(function(item) {
        window.setTimeout(function() {
          item.apply(this, [index, adds, remed]);
        }.bind(this), 1);
      }, this);
    return remed;
  };

  Array.prototype.popObject = function() {
    return this.replace(this.length - 1, 1);
  };

  Array.prototype.pushObject = function(o) {
    return this.replace(this.length, 0, o);
  };

  Array.prototype.shiftObject = function() {
    return this.replace(0, 1);
  };

  Array.prototype.unshiftObject = function(o) {
    return this.replace(0, 0, o);
  };

  Array.prototype.removeObject = function(o) {
    var needle = this.indexOf(o);
    if (needle != -1)
      return this.replace(needle, 1);
  };

  Array.prototype.insertAt = function(index, o) {
    return this.replace(index, 0, o);
  };

  Array.prototype.removeAt = function(index) {
    return this.replace(index, 1);
  };

  Array.prototype.clear = function() {
    return this.replace(0, this.length);
  };

  Array.prototype.removeArrayObserver = function(listener) {
    if (!('__hashcache__' in this))
      return;
    var needle = this.__hashcache__.indexOf(listener);
    if (needle != -1)
      this.__hashcache__.splice(needle, 1);
  };

  Array.prototype.addArrayObserver = function(listener) {
    if (!('__hashcache__' in this))
      this.__hashcache__ = [];
    this.__hashcache__.push(listener);
  };

  var swap = function(arr, i, j) {
    if (i == j)
      return;
    var tmp = arr[i];
    tmp = arr.replace(j, 1, tmp);
    arr.replace(i, 1, tmp);
  };

  var quickSort = function(arr, compare, left, right) {
    if (left >= right)
      return;
    swap(arr, left, Math.floor((left + right) / 2));
    var i;
    var last = left;
    for (i = left + 1; i <= right; i++)
      if (compare(arr[i], arr[left]) < 0)
        swap(arr, ++last, i);
      swap(arr, left, last);
    quickSort(arr, compare, left, last - 1);
    quickSort(arr, compare, last + 1, right);
  };

  Array.prototype.quickSort = function(compare){
    quickSort(this, compare, 0, this.length - 1);
    return this;
  };

  this.ArrayController = api.Object.extend({
    init: function(){
      api.Object._super('init', this);

      var arr = false;
      var c = false;
      var m = false;
      var s = [];

      var filter = function() {
        return true;
      };

      var map = function(item) {
        return item;
      };

      var sort = function(a, b) {
        return (a < b) ? -1 : (a == b ? 0 : 1);
      };

      var obs = function(index, added, removed) {
        removed.forEach(function(item) {
          var needle = c.indexOf(item, index);
          if (needle != -1) {
            c.splice(needle, 1);
            item = m.splice(needle, 1);
            needle = s.indexOf(item);
            s.replace(needle, 1);
          }
        });

        added.forEach(function(item) {
          if (filter(item)) {
            c.splice(index, 0, item);
            item = map(item);
            m.splice(index, 0, item);
            var needle;
            s.some(function(sub, idx) {
              needle = idx;
              return sort(sub, item) >= 0;
            });
            s.replace(needle, 0, item);
          }
        });
      };

      this.destroy = function() {
        arr.removeArrayObserver(obs);
        arr = false;
        c = false;
        m = false;
        s.clear();
      };

      Object.defineProperty(this, 'original', {
        get: function(){
          return arr;
        }
      });

      Object.defineProperty(this, 'content', {
        enumerable: true,
        get: function() {
          return s;
        },
        set: function(a) {
          if (arr)
            arr.removeArrayObserver(obs);
          arr = a;
          arr.addArrayObserver(obs);
          c = arr.filter(filter);
          m = c.map(map);
          s.clear();
          m.forEach(function(item){
            s.pushObject(item);
          });
          s.quickSort(sort);
        }
      });

      Object.defineProperty(this, 'filter', {
        get: function() {
          return filter;
        },
        set: function(callback) {
          filter = callback;
          if (arr) {
            c = arr.filter(filter);
            m = c.map(map);
            s.clear();
            m.forEach(function(item){
              s.pushObject(item);
            });
            s.quickSort(sort);
          }
        }
      });

      Object.defineProperty(this, 'map', {
        get: function() {
          return map;
        },
        set: function(callback) {
          map = callback;
          if (arr) {
            m = c.map(map);
            s.clear();
            m.forEach(function(item){
              s.pushObject(item);
            });
            s.quickSort(sort);
          }
        }
      });

      Object.defineProperty(this, 'sort', {
        get: function() {
          return sort;
        },
        set: function(callback) {
          sort = callback;
          if (arr)
            s.quickSort(sort);
        }
      });
    }
  });

});
