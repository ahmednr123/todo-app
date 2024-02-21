import { Popup, PopupType } from './Popup';
import { RootTaskHandler, SortBy, TaskMoverState } from './Task';
import { TheDOMGuy } from './TheDOMGuy';
import './style.css';

document.addEventListener("click", (evt) => {
    let target = evt.target as HTMLElement;

    if (!target)
        return;

    const toggle_sort_order = target.getAttribute("toggle-sort-order");
    if (toggle_sort_order) {
        const list_name = target.getAttribute("list-name");
        TheDOMGuy.toggleSortOrder(list_name);
        return;
    }

    const update_sort = target.getAttribute("update-sort");
    if (update_sort) {
        const list_name = target.getAttribute("list-name");
        switch (update_sort) {
            case "priority":
                TheDOMGuy.updateSort(list_name, SortBy.PRIORITY);
                break;
            case "end_date":
                TheDOMGuy.updateSort(list_name, SortBy.END_DATE);
                break;
        }
        return;
    }

    if (target.getAttribute("toggle-task") || (target.parentElement && target.parentElement.getAttribute("toggle-task"))) {
        const elem = target.getAttribute("toggle-task") ? target : target.parentElement;
        const task_id = elem.getAttribute("task-id");
        const task = RootTaskHandler.getTask(task_id);
        task.checked = !task.checked;
        if (task.checked) {
            if (!elem.classList.contains('checked')) {
                elem.classList.add('checked');
            }
        } else {
            elem.classList.remove('checked');
        }
        return;
    }

    while (!target.classList.contains('task-container')) {
        if (target.tagName.toLowerCase() == 'body' || target.parentElement == null) {
            return;
        }
        target = target.parentElement;
    }

    Popup.open(PopupType.CURRENT_TASK, target.getAttribute('task-id'));
});

document.addEventListener("mousedown", (evt) => {
    let target = evt.target as HTMLElement;
    while (!target.classList.contains('task-container')) {
        if (target.tagName.toLowerCase() == 'body' || target.parentElement == null) {
            return;
        }
        target = target.parentElement;
    }

    if (evt.button != 0)
        return;

    TaskMoverState.ref = target;
    TaskMoverState.initialized = false;
});

document.addEventListener("mousemove", function (evt) {
    if (TaskMoverState.ref && !TaskMoverState.initialized) {
        const computedStyle = getComputedStyle(TaskMoverState.ref);
        const width = parseInt(computedStyle.width);
        const height = parseInt(computedStyle.height);

        TaskMoverState.ref.style.position = "fixed";
        TaskMoverState.ref.style.width = width + 'px';
        TaskMoverState.ref.style.height = height + 'px';
        TaskMoverState.ref.style.zIndex = '30';

        document.body.style.cursor = "move";
        TaskMoverState.initialized = true;
    }

    if (TaskMoverState.ref) {
        evt.preventDefault();
        TaskMoverState.ref.style.top = `${evt.clientY+1}px`;
        TaskMoverState.ref.style.left = `${evt.clientX+1}px`;
    }
});

document.addEventListener("mouseup", function () {
    if (TaskMoverState.ref) {
        document.body.style.cursor = "auto";

        TaskMoverState.ref.style.position = "relative";
        TaskMoverState.ref.style.width = 'auto';
        TaskMoverState.ref.style.height = 'auto';
        TaskMoverState.ref.style.top = 'auto';
        TaskMoverState.ref.style.left = 'auto';
        TaskMoverState.ref.style.zIndex = '0';

        if (TaskMoverState.to_list_ref) {
            const moveHereElem = TaskMoverState.to_list_ref.getElementsByClassName("move-here")[0] as HTMLElement;
            if (moveHereElem)
                moveHereElem.style.display = "none";

            const to_list_name = TaskMoverState.to_list_ref.getAttribute("list-name");
            const old_list_name = RootTaskHandler.moveTask(TaskMoverState.ref.getAttribute('task-id'), to_list_name);
            TheDOMGuy.updateTaskList(to_list_name);
            TheDOMGuy.updateTaskList(old_list_name);
        }

        TaskMoverState.initialized = false;
        TaskMoverState.ref = null;
    }
});

Popup.init();
TheDOMGuy.loadTaskLists();
