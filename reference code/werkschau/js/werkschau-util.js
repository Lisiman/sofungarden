/*
 * CONTENTS
 * ------------------------------------
 *  1. Image loading util
 *  2. Student Hover JQuery Function
 *  3. Throttle Function
 *  4. Sticky Header - Immediately Executing Function
 *  5. Debounce - Fire functions for a period of time
 *  6. Random Position JQuery Function
 *  7. Menu Functions
 *  8. Search Functions - any page than search-page.js
 *  9. Wait Util - Function returning promise after n-miliseconds
 * 10. Navigate backwards in the windows history (Go to previous page)
 * 11. Start a video
 * 12. Utility function for displace.js
 */

const rootUrl = window.werkschau.baseUrl;

// api caller
function get(route, resultHandler) {
  fetch(route,
    {
      method: 'GET',
      headers: {
        'X-Requested-With': 'fetch'
      }
    })
    .then(res => res.json())
    .then(res => resultHandler(res))
    .catch(error => console.log(error));
}

/**
 * 1. Image loading util
 * ------------------------------------
 * @Author: Konstantin Kraska <office@kraska-systems.de>
 * Function handles image loading for background image urls set programmatically
 * use it to wait for image load and display a spinner ect. while image is not loaded
 * @param url
 * @returns {Promise<string>} - returns the url when the image is loaded
 */

function waitForImgLoad(url) {
  const image = $(`<img src="${url}">`);

  return new Promise(resolve => {
    image.on('load', () => {
      resolve(url)
    });
  })
}

/**
 * 2. Student Hover JQuery Function
 * ------------------------------------
 * @Author: Konstantin Kraska <office@kraska-systems.de>
 * JQuery function to add a student hover carousel based on a student template
 * @param data - student object recieved from the api
 */

$.fn.studentCarousel = function (data) {
  const $this = $(this);
  const e_imageContainer = $this.find('.student_teaser--image');
  const e_description = $this.find('.description');
  const e_name = $this.find('.name');
  const e_currentNum = $this.find('.currentNum');
  const e_totalNum = $this.find('.totalNum');
  const e_spinner = $this.find('.spinner-container');

  // data
  const slides = data.slides;
  let currentHitbox = 1;

  // dimensions
  const width = $this.width();
  const offsetLeft = $this.offset().left;
  const hitBoxWidth = width / slides.length - 1;

  async function handleSlides(num) {
    let slide = slides[num];

    if (slide.loaded === undefined) {
      // show spinner
      e_spinner.css('display', 'flex');
      // resolve image load
      const resolvedImage = await waitForImgLoad(slide.imgUrl);
      // add to element css
      setSlide(slide);
      // set slide status to loaded
      slide.loaded = true;
      // hide spinner
      e_spinner.css('display', 'none');
    } else {
      // set slide from the image
      setSlide(slide)
    }
  }

  function setSlide(slide) {
    e_imageContainer.css('background-image', `url(${slide.imgUrl}`);
    e_currentNum.text(currentHitbox);
    slide.description ? e_description.text(slide.description) : e_description.html('&nbsp');
  }

  async function init() {
    let initialSlide = slides[0];
    initialSlide.loaded = true;

    e_name.text(data.fullName);
    e_totalNum.text(slides.length);
    e_currentNum.text(1);
    e_spinner.css('display', 'none');

    // initialize listener
    $this.on('mousemove', async (e) => {
      const mouseX = e.pageX - offsetLeft;
      await handleHoverMove(mouseX);
    });

    // event listener for touch move
    $this.on('touchmove', async function (e) {
      const touchX = e.touches[0].pageX - offsetLeft;
      await handleHoverMove(touchX);
    });

    async function handleHoverMove(mouseX){
      let hitBox = Math.ceil(mouseX / hitBoxWidth);

      if (currentHitbox !== hitBox && hitBox <= slides.length && hitBox > 0) {
        currentHitbox = hitBox;
        await handleSlides(hitBox - 1);
      }
    }

    // event listener for click
    $this.on('click', function () {
      $(location).attr('href', data.url);
    });

    await handleSlides(0, slides, e_spinner);
  };

  init();

  return $this;
};

function handleStudentSlides(res) {
  const students = $('.student_teaser');
  let eq = 0;

  for (let item of res.data) {
    const studentContainer = students.eq(eq);
    studentContainer.studentCarousel(item);
    studentContainer.on('click', function () {
      $(location).attr('href', item.url);
    });
    eq++;
  }

  // hide loading spinner
  $('#loadingSpinner').hide();
}

/**
 * 3. Throttle Function
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 * Throttle firing a function for a defined period of time.
 * Reference: https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/
 */
function throttle(callback, interval) {
  var enable_call = true;

  return function () {

    if (!enable_call) {
      return
    }
    ;

    enable_call = false;

    callback.apply(this);

    setTimeout(function () {
      enable_call = true;
    }, interval);
  }
}

/**
 * 4. Sticky Header - Immediately Executing Function
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 * Enables Sticky Header functionality
 * Reference: https://stackoverflow.com/a/54794011
 */

$(() => {
  const stuckClass = 'is-stuck';
  const $stickyTopElements = $('header.student');
  const $stickyBottomElements = $('.sticky-bottom');

  const determineSticky = () => {
    $stickyTopElements.each((i, el) => {
      const $el = $(el);
      const stickPoint = parseInt($el.css('top'), 10);
      const currTop = el.getBoundingClientRect().top;
      const isStuck = currTop <= stickPoint;
      $el.toggleClass(stuckClass, isStuck);
    });

    $stickyBottomElements.each((i, el) => {
      const $el = $(el);
      const stickPoint = parseInt($el.css('bottom'), 10);
      const currBottom = el.getBoundingClientRect().bottom;
      const isStuck = currBottom + stickPoint >= window.innerHeight;
      $el.toggleClass(stuckClass, isStuck);
    });
  };

  //run immediately
  determineSticky();

  //Run when the browser is resized or scrolled
  //Uncomment below to run less frequently with a debounce
  //let debounce = null;
  $(window).on('resize scroll', () => {
    //clearTimeout(debounce);
    //debounce = setTimeout(determineSticky, 100);

    determineSticky();
  });
});

