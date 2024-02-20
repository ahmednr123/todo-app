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

//Better to have ParentTasksArray in a class and restrict
//illegal modifications. Also move TaskOperations to here
const ParentTasksArray: Array<Task> = [];

type TaskConfig = {
    list_name: String,

    title?: String,
    description?: String,
    end_date?: Date,
    priority?: TaskPriority,
    checked?: Boolean
};

class TaskOperations {
    public static new (config: TaskConfig): Task {
        if (!TaskList.exists(config.list_name)) {
            throw new Error("TaskList doesn't exist.");
        }

        return {
            id: uuid(),
            list_name: config.list_name,
            title: config.title || "",
            description: config.description || "",
            end_date: config.end_date || (new Date()),
            priority: config.priority || TaskPriority.NONE,
            checked: config.checked || false
        }
    }
}

class TaskList {
    name: String;
    sort_order: SortOrder;
    sort_by: SortBy;

    private static task_lists: Set<TaskList> = new Set();
    public static parent_tasks: Array<Task> = null;

    public static exists (name: String) {
        for (let t of TaskList.task_lists) {
            if (t.name == name)
                return true;
        }

        return false;
    }

    public constructor (name: String) {
        if (!TaskList.parent_tasks)
            throw new Error("Parent task list not assigned to TaskList");

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
        return TaskList.parent_tasks
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

const task1: Task =
TaskOperations.new({
    title: "Title 1",
    end_date: new Date(),
    priority: TaskPriority.HIGH,
    list_name: 'todo',
    checked: false
});

const task2: Task =
TaskOperations.new({
    title: "Title 2",
    end_date: new Date(),
    priority: TaskPriority.HIGH,
    list_name: 'todo',
    checked: false
});

const task3: Task =
TaskOperations.new({
    title: "Title 3",
    end_date: new Date(),
    priority: TaskPriority.HIGH,
    list_name: 'todo',
    checked: false
});

TaskList.parent_tasks = ParentTasksArray;
const todo_task_list = new TaskList('todo');

ParentTasksArray.push(task2);
ParentTasksArray.push(task1);
ParentTasksArray.push(task3);

console.log("Tasks: ");
console.dir(todo_task_list.getTasks());
