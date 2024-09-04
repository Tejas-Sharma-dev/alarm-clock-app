// html element varaible
const hourEle = document.getElementById('hour');
const minEle = document.getElementById('minute');
const secEle = document.getElementById('second');
const phaseEle = document.getElementById('phase');
const dayEle = document.getElementById('day');
const selectHourEle = document.querySelector('#hour-select');
const selectMinuteEle = document.querySelector('#minute-select');
const selectSecondEle = document.querySelector('#second-select');
const requiredFields = document.querySelectorAll('.input-required');
const hourReq = document.getElementById('hrs-req');
const minReq = document.getElementById('min-req');
const secReq = document.getElementById('sec-req');
const phaseReq = document.getElementById('phase-req');
const titleReq = document.getElementById('title-req');
const selectTitleBox = document.getElementById('title-txt-box');
const selectMessageBox = document.getElementById('msg-txt-box');
const phaseSelectBoxEle = document.querySelectorAll('input[name="phase-select"]');
const createAlarmBtnEle = document.querySelector('#createAlarmBtn');
const alarmListContainer = document.querySelector('#alarm-list-container')

// global variable
const alarmListArr = [];
let alarmCounter = 0;
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const alarmTune = new Audio();
alarmTune.src = 'assets/sounds/bell-98033.mp3';



/**
 * Initializes the application by displaying the current time and loading select options.
 */
window.addEventListener("load", () => {
    // display current time
    setInterval(currentTime, 1000);
    // load options for input select tags
    loadSelectOptions();
});



/**
 * Displays Current Time by assigning Hour, Minute, Seconds value to 
 * span text and also checks if any alarm is Set by user or Not
 */
function currentTime() {
    let currTime = new Date();
    let hour = currTime.getHours();
    hourEle.textContent = (hour % 12 || 12).toString().padStart(2, '0');
    minEle.textContent = (currTime.getMinutes() < 10 ? '0' : '') + currTime.getMinutes();
    secEle.textContent = (currTime.getSeconds() < 10 ? '0' : '') + currTime.getSeconds();
    dayEle.textContent = weekday[currTime.getDay()];
    phaseEle.textContent = currTime.getHours() >= 12 ? 'PM' : 'AM';

    // if any alarm is Set
    if (alarmListArr) {
        checkAlarm();
    }
}



/**
 * Validates a user input string.
 *
 * Checks if the provided `timeInput` string is neither 'Select' nor an empty string.
 *
 * @param {string} timeInput - The input string to validate.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
function isValid(timeInput) {
    return (timeInput != 'Select' && timeInput != '' && timeInput != null ? true : false);
}



/**
 * Plays the alarm sound.
 *
 * global variable `alarmTune` is an audio element containing the alarm sound.
 */
function playAlarm() {
    try {
        alarmTune.play();
    } catch (err) {
        console.error(`Error:: ${err}`);
    }
}



/**
 * Pauses the alarm sound.
 *
 * global variable `alarmTune` is an audio element containing the alarm sound.
 */
function stopAlarm() {
    alarmTune.pause();
}

/**
 * returns the selected value of phase element
 * @returns {string} user selected phase option AM or PM
 */
function getSelectedRadioButtonValue() {

    let selectedValue = null;
    phaseSelectBoxEle.forEach(radioButton => {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
        }
    });

    return selectedValue;
}




/**
 * Handles the click event on the "Create Alarm" button.
 *
 * Retrieves input values, validates them, and sets a new alarm if valid.
 */
createAlarmBtnEle.addEventListener('click', function () {
    const hourInput = selectHourEle.value;
    const minuteInput = selectMinuteEle.value;
    const secondsInput = selectSecondEle.value;
    const phaseInput = getSelectedRadioButtonValue();
    const titleInput = selectTitleBox.value;
    const messageInput = selectMessageBox.value;

    if (isValid(hourInput) && isValid(minuteInput) && isValid(secondsInput) && isValid(phaseInput) && isValid(titleInput)) {
        // informing successful additon of alarm to user
        displayAlert(`Alarm Set Successful for ${titleInput}\nat ${hourInput}:${minuteInput}:${secondsInput} ${phaseInput}`, 'success');
        // reset input values
        resetUserInputs();
        // to store timestamp value and alarm time in str format
        let alarmSetTimeStamp = generateTimestamp(Number(hourInput), Number(minuteInput), Number(secondsInput), phaseEle.textContent);
        let alarmSetStr = `${hourInput}:${minuteInput}:${secondsInput} ${phaseInput}`;
        // sets an alarm by appending alarm obj to the alarm list
        setAlarm(alarmSetStr, alarmSetTimeStamp, titleInput, messageInput);

    } else {
        // displays required field to be updated
        displayRequired();
        // informing error while setting alarm
        displayAlert(`Warning: Please Input Required Fields!!`, 'invalid')
    }
})



