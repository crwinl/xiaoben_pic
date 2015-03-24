// 初始化全局
var $window = $(window),
	$document = $(document),
	isIE6 = !!(navigator.appVersion.indexOf("MSIE 6") > -1);

var album = {
	// 专辑图片图片切换
	imgreset: function(a) {
		var b = $(".current"),
			c = $(".content-nav .icon-view"),
			d = $("#img_cont_list li:eq(" + a + ")"),
			f = $(".showcase .intro li:eq(" + a + ")");
		$img = d.css({
			display: "block"
		}).siblings().css({
			display: "none"
		}).end().find("img"), f.css({
			display: "block"
		}).siblings().css({
			display: "none"
		}), $img.attr("src") || $img.attr("src", $img.attr("data-src")), $next_img = d.next().find("img"), b.text(a + 1), $next_img.attr("src") || $next_img.attr("src", $next_img.attr("data-src")), c.attr("href", $img.attr("src")), $img.width() > 1006 && $img.width(1006);
	},
	// 初始化函数变量
	a: null,
	b: null,
	c: null,
	d: null,
	e: null,
	f: null,
	g: null,
	_index: null,
	resize: function() {
		this.a = $("#img_cont_list li").length,
			this.b = $("#images_box").offset().top,
			this.c = $(".img_list"),
			this.d = this.c.find("ul"),
			this.e = this.c.find("li"),
			this.f = this.e.length,
			this.g = this.e.outerWidth(true)
	},
	// 立即执行
	start: function() {
		this.resize();
		this._index = window.location.hash ? parseInt(window.location.hash.substr(2)) - 1 : 0, this._index < this.a && this._index > 0 || (this._index = 0);
		this.imgreset(this._index);
		$("html,body").animate({
			scrollTop: album.b
		}, 500); //页面立即滚动到图片查阅位置
		this.d.width(this.f * this.g); //初始化ul宽度
		this.e.eq(this._index).addClass("cur").siblings().removeClass("cur"); //当前页面的缩略图加焦点
		album.simg_do(this._index); //缩略图滚动到相应位置
		this.simg(); // 缩略图绑定点击事件
		// 绑定键盘事件
		$(document).unbind('keydown.jayle').bind('keydown.jayle', function(e) {
			if (e.keyCode == 37) {
				album.prve();
			} else if (e.keyCode == 39) {
				album.next();
			}
		});
		// 左右切换
		$("#images_box .img_content .btn_prve").bind("click", function() {
			album.prve();
		});
		$("#images_box .img_content .btn_next").bind("click", function() {
			album.next();
		});
		// 
		$(".album_close").bind("click",album.upkey());
		// 
		this.key();
		// 
		this.simg_p();
		this.simg_n();

	},
	// 上一页
	prve: function() {
		album._index > 0 ? (album._index--, window.location.hash = "p" + (album._index + 1), album.imgreset(album._index), $("html,body").animate({
			scrollTop: album.b
		}, 35)) : album.img_next(), album.e.eq(album._index).addClass("cur").siblings().removeClass("cur");
		album.simg_do(album._index);
	},
	// 下一页
	next: function() {
		album.a - 1 > album._index ? (album._index++, window.location.hash = "p" + (album._index + 1), album.imgreset(album._index), $("html,body").animate({
			scrollTop: album.b
		}, 35)) : album.img_next(), album.e.eq(album._index).addClass("cur").siblings().removeClass("cur");
		album.simg_do(album._index);
	},
	// 缩略图绑定点击事件
	simg: function() {
		this.e.each(function(i) {
			$(this).bind("click", function() {
				var $position = album.d.position().left;
				album._index = i;
				window.location.hash = "p" + (album._index + 1);
				album.imgreset(album._index), $("html,body").animate({
					scrollTop: album.b
				}, 35);
				album.simg_do(album._index);
				$(this).addClass("cur").siblings().removeClass("cur");
			});
		});
	},
	// 缩略图列表上一页事件
	simg_p: function() {
		$("#images_box .img_list .btn_prve").click(function() {
			var $position = album.d.position().left;
			$position < -(album.a - 8) * album.g ? !album.d.is(':animated') && album.d.animate({
				left: '+=' + 8 * album.g + 'px'
			}, 500) : !album.d.is(':animated') && album.d.animate({
				left: 0
			}, 500)
		})
	},
	// 缩略图列表下一页事件
	simg_n: function() {
		$("#images_box .img_list .btn_next").click(function() {
			var $position = album.d.position().left;
			$position > -(album.a - 16) * album.g ? !album.d.is(':animated') && album.d.animate({
				left: '-=' + 8 * album.g + 'px'
			}, 500) : !album.d.is(':animated') && album.d.animate({
				left: -(album.a - 8) * album.g + 'px'
			}, 500);
		})
	},
	// 缩略图列表滚动事件
	simg_do: function(_index) {
		if (album.d.is(':animated')) {
			return
		}
		if (_index < 4) {
			album.d.animate({
				left: 0
			}, 500);
		} else if (_index >= album.a - 4) {
			album.d.animate({
				left: -(album.a - 8) * album.g + 'px'
			});
		} else {
			album.d.animate({
				left: -(_index - 3) * album.g + 'px'
			});
		}
	},
	// 
	img_next: function(){
		$(".img_next").show();
		$(".album_re").attr("href",window.location.href.split("#")[0]);
		window.onmousewheel=function(){return false};
		$(".img_next .bg").css({"width":$window.width()+"px","height":$window.height()+"px"});
		$(document).unbind('keydown.jayle');
		$(document).bind('keydown.jayle',function(e){
			if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 108) {
				return false;
			}else if(e.keyCode == 27) {
				album.upkey();
			}

		});
	},
	key: function(){
		// 绑定键盘事件
		$(document).unbind('keydown.jayle').bind('keydown.jayle', function(e) {
			if (e.keyCode == 37) {
				album.prve();
			} else if (e.keyCode == 39) {
				album.next();
			}
		});
	},
	upkey: function(){
			$(".img_next").hide();
			window.onmousewheel=function(){return true};
			album.key();
	}

}
$(function() {
	album.start();
})