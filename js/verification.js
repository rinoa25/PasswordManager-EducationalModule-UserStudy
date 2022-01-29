// Defines the bottom error message variables
var idfield = document.getElementById('workerid');
var dummy = document.getElementById('DummyID');
var newDummy = parseInt(dummy.value, 10);

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
  if (now-setupTime > 10 * 60 * 1000) {
    localStorage.clear();
    sessionStorage.clear();
  }
}

// Even for experimental, and Odd for control
function numtype (criterianum) {
  if (criterianum % 2 === 0) {
    return "experimental"; // Even
  }
  else {
    return "control"; // Odd
  }
}

// Checks if user is authorized to visit the page:
// They can't go back to a previous page they visited
// They can't jump to a page they havent visited
var checkauthentication = sessionStorage.getItem('actualprocess');

// User progressed further than the verification page
if (checkauthentication != null) {
  // User goes back to their respective page.
  window.location.replace(sessionStorage.getItem('actualprocess'));
}
// Users who just entered the site have no condition
// Thus, this only applies to users who have just successfully verified their Worker ID
else {
  if (document.querySelector('small').innerText == 'User successfully authenticated') {
    // Add Worker ID to local storage so to keep a record of users who passed verification check
    // By doing so, we can disallow them to register twice
    var olddata = JSON.parse(localStorage.getItem('useridvalue'));
    // Add new value in array
    olddata.push(sessionStorage.getItem('workerid'));
    // Update local storage with new array
    localStorage.setItem('useridvalue', JSON.stringify(olddata));
    // Sets a variable to hold user's page location
    sessionStorage.setItem('actualprocess', "consentform.html");
    // Sets a variable to hold user's group type (control / experimental)
    sessionStorage.setItem('group', numtype(newDummy))
    // User is sent to the next page
    window.location.replace("consentform.html");
  }
}

// Always sets cursor at the end of the text
$(function() {
  var input = $("#workerid");
  var len = input.val().length;
  input[0].focus();
  input[0].setSelectionRange(len, len);
});

// Anytime user clicks field, error borders will be gone
idfield.addEventListener('input', function() {
  setNeutralFor(idfield);
});

// Validates Worker ID
function checkValidation() {
  // Verifies that Worker ID consists of letters and numbers
  var letterNumber = /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/;
  // Removes whitespace from both ends of a Worker ID
  var idValue = idfield.value.trim();

  // When the Worker ID is being verified on server, it is not stored (just checks if it already exists)
  // Thus, if it doesn't exist yet, program will keep allowing this Worker ID to pass
  // User can easily go to another tab and register again
  // Therefore, we have to make sure user not registering twice
  if (JSON.parse(localStorage.getItem('useridvalue')) != null && JSON.parse(localStorage.getItem('useridvalue')).includes(idValue)) {
    setErrorFor(idfield, "User has already started the process");
  }
  // Scenario that Worker ID is blank upon submission
  else if (idValue == "") {
    setErrorFor(idfield, "MTurk Worker ID cannot be blank");
  }
  // Scenario that Worker ID is invalid / didn't pass letterNumber verification
  else if (!idValue.match(letterNumber)) {
    setErrorFor(idfield, "Invalid MTurk Worker ID");
  }
  // Scenario that Worker ID is invalid / contains lowercase characters
  else if (idValue != idValue.toUpperCase()) {
    setErrorFor(idfield, "Please enter your Worker ID in all uppercase letters");
  }
  // Scenario that Worker ID is invalid / is not 14 characters long
  else if (idValue.length != 14) {
    setErrorFor(idfield, "Your Worker ID needs to be 14 characters long");
  }
  // Scenario that Worker ID is valid / above conditions were not met
  else {
    // Save Worker ID in session storage, and send this variable to database when user completes study
    sessionStorage.setItem('workerid', idValue);
    // If list is empty, create an array first
    if (olddata == null) {
      localStorage.setItem('useridvalue', '[]');
    }
    // finally submit
    verification.submit();
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
function setSuccessFor(input) {
  // border colour of input field and colour of text will be green
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
