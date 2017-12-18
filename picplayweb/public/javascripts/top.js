function getScrolled() {
 return ( window.pageYOffset !== undefined ) ? window.pageYOffset: document.documentElement.scrollTop;
}
var topButton = document.getElementById( 'page-top' );
window.onscroll = function() {
  ( getScrolled() > 500 ) ? topButton.classList.add( 'fade-in' ): topButton.classList.remove( 'fade-in' );
};
function scrollToTop() {
  var scrolled = getScrolled();
  window.scrollTo( 0, Math.floor( scrolled / 2 ) );
  if ( scrolled > 0 ) {
    window.setTimeout( scrollToTop, 30 );
  }
};
topButton.onclick = function() {
  scrollToTop();
};
