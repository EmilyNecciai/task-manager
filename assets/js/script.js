// ADD TASK TO TASK LIST
var taskIdCounter = 0;

var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;
  
    var isEdit = formEl.hasAttribute("data-task-id");

    //package data as object
   //get task id and call function if is edit
   if (isEdit) {
       var taskId = formEl.getAttribute("data-task-id");
       completeEditTask(taskNameInput, taskTypeInput, taskId);
   } else {
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };
    createTaskEl(taskDataObj);    
   }
};

var createTaskEl = function(taskDataObj) {

        //create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        //add taskid as custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter);

        //create div to hold task info
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
        listItemEl.appendChild(taskInfoEl);
    
        var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);
        
        //add list item to list
        switch (taskDataObj.status) {
            case "to do":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
              tasksToDoEl.append(listItemEl);
              break;
            case "in progress":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
              tasksInProgressEl.append(listItemEl);
              break;
            case "completed":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
              tasksCompletedEl.append(listItemEl);
              break;
            default:
              console.log("Something went wrong!");
          }
        
        taskDataObj.id = taskIdCounter;

        tasks.push(taskDataObj);

        saveTasks();

        taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //EDIT BUTTON
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);
    
    //DELETE BUTTON
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }


    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
        saveTasks();
    };

    alert("Task Updated!");

    //reset button
    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
};


var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//DELETE TASK FUNCTION
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    tasks = updatedTaskArr;
    saveTasks();
};

//EDIT TASK FUNCTIOn
var editTask = function(taskId) {
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    formEl.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

//CHANGE COLUMN FUNCTION
var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//PSEUDO for Load Tasks
//Gets task items from localStorage.
// Converts tasks from the string format back into an array of objects.
// Iterates through a tasks array and creates task elements on the page from it.

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    
    if (!savedTasks) {
        return false;
    }
//get data back into an array of objects
    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++) {
        //pass each task OBJECT into the createTaskEl() FUNCTION
        createTaskEl(savedTasks[i]); 
    }
};


//CREATE NEW TASK EVENT LISTENER
formEl.addEventListener("submit", taskFormHandler);

//GENERAL EVENT LISTENER
pageContentEl.addEventListener("click", taskButtonHandler);

//change column event listener
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();
