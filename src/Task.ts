export enum TaskPriority {
    NONE = 4,
    LOW = 3,
    MEDIUM = 2,
    HIGH = 1,
}

export const TaskMoverState = {
    ref: null,
    initialized: false,
    to_list_ref: null
};

export type Task = {
    id: string,
    title: string,
    list_name: string,
    description: string,
    end_date: Date,
    priority: TaskPriority,
    checked: Boolean,
}

export enum SortBy {
    PRIORITY,
    END_DATE
}

export enum SortOrder {
    ASC, DESC
}

export type TaskConfig = {
    title?: string,
    description?: string,
    end_date?: Date,
    priority?: TaskPriority,
    checked?: Boolean
};
