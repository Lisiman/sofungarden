/**
 * Countdown until Werkschau
 * Reference: https://www.w3schools.com/howto/howto_js_countdown.asp
 */
let eventStart = $('#countdown').attr('data-event-start');

// Set the date we're counting down to
let countDownDate = new Date(eventStart).getTime();

// Update the count down every 1 second
let x = setInterval(function() {

  // Get today's date and time
  let now = new Date().getTime();

  // Find the distance between now and the count down date
  let distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds filled with 0 if
  // only 1 digit.
  let days    = zeroFill(Math.floor(distance / (1000 * 60 * 60 * 24)), 2);
  let hours   = zeroFill(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
  let minutes = zeroFill(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
  let seconds = zeroFill(Math.floor((distance % (1000 * 60)) / 1000), 2);

  // Display the result in the element with id="demo"
  $('#countdown').html(days + ": <br>" + hours + ": <br>"
  + minutes + ": <br>" + seconds);

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    $('#countdown').html('EXPIRED');
  }
}, 1000);

// Source: https://stackoverflow.com/a/1267338
function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}



/**
 * Random position the .devices
 */
$( 'main .device' ).each( function () {
   $( this ).randomPosition();
});

$( '#werk_chow_chow' ).randomPosition();



/**
 * If a user clicks on a search_tag, he or she gets redirected to the search
 * page to see the search results for the according tag.
 */
$('.search_tag').on('click', function () {

  const rootUrl = window.werkschau.baseUrl;
  const tagValue = $(this).attr('data-value');

  // Redirect with query string
  window.location.href = rootUrl + '/search?tag=' + encodeURIComponent(tagValue);
});


// SEARCH HANDLING
$('#search--control').autoCompleteSearch({ resultContainerId: 'search--results'});
