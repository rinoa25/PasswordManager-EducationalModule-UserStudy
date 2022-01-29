// Defines the two textfield variables
var user = document.querySelector(".username");
var pass = document.querySelector(".pass");

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

// Autofill password for those that chose to use the password manager
if (sessionStorage.getItem('signupOption') == 'with password manager') {
  pass.value = sessionStorage.getItem('registeredpass');
  // Automatically fills password field with their assigned random password when user changes their username
  user.addEventListener('change', function() {
    pass.value = sessionStorage.getItem('registeredpass');
    // When filled, the border colour returns to default
    setNeutralFor(pass);
  });
}

// Checks if user is authorized to visit the page:
// They can't go back to a previous page they visited
// They can't jump to a page they havent visited
var checkauthentication = sessionStorage.getItem('actualprocess');

// User jumped from verification to login page
if (checkauthentication == null) {
// User goes back to verification page
  window.location.replace("/");
}
// User progressed further than the login page
else if (checkauthentication != null && checkauthentication != "login.html") {
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

// When username is filled, the border colour returns to default
user.addEventListener('input', function() {
  setNeutralFor(user);
});

// When password is filled by user, the border colour returns to default
pass.addEventListener('input', function() {
  setNeutralFor(pass);
});

// Checks validity of username
function checkUser() {
  // Retrieves username from username field and removes whitespace from both ends of username
  var userValue = user.value.trim();
  // Scenario that username is blank upon submission
  if (userValue == "") {
    setErrorFor(user, "Username cannot be blank");
  }
}

// Checks whether password entered during registration and login are the same
function checkMatch() {
  // Retrieves password from password field
  var passValue = pass.value;
  // Records respective entry
  if (passValue == sessionStorage.getItem('registeredpass')) {
    sessionStorage.setItem('match', 'yes');
  }
  else {
    sessionStorage.setItem('match', 'no');
  }
}

// Will be called upon when user is ready to go to the next page (opinion poll page)
function complete() {
  // Records user's page location
  sessionStorage.setItem('actualprocess', "opinionpoll.html");
  // Shows pop up message that tells users to give feedback in the next page
  Swal.fire({
  title: 'Login Successful!',
  icon: 'success',
  confirmButtonText: 'Continue and give us your experience and feedback',
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey:  false}).then(function(){window.location.replace("/opinionpoll.html");});
}

// Validates login credentials
function checkValidation() {
  // Retrieves username from username field and removes whitespace from both ends of username
  var userValue = user.value.trim();
  // Retrieves password from password field
  var passValue = pass.value;

  // Validity of username is implemented here so that it gets checked simultaneously with password
  checkUser();

  // Scenario that password is blank upon submission
  if (passValue == "") {
    setErrorFor(pass, "Password cannot be blank");
  }
  // username verification is also here so that it is counted in the conditions of else
  else if (userValue == "") {
    setErrorFor(user, "Username cannot be blank");
  }
  // Scenario that username and password are valid / above conditions were not met
  else {
    // Borders of username and password fields will be green
    setSuccessFor(user, "");
    setSuccessFor(pass, "");
    // Checks and records whether password entered during registration and login are the same
    checkMatch();
    // Records login password and proceeds to the next page (opinion poll page)
    sessionStorage.setItem('loginpass', passValue);
    // User ready to go to next page
    complete();
  }

  return false;

}

// Scenario when error occurs
function setErrorFor(input, message) {
  // border colour of input field and colour of text will be red
  var container = input.parentElement;
  var bottom = container.querySelector(".bottomerror");
  var small = bottom.querySelector("small");
  small.innerText = message;
  container.className = "container error";
}

// Scenario when successful submission occurs
function setSuccessFor(input, message) {
  // border colour of input field will be green, and text will be hidden
	var container = input.parentElement;
  var bottom = container.querySelector(".bottomerror");
  var small = bottom.querySelector("small");
  small.innerText = message;
	container.className = 'container success';
}

// Scenario when user clicks input field
function setNeutralFor(input) {
  // border colour will be default, and no text will be appear below input field
  var container = input.parentElement;
	container.className = 'container neutral';
}
