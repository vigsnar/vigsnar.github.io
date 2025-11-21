/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        var href = $anchor.attr('href');

        // If href contains a fragment, extract it (works with '#about' and '/base/#about')
        var hashIndex = href ? href.indexOf('#') : -1;
        if (hashIndex === -1) {
            // no fragment — let the link behave normally
            return;
        }

        var fragment = href.substring(hashIndex); // e.g. '#about'
        var pathBeforeHash = href.substring(0, hashIndex);

        // If the fragment exists on the current page, smooth-scroll to it
        if ($(fragment).length && (pathBeforeHash === '' || pathBeforeHash === window.location.pathname || pathBeforeHash === window.location.pathname + '/')) {
            $('html, body').stop().animate({
                scrollTop: ($(fragment).offset().top - 50)
            }, 1250, 'easeInOutExpo');
            event.preventDefault();
            return;
        }

        // Otherwise, navigate to the href (front page + fragment). Allow default navigation.
        // This will load the front page which can then jump to the fragment.
        // Do not call preventDefault so the browser navigates.
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

})(jQuery); // End of use strict
