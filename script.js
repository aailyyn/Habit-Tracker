
let $markBtn, $progressGrid, $streakCounter;
const LOCAL_STORAGE_KEY = 'habitTrackerData';
let completedDates = []; 


function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function loadHabitData() {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
        
        return JSON.parse(storedData);
    }
    
    return [];
}


function saveHabitData(data) {
    
    const dataToStore = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, dataToStore);
}




function renderProgressGrid() {
    
    $progressGrid.empty();

    const today = new Date();
    const numDaysToDisplay = 30; 
    for (let i = numDaysToDisplay - 1; i >= 0; i--) {
        const day = new Date(today); 
        day.setDate(today.getDate() - i);

        
        const dayDateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;

        const $dayBox = $('<div>'); 
        $dayBox.addClass('day-box'); 

       
        if (completedDates.includes(dayDateString)) {
            $dayBox.addClass('completed'); 
        }

       
        $progressGrid.prepend($dayBox);
    }
}


function calculateStreak() {
    console.log("--- calculateStreak() started ---");
    let currentStreak = 0;
    const todayDateString = getTodayDateString();
    console.log("Today's date string:", todayDateString);
    console.log("Completed dates:", completedDates); 

    
    if (completedDates.length === 0) {
        $streakCounter.text(`Current Streak: 0`);
        console.log("No completed dates found. Streak: 0");
        console.log("--- calculateStreak() finished ---");
        return;
    }

    
    if (!completedDates.includes(todayDateString)) {
        $streakCounter.text(`Current Streak: 0`);
        console.log("Today not marked. Streak: 0");
        console.log("--- calculateStreak() finished ---");
        return;
    }

    
    currentStreak = 1;
    console.log("Today is marked. Initial streak:", currentStreak);
    let dayCounter = 1;

   
    while (true) {
        const previousDay = new Date();
        
        previousDay.setDate(new Date().getDate() - dayCounter);

        const previousDayString = `<span class="math-inline">\{previousDay\.getFullYear\(\)\}\-</span>{String(previousDay.getMonth() + 1).padStart(2, '0')}-${String(previousDay.getDate()).padStart(2, '0')}`;
        console.log("Checking previous day:", previousDayString);

        if (completedDates.includes(previousDayString)) {
            currentStreak++;
            dayCounter++;
            console.log("Day marked. Streak now:", currentStreak);
        } else {
            
            console.log("Streak broken at:", previousDayString);
            break;
        }
    }

    
    $streakCounter.text(`Current Streak: ${currentStreak}`);
    console.log("Final streak displayed:", currentStreak);
    console.log("--- calculateStreak() finished ---");
}


$(document).ready(function() {
    
    $markBtn = $("#mark-complete-btn");
    $progressGrid = $("#progress-grid");
    $streakCounter = $("#streak-counter");

    
    const habitName = "Read for 15 minutes"; 
    $("#habit-tracker-app h2").text(habitName);

    
    completedDates = loadHabitData();

    
    renderProgressGrid();

    calculateStreak();

    
    $markBtn.on('click', function() {
        const todayString = getTodayDateString();
        if (completedDates.includes(todayString)) {
            console.log('Habit already marked for today!');
            
            return; 
        }

        
        completedDates.push(todayString);

       
        saveHabitData(completedDates);

        
        renderProgressGrid();

        
        calculateStreak();

        console.log("Habit marked for today!");
        
    });
});