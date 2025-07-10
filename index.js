const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const submitBtn = document.getElementById("submit-btn");
const deleteBtn = document.getElementById("delete-btn");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const deadlineInput = document.getElementById("deadline-input");
const overdueList = document.getElementById("overdue-list");

// Add task
submitBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    const priority = prioritySelect.value;
    const createdAt = getCurrentDate();
    const deadlineValue = deadlineInput.value;

    if (task === "") {
        alert("Todo cannot be empty!");
        return;
    }

    const li = createTaskElement(task, priority, deadlineValue, createdAt);
    const isOverdue = isDeadlineOverdue(deadlineValue);
    li.dataset.origin = isOverdue ? "overdue" : "todo";

    if (isOverdue) {
        overdueList.appendChild(li);
    } else {
        todoList.appendChild(li);
    }

    taskInput.value = "";
    deadlineInput.value = "";
});

// Delete all to-do and done
deleteBtn.addEventListener("click", () => {
    if (confirm("Delete All Todo?")) {
        todoList.innerHTML = "";
        doneList.innerHTML = "";
    }
});

// Helper
function createElementHtml(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
        if (key === "textHtml") {
            element.textContent = value;
        } else {
            element.setAttribute(key, value);
        }
    }
    for (const child of children) {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    }
    return element;
}

function createTaskElement(task, priority, deadlineValue, createdAt) {
    const spanName = createElementHtml("span", { textHtml: "John Doe" });
    const pName = createElementHtml("p", {}, [spanName]);
    const spanPosition = createElementHtml("span", { textHtml: "Developer" });
    const pPosition = createElementHtml("p", {}, [spanPosition]);
    const createdAtEl = createElementHtml("time", { datetime: createdAt.iso, textHtml: createdAt.text });
    const pCreatedAt = createElementHtml("p", {}, [createdAtEl]);
    const spanPriority = createElementHtml("span", { textHtml: `(${priority})` });
    const pPriority = createElementHtml("p", {}, [spanPriority]);
    const pTask = createElementHtml("p", { textHtml: task });
    const checkbox = createElementHtml("input", { type: "checkbox" });
    const pDeadline = createElementHtml("p", {}, [
        createElementHtml("time", { datetime: deadlineValue, textHtml: `Deadline: ${formatDateReadable(deadlineValue)}` })
    ]);

    const divHead = createElementHtml(
        "div",
        { class: "profile created-at priority" },
        [pName, pCreatedAt, pPosition, pPriority, pDeadline]
    );

    const divTask = createElementHtml("div", { class: "task" }, [pTask]);
    const divData = createElementHtml("div", { class: "data" }, [divHead, divTask]);

    const li = createElementHtml(
        "li",
        { class: `priority-${priority}` },
        [divData, checkbox]
    );

    checkbox.addEventListener("change", () => {
        li.classList.toggle("done-task", checkbox.checked);

        if (checkbox.checked) {
            doneList.appendChild(li);
        } else {
            const origin = li.dataset.origin;
            if (origin === "overdue") {
                overdueList.appendChild(li);
            } else {
                todoList.appendChild(li);
            }
        }
    });

    return li;
}

function getCurrentDate() {
    const now = new Date();
    const iso = now.toISOString().split("T")[0];
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const text = now.toLocaleDateString("en-US", options);
    return { iso, text };
}

function formatDateReadable(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
}

function isDeadlineOverdue(deadlineStr) {
    if (!deadlineStr) return "";
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today;
}
