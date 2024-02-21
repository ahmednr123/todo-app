import { SortBy, SortOrder, Task } from "./Task";
import { TasksHandler } from "./TaskHandler";

export class TaskList {
    name: string;
    proper_name: string;
    sort_order: SortOrder;
    sort_by: SortBy;

    private static task_lists: Set<TaskList> = new Set();
    public static tasks_handler: TasksHandler = null;

    public static exists (name: string) {
        for (let t of TaskList.task_lists) {
            if (t.name == name)
                return true;
        }

        return false;
    }

    public constructor (name: string, proper_name: string) {
        if (!TaskList.tasks_handler)
            throw new Error("Tasks handler not assigned to TaskList");

        this.name = name;
        this.proper_name = proper_name;
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

    public getName (): string { return this.name; }
    public getProperName (): string { return this.proper_name; }
    public getSortOrder (): SortOrder { return this.sort_order; }
    public getSortBy (): SortBy { return this.sort_by; }

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

    public toggleSortOrder () {
        if (this.sort_order == SortOrder.ASC)
            this.sort_order = SortOrder.DESC;
        else
            this.sort_order = SortOrder.ASC;
    }

    public toString () {
        return this.name;
    }
}
