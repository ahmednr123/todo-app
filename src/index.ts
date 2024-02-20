import { v4 as uuid } from 'uuid';

import './style.css';

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
