import { RootTaskHandler, stringToTaskPriority, taskPriorityToString } from "./Task";
import { TheDOMGuy } from "./TheDOMGuy";

export enum PopupType {
    NEW_TASK,
    CURRENT_TASK
}

export class Popup {
    private static popup_type: PopupType = null;
    private static task_id: string = null;

    public static init () {
        const popup = document.getElementById("popup");
        const close = popup.getElementsByClassName("close")[0];
        close.addEventListener("click", () => {
            Popup._close();
        });

        const save = popup.getElementsByClassName("save")[0] as HTMLButtonElement;
        save.addEventListener("click", () => {
            const closeable = Popup._save();
            if (closeable)
                Popup._close();
        });

        const cancel = popup.getElementsByClassName("cancel")[0] as HTMLButtonElement;
        cancel.addEventListener("click", () => {
            Popup._close();
        });

        const _delete = popup.getElementsByClassName("delete")[0] as HTMLButtonElement;
        _delete.addEventListener("click", () => {
            Popup._delete();
            Popup._close();
        });
    }

    private static _open () {
        const backdrop = document.getElementById("backdrop");
        const popup = document.getElementById("popup");

        backdrop.style.display = "block";
        popup.style.display = "block";
    }

    private static _close () {
        const backdrop = document.getElementById("backdrop");
        const popup = document.getElementById("popup");

        backdrop.style.display = "none";
        popup.style.display = "none";

        Popup.popup_type = null;
        Popup.task_id = null;
    }

    public static open (type: PopupType, id: string) {
        const popup = document.getElementById("popup");
        const error_span = popup.getElementsByClassName("error")[0] as HTMLSpanElement;
        error_span.style.display = "none";

        switch(type) {
            case PopupType.NEW_TASK:
                (document.getElementById("list_name") as HTMLSelectElement).value = id;
                (popup.getElementsByClassName("delete")[0] as HTMLElement).style.display = "none";

                (document.getElementById("title") as HTMLInputElement).value = "";
                (document.getElementById("end_date") as HTMLInputElement).value = formatDateToHTMLInputDate(new Date());
                (document.getElementById("desc") as HTMLTextAreaElement).value = "";
                (document.getElementById("priority") as HTMLSelectElement).value = "none";
                break;
            case PopupType.CURRENT_TASK:
                Popup.task_id = id;
                (document.getElementById("popup").getElementsByClassName("delete")[0] as HTMLElement).style.display = "block";

                const task = RootTaskHandler.getTask(id);
                (document.getElementById("title") as HTMLInputElement).value = task.title;
                (document.getElementById("end_date") as HTMLInputElement).value = formatDateToHTMLInputDate(task.end_date);
                (document.getElementById("desc") as HTMLTextAreaElement).value = task.description;
                (document.getElementById("priority") as HTMLSelectElement).value = taskPriorityToString(task.priority);
                (document.getElementById("list_name") as HTMLSelectElement).value = task.list_name;
                break;
        }

        Popup.popup_type = type;
        Popup._open();
    }

    private static _save () {
        console.log(`popup_type: ${Popup.popup_type}, type: ${PopupType.NEW_TASK}`);

        const title = (document.getElementById("title") as HTMLInputElement).value;
        const end_date = (document.getElementById("end_date") as HTMLInputElement).value;
        const desc = (document.getElementById("desc") as HTMLTextAreaElement).value;
        const priority = (document.getElementById("priority") as HTMLSelectElement).value;
        const list_name = (document.getElementById("list_name") as HTMLSelectElement).value;

        if (!title) {
            Popup._error("Title cannot be empty");
            return false;
        }

        if (Popup.popup_type == PopupType.CURRENT_TASK) {
            RootTaskHandler.updateTask(Popup.task_id, {
                title,
                end_date: new Date(end_date),
                description: desc,
                priority: stringToTaskPriority(priority)
            });

            const old_list = RootTaskHandler.moveTask(Popup.task_id, list_name);
            TheDOMGuy.updateTaskList(list_name);
            if (old_list != list_name) {
                TheDOMGuy.updateTaskList(old_list);
            }
            return true;
        }

        RootTaskHandler.addTask(list_name, {
            title,
            end_date: new Date(end_date),
            description: desc,
            priority: stringToTaskPriority(priority)
        })

        TheDOMGuy.updateTaskList(list_name);
        return true;
    }

    private static _delete () {
        if (!Popup.task_id)
            return;
        const task = RootTaskHandler.getTask(Popup.task_id);
        const list_name = task.list_name;
        RootTaskHandler.removeTask(Popup.task_id);
        TheDOMGuy.updateTaskList(list_name);
    }

    private static _error (msg: string) {
        const popup = document.getElementById("popup");
        const error_span = popup.getElementsByClassName("error")[0] as HTMLSpanElement;
        error_span.innerHTML = msg;
        error_span.style.display = "inline";
    }
}

//ChatGPT
function formatDateToHTMLInputDate(date: Date) {
    // Get year, month, and day components from the date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the HTML input date string in the format yyyy-mm-dd
    const htmlInputDate = `${year}-${month}-${day}`;
    return htmlInputDate;
}