/**
 * 5. Debounce - Fire functions for a period of time
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 * Debounce firing a function for a defined period of time.
 * Reference: https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/
 */
function debounce(callback, interval) {
  let debounce_timeout_id;

  return function () {
    clearTimeout(debounce_timeout_id);

    debounce_timeout_id = setTimeout(function () {
      callback.apply(this);
    }, interval);
  };
}

/**
 * 6. Random Position JQuery Function
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 * Position an element random in the browser window
 */
$.fn.randomPosition = function () {
  var element = $(this);
  var elementTransformation = element.css('transform');
  var transformationMatrixPattern = /-?\d+\.?\d*/g;

  // Convert the elementTransformation matrix-string into an array.
  elementTransformation = elementTransformation.match(transformationMatrixPattern);

  elementTransformation = elementTransformation ? elementTransformation : [1, 0, 0, 1, 0, 0];

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var newX = Math.floor((Math.random() * (windowWidth * 0.7)) - 50);
  var newY = Math.floor((Math.random() * (windowHeight * 0.7)) - 50);

  // Calculate a new transformationValue. Don't change the rotation and scale.
  var transformationValue = 'matrix('
    + elementTransformation[0] + ', '
    + elementTransformation[1] + ', '
    + elementTransformation[2] + ', '
    + elementTransformation[3] + ', '
    + newX + ', '
    + newY + ')';

  // Position the element fixed and apply the calculated transformationValue
  // to it.
  element.css({
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'margin': 0,
    'padding': 0,
    'transform': transformationValue
  });
}

/**
 * 7. Menu Functions & Toggles
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 */

function toggleMobileMenu() {

  const menuWrapper = $('header .header--wrapper');

  // Toggle
  if (menuWrapper.attr('aria-expanded') === 'true') {

    menuWrapper.attr('aria-expanded', false);
    menuWrapper.addClass('collapsed');

  } else {

    menuWrapper.attr('aria-expanded', true);
    menuWrapper.removeClass('collapsed');

  }
}

function toggleSearch() {

  // If the zIndexCounter is set because of other draggable devices, increase
  // it and use it to determine the z-index for #search.
  if ('zIndexCounter' in window) {
    $('#search').css('z-index', zIndexCounter++);
  }

  $('#search').toggle();

  $('#search--input').focus();
  $('#search--control').focus();

}

function hideDevice() {
  let device = $(this).closest('.device');
  let video = device.find('video');

  device.hide();

  // If this device is showing a video, stop it.
  video.each(function () {
    this.pause();
  });
}

function toggleSound() {
  let icon = $(this);
  let video = icon.closest('.device').find('video');
  let sound = video.prop('muted');

  if (sound) {
    icon.removeClass('muted')
    video.prop('muted', false);
  } else {
    icon.addClass('muted');
    video.prop('muted', true);
  }
}

/**
 * 8. Search Handling for pages !== search-page
 * ------------------------------------
 * @Author: Konstantin Kraska <office@kraska-systems.de>
 *
 * Search handlers for search performed on any page not equal to the search page
 * Pay Attention -> Do not use on search-page.js, search is handled in another way
 */

$.fn.autoCompleteSearch = function (options = {resultContainerId: 'search--results'}) {

  const $this = $(this);
  const resultContainer = $('#' + options.resultContainerId);

  // autocomplete search handler
  function handleAutoCompleteSearch(param) {
    fetch(
      `${rootUrl}/search/autocomplete?q=${param}`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'fetch'
        }
      })
      .then(res => res.json())
      .then(res => {
        handleSearchResults(res.data)
      })
      .catch(err => console.log(err));
  }

  // search result handler
  function handleSearchResults(data) {
    // clear container
    resultContainer.empty();

    // add result data
    if (data.length > 0) {
      // build results
      for (let result of data) {
        const html = $(`<a class="search--result" href="${result.url}"><span class="search--result--type">(${result.type})</span> <span class="search--result--title">${result.title}</span></a>`);

        resultContainer.append(html);
      }
    } else {
      resultContainer.append($(`<span>Deine Suche lieferte keine Ergebnisse.</span>`))
    }
  }

  $this.on('input', function () {
    const inputValue = $this.val();

    // If input is empty...
    if (inputValue === '') {
      // ... clear results container and send NO request
      resultContainer.empty();
    } else {
      handleAutoCompleteSearch(inputValue);
    }
  });

  return $this;
};

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}



/**
 * 10. Navigate backwards in the windows history
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 * Go to the previously visited page
 */
function windowHistoryBack() { window.history.back(); }



/**
 * 11. Start a video
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 */
function startVideo() { this.play(); }



/**
 * 12. Utility function for displace.js
 * ------------------------------------
 * @Author: Florian Kapaun <hello@florian-kapaun.de>
 * These functions are fired by displace.js
 */
function onDragStart (e) {
    increaseZIndex(e);
    active(e);
}

var zIndexCounter = 2;

function increaseZIndex (e) {
  if ($(e).css('z-index') !== '9979') {
    $(e).css('z-index', zIndexCounter++);
  }
}

function active (e) { e.className += ' active'; }

function inactive (e) { e.className = e.className.replace('active', ''); }