/**
 * Sets a new alarm with the provided details.
 *
 * @param {string} alarmTime - The desired alarm time in a formatted string (HH:MM:SS AM/PM).
 * @param {number} timeStamp - The timestamp representing the alarm time.
 * @param {string} title - The title of the alarm.
 * @param {string} message - An optional message for the alarm. Defaults to an empty string.
 */
function setAlarm(alarmTime, timeStamp, title, message = '') {
    // incrementing alarm ID counter
    alarmCounter += 1;
    // pushing new alarm-set
    alarmListArr.push({
        alarmID: alarmCounter,
        alarmTime: alarmTime,
        alarmTimeStamp: timeStamp,
        alarmTitle: title,
        alarmMessage: message
    })
    // display alarm-set list
    displayAlarmSet();
}



/**
 * Checks for active alarms in the alarm list.
 *
 * Iterates through the `alarmListArr` and triggers alarms that have timestamps less than or equal to the current time.
 *
 */
function checkAlarm() {

    if (!alarmListArr) {
        return; // No alarms to check if list is empty
    }

    const currentTime = Date.now();

    alarmListArr.forEach((alarmSetObj) => {

        const alarmToCheck = alarmSetObj.alarmTimeStamp;

        // console.log(`alarm set timestamp:: ${alarmToCheck}\nalarm now::${currentTime}`);

        if (currentTime >= alarmToCheck) {
            setTimeout(() => {
                showAlert(alarmSetObj.alarmTitle, alarmSetObj.alarmMessage)
            }, 700);
            playAlarm();
            removeAlarmSet(alarmSetObj);
            displayAlarmSet();
        }
    })
}



/**
 * Displays an alert with a title and message.
 *
 * @param {string} title - The title of the alert.
 * @param {string} message - The message to display within the alert.
 */
function showAlert(title, message) {
    alert(`Hi There,\nAlert: ${title}\nMessage: ${message}`);
}



/**
 * Displays a list of set alarms.
 *
 * Creates HTML elements for each alarm, populates them with data, and appends them to the `alarmListContainer`.
 *
 * alarmListArr - The array containing alarm objects is global varible
 */
function displayAlarmSet() {
    const deleteBtnContent = `<i class="fa-solid fa-trash"></i>`;

    // Reset the contents of the alarm list container
    alarmListContainer.innerHTML = '';

    // If there are no alarms, return early
    if (!alarmListArr || alarmListArr.length === 0) {
        return;
    }

    alarmListArr.forEach((alarm) => {
        // Create HTML elements
        const divEle = document.createElement('div');
        const headerEle = document.createElement('h3');
        const titleEle = document.createElement('p');
        const messageEle = document.createElement('p');
        const alarmDeleBtnEle = document.createElement('button');

        // Assign classes
        divEle.classList.add('alarm-set');
        headerEle.classList.add('alarm-set-header');
        titleEle.classList.add('alarm-set-title');
        messageEle.classList.add('alarm-set-message');
        alarmDeleBtnEle.classList.add('alarm-set-delete-btn');

        // Assign text content
        headerEle.textContent = alarm.alarmTime;
        titleEle.textContent = alarm.alarmTitle;
        messageEle.textContent = alarm.alarmMessage;
        alarmDeleBtnEle.innerHTML = deleteBtnContent;

        // Attach delete button event listener
        alarmDeleBtnEle.addEventListener('click', () => {
            removeAlarmSet(alarm);
            displayAlarmSet();
        });

        // Append elements to the container
        divEle.append(headerEle, titleEle, messageEle, alarmDeleBtnEle);
        alarmListContainer.appendChild(divEle);
    });
}



/**
 * Removes an alarm from the alarm list.
 *
 * @param {Object} alarmObjToBeDeleted - The alarm object to be removed.
 */
function removeAlarmSet(alarmObjToBeDeleted) {
    const indexToBeRemoved = alarmListArr.findIndex((alarmObj) => {
        return alarmObj.alarmID === alarmObjToBeDeleted.alarmID;
    });

    if (indexToBeRemoved !== -1) {
        alarmListArr.splice(indexToBeRemoved, 1);
    } else {
        console.error('Error: Alarm not found.');
    }
}



/**
 * Displays a required message next to input fields that have invalid values.
 */
function displayRequired() {
    const requiredMessage = '*';
    const notRequired = '';
    hourReq.textContent = isValid(selectHourEle.value) === true ? notRequired : requiredMessage;
    minReq.textContent = isValid(selectMinuteEle.value) === true ? notRequired : requiredMessage;
    titleReq.textContent = isValid(selectTitleBox.value) === true ? notRequired : requiredMessage;
    phaseReq.textContent = isValid(phaseEle.value) === true ? notRequired : requiredMessage;
}


/**
 * resets the input field with defualt value or empty string
 */
