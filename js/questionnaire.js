// Defines the two sets of questions
var firstset = document.querySelector(".firstset");
var secondset = document.querySelector(".secondset");

// Defines the different question by group
var experimental = document.getElementById('experimental');
var control = document.getElementById('control');

// Defines the selection dropdown variables (FIRST SET)
var gender = document.getElementById('workergender');
var age = document.getElementById('workerage');
var education = document.getElementById('workereducation');
var language = document.getElementById('workerlanguage');
var area = document.getElementById('workerstudy');
var trick = document.getElementById('trick');

// Defines the selection dropdown variables (SECOND SET)
var usedpm = document.getElementById('usedpm');
var understandtheory = document.getElementById('understandtheory');
var securepm = document.getElementById('securepm');
var futurepm = document.getElementById('futurepm');

var educationalmodule = document.getElementById('educationalmodule');
var reason = document.getElementById('workerreason');

// Defines 50% formatted selection dropdown variables (FIRST SET)
var specialLanguage = document.getElementById('workerlanguage2');
var specialArea = document.getElementById('workerstudy2');

// Defines the textfield variables (FIRST SET)
var language2 = document.getElementById('otherlanguage');
var area2 = document.getElementById('otherstudy');

// Defines row variables (FIRST SET)
var row = document.querySelector(".row");
var row2 = document.querySelector(".secondrow");

// Defines previous data collected
var workerID = document.getElementById('workerID');
var group = document.getElementById('group');
var signupOption = document.getElementById('signupOption');
var passPolicy = document.getElementById('passPolicy');
var randomPass = document.getElementById('randomPass');
var registeredPass = document.getElementById('registeredPass');
var loginPass = document.getElementById('loginPass');
var match = document.getElementById('match');
var agreed = document.getElementById('agreed');

var finalLanguage = document.getElementById('finalLanguage');
var finalArea = document.getElementById('finalArea');
var finalModule = document.getElementById('finalModule');
var finalReason = document.getElementById('finalReason');

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

// Fill the values of the previous data
workerID.value = sessionStorage.getItem('workerid');
group.value = sessionStorage.getItem('group');
signupOption.value = sessionStorage.getItem('signupOption');
passPolicy.value = sessionStorage.getItem("passpolicy");
randomPass.value = sessionStorage.getItem('assignedRndmPass');
registeredPass.value = sessionStorage.getItem('registeredpass');
loginPass.value = sessionStorage.getItem('loginpass');
match.value = sessionStorage.getItem('match');
agreed.value = sessionStorage.getItem('agreed');

// LAST QN IN SECOND SET (DIFFERENT FOR USER IN DIFFERENT GROUP)
// Hide experimental sections for users in control group
if (sessionStorage.getItem('group') == 'control') {
  experimental.style.display = 'none';
}
// Hide control sections for users in experimental group
else if (sessionStorage.getItem('group') == 'experimental') {
  control.style.display = 'none';
}

// Checks if user is authorized to visit the page:
// They can't go back to a previous page they visited
// They can't jump to a page they havent visited
var checkauthentication = sessionStorage.getItem('actualprocess');

// User jumped from verification to questionnaire page
if (checkauthentication == null) {
// User goes back to verification page
  window.location.replace("/");
}
// User progressed further than the questionnaire page
else if (checkauthentication != null && checkauthentication != "questionnaire.html") {
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

// When this function is called upon, the user has selected the 'other' option
function checkLanguage() {
  if (language.value == 'other') {
    // Will show the new format of the dropdown with the textbox beside it
    row.style.display = 'block';
    // Old format is hidden for now
    language.style.display = 'none';
    // New dropdown will have 'other' option selected automatically
    $("#workerlanguage2").val('other');
  }
}

// When this function is called upon, the user no longer selected the 'other' option
function revertLanguage() {
  if (specialLanguage.value != 'other') {
    // Will put default border back on textbox
    setNeutralFor(language2);
    // Will hide the new format of the dropdown with the textbox beside it
    row.style.display = 'none';
    // Old format is brought back
    language.style.display = 'block';
    // The original dropdown will have the previous option selected automatically
    $("#workerlanguage").val(specialLanguage.value);
  }
}

// When this function is called upon, the user has selected the 'other' option
function checkArea() {
  if (area.value == 'other') {
    // Will show the new format of the dropdown with the textbox beside it
    row2.style.display = 'block';
    // Old format is hidden for now
    area.style.display = 'none';
    // New dropdown will have 'other' option selected automatically
    $("#workerstudy2").val('other');
  }
}

// When this function is called upon, the user no longer selected the 'other' option
function revertArea() {
  if (specialArea.value != 'other') {
    // Will put default border back on textbox
    setNeutralFor(area2);
    // Will hide the new format of the dropdown with the textbox beside it
    row2.style.display = 'none';
    // Old format is brought back
    area.style.display = 'block';
    // The original dropdown will have the previous option selected automatically
    $("#workerstudy").val(specialArea.value);
  }
}

// When a selection is chosen from dropdown, the error message disappears
$('#workergender').on('change', function() {
  var value = $(this).val();
  setNeutralFor(gender);
});

// When a selection is chosen from dropdown, the error message disappears
$('#workerage').on('change', function() {
  var value = $(this).val();
  setNeutralFor(age);
});

// When a selection is chosen from dropdown, the error message disappears
$('#workereducation').on('change', function() {
  var value = $(this).val();
  setNeutralFor(education);
});

// When a selection is chosen from dropdown, the error message disappears
$('#workerlanguage').on('change', function() {
  var value = $(this).val();
  setNeutralFor(language);
});

// When language textfield is filled by user, border colour returns to default (no text as well)
language2.addEventListener('input', function() {
  setNeutralFor(language2);
});

// When a selection is chosen from dropdown, the error message disappears
$('#workerstudy').on('change', function() {
  var value = $(this).val();
  setNeutralFor(area);
});

// When area textfield is filled by user, border colour returns to default (no text as well)
area2.addEventListener('input', function() {
  setNeutralFor(area2);
});

// When a selection is chosen from dropdown, the error message disappears
$('#trick').on('change', function() {
  var value = $(this).val();
  setNeutralFor(trick);
});

// QUESTIONNAIRE SECOND SET

// When a selection is chosen from dropdown, the error message disappears
$('#usedpm').on('change', function() {
  var value = $(this).val();
  setNeutralFor(usedpm);
});

// When a selection is chosen from dropdown, the error message disappears
$('#understandtheory').on('change', function() {
  var value = $(this).val();
  setNeutralFor(understandtheory);
});

// When a selection is chosen from dropdown, the error message disappears
$('#securepm').on('change', function() {
  var value = $(this).val();
  setNeutralFor(securepm);
});

// When a selection is chosen from dropdown, the error message disappears
$('#futurepm').on('change', function() {
  var value = $(this).val();
  setNeutralFor(futurepm);
});

// When a selection is chosen from dropdown, the error message disappears
$('#educationalmodule').on('change', function() {
  var value = $(this).val();
  setNeutralFor(educationalmodule);
});

// When reason textfield is filled by user, border colour returns to default (no text as well)
reason.addEventListener('input', function() {
  setNeutralFor(reason);
});

function firstComplete() {
  firstset.style.display = 'none';
  secondset.style.display = 'block';
}

// Checks validity of fields under gender field
function firstCheck() {
  // Retrieves age from age field and removes whitespace from both ends
  var ageValue = age.value.trim();
  // Retrieves education from education field and removes whitespace from both ends
  var educationValue = education.value.trim();
  // Retrieves language from lanuguage field and removes whitespace from both ends
  var languageValue = language.value.trim();
  // Retrieves language from lanuguage text field and removes whitespace from both ends
  var language2Value = language2.value.trim();
  // Retrieves area from area field and removes whitespace from both ends
  var areaValue = area.value.trim();
  // Retrieves area from area text field and removes whitespace from both ends
  var area2Value = area2.value.trim();
  var trickValue = trick.value.trim();

  // Scenario that age is invalid / didn't choose a selection from dropdown
  if (ageValue == "null") {
    setErrorFor(age, "Please select an option");
  }
  // Scenario that education is invalid / didn't choose a selection from dropdown
  if (educationValue == "null") {
    setErrorFor(education, "Please select an option");
  }
  // Scenario that language is invalid / didn't choose a selection from dropdown
  if (languageValue == "null") {
    setErrorFor(language, "Please select an option");
  }
  // Scenario that language is invalid / chose 'other' option and left language textfield blank
  if (row.style.display == 'block' && language2Value == "") {
    setErrorFor(language2, "This field cannot be blank");
  }
  // Scenario that area is invalid / didn't choose a selection from dropdown
  if (areaValue == "null") {
    setErrorFor(area, "Please select an option");
  }
  // Scenario that area is invalid / chose 'other' option and left area textfield blank
  if (row2.style.display == 'block' && area2Value == "") {
    setErrorFor(area2, "This field cannot be blank");
  }
  // Scenario that number is invalid / didn't choose a selection from dropdown
  if (trickValue == "null") {
    setErrorFor(trick, "Please select an option");
  }
}

// Checks validity of fields under usedpm field
function secondCheck() {
  // Retrieves answer from field and removes whitespace from both ends
  var understandtheoryValue = understandtheory.value.trim();
  var securepmValue = securepm.value.trim();
  var futurepmValue = futurepm.value.trim();

  var educationalmoduleValue = educationalmodule.value.trim();
  var reasonValue = reason.value.trim();

  // Scenario that option is invalid / didn't choose a selection from dropdown
  if (understandtheoryValue == "null") {
    setErrorFor(understandtheory, "Please select an option");
  }
  // Scenario that option is invalid / didn't choose a selection from dropdown
  if (securepmValue == "null") {
    setErrorFor(securepm, "Please select an option");
  }
  // Scenario that option is invalid / didn't choose a selection from dropdown
  if (futurepmValue == "null") {
    setErrorFor(futurepm, "Please select an option");
  }
  // Scenario that option is invalid / didn't choose a selection from dropdown
  if (sessionStorage.getItem('group') == 'experimental' && educationalmoduleValue == "null") {
    setErrorFor(educationalmodule, "This field cannot be blank");
  }
  // Scenario that area is invalid / left textfield blank
  if (sessionStorage.getItem('group') == 'control' && reasonValue == "") {
    setErrorFor(reason, "This field cannot be blank");
  }
}

function getLanguage() {
  var languageValue = language.value.trim();
  var language2Value = language2.value.trim();
  if (row.style.display == 'block') {
    finalLanguage.value = language2Value;
  }
  else {
    finalLanguage.value = languageValue;
  }
}

function getArea() {
  var areaValue = area.value.trim();
  var area2Value = area2.value.trim();
  if (row2.style.display == 'block') {
    finalArea.value = area2Value;
  }
  else {
    finalArea.value = areaValue;
  }
}

function getModule() {
  if (sessionStorage.getItem('group') == 'control') {
    finalModule.value = 'n/a';
  }
  else {
    finalModule.value = educationalmodule.value;
  }
}

function getReason() {
  if (sessionStorage.getItem('group') == 'experimental') {
    finalReason.value = 'n/a';
  }
  else {
    finalReason.value = reason.value.trim();
  }
}

// Validates first questionnaire set, and see if user can go to the next set
function validate() {
  // Retrieves gender from gender field and removes whitespace from both ends
  var genderValue = gender.value.trim();
  // Retrieves age from age field and removes whitespace from both ends
  var ageValue = age.value.trim();
  // Retrieves education from education field and removes whitespace from both ends
  var educationValue = education.value.trim();
  // Retrieves language from lanuguage field and removes whitespace from both ends
  var languageValue = language.value.trim();
  // Retrieves language from lanuguage text field and removes whitespace from both ends
  var language2Value = language2.value.trim();
  // Retrieves area from area field and removes whitespace from both ends
  var areaValue = area.value.trim();
  // Retrieves area from area text field and removes whitespace from both ends
  var area2Value = area2.value.trim();
  var trickValue = trick.value.trim();

  // Validity of  fields under gender field is implemented here so that it gets checked simultaneously with gender field
  firstCheck();

  // Scenario that gender is invalid / didn't choose a selection from dropdown
  if (genderValue == "null") {
    setErrorFor(gender, "Please select an option");
  }

  // Everything is validated again so that it is counted in the conditions of else

  // Scenario that age is invalid / didn't choose a selection from dropdown
  else if (ageValue == "null") {
    setErrorFor(age, "Please select an option");
  }
  // Scenario that education is invalid / didn't choose a selection from dropdown
  else if (educationValue == "null") {
    setErrorFor(education, "Please select an option");
  }
  // Scenario that language is invalid / didn't choose a selection from dropdown
  else if (languageValue == "null") {
    setErrorFor(language, "Please select an option");
  }
  // Scenario that language is invalid / chose 'other' option and left language textfield blank
  else if (row.style.display == 'block' && language2Value == "") {
    setErrorFor(language2, "This field cannot be blank");
  }
  // Scenario that area is invalid / didn't choose a selection from dropdown
  else if (areaValue == 'null') {
    setErrorFor(area, "Please select an option");
  }
  // Scenario that area is invalid / chose 'other' option and left area textfield blank
  else if (row2.style.display == 'block' && area2Value == "") {
    setErrorFor(area2, "This field cannot be blank");
  }
  else if (trickValue == 'null') {
    setErrorFor(trick, "Please select an option");
  }
  // Scenario that everything is valid / above conditions were not met
  else {
    // Get final answer for language
    getLanguage();
    // Get final answer for area
    getArea();
    // User ready to go to next questionnaire set
    firstComplete();
  }

  return false;

}

// Validates last questionnaire set, and see if user can go to send data to database and finally go to completed page
function validate2() {
  // Retrieves answer from field and removes whitespace from both ends
  var usedpmValue = usedpm.value.trim();
  var understandtheoryValue = understandtheory.value.trim();
  var securepmValue = securepm.value.trim();
  var futurepmValue = futurepm.value.trim();

  var educationalmoduleValue = educationalmodule.value.trim();
  var reasonValue = reason.value.trim();

  // Validity of  fields under usedpm field is implemented here so that it gets checked simultaneously with usedpm field
  secondCheck();

  // Scenario that option is invalid / didn't choose a selection from dropdown
  if (usedpmValue == "null") {
    setErrorFor(usedpm, "Please select an option");
  }

  // Everything is validated again so that it is counted in the conditions of else

  // Scenario that option is invalid / didn't choose a selection from dropdown
  else if (understandtheoryValue == "null") {
    setErrorFor(understandtheory, "Please select an option");
  }
  // Scenario that option is invalid / didn't choose a selection from dropdown
  else if (securepmValue == "null") {
    setErrorFor(securepm, "Please select an option");
  }
  // Scenario that option is invalid / didn't choose a selection from dropdown
  else if (futurepmValue == "null") {
    setErrorFor(futurepm, "Please select an option");
  }
  // Scenario that option is invalid / didn't choose a selection from dropdown
  else if (sessionStorage.getItem('group') == 'experimental' && educationalmoduleValue == "null") {
    setErrorFor(educationalmodule, "This field cannot be blank");
  }
  // Scenario that area is invalid / left textfield blank
  else if (sessionStorage.getItem('group') == 'control' && reasonValue == "") {
    setErrorFor(reason, "This field cannot be blank");
  }
  // Scenario that everything is valid / above conditions were not met
  else {
    // Sets a variable to hold user's page location
    sessionStorage.setItem('actualprocess', "completed.html");
    // Erases user's id from local storage so that server will respond "user in database" instead of "user has already started the process"
    var dat = localStorage.getItem('useridvalue').replaceAll(sessionStorage.getItem('workerid'), '');
    localStorage.setItem('useridvalue', dat);
    // Get final answer for module
    getModule();
    // Get final answer for reason
    getReason();
    // finally submit
    questionnaire.submit();
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
