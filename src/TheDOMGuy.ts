import { Popup, PopupType } from "./Popup";
import { RootTaskHandler, SortBy, SortOrder, Task, TaskMoverState, TaskPriority, TasksHandler, taskPriorityToString } from "./Task";
import { TaskList } from "./TaskList";

const RawHTML = {
    sort: (list_name: string, sort_by: SortBy) => sort_by == SortBy.PRIORITY ?
        `<b style="margin-right: 3px;">Priority</b>
        <a href="#" update-sort="end_date" list-name="${list_name}">End Date</a>` :
        `<a href="#" style="margin-right: 3px;" update-sort="priority" list-name="${list_name}">Priority</a>
        <b>End Date</b>`
    ,
    list: (list_name: string, list_proper_name: string, tasks: Array<Task>, sort_order: SortOrder, sort_by: SortBy) =>
        `<div class="tasks-container" id="${list_name}-list" list-name="${list_name}">
            <div class="move-here">Move Here</div>
            <div class="list-header">
                <div class="header-title">${list_proper_name}</div>
                <div class="add-task">+</div>
            </div>
            <div class="sort-by" style="${tasks.length == 0 && "display: none;"}">
                <div>
                    <span style="margin-right: 3px;">Sort by:</span>
                    <span class="sort-info">
                        ${RawHTML.sort(list_name, sort_by)}
                    </span>
                </div>
                <div>
                    <span toggle-sort-order="true" class="material-symbols-outlined sort-order-arrow" style="font-size: 14px" list-name="${list_name}">
                        ${sort_order == SortOrder.ASC ? "arrow_upward" : "arrow_downward"}
                    </span>
                </div>
            </div>
            <div class="tasks" style="${tasks.length == 0 && "display: none;"}">
                ${tasks.map(t => RawHTML.task(t.id, t.title, t.checked, t.priority, list_name))}
            </div>
            <div class="no-task-here" style="${tasks.length == 0 && "display: block;"}">
                No tasks added to this list
            </div>
        </div>`,

    task: (id: string, title: string, is_checked: Boolean, priority: TaskPriority, list: string) => `
        <div class="task-container ${taskPriorityToString(priority)}" task-id="${id}" task-list="${list}">
            <div class="check-box ${is_checked && "checked"}" toggle-task="true" task-id="${id}">
                <span class="material-symbols-outlined">done</span>
            </div>
            <div class="task-title">
                ${title}
            </div>
        </div>
        `
}
const todoList = new TaskList('todo', 'To Do');
const progressList = new TaskList('progress', 'In Progress');
const doneList = new TaskList('done', 'Done');

const task_lists = {};
task_lists[todoList.getName()] = todoList;
task_lists[progressList.getName()] = progressList;
task_lists[doneList.getName()] = doneList;

RootTaskHandler.addTask('todo', {
    title: "Sample Task",
    description: "This is some descriuption for the sample task",
    checked: false,
    priority: TaskPriority.HIGH
});

RootTaskHandler.addTask('progress', {
    title: "This is some task that I want to add to the 'In Progress' section",
    description: "This is some descriuption for the sample task",
    checked: true,
    priority: TaskPriority.LOW
});

export class TheDOMGuy {
    public static loadTaskLists () {
        let html_data = "";
        for (const list_name in task_lists) {
            const task_list = task_lists[list_name];
            html_data +=
                RawHTML.list(
                    list_name,
                    task_list.proper_name,
                    task_list.getTasks(),
                    task_list.getSortOrder(),
                    task_list.getSortBy()
                );
        }

        const appContainer = document.getElementById("app-container");
        appContainer.innerHTML = html_data;

        for (const list_name in task_lists) {
            const list_div = document.getElementById(list_name+"-list");
            list_div.addEventListener('mouseenter', function () {
                if (TaskMoverState.ref && TaskMoverState.ref.getAttribute('task-list') != list_name) {
                    const moveHereElem = list_div.getElementsByClassName("move-here")[0] as HTMLElement;
                    moveHereElem.style.display = "flex";
                    TaskMoverState.to_list_ref = list_div;
                }
            });
            list_div.addEventListener('mouseleave', function () {
                TaskMoverState.to_list_ref = null;
                const moveHereElem = list_div.getElementsByClassName("move-here")[0] as HTMLElement;
                if (moveHereElem)
                    moveHereElem.style.display = "none";
            });
            list_div.getElementsByClassName("add-task")[0].addEventListener("click", function () {
                //Open popup with list_name info
                //alert("Open popup");
                Popup.open(PopupType.NEW_TASK, list_name);
            });
        }
    }

    public static updateTaskList (list_name: string) {
        if (!task_lists[list_name])
            throw new Error("List not loaded");

        const list_div = document.getElementById(list_name+"-list");
        const tasks_div = list_div.getElementsByClassName("tasks")[0] as HTMLElement;
        const sort = list_div.getElementsByClassName('sort-by')[0] as HTMLElement;
        const no_tasks_div = list_div.getElementsByClassName('no-task-here')[0] as HTMLElement;
        const tasks = task_lists[list_name].getTasks();

        const sort_span = list_div.getElementsByClassName("sort-info")[0] as HTMLElement;
        sort_span.innerHTML = RawHTML.sort(list_name, task_lists[list_name].getSortBy());

        const sort_order_span = list_div.getElementsByClassName("sort-order-arrow")[0] as HTMLElement;
        sort_order_span.innerHTML = task_lists[list_name].getSortOrder() == SortOrder.ASC ?
            "arrow_upward" : "arrow_downward";

        if (tasks.length == 0) {
            sort.style.display = 'none';
            tasks_div.style.display = 'none';
            no_tasks_div.style.display = 'block';
        } else {
            sort.style.display = 'flex';
            tasks_div.style.display = 'block';
            no_tasks_div.style.display = 'none';
        }

        let tasks_html = "";
        for (let task of tasks) {
            tasks_html += RawHTML.task(task.id, task.title, task.checked, task.priority, list_name);
        }

        tasks_div.innerHTML = tasks_html;
    }

    public static updateSort (list_name: string, sort_by: SortBy) {
        if (!task_lists[list_name])
            throw new Error("List not loaded");

        task_lists[list_name].updateSortBy(sort_by);
        TheDOMGuy.updateTaskList(list_name);
    }

    public static toggleSortOrder (list_name: string) {
        if (!task_lists[list_name])
            throw new Error("List not loaded");

        task_lists[list_name].toggleSortOrder();
        TheDOMGuy.updateTaskList(list_name);
    }

    public static updateTask (id: string) {
        const task = RootTaskHandler.getTask(id);
        const list_name = task.list_name;

        const list_div = document.getElementById(list_name+"-list");
        const tasks_div = list_div.getElementsByClassName("tasks")[0];
        const task_divs = tasks_div.getElementsByClassName("task-container");

        for (let task_div of task_divs) {
            if (task_div.getAttribute("task-id") == id) {
                task_div.classList.remove('none');
                task_div.classList.remove('high');
                task_div.classList.remove('medium');
                task_div.classList.remove('low');

                task_div.classList.add(taskPriorityToString(task.priority));

                const check_box = task_div.getElementsByClassName("check-box")[0];
                if (task.checked && !check_box.classList.contains('checked'))
                    check_box.classList.add('checked');
                else
                    check_box.classList.remove('checked');

                task_div.getElementsByClassName("task-title")[0]
                    .innerHTML = task.title;
                break;
            }
        }
    }
}
