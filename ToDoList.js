let title = document.getElementById("title");
let category = document.getElementById("category");
let description = document.getElementById("description");
let priority = document.getElementById("priority");
let submitBtn = document.getElementById("submit-btn");
let search = document.getElementById("search");

let mood = "create";
let tmp;
let dataTasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];

submitBtn.onclick = function() {
    let newTask = {
        title: title.value,
        category: category.value || "General",
        description: description.value,
        priority: priority.value,
        completed: false,
        date: new Date().toLocaleDateString()
    };

    if (title.value != "") {
        if (mood === "create") {
            dataTasks.push({ ...newTask, id: Date.now() });
        } else {
            let index = dataTasks.findIndex(item => item.id === tmp);
            if (index !== -1) {
                dataTasks[index] = { ...newTask, id: tmp, completed: dataTasks[index].completed, date: dataTasks[index].date };
            }
            mood = "create";
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                </svg>
                Create Task`;
        }
        clearData();
    }
    localStorage.setItem("tasks", JSON.stringify(dataTasks));
    showData();
};

function clearData() {
    title.value = ""; 
    category.value = ""; 
    description.value = ""; 
    priority.value = "Low";
}

function showData(data = dataTasks) {
    let container = document.getElementById("cards-container");
    let cards = "";
    
    data.forEach((item) => {
        let isCompleted = item.completed ? "completed" : "";
        cards += `
            <div class="task-card card ${isCompleted} animate-in">
                <div class="tape"></div>
                <div class="card-header">
                    <div>
                        <span class="date-text">${item.category}</span>
                        <h3>${item.title}</h3>
                    </div>
                    <span class="badge badge-priority-${item.priority}">${item.priority}</span>
                </div>
                <p class="desc-text">${item.description}</p>
                <div class="card-footer">
                    <span class="date-text">${item.date}</span>
                    <div class="actions">
                        <button class="btn-icon btn-success" onclick="toggleComplete(${item.id})">
                            ${item.completed ? 'Undo' : 'Done'}
                        </button>
                        <button class="btn-icon" onclick="updateData(${item.id})">Edit</button>
                        <button class="btn-icon btn-danger" onclick="deleteData(${item.id})">Delete</button>
                    </div>
                </div>
            </div>`;
    });
    container.innerHTML = cards;


    let delBtn = document.getElementById("deleteAllBtnContainer");
    if (dataTasks.length > 0) {
        let displayCount = (search.value != "") ? data.length : dataTasks.length;
        delBtn.innerHTML = `
            <button class="btn-danger" onclick="deleteAll()">
                Delete All (${displayCount})
            </button>`;
    } else {
        delBtn.innerHTML = "";
    }
}

window.deleteData = (id) => {
    dataTasks = dataTasks.filter(item => item.id !== id);
    localStorage.tasks = JSON.stringify(dataTasks);
    
    if (search.value != "") {
        searchData(search.value);
    } else {
        showData();
    }
};

window.deleteAll = () => {
    if (search.value != "") {
        let filteredIds = dataTasks.filter(item => 
            item.title.toLowerCase().includes(search.value.toLowerCase()) || 
            item.category.toLowerCase().includes(search.value.toLowerCase())
        ).map(item => item.id);
        
        dataTasks = dataTasks.filter(item => !filteredIds.includes(item.id));
        search.value = "";
    } else {
        dataTasks = [];
    }
    
    localStorage.tasks = JSON.stringify(dataTasks);
    showData();
};

window.toggleComplete = (id) => {
    let index = dataTasks.findIndex(item => item.id === id);
    if (index !== -1) {
        dataTasks[index].completed = !dataTasks[index].completed;
        localStorage.tasks = JSON.stringify(dataTasks);
        
        if (search.value != "") {
            searchData(search.value);
        } else {
            showData();
        }
    }
};

window.updateData = (id) => {
    let item = dataTasks.find(p => p.id === id);
    title.value = item.title;
    category.value = item.category;
    description.value = item.description;
    priority.value = item.priority;
    
    mood = "update";
    tmp = id;
    submitBtn.innerHTML = "Update Task";
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.searchData = (value) => {
    let filteredData = dataTasks.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
    );
    showData(filteredData);
};

showData();