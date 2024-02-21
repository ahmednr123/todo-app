import { SortBy, SortOrder, Task, TaskPriority } from "./Task";
import { taskPriorityToString } from "./Utils";

export const RawHTML = {
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
                ${tasks.map(t => RawHTML.task(t.id, t.title, t.checked, t.priority, list_name)).join("")}
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
        </div>`
}

