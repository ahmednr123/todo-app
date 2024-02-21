import { v4 as uuid } from 'uuid';
import { Task, TaskConfig, TaskPriority } from "./Task";
import { TaskList } from "./TaskList";

export class TasksHandler {
    private tasks: Array<Task> = [];

    public getTasks () {
        return this.tasks.slice();
    }

    public addTask (list_name: string, config: TaskConfig) {
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

    public removeTask (id: string) {
        const index = this.tasks.findIndex(t => t.id == id);
        if (index != -1) {
            this.tasks.splice(index, 1);
        }
    }

    public getTask (id: string) {
        const task = this.tasks.find(t => t.id == id);
        if (!task)
            throw new Error("Task not found");
        return task;
    }

    public updateTask (id: string, config: TaskConfig) {
        const task = this.tasks.find(t => t.id == id);

        task.title = config.title || task.title;
        task.description = config.description || task.description;
        task.end_date = config.end_date || task.end_date;
        task.priority = config.priority || task.priority;
        task.checked = config.checked || task.checked;
    }

    public moveTask (id: string, list_name: string) {
        if (!TaskList.exists(list_name)) {
            throw new Error("TaskList doesn't exist.");
        }

        const task = this.tasks.find(t => t.id == id);
        const old_list_name = task.list_name;
        task.list_name = list_name;
        return old_list_name;
    }
}
