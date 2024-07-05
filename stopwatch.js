let startTime;
let elapsedTime = 0;
let timerInterval;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const recordsList = document.getElementById('recordsList');
const deleteBtn = document.getElementById('deleteBtn');
const selectAllBtn = document.getElementById('selectAllBtn');

// 모든 기록 삭제
const deleteAllRecords = () => {
    recordsList.innerHTML = "";
};

// start
const startTimer = () => {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        display.textContent = formatTime(elapsedTime);
    }, 10);
    startBtn.disabled = true;
    stopBtn.disabled = false;
};

// stop
const stopTimer = () => {
    clearInterval(timerInterval);
    addRecord();
    startBtn.disabled = false;
    stopBtn.disabled = true;
};

// reset
const resetTimer = () => {
    clearInterval(timerInterval);
    elapsedTime = 0;
    display.textContent = "00:00:00";
    startBtn.disabled = false;
    stopBtn.disabled = true;

    deleteAllRecords();
};

// 시간 포맷 함수
const formatTime = (time) => {
    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time % 3600000) / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000));
    return (
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds) +
        "." +
        (milliseconds < 100 ? "0" : "") + (milliseconds < 10 ? "0" : "") + milliseconds
    );
};

const updateSelectAllBtnState = () => {
    const checkboxes = recordsList.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    if (allChecked && checkboxes.length > 0) {
        selectAllBtn.classList.add('active');
        selectAllBtn.textContent = "🙈";
    } else {
        selectAllBtn.classList.remove('active');
        selectAllBtn.textContent = "🙉";
    }
};

// 기록 추가
const addRecord = () => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const span = document.createElement("span");
    const indexSpan = document.createElement("span");

    span.textContent = display.textContent;
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(indexSpan);
    
    recordsList.appendChild(li);
    updateRecordIndices();

    checkbox.addEventListener('change', updateSelectAllBtnState);
    updateSelectAllBtnState();
};

// 선택된 기록 삭제
const deleteSelectedRecords = () => {
    const records = recordsList.querySelectorAll('li');
    let hasChecked = false;
    records.forEach(record => {
        const checkbox = record.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            hasChecked = true;
            recordsList.removeChild(record);
        }
    });
    if (hasChecked) {
        updateRecordIndices();
        updateSelectAllBtnState();
    }
    return hasChecked;
};

// 전체 선택/해제
const checkBoxAll = () => {
    const checkboxes = recordsList.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });

    updateSelectAllBtnState();
};

const handleDelete = () => {
    const hasChecked = deleteSelectedRecords();
    if (!hasChecked) {
        deleteAllRecords();
    }
};

// 기록 순서 업데이트
const updateRecordIndices = () => {
    const records = recordsList.querySelectorAll('li');
    records.forEach((record, index) => {
        const indexSpan = record.querySelector('span:last-child');
        indexSpan.textContent = index + 1;
    });
};

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);
deleteBtn.addEventListener("click", handleDelete);
selectAllBtn.addEventListener("click", checkBoxAll);

// 초기 상태 설정
stopBtn.disabled = true;
display.textContent = "00:00:00";
updateSelectAllBtnState();