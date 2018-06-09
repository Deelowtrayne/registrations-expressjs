const ADD_BTN = document.querySelector('.add-btn');
const INPUT_ELEM = document.querySelector('.reg-number');
var clearBtn2 = document.querySelector('.clear-btn2');
var townElem2 = document.querySelector('.town-select2');
//
let templateSource = document.querySelector('.registration-template').innerHTML;
const REG_TEMPLATE = Handlebars.compile(templateSource);
const DISPLAY_ELEM = document.querySelector('#display-area');

var storedRegs2 = localStorage.getItem('HB-Registrations') ? JSON.parse(localStorage.getItem('HB-Registrations')) : {};
let newRegistration = Registration(storedRegs2);

function addNew() {
  let enteredReg = INPUT_ELEM.value.trim();
  INPUT_ELEM.value = "";
  if (newRegistration.reg(enteredReg)) {
    // else empty the alert element, set update local storage
    document.querySelector('.alert2').innerHTML = "";
    localStorage.setItem('HB-Registrations', JSON.stringify(newRegistration.registrations()));
    // generate list item for display
    DISPLAY_ELEM.innerHTML = REG_TEMPLATE({
      regList: newRegistration.registrations()
    });
  } else {
    document.querySelector('.alert2').innerHTML = "Please enter a valid registration number";
  }
}

function updateHandlebarsDisplay(tag) {
  let regs = Object.keys(storedRegs);
  let output = [];
  // check if there is data in the local storage
  if (regs.length < 1)
    return;

  if(tag === 'all')
    return regs;

  if (regs.length > 0) {
    for (let i = 0; i < regs.length; i++) {
      if (regs[i].startsWith(tag))
        output.push(regs[i]);
    }
  }
  return output;
}

function handlebarsClearAll() {
  localStorage.removeItem('HB-Registrations');
  townElem2.value = 'all'
  INPUT_ELEM.value = "";
  location.hash = "";
  DISPLAY_ELEM.innerHTML = "";
  document.querySelector('.alert2').innerHTML = "";
}

ADD_BTN.addEventListener('click', addNew);

clearBtn2.addEventListener('click', handlebarsClearAll);

townElem2.addEventListener('change', function() {
  DISPLAY_ELEM.innerHTML = REG_TEMPLATE({
    regList: newRegistration.filterBy(townElem2.value)
  });
});

//
window.addEventListener('load', function() {
  DISPLAY_ELEM.innerHTML = REG_TEMPLATE({
    regList: newRegistration.registrations()
  });
})
