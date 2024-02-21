import { TaskPriority } from "./Task";

export function
stringToTaskPriority (priority: string): TaskPriority {
    switch (priority.toLowerCase()) {
        case 'none':
            return TaskPriority.NONE;
        case 'low':
            return TaskPriority.LOW;
        case 'medium':
            return TaskPriority.MEDIUM;
        case 'high':
            return TaskPriority.HIGH;
    }

    throw new Error("Unknown priority value");
}

export function
taskPriorityToString (priority: TaskPriority): string {
    switch (priority) {
        case TaskPriority.NONE:
            return 'none';
        case TaskPriority.LOW:
            return 'low';
        case TaskPriority.MEDIUM:
            return 'medium';
        case TaskPriority.HIGH:
            return 'high';
    }
}

//ChatGPT
export function
formatDateToHTMLInputDate(date: Date) {
    // Get year, month, and day components from the date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the HTML input date string in the format yyyy-mm-dd
    const htmlInputDate = `${year}-${month}-${day}`;
    return htmlInputDate;
}
