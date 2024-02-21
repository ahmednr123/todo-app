import { RootTaskHandler, SortOrder, Task, TaskList } from ".";

const RawHTML = {
    list: (list_name: string, list_proper_name: string, tasks: Array<Task>, sort_order: SortOrder) =>
        `<div class="tasks-container" id="${list_name}-list" list-name="${list_name}">
            <div class="list-header">
                <div class="header-title">${list_proper_name}</div>
                <div class="add-task">+</div>
            </div>
            <div class="sort-by" style="${tasks.length == 0 && "display: none;"}">
                <div>
                    <span style="margin-right: 3px;">Sort by:</span>
                    <a href="#" style="margin-right: 3px;">Priority</a>
                    <a href="#">End Date</a>
                </div>
                <div>
                    <span class="material-symbols-outlined" style="font-size: 14px">
                        ${sort_order == SortOrder.ASC ? "arrow_upward" : "arrow_downward"}
                    </span>
                </div>
            </div>
            <div class="tasks" style="${tasks.length == 0 && "display: none;"}">
                ${tasks.map(t => RawHTML.task(t.id, t.title, t.checked))}
            </div>
            <div class="no-task-here" style="${tasks.length == 0 && "display: block;"}">
                No tasks added to this list
            </div>
        </div>`,

    task: (id: string, title: string, is_checked: Boolean) => `
        <div class="task-container high" task-id="${id}">
            <div class="check-box ${is_checked && "checked"}">
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

class TheDOMGuy {
    public static loadTaskLists () {
        let html_data = "";
        for (const list_name in task_lists) {
            const task_list = task_lists[list_name];
            html_data += RawHTML.list(list_name, task_list.proper_name, task_list.getTasks(), task_list.getSortOrder());
        }

        const appContainer = document.getElementById("app-container");
        appContainer.innerHTML = html_data;
    }

    public static updateTaskList (list_name: string) {
        if (!task_lists[list_name])
            throw new Error("List not loaded");

        const list_div = document.getElementById(list_name+"-list");
        const tasks_div = list_div.getElementsByClassName("tasks")[0];

        let tasks_html = "";
        for (let task of task_lists[list_name].getTasks()) {
            tasks_html += RawHTML.task(task.id, task.title, task.checked);
        }

        tasks_div.innerHTML = tasks_html;
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

                task_div.classList.add(task.priority.toString());

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
