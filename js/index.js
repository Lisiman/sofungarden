
//Mobile Menu toggle (on-page header)
$('#mobile_menu--toggle').on('click', toggleMobileMenu);

// Search bar
$('#search_link').on('click', toggleSearch);

// .device buttons
$('button.device--controls--close').on('click', hideDevice);
$('button.device--controls--sound').on('click', toggleSound);

// start .device VIDEO
$('.device VIDEO').on('click', startVideo);

// Make .draggable elements draggable with displace.js
const options = {

    onMouseDown: onDragStart,
    onTouchStart: onDragStart,
    onMouseUp: inactive,
    onTouchStop: inactive,
    ignoreFn: function (event) {

        if (event.target.closest('#search--input') != null ||
            event.target.closest('#search--control') != null ||
            event.target.closest('.search_tags') != null) {

            return true;

        }

        return false;

    }

};

$('.draggable').each(function () {
  window.displacejs(this, options);
});
