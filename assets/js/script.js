// ADD TASK TO TASK LIST
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    //package data as object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send as arguement to createTaskEl
    createTaskEl(taskDataObj);

    formEl.reset();
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
    
        //add list item to list
        tasksToDoEl.appendChild(listItemEl);

        taskIdCounter++;
};

formEl.addEventListener("submit", taskFormHandler);


