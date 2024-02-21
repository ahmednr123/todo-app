import { TaskPriority } from "./Task";
import { TasksHandler } from "./TaskHandler";
import { TaskList } from "./TaskList";

export const RootTaskHandler = new TasksHandler();
TaskList.tasks_handler = RootTaskHandler;

const todoList = new TaskList('todo', 'To Do');
const progressList = new TaskList('progress', 'In Progress');
const doneList = new TaskList('done', 'Done');

export const RootTaskLists = {};

RootTaskLists[todoList.getName()] = todoList;
RootTaskLists[progressList.getName()] = progressList;
RootTaskLists[doneList.getName()] = doneList;

RootTaskHandler.addTask('todo', {
    title: "Research market trends for project X",
    description: "This is some descriuption for the sample task",
    checked: false,
    priority: TaskPriority.LOW
});

RootTaskHandler.addTask('todo', {
    title: "Draft outline for presentation on topic Y",
    description: "This is some descriuption for the sample task",
    checked: false,
    priority: TaskPriority.LOW
});

RootTaskHandler.addTask('todo', {
    title: "Schedule meeting with team to discuss upcoming deadlines",
    description: "This is some descriuption for the sample task",
    checked: false,
    priority: TaskPriority.HIGH
});

RootTaskHandler.addTask('todo', {
    title: "Review and respond to emails from clients",
    description: "This is some descriuption for the sample task",
    checked: false,
    priority: TaskPriority.MEDIUM
});

RootTaskHandler.addTask('todo', {
    title: "Create marketing plan for new product launch",
    description: "This is some descriuption for the sample task",
    checked: false,
    priority: TaskPriority.NONE
});

RootTaskHandler.addTask('progress', {
    title: "Design UI mockups for website redesign",
    description: "This is some descriuption for the sample task",
    checked: true,
    priority: TaskPriority.MEDIUM
});

RootTaskHandler.addTask('progress', {
    title: "Analyze data for quarterly report",
    description: "This is some descriuption for the sample task",
    checked: true,
    priority: TaskPriority.HIGH
});

RootTaskHandler.addTask('done', {
    title: "Finalize budget proposal for next quarter",
    description: "This is some descriuption for the sample task",
    checked: true,
    priority: TaskPriority.LOW
});

RootTaskHandler.addTask('done', {
    title: "Present findings from market research to management",
    description: "This is some descriuption for the sample task",
    checked: true,
    priority: TaskPriority.HIGH
});

RootTaskHandler.addTask('done', {
    title: "Send follow-up emails to clients regarding ongoing projects",
    description: "This is some descriuption for the sample task",
    checked: true,
    priority: TaskPriority.HIGH
});