function resetUserInputs() {
    const selectType = 'Select';
    const emptyStr = '';

    selectHourEle.value = selectType;
    selectMinuteEle.value = selectType;
    selectSecondEle.value = '00';
    selectTitleBox.value = emptyStr;

    if (selectMessageBox.value) {
        selectMessageBox.value = '';
    }

    phaseSelectBoxEle.forEach(radioButton => {
        if (radioButton.checked) {
            radioButton.checked = false;
        }
    });

    hourReq.textContent = emptyStr;
    minReq.textContent = emptyStr;
    secReq.textContent = emptyStr;
    titleReq.textContent = emptyStr;
    phaseReq.textContent = emptyStr;

}


/**
 * Handles changes to a select element and updates a corresponding requirement element.
 *
 * @param {HTMLElement} selectElement - The select element to monitor for changes.
 * @param {HTMLElement} requirementElement - The element to display a requirement message.
 */
function handleSelectChange(selectElement, requirementElement) {
    if (selectElement.value === 'Select') {
        requirementElement.textContent = '*';
    } else {
        requirementElement.textContent = '';
    }
}

selectHourEle.addEventListener('change', () => {
    handleSelectChange(selectHourEle, hourReq);
});

selectMinuteEle.addEventListener('change', () => {
    handleSelectChange(selectMinuteEle, minReq);
});


/**
 * Handles changes to a phase selection element and updates the phase requirement message.
 *
 * @param {Event} event - The event object triggered by the change.
 */
function handlePhaseSelectChange(event) {
    const selectedValue = event.target.value;
    phaseReq.textContent = selectedValue === null ? '*' : '';
}

phaseSelectBoxEle.forEach((ele) => {
    ele.addEventListener('change', handlePhaseSelectChange);
});


selectTitleBox.addEventListener('input', () => {
    if (selectTitleBox.value) titleReq.textContent = '';
})



/**
 * Generates a timestamp based on the provided hour, minute, second, and phase (AM/PM).
 *
 * @param {number} hour - The hour in 12-hour format (1-12).
 * @param {number} minute - The minute (0-59).
 * @param {number} second - The second (0-59).
 * @param {string} phase - The AM/PM indicator (either 'AM' or 'PM').
 * @returns {number} The generated timestamp in milliseconds.
 */
function generateTimestamp(hour, minute, second, phase) {
    // Create a new Date object for the current date
    const currentDate = new Date();

    // Adjust the hour based on the phase (PM)
    if (phase === 'PM') {
        hour += 12;
    }

    // Set the provided hour, minute, and second
    currentDate.setHours(hour);
    currentDate.setMinutes(minute);
    currentDate.setSeconds(second);

    // Get the timestamp in milliseconds
    const timestamp = currentDate.getTime();

    return timestamp;
}



/**
 * Creates option elements for a select element within a specified range.
 *
 * @param {HTMLElement} selectElement - The select element to populate with options.
 * @param {number} start - The starting value for the options.
 * @param {number} end - The ending value for the options.
 * @param {number} step - The increment between options (default: 1).
 * @param {string} noSelectionText - The text for the "Select" option (default: "Select").
 */
function createSelectOptions(selectElement, start, end, step = 1, noSelectionText = 'Select') {
    const documentFragment = document.createDocumentFragment();

    for (let i = start; i <= end; i += step) {
        const option = document.createElement('option');
        if (i === 0) {
            option.textContent = noSelectionText;
            option.value = noSelectionText;
            // seconds should start from 00 (optional to set)
            if (selectElement == selectSecondEle) {
                option.value = i.toString().padStart(2, '0');
                option.textContent = option.value;
            }
        }
        else {
            option.value = i.toString().padStart(2, '0');
            option.textContent = option.value;
        }
        documentFragment.appendChild(option);
    }
    selectElement.appendChild(documentFragment);
}



/**
 * Populates select elements with options for hours, minutes, and seconds.
 */
function loadSelectOptions() {
    createSelectOptions(selectHourEle, 0, 12);
    createSelectOptions(selectMinuteEle, 0, 59);
    createSelectOptions(selectSecondEle, 0, 59);
}



/**
 * Displays an alert message with a specified status.
 *
 * @param {string} message - The message to display within the alert.
 * @param {string} status - The status of the alert (e.g., 'success', 'error').
 */
function displayAlert(message, status = 'success') {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'show', status);

    const msgIcon = (status === 'invalid' ? 'fa-circle-exclamation' : 'fa-circle-check');
    alertElement.innerHTML = `<span class="msg-symbol"><i class="fa-solid ${msgIcon}"></i></span>
                                 <span class="msg">${message}</span>
                                 <span class="close-btn"><i class="fa-solid fa-xmark"></i></span>`;

    document.body.appendChild(alertElement);

    const alertCloseBtn = document.querySelector('.close-btn');
    alertCloseBtn.addEventListener('click', () => {
        alertElement.classList.remove('show');
        alertElement.classList.add('hide');
    });

    setTimeout(() => {
        alertElement.classList.remove('show');
        alertElement.classList.add('hide');
    }, 5000);
}