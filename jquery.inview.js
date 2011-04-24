/* Copyright 2011, Murray M. Moss */
(function($, w){
	var $w = $(w),
		queue = [],
		viewTestInterval = null;

	function isInView($el) {
		var viewTop = $w.scrollTop(),
			viewBtm = viewTop + $w.height(),
			elTop = $el.offset().top,
			elBtm = elTop + $el.height();

		return elBtm >= viewTop && elTop <= viewBtm;
	}

	function resolvePromises() {
		if(queue.length > 0){
			var i;
			for(i=queue.length-1; i>=0; i--) {
				var itm = queue[i];

				if(isInView(itm.target)) {
					itm.deferred.resolve(itm.target);
					queue.splice(i, 1);
				}
			}

			if(queue.length < 1) {
				clearInterval(viewTestInterval);
				viewTestInterval = null;
			}
		}
	}

	$.fn.inView = function(){
		var $this = $(this),
			$deferred = $.Deferred();
			
		$this.each(function(){
			queue.push({
				target: $this,
				deferred: $deferred
			});
		});

		if(queue.length > 0 && viewTestInterval === null) {
			viewTestInterval = setInterval(resolvePromises, 350);
		}

		return $deferred.promise();
	};

	$.fn.inView.getQueue = function(){ return queue; };
	$.fn.inView.getInterval = function(){ return viewTestInterval; };
}(jQuery, window));
