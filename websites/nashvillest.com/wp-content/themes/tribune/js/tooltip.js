jQuery(document).ready(function(jQuery){
    
    if (!jQuery.browser.msie) {
        jQuery('#social ul li').each(function(index) {
            var button = jQuery(this);

            // Create a tooltip for each button
            var tooltipContent = new Array(
                '<span class="left"></span>',
                '<span class="center">'+jQuery(this).children('a').attr("title")+'</span>',
                '<span class="right"></span>');

            var tooltip = jQuery('<div/>').attr('class', 'tooltip').html(tooltipContent.join('')).appendTo(jQuery(this));

            tooltip.css('left', -(tooltip.width()/2)+15).bind('click', function(event) {
                window.open(button.children('a').attr('href'));
            });

            button.hover(function() {
                tooltip.fadeIn('fast');
            }, function() {
                tooltip.fadeOut('fast');
            });
        });
    }
});