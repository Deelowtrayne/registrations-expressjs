// registration number input elements
var inputElem = document.querySelector('.regNumber');
var btnAdd = document.querySelector('.submit-btn');
var clearBtn = document.querySelector('.clear-btn');
var townElem = document.querySelector('.town-select');
// display element
var displayElem = document.querySelector('.display-area');

// Run this as soon as the page loads
let storedRegs = localStorage.getItem('Registrations') ? JSON.parse(localStorage.getItem('Registrations')) : {};
var registration = Registration(storedRegs);

function createElem(reg) {
  // generate list item for
  let li = document.createElement('li');
  li.className = "reg-plate";
  li.textContent = reg;
  displayElem.appendChild(li);
}

function addRegistration() {
  var enteredReg = inputElem.value.trim();
  inputElem.value = "";
  if (registration.reg(enteredReg)) {
    // else empty the alert element, set update local storage
    document.querySelector('.alert').innerHTML = "";
    localStorage.setItem('Registrations', JSON.stringify(registration.registrations()));
    // generate list item for display
    createElem(registration.regNumber());
  } else {
    document.querySelector('.alert').innerHTML = "Please enter a valid registration number";
  }
}

function clearAll() {
  localStorage.removeItem('Registrations');
  townElem.value = 'all'
  inputElem.value = "";
  location.hash = "";
  displayElem.innerHTML = "";
  document.querySelector('.alert').innerHTML = "";
}

/******************************************************
 *  LISTEN FOR BUTTON CLICKS AND ELEMENT STATE-CHANGE
 ******************************************************/

btnAdd.addEventListener('click', addRegistration);

window.addEventListener('load', function() {
  if(storedRegs.length > 0)
  for (var i = 0; i< storedRegs.length; i++) {
    createElem(storedRegs[i]);
  }
});

townElem.addEventListener('change', function() {
  let filterData = registration.filterBy(townElem.value);
  displayElem.innerHTML = "";
  console.log(Object.keys(filterData));

  if (filterData.length > 0) {
    console.log('in if statement');
    for (var i = 0; i< filterData.length; i++) {
      createElem(filterData[i]);
    }
  }
});

clearBtn.addEventListener('click', clearAll);
