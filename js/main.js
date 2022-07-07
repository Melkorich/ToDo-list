const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}


checkEmptyList();

//добавление задачи
form.addEventListener('submit', addTask);
//удаление задачи
tasksList.addEventListener('click', deleteTask);
//отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);


//функция добавление задачи
function addTask(e) {
    //отменяем отправку формы
    e.preventDefault();

    //доставляем текст задачи из инпута
    const taskText = taskInput.value;

    //описываем задачу ввиде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    //добавляем задачу в массив с задачами
    tasks.push(newTask);

    saveToLocalStorage();

    //рендерим задачу на странице
    renderTask(newTask);

    //очищаем инпут каждый раз после добавления задачи
    taskInput.value = '';
    taskInput.focus();

    //если с списке задач появляется один и более элементов, мы скрываем надпись "задач нет"
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }

    checkEmptyList();
}

//функция удаления задачи
function deleteTask(e) {

    if (e.target.dataset.action === 'delete') {
        const parentNode = e.target.closest('li');
        const id = Number(parentNode.id);

        //удаляем задачу через фильтрацию массива
        tasks = tasks.filter(function (task) {
            if (task.id === id) {
                return false
            } else {
                return true
            }
        })

        //удаляем задачу из разметки
        parentNode.remove();
    }

    saveToLocalStorage();

    //если с списке задач один элемент добавляем надпись задач нет
    // if (tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }

    checkEmptyList();
}

//функция отметки задачи как сделанной
function doneTask(e) {
    //проверяем что клик был по кнопке "задача выполнена"
    if (e.target.dataset.action === 'done') {
        const parentNode = e.target.closest('li');
        const taskTitle = parentNode.querySelector('.task-title');

        const id = Number(parentNode.id);

        const task = tasks.find(function (task) {
            if (task.id === id) {
                return true
            }
        });

        task.done = !task.done;

        saveToLocalStorage();

        taskTitle.classList.add('task-title--done');
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>
        `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    //формируем css класс
    const cssClass = task.done ? 'task-title--done' : 'task-title';

    //формируем разметку с задачей, генерирукем html
    const taskHTML = `
     <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
         <span class="${cssClass}">${task.text}</span>
         <div class="task-item__buttons">
             <button type="button" data-action="done" class="btn-action">
                 <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
             <button type="button" data-action="delete" class="btn-action">
                 <img src="./img/cross.svg" alt="Done" width="18" height="18">
             </button>
         </div>
     </li>
 `;

    //добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
