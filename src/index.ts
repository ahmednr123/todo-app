import { v4 as uuid } from 'uuid';

import './style.css';

//document.addEventListener('click', (evt) => {
//    evt.preventDefault();
//    console.log("target:");
//    console.dir(evt.target);
//    console.log("related target:");
//    console.dir(evt.relatedTarget);
//});

const TaskState = {
    ref: null,
};

const progressList = document.getElementById("progress-list");
progressList.addEventListener('mouseenter', function () {
    if (TaskState.ref) {
        const moveHereElem = progressList.getElementsByClassName("move-here")[0] as HTMLElement;
        moveHereElem.style.display = "flex";
    }
});

progressList.addEventListener('mouseleave', function () {
    const moveHereElem = progressList.getElementsByClassName("move-here")[0] as HTMLElement;
    moveHereElem.style.display = "none";
});

const taskElement = document.getElementById("task-moveable")
taskElement.addEventListener("mousedown", function (evt) {
    if (evt.button != 0)
        return;

    TaskState.ref = taskElement;
    const computedStyle = getComputedStyle(TaskState.ref);
    const width = parseInt(computedStyle.width);
    const height = parseInt(computedStyle.height);

    console.log(`width: ${width} ${height}`);

    TaskState.ref.style.position = "fixed";
    TaskState.ref.style.width = width + 'px';
    TaskState.ref.style.height = height + 'px';
    TaskState.ref.style.zIndex = '30';
    console.log("mousedown");
});

document.addEventListener("mousemove", function (evt) {
    if (TaskState.ref) {
        evt.preventDefault();
        TaskState.ref.style.top = `${evt.clientY+1}px`;
        TaskState.ref.style.left = `${evt.clientX+1}px`;
    }
});

document.addEventListener("mouseup", function () {
    if (TaskState.ref) {
        TaskState.ref.style.position = "relative";
        TaskState.ref.style.width = 'auto';
        TaskState.ref.style.height = 'auto';
        TaskState.ref.style.top = 'auto';
        TaskState.ref.style.left = 'auto';
        TaskState.ref.style.zIndex = '0';
        TaskState.ref = null;
        console.log(`mouseup`);
    }
});

enum TaskPriority {
    NONE = 0,
    HIGH = 3,
    MEDIUM = 2,
    LOW = 1
}

type Task = {
    id: String,
    title: String,
    list_name: String,
    description: String,
    end_date: Date,
    priority: TaskPriority,
    checked: Boolean,
}

enum SortBy {
    PRIORITY,
    END_DATE
}

enum SortOrder {
    ASC, DESC
}

class TasksHandler {
    private tasks: Array<Task> = [];

    public getTasks () {
        return this.tasks.slice();
    }

    public addTask (list_name: String, config: TaskConfig) {
        if (!TaskList.exists(list_name)) {
            throw new Error("TaskList doesn't exist.");
        }

        this.tasks.push({
            id: uuid(),
            list_name: list_name,
            title: config.title || "",
            description: config.description || "",
            end_date: config.end_date || (new Date()),
            priority: config.priority || TaskPriority.NONE,
            checked: config.checked || false
        });
    }

    public removeTask (id: String) {
        const index = this.tasks.findIndex(t => t.id == id);
        if (index != -1) {
            this.tasks.splice(index);
        }
    }

    public getTask (id: String) {
        const task = this.tasks.find(t => t.id == id);
        if (!task)
            throw new Error("Task not found");
        return task;
    }

    public updateTask (id: String, config: TaskConfig) {
        const task = this.tasks.find(t => t.id == id);

        task.title = config.title || task.title;
        task.description = config.description || task.description;
        task.end_date = config.end_date || task.end_date;
        task.priority = config.priority || task.priority;
        task.checked = config.checked || task.checked;
    }

    public moveTask (id: String, list_name: String) {
        if (!TaskList.exists(list_name)) {
            throw new Error("TaskList doesn't exist.");
        }

        const task = this.tasks.find(t => t.id == id);
        task.list_name = list_name;
    }
}

type TaskConfig = {
    title?: String,
    description?: String,
    end_date?: Date,
    priority?: TaskPriority,
    checked?: Boolean
};

class TaskList {
    name: String;
    sort_order: SortOrder;
    sort_by: SortBy;

    private static task_lists: Set<TaskList> = new Set();
    public static tasks_handler: TasksHandler = null;

    public static exists (name: String) {
        for (let t of TaskList.task_lists) {
            if (t.name == name)
                return true;
        }

        return false;
    }

    public constructor (name: String) {
        if (!TaskList.tasks_handler)
            throw new Error("Tasks handler not assigned to TaskList");

        this.name = name;
        this.sort_order = SortOrder.ASC;
        this.sort_by = SortBy.PRIORITY;

        for (let t of TaskList.task_lists) {
           if (t.name == name)
                throw new Error("Task list already exists");
        }

        TaskList.task_lists.add(this);
    }

    private getComparator (sort_by: SortBy, sort_order: SortOrder) {
        switch (sort_by) {
            case SortBy.PRIORITY:
                return (a: Task, b: Task) => {
                    return sort_order == SortOrder.ASC ?
                        a.priority - b.priority :
                        b.priority - a.priority;
                }
            case SortBy.END_DATE:
                return (a: Task, b: Task) => {
                    return sort_order == SortOrder.ASC ?
                        a.end_date.getTime() - b.end_date.getTime() :
                        b.end_date.getTime() - a.end_date.getTime();
                }
        }
    }

    public getTasks (): Array<Task> {
        return TaskList.tasks_handler.getTasks()
                .filter(o => o.list_name == this.name)
                .toSorted(
                    this.getComparator(
                        this.sort_by,
                        this.sort_order
                    )
                );
    }

    public updateSortBy (sort_by: SortBy) {
        this.sort_by = sort_by;
    }

    public updateSortOrder (sort_order: SortOrder) {
        this.sort_order = sort_order;
    }

    public toString () {
        return this.name;
    }
}

const rootTaskHandler = new TasksHandler();

TaskList.tasks_handler = rootTaskHandler;
const todo_task_list = new TaskList('todo');
const progress_task_list = new TaskList('progress');
const done_task_list = new TaskList('done');

rootTaskHandler.addTask('todo', {
    title: "Title 1",
    end_date: new Date(),
    priority: TaskPriority.HIGH,
    checked: false
});

rootTaskHandler.addTask('todo', {
    title: "Title 2",
    end_date: new Date(),
    priority: TaskPriority.HIGH,
    checked: false
});

rootTaskHandler.addTask('todo', {
    title: "Title 3",
    end_date: new Date(),
    priority: TaskPriority.LOW,
    checked: false
});

rootTaskHandler.addTask('progress', {
    title: "Title 4",
    end_date: new Date(),
    priority: TaskPriority.MEDIUM,
    checked: false
});

console.log("Tasks: ");
console.dir(todo_task_list.getTasks());

console.log("Root Tasks: ");
console.dir(rootTaskHandler.getTasks());
