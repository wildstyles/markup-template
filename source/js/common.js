$(function() {

/*CAROUSEL*/
  $('.reviews-carousel').owlCarousel({
    loop: true,
    items: 3,
    nav: false,
    smartSpeed: 1200,
    margin: 20,
    //navText: ['<svg class="icon home-icon-left"><use xlink:href="img/sprite.svg#left-arrow"></use></svg>', '<svg class="icon home-icon-right"><use xlink:href="img/sprite.svg#right-arrow"></use></svg>'],
    responsiveClass: true,
    dots: true
  });

  var owl = $('.owl-carousel');
  owl.owlCarousel();
	// Go to the next item
	$('.home-icon-left').click(function() {
		owl.trigger('next.owl.carousel', [1000]);
	});
	// Go to the previous item
	$('.home-icon-right').click(function() {
    // With optional speed parameter
    // Parameters has to be in square bracket '[]'
    owl.trigger('prev.owl.carousel', [1000]);
  });


	//SCROLL UP
	$('.top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 1200);
	});

	$(window).scroll(function () {
		if ($(this).scrollTop() > 1500) {
			$('.top').addClass("active");
		} else {
			$('.top').removeClass("active");
		}
	});


	//Navbar show-hide
	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		var homeheight = $(".home").height() -120;
		if (scroll > homeheight ) {
			$(".main-header").addClass('header-stick');
		} else {
			$(".main-header").removeClass('header-stick');
		}
	});

	var navigation = $('.main-header__navigation ul');
	var navigationOpen = 'main-header__navigation--open';
	var responsiveOverlay = $('.responsive-menu__overlay');
	var responsiveOverlayActive = 'responsive-menu__overlay--active';
	//Responsive-menu toggle
	$('.responsive-menu').click(function() {
		navigation.toggleClass(navigationOpen);
		$(this).toggleClass('responsive-menu--open');
		responsiveOverlay.toggleClass(responsiveOverlayActive);
	});

	var scrollLink = $('.js-anchor-link');

	responsiveOverlay.click(function() {
		$(this).removeClass(responsiveOverlayActive);
		navigation.removeClass(navigationOpen);
		$('.responsive-menu').toggleClass('responsive-menu--open');
	});

	// Smooth scrolling
	scrollLink.click(function(e) {
		e.preventDefault();
		if ($(window).width() < 992) {
			navigation.toggleClass(navigationOpen);
			$('.responsive-menu__overlay').toggleClass('responsive-menu__overlay--active');
			$('.responsive-menu').removeClass('responsive-menu--open');
		}
		$('body,html').animate({
			scrollTop: $(this.hash).offset().top-45
		}, 1000 );
	});

	// Active link switching
	$(window).scroll(function() {
		var scrollbarLocation = $(this).scrollTop();
		scrollLink.each(function() {
			var sectionOffset = $(this.hash).offset().top -50;
			if ( sectionOffset <= scrollbarLocation ) {
				$(this).parent().addClass('header-active');
				$(this).parent().siblings().removeClass('header-active');
			}
		});
	});

});
