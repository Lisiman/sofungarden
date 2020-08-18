/**
 * block-marquee.js
 * @author Florian Kapaun <hello@florian-kapaun.de>
 */



/**
 * Create marquee elements
 */
$.fn.createMarqueeElements = function(numberOfMarqueesNeeded) {
   if(!$(this).hasClass('marquee--wrapper')) return;

   var marqueeWrapper         = $(this);
   var marquee                = marqueeWrapper.find('.marquee:first-of-type');
   var numberOfMarqueesNeeded = numberOfMarqueesNeeded;

   // Remove already created marquees
   if (marqueeWrapper.find('.marquee').length > 1) {
      marqueeWrapper.find('.marquee').not('.marquee--1').remove();
   }

   // Create additional marquee elements
   for (var  i = 1; i < numberOfMarqueesNeeded+1; i++) {

      // The first one mustn't be created – we just add the class to it
      if (i === 1) {
         marquee.addClass('marquee--' + i);
      } else {
         var newMarquee = marquee.clone();
         newMarquee.removeClass('marquee--1');
         newMarquee.addClass('marquee--' + i);
         newMarquee.attr('aria-hidden', true);

         marqueeWrapper.append(newMarquee);
      }
   }
}



/**
 * Create marquee CSS-Animation
 */
$.fn.createAnimation = function(numberOfMarqueesNeeded) {
   var marqueeWrapper         = $(this);
   var marquee                = marqueeWrapper.find('.marquee:first-of-type');
   var marqueeWidth           = marquee.outerWidth();
   var numberOfMarqueesNeeded = numberOfMarqueesNeeded;
   var style                  = document.createElement('STYLE');
   var animation              = '';
   var duration               = 18;
   var delay                  = duration/numberOfMarqueesNeeded;

   // Remove already created style elements
   $('STYLE').each(function(){
      if($(this).attr('data-block') === 'marquee') {
         $(this).remove();
      }
   });

   // To make sure the styles are re-applied
   setTimeout(function(){

      // Populate style-element with attributes
      $(style).attr({
         'type': 'text/css',
         'data-block': 'marquee'
      });

      // Create css-classes with animation
      for (var  i = 1; i < numberOfMarqueesNeeded+1; i++) {
         animation += '.marquee--' + i;
         animation += ' { animation: marquee ' + duration + 's linear -' + (delay*i) + 's infinite; }';
      }

      // Create @keyframes animation
      var keyFrames = '\
         @keyframes marquee {\
            0%   { transform: translateX(' + (marqueeWidth*(numberOfMarqueesNeeded-1)) + 'px); }\
            100% { transform: translateX(-' + marqueeWidth + 'px); }\
         }\
      ';

      $(style).append(keyFrames);
      $(style).append(animation);

      $('head')[0].appendChild(style);
   }, 1);
}



/**
 * Wait for fonts to load
 * Reference: https://stackoverflow.com/a/11689060
 */
function waitForFonts(fonts, callback) {
    var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font + ', sans-serif';

            var interval;
            function checkFont() {
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};



/**
 * Initialize marquees after the font has loaded
 */
waitForFonts(['Roc Grotesk'], function() {
   resetMarquees();
   $(window).on('resize', resetMarquees);
});



/**
 * Reset marquee elements and animation
 */
function resetMarquees(){
   $('.marquee--wrapper').each(
      function() {
         var marqueeWrapper         = $(this);
         var marqueeWrapperWidth    = marqueeWrapper.outerWidth();
         var marquee                = marqueeWrapper.find('.marquee:first-of-type');
         var marqueeWidth           = marquee.outerWidth();
         var numberOfMarqueesNeeded = Math.ceil(marqueeWrapperWidth/marqueeWidth) + 1;

         marqueeWrapper.createMarqueeElements(numberOfMarqueesNeeded);
         marqueeWrapper.createAnimation(numberOfMarqueesNeeded);
      }
   )
}
