// Defines the experimental (title and questions) variables
var experimentalTitle = document.getElementById('experimentalTitle');
var experimentalQn1 = document.getElementById('experimentalQn1');
var experimentalQn2 = document.getElementById('experimentalQn2');
var checkbox1 = document.getElementById('option1');
var checkbox2 = document.getElementById('option2');

// Defines the control (title and questions) variables
var controlTitle = document.getElementById('controlTitle');
var controlQn1 = document.getElementById('controlQn1');
var controlQn2 = document.getElementById('controlQn2');
var radio1 = document.getElementById('radio1');
var radio2 = document.getElementById('radio2');

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

// Hide experimental sections for users in control group
if (sessionStorage.getItem('group') == 'control') {
  experimentalTitle.style.display = 'none';
  experimentalQn1.style.display = 'none';
  experimentalQn2.style.display = 'none';
}
// Hide control sections for users in experimental group
else if (sessionStorage.getItem('group') == 'experimental') {
  controlTitle.style.display = 'none';
  controlQn1.style.display = 'none';
  controlQn2.style.display = 'none';
}

// Checks if user is authorized to visit the page:
// They can't go back to a previous page they visited
// They can't jump to a page they havent visited
var checkauthentication = sessionStorage.getItem('actualprocess');

// User jumped from verification to opinion poll page
if (checkauthentication == null) {
// User goes back to verification page
  window.location.replace("/");
}
// User progressed further than the opinion poll page
else if (checkauthentication != null && checkauthentication != "opinionpoll.html") {
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

// Proceeds to next page (questionnaire)
function complete() {
  sessionStorage.setItem('actualprocess', "questionnaire.html");
  window.location.replace("questionnaire.html");
}

// Validates opinon poll options by checking which group user is from (control / experimental)
function checkValidation() {
  // If user is from control group:
  if (sessionStorage.getItem('group') == 'control') {
    // Shows error pop up if no radio button is selected upon submission
    if (!(radio1.checked || radio2.checked)) {
      Swal.fire({
      title: 'Error!',
      text: 'Please select an option to proceed',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey:  false});
    }
    // Records user's radio selection, and proceeds to the next page (questionnaire.html)
    else {
      if (radio1.checked) {sessionStorage.setItem("agreed", "yes")}
      else {sessionStorage.setItem("agreed", "no")}
      complete();
    }
  }
  // If user is from experimental group:
  else {
    // Records user's checkbox selection: user selected both statements
    if (checkbox1.checked && checkbox2.checked) {
      sessionStorage.setItem("agreed", "both")
    }
    // Records user's checkbox selection: user selected one statement only
    else if (checkbox1.checked || checkbox2.checked) {
      if (checkbox1.checked) {sessionStorage.setItem("agreed", "using password manager only")}
      else {sessionStorage.setItem("agreed", "using password suggestions only")}
    }
    // Records user's checkbox selection: user didn't select any statement
    else {
      sessionStorage.setItem("agreed", "none")
    }
    // Proceeds to the next page (questionnaire.html)
    complete();
  }

  return false;

}
