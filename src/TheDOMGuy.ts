import { Popup, PopupType } from "./Popup";
import { SortBy, SortOrder, TaskMoverState } from "./Task";
import { taskPriorityToString } from "./Utils";
import { RootTaskHandler, RootTaskLists } from "./AppConfig";
import { RawHTML } from "./RawHTML";

export class TheDOMGuy {
    public static loadTaskLists () {
        let html_data = "";
        for (const list_name in RootTaskLists) {
            const task_list = RootTaskLists[list_name];
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

        for (const list_name in RootTaskLists) {
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
                Popup.open(PopupType.NEW_TASK, list_name);
            });
        }
    }

    public static updateTaskList (list_name: string) {
        if (!RootTaskLists[list_name])
            throw new Error("List not loaded");

        const list_div = document.getElementById(list_name+"-list");
        const tasks_div = list_div.getElementsByClassName("tasks")[0] as HTMLElement;
        const sort = list_div.getElementsByClassName('sort-by')[0] as HTMLElement;
        const no_tasks_div = list_div.getElementsByClassName('no-task-here')[0] as HTMLElement;
        const tasks = RootTaskLists[list_name].getTasks();

        const sort_span = list_div.getElementsByClassName("sort-info")[0] as HTMLElement;
        sort_span.innerHTML = RawHTML.sort(list_name, RootTaskLists[list_name].getSortBy());

        const sort_order_span = list_div.getElementsByClassName("sort-order-arrow")[0] as HTMLElement;
        sort_order_span.innerHTML = RootTaskLists[list_name].getSortOrder() == SortOrder.ASC ?
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
        if (!RootTaskLists[list_name])
            throw new Error("List not loaded");

        RootTaskLists[list_name].updateSortBy(sort_by);
        TheDOMGuy.updateTaskList(list_name);
    }

    public static toggleSortOrder (list_name: string) {
        if (!RootTaskLists[list_name])
            throw new Error("List not loaded");

        RootTaskLists[list_name].toggleSortOrder();
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
