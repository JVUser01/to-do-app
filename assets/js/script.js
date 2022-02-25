document.querySelector(".header__theme-icon").addEventListener("click", changeTheme);
document.querySelector(".header__input__field").addEventListener("keyup", createNewToDo);

showHideFooter();
updateRemainingItemCounter();

function changeTheme() {
    let header = document.querySelector(".header");
    header.classList.toggle("header--light");

    let headerIsLight = header.classList.contains("header--light");
    if(headerIsLight == true) {
        document.querySelector(".header__theme-icon").setAttribute("src", "images/icon-moon.svg");
    } else {
        document.querySelector(".header__theme-icon").setAttribute("src", "images/icon-sun.svg");
    }

    document.querySelector(".header__input").classList.toggle("header__input--light");
    document.querySelector(".header__input__check").classList.toggle("header__input__check--light");
    document.querySelector(".header__input__field").classList.toggle("header__input__field--light");

    document.querySelector(".todo-list-area").classList.toggle("todo-list-area--light");
    
    document.querySelectorAll(".todo-list__item").forEach(item => {
        item.classList.toggle("todo-list__item--light");
    });
    document.querySelectorAll(".todo-list__check").forEach(item => {
        item.classList.toggle("todo-list__check--light");
    });
    document.querySelectorAll(".todo-list__check-bg").forEach(item => {
        item.classList.toggle("todo-list__check-bg--light");
    });
    document.querySelectorAll(".todo-list__text").forEach(item => {
        item.classList.toggle("todo-list__text--light");
    });

    document.querySelector(".todo-list__footer").classList.toggle("todo-list__footer--light");
    document.querySelector(".todo-list__filters").classList.toggle("todo-list__filters--light");
    document.querySelectorAll(".todo-list__filter").forEach(item => {
        item.classList.toggle("todo-list__filter--light");
    });
    document.querySelector(".todo-list__clear-completed").classList.toggle("todo-list__clear-completed--light");

    document.querySelector(".todo-list-area__drag-info").classList.toggle("todo-list-area__drag-info--light");
}

function createNewToDo(event) {
    if(event.key == "Enter") {
        let newToDoItem = document.querySelector(".item-example .todo-list__item").cloneNode(true);
        newToDoItem.querySelector(".todo-list__text").innerHTML = event.currentTarget.value;
        let lastItem = document.querySelector(".todo-list").lastElementChild;
        document.querySelector(".todo-list").insertBefore(newToDoItem, lastItem);
        event.currentTarget.value = "";
        newToDoItem.querySelector(".todo-list__delete-icon").addEventListener("click", removeItem);
        newToDoItem.querySelector(".todo-list__text").addEventListener("click", checkUncheckItem);
        newToDoItem.querySelector(".todo-list__check").addEventListener("click", checkUncheckItem);

        showHideFooter();
        updateRemainingItemCounter();
    }
}

function removeItem(event) {
    event.currentTarget.parentElement.remove();
    showHideFooter();
    updateRemainingItemCounter();
}

function showHideFooter() {
    let numberOfItems = document.querySelectorAll(".todo-list .todo-list__item").length;
    if(numberOfItems == 0) {
        document.querySelector(".todo-list__footer").style.display = "none";
    } else {
        document.querySelector(".todo-list__footer").style.display = "flex";
    }
}

function updateRemainingItemCounter() {
    let numberOfUncheckedItems = document.querySelectorAll(".todo-list .todo-list__item:not(.todo-list__item--selected)").length;
    document.querySelector(".todo-list__items-counter").innerHTML = `${numberOfUncheckedItems} items left`;
}

function checkUncheckItem(event) {
    let item = event.currentTarget.parentElement;
    if(item.classList.contains("todo-list__item--selected")) {
        item.classList.remove("todo-list__item--selected");
        item.querySelector(".todo-list__check").classList.remove("todo-list__check--checked");
        item.querySelector(".todo-list__text").classList.remove("todo-list__text--selected");
        item.querySelector(".todo-list__check-icon").style.display = "none";
    } else {
        item.classList.add("todo-list__item--selected");
        item.querySelector(".todo-list__check").classList.add("todo-list__check--checked");
        item.querySelector(".todo-list__text").classList.add("todo-list__text--selected");
        item.querySelector(".todo-list__check-icon").style.display = "inline";
    }
    updateRemainingItemCounter();
}