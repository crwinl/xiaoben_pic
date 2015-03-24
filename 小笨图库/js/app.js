(function($) {
	var loadurl = 'http://tu.duowan.com/tu',
		loaded = false,
		offset = 30,
		sTimer;
	var order = 'created';
	var MIN_WIN_WIDTH = 1000,
		ITEM_WIDTH = 236,
		MARGIN = 15;
	var jWindow = $(window),
		jLayout = $("#layout"),
		jPicList = $('#pic-list');
	var jLoading = $('#loading');

	function adjust() {
		var cw = Math.max(jWindow.width(), MIN_WIN_WIDTH);
		jLayout.width(cw);
		jPicList.width(Math.floor(cw / ITEM_WIDTH) * ITEM_WIDTH + MARGIN);
	}

	function loadMore() {
		if (loaded == 1) return;
		jLoading.show();
		$.getJSON(loadurl, {
			'offset': offset,
			'order': order,
			math: Math.random()
		}, function(json) {
			if ('undefined' == json || json.enabled == 0) {
				loaded = 1;
			} else {
				var options = jPicList.data("masonry").options,
					bakAnimated = options.isAnimated;
				options.isAnimated = false;
				jPicList.append(json.html).masonry("reload");
				offset = json.offset;
				options.isAnimated = bakAnimated;
			}
			tagShow();
			jLoading.hide();
		});
	}

	function tagShow() {
		$('#pic-list').masonry({
			itemSelector: '.box',
			columnWidth: ITEM_WIDTH,
			isAnimated: this.XMLHttpRequest && !("opacity" in document.body.style) ? false : true
		});
		$(".pic-list li:not(.tags)").hover(function() {
			$(this).addClass("ding");
		}, function() {
			$(this).removeClass("ding");
		});
	}
	jWindow.resize(adjust);
	adjust();
	tagShow();
	$(window).scroll(function scrollHandler() {
		clearTimeout(sTimer);
		sTimer = setTimeout(function() {
			if (loaded == 1) {
				$(window).unbind("scroll", scrollHandler);
			}
			var c = document.documentElement.clientHeight || document.body.clientHeight,
				t = $(document).scrollTop();
			if (t + c >= jPicList.offset().top + jPicList.height()) {
				loadMore();
			}
		}, 100);
	});
})(jQuery);