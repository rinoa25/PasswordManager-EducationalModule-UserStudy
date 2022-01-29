// Defines password manager info message
var pmInfo = document.getElementById('topinfo');

// Defines the two textfield variables
var user = document.querySelector(".username");
var pass = document.querySelector(".pass");

// Defines the variables used to check user inactivity
var myTimer;
var minutes = 10;

// Defines an array that holds two password policies
var policies = ['1C8', '3C12']

// Defines random password variable
var randompass;

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

// Generates random passwords that meet required policy
// at least 1 number, 1 upper case character, and 1 lower case character
function generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var allChars = numberChars + upperChars + lowerChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}

// Shuffles each password section (uppercase, lowercase, numbers) so it can be a true random password
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Generates random password
randompass = generatePassword(32);

// Hide password manager info message for those who didn't choose to use a password manager
if (sessionStorage.getItem('signupOption') == 'without password manager') {
  pmInfo.style.display = 'none';
  sessionStorage.setItem('assignedRndmPass', 'n/a');
}
// If user chose to use a password manager:
else if (sessionStorage.getItem('signupOption') == 'with password manager') {
  // Automatically fills password field with random password when user finishes typing their username
  user.addEventListener('change', function() {
    pass.value = randompass;
    // When filled, the border colour returns to default
    setNeutralFor(pass);
  });
}

// Checks if user is authorized to visit the page:
// They can't go back to a previous page they visited
// They can't jump to a page they havent visited
var checkauthentication = sessionStorage.getItem('actualprocess');

// User jumped from verification to registration page
if (checkauthentication == null) {
// User goes back to verification page
  window.location.replace("/");
}
// User progressed further than the registration page
else if (checkauthentication != null && checkauthentication != "registration.html") {
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

// Randomly chooses a password policy for the user to follow
function choose(policies) {
  var index = Math.floor(Math.random() * policies.length);
  return policies[index];
}

// once page loaded, password policy is chosen. Will persist through refreshes but not sessions
var passpolicy = sessionStorage.getItem('passpolicy');
if (passpolicy == null) {
    sessionStorage.setItem('passpolicy', choose(policies));
}

// Records the usage of the random password, only available for users that chose the PM option previously
function usedPm() {
  if (pass.value == randompass){
    sessionStorage.setItem('assignedRndmPass', 'used');
  }
  else {
    sessionStorage.setItem('assignedRndmPass', 'unused');
  }
}

// Checks validity of username
function checkUser() {
  // Retrieves username from username field and removes whitespace from both ends of username
  var userValue = user.value.trim();
  // Scenario that username is blank upon submission
  if (userValue == "") {
    setErrorFor(user, "Username cannot be blank");
  }
}

// Will be called upon when user is ready to go to the next page (login page)
function complete() {
  // Records user's page location
  sessionStorage.setItem('actualprocess', "login.html");
  // Show appropriate pop up message for users that used password manager
  if (sessionStorage.getItem('signupOption') == 'with password manager') {
    Swal.fire({
    title: 'Registered Successfully!',
    text: 'Your password is encrypted and stored. You only need to enter your username when you log in.',
    icon: 'success',
    confirmButtonText: 'Continue to Login',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey:  false}).then(function(){window.location.replace("/login.html");});
  }
  // Show appropriate pop up message for users that didn't use password manager
  else {
    Swal.fire({
    title: 'Registered Successfully!',
    icon: 'success',
    confirmButtonText: 'Continue to Login',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey:  false}).then(function(){window.location.replace("/login.html");});
  }
}

// Validates registration credentials
function checkValidation() {
  // Retrieves username from username field and removes whitespace from both ends of username
  var userValue = user.value.trim();
  // Retrieves password from password field
  var passValue = pass.value;
  // At least one uppercase letter, one lowercase letter and one number
  var policy3C12form = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

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
  // Scenario that password is invalid / didn't pass 1C8 requirement
  else if (sessionStorage.getItem("passpolicy") == "IC8" && passValue.length < 8) {
    setErrorFor(pass, "Password must contain at least 8 characters");
  }
  // Scenario that password is invalid / didn't pass 3C12 length requirement
  else if (sessionStorage.getItem("passpolicy") == "3C12" && passValue.length < 12) {
    setErrorFor(pass, "Password must contain at least 12 characters");
  }
  // Scenario that password is invalid / didn't pass 3C12 form requirement
  else if (sessionStorage.getItem("passpolicy") == "3C12" && policy3C12form.test(passValue) == false) {
    setErrorFor(pass, "Password must contain an uppercase letter, a lowercase letter, and a digit.");
  }
  // Scenario that username and password are valid / above conditions were not met
  else {
    // Borders of username and password fields will be green
    setSuccessFor(user, "");
    setSuccessFor(pass, "");
    // See which entry to record for PM usage
    if (sessionStorage.getItem('signupOption') == 'with password manager'){
      usedPm();
    }
    // Records password used in registration
    sessionStorage.setItem('registeredpass', passValue);
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
