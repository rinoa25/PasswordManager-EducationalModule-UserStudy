// Defines "I agree" checkbox & experimental sections
var agree = document.getElementById('consent');
var experimental = document.getElementById('experimental')

// Defines the variables used to check user inactivity
var myTimer;
var minutes = 10;

// Pop up that is displayed when user has been inactive for more than 10 minutes
function sessionOut() {
  Swal.fire({
  title: 'Session Timeout',
  text: 'You have been inactive for more than 10 minutes. You will be redirected back to the start of the study.',
  icon: 'info',
  confirmButtonText: 'OK',
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey:  false}).then(function(){window.location.replace("/");});
}

// Reloads page automatically when user clicks back arrow
// By default, when user clicks back arrow, page doesn't reload (it will show the state it was left at)
window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload(true);
  }
});

// All variable are deleted if it has been 10 minutes since the user completed the study or user restored the page too late
var now = new Date().getTime();
var setupTime = localStorage.getItem('setupTime');
if (setupTime != null) {
  if (now-setupTime > minutes * 60 * 1000) {
    localStorage.clear();
    sessionStorage.clear();
  }
}

// Hide experimental section for control group (odd)
if (sessionStorage.getItem('group') == 'control') {
  experimental.style.display = 'none';
}

// Checks if user is authorized to visit the page:
// They can't go back to a previous page they visited
// They can't jump to a page they havent visited
var checkauthentication = sessionStorage.getItem('actualprocess');

// User jumped from verification to consent form
if (checkauthentication == null) {
// User goes back to verification page
  window.location.replace("/");
}
// User progressed further than the verification page
else if (checkauthentication != null && checkauthentication != "consentform.html") {
  // User goes back to their respective page.
  window.location.replace(sessionStorage.getItem('actualprocess'));
}

// Listens if page is out of sight
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'hidden') {
    // If 10 minutes has passed and user still hasn't looked at the page:
    // Storage is cleared and popup is shown
    myTimer = setTimeout(function(){sessionStorage.clear(); localStorage.clear(); sessionOut();}, 600000);
    localStorage.setItem('setupTime', new Date().getTime());
  }
  // If 10 minutes is not up, and user finally looks at the page again, the timer is cleared and stopped
  else {
    clearTimeout(myTimer);
  }
});

// Checks if user ticked the "I agree" checkbox
function validate() {
  // If user ticked the "I agree" checkbox, we check the group (control / experimental) the user is in
  if (agree.checked) {
    // If user is in the control group, they proceed to the sign up option page and skip the educational module
    if (sessionStorage.getItem('group') == 'control') {
      sessionStorage.setItem('actualprocess', "prerequisite.html");
      window.location.replace("prerequisite.html");
    }
    // If user is in the experimental group, they proceed to the educational module
    else {
      sessionStorage.setItem('actualprocess', "introduction.html");
      window.location.replace("introduction.html");
    }
  }
  // If user didn't tick the "I agree" checkbox, an error pop up message is shown
  else {
    Swal.fire({
    title: 'Error!',
    text: 'Please click the box to proceed',
    icon: 'error',
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey:  false});
  }
}
