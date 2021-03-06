// Copyright 2013, Murray M. Moss
(function(jQuery, window) {
  var $, $w, clearInterval, inView, interval, queue, resolve, setInterval;
  $ = jQuery;
  $w = jQuery(window);
  interval = null;
  queue = [];
  setInterval = window.setInterval, clearInterval = window.clearInterval;
  inView = function($el) {
    var elBtm, elTop, viewBtm, viewTop;
    viewTop = $w.scrollTop();
    viewBtm = viewTop + $w.height();
    elTop = $el.offset().top;
    elBtm = elTop + $el.height();
    return elBtm >= viewTop && elTop <= viewBtm;
  };
  resolve = function() {
    var i, itm;
    if (queue.length > 0) {
      i = queue.length - 1;
      while (i >= 0) {
        itm = queue[i];
        if (inView(itm.target)) {
          itm.deferred.resolve(itm.target);
          queue.splice(i, 1);
        }
        i--;
      }
      if (queue.length < 1) {
        clearInterval(interval);
        return interval = null;
      }
    }
  };
  return $.fn.inView = function($el, callback) {
    var deferred;
    if ($el == null) {
      $el = this;
    }
    deferred = $.Deferred(function(dfd) {
      $el.each(function() {
        return queue.push({
          target: $(this),
          deferred: dfd
        });
      });
      if (queue.length > 0 && interval === null) {
        return interval = setInterval(resolve, 250);
      }
    });
    if (callback != null) {
      deferred.done(callback);
    }
    return deferred.promise();
  };
})(jQuery, window);
