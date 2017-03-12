/*
@author       Constantin Saguin - @brutaldesign
@link            http://bsign.co
@github        http://github.com/brutaldesign/swipebox
@version     1.0
@license      MIT License
*/
(function(e, t, n, r) {
	n.swipebox = function(i, s) {
		var o = { useCSS: true, hideBarsDelay: 3e3 },
			u = this,
			a = n(i),
			i = i,
			f = i.selector,
			l = n(f),
			c = t.createTouch !== r || "ontouchstart" in e || "onmsgesturechange" in e || navigator.msMaxTouchPoints,
			h = !!e.SVGSVGElement,
			p = '<div id="swipebox-overlay">					<div id="swipebox-slider"></div>					<div id="swipebox-caption"></div>					<div id="swipebox-action">						<a id="swipebox-close"></a>						<a id="swipebox-prev"></a>						<a id="swipebox-next"></a>					</div>			</div>';
		u.settings = {};
		u.init = function() {
			u.settings = n.extend({}, o, s);
			l.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				index = a.index(n(this));
				d.init(index)
			})
		};
		var d = {
			init: function(e) {
				this.build();
				this.openSlide(e);
				this.openImg(e);
				this.preloadImg(e + 1);
				this.preloadImg(e - 1)
			},
			build: function() {
				var t = this;
				n("body").append(p);
				if(t.doCssTrans()) {
					n("#swipebox-slider").css({ "-webkit-transition": "left 0.4s ease", "-moz-transition": "left 0.4s ease", "-o-transition": "left 0.4s ease", "-khtml-transition": "left 0.4s ease", transition: "left 0.4s ease" });
					n("#swipebox-overlay").css({ "-webkit-transition": "opacity 1s ease", "-moz-transition": "opacity 1s ease", "-o-transition": "opacity 1s ease", "-khtml-transition": "opacity 1s ease", transition: "opacity 1s ease" });
					n("#swipebox-action, #swipebox-caption").css({ "-webkit-transition": "0.5s", "-moz-transition": "0.5s", "-o-transition": "0.5s", "-khtml-transition": "0.5s", transition: "0.5s" })
				}
				if(h) {
					var r = n("#swipebox-action #swipebox-close").css("background-image");
					n("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({ "background-image": r })
				}
				a.each(function() { n("#swipebox-slider").append('<div class="slide"></div>') });
				t.setDim();
				t.actions();
				t.keyboard();
				t.gesture();
				t.animBars();
				n(e).resize(function() { t.setDim() }).resize()
			},
			setDim: function() {
				var t = { width: n(e).width(), height: e.innerHeight ? e.innerHeight : n(e).height() };
				n("#swipebox-overlay").css(t)
			},
			supportTransition: function() { var e = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" "); for(var n = 0; n < e.length; n++) { if(t.createElement("div").style[e[n]] !== r) { return e[n] } } return false },
			doCssTrans: function() { if(u.settings.useCSS && this.supportTransition()) { return true } },
			gesture: function() {
				if(c) {
					var e = this,
						t = null,
						r = 10,
						i = {},
						s = {};
					var o = n("#swipebox-caption, #swipebox-action");
					o.addClass("visible-bars");
					e.setTimeout();
					n("body").bind("touchstart", function(e) {
						n(this).addClass("touching");
						s = e.originalEvent.targetTouches[0];
						i.pageX = e.originalEvent.targetTouches[0].pageX;
						n(".touching").bind("touchmove", function(e) {
							e.preventDefault();
							e.stopPropagation();
							s = e.originalEvent.targetTouches[0]
						});
						return false
					}).bind("touchend", function(u) {
						u.preventDefault();
						u.stopPropagation();
						t = s.pageX - i.pageX;
						if(t >= r) { e.getPrev() } else if(t <= -r) { e.getNext() } else {
							if(!o.hasClass("visible-bars")) {
								e.showBars();
								e.setTimeout()
							} else {
								e.clearTimeout();
								e.hideBars()
							}
						}
						n(".touching").off("touchmove").removeClass("touching")
					})
				}
			},
			setTimeout: function() {
				if(u.settings.hideBarsDelay > 0) {
					var t = this;
					t.clearTimeout();
					t.timeout = e.setTimeout(function() { t.hideBars() }, u.settings.hideBarsDelay)
				}
			},
			clearTimeout: function() {
				e.clearTimeout(this.timeout);
				this.timeout = null
			},
			showBars: function() {
				var e = n("#swipebox-caption, #swipebox-action");
				if(this.doCssTrans()) { e.addClass("visible-bars") } else {
					n("#swipebox-caption").animate({ top: 0 }, 500);
					n("#swipebox-action").animate({ bottom: 0 }, 500);
					setTimeout(function() { e.addClass("visible-bars") }, 1e3)
				}
			},
			hideBars: function() {
				var e = n("#swipebox-caption, #swipebox-action");
				if(this.doCssTrans()) { e.removeClass("visible-bars") } else {
					n("#swipebox-caption").animate({ top: "-50px" }, 500);
					n("#swipebox-action").animate({ bottom: "-50px" }, 500);
					setTimeout(function() { e.removeClass("visible-bars") }, 1e3)
				}
			},
			animBars: function() {
				var e = this;
				var t = n("#swipebox-caption, #swipebox-action");
				if(!c) {
					t.addClass("visible-bars");
					e.setTimeout();
					n("#swipebox-slider").click(function(n) {
						if(!t.hasClass("visible-bars")) {
							e.showBars();
							e.setTimeout()
						}
					});
					n("#swipebox-action").hover(function() {
						e.showBars();
						t.addClass("force-visible-bars");
						e.clearTimeout()
					}, function() {
						t.removeClass("force-visible-bars");
						e.setTimeout()
					})
				}
			},
			keyboard: function() {
				if(!c) {
					var t = this;
					n(e).bind("keyup", function(e) {
						e.preventDefault();
						e.stopPropagation();
						if(e.keyCode == 37) { t.getPrev() } else if(e.keyCode == 39) { t.getNext() } else if(e.keyCode == 27) { t.closeSlide() }
					})
				}
			},
			actions: function() {
				var e = this;
				if(a.length < 2) { n("#swipebox-prev, #swipebox-next").hide() } else {
					n("#swipebox-prev").bind("click touchend", function(t) {
						t.preventDefault();
						t.stopPropagation();
						e.getPrev();
						e.setTimeout()
					});
					n("#swipebox-next").bind("click touchend", function(t) {
						t.preventDefault();
						t.stopPropagation();
						e.getNext();
						e.setTimeout()
					})
				}
				n("#swipebox-close").bind("click touchstart", function(t) { e.closeSlide() })
			},
			setSlide: function(e) {
				var t = n("#swipebox-slider");
				if(this.doCssTrans()) { t.css({ left: -e * 100 + "%" }) } else { t.animate({ left: -e * 100 + "%" }) } n("#swipebox-slider .slide").removeClass("current");
				n("#swipebox-slider .slide").eq(e).addClass("current");
				this.setTitle(e);
				n("#swipebox-prev, #swipebox-next").removeClass("disabled");
				if(e == 0) { n("#swipebox-prev").addClass("disabled") } else if(e == a.length - 1) { n("#swipebox-next").addClass("disabled") }
			},
			openSlide: function(e) {
				n("#swipebox-overlay").show().stop().animate({ opacity: 1 }, "slow").addClass("visible");
				setTimeout(function() { n("body").addClass("swipebox-overflow-hidden") }, 1500);
				this.setSlide(e)
			},
			preloadImg: function(e) {
				var t = this;
				setTimeout(function() { t.openImg(e) }, 1e3)
			},
			openImg: function(e) { var t = this; if(e < 0 || e >= a.length) { return false } t.loadImg(a.eq(e).attr("href"), function() { n("#swipebox-slider .slide").eq(e).html(this) }) },
			setTitle: function(e) { var t = null; if(a.eq(e).attr("title")) { n("#swipebox-caption").empty().append(a.eq(e).attr("title")) } },
			loadImg: function(e, t) {
				var r = n("<img>").on("load", function() { t.call(r) });
				r.attr("src", e)
			},
			getNext: function() {
				var e = this;
				index = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));
				if(index + 1 < a.length) {
					index++;
					e.setSlide(index);
					e.preloadImg(index + 1)
				} else {
					n("#swipebox-slider").addClass("rightSpring");
					setTimeout(function() { n("#swipebox-slider").removeClass("rightSpring") }, 500)
				}
			},
			getPrev: function() {
				var e = this;
				index = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));
				if(index > 0) {
					index--;
					e.setSlide(index);
					e.preloadImg(index - 1)
				} else {
					n("#swipebox-slider").addClass("leftSpring");
					setTimeout(function() { n("#swipebox-slider").removeClass("leftSpring") }, 500)
				}
			},
			closeSlide: function() {
				var e = this;
				n("body").removeClass("swipebox-overflow-hidden");
				n("#swipebox-overlay").animate({ opacity: 0 }, "fast");
				setTimeout(function() {
					n("#swipebox-overlay").removeClass("visible");
					e.destroy()
				}, 1e3)
			},
			destroy: function() {
				var t = this;
				n(e).unbind("keyup");
				n(e).unbind("resize");
				n("body").unbind();
				n("#swipebox-slider").unbind();
				n("#swipebox-overlay").remove();
				a.removeData("_swipebox")
			}
		};
		u.init()
	};
	n.fn.swipebox = function(e) {
		if(!n.data(this, "_swipebox")) {
			var t = new n.swipebox(this, e);
			this.data("_swipebox", t)
		}
	}
})(window, document, jQuery)