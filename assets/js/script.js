let storedItems = JSON.parse(localStorage.getItem("todoList"));
retrieveItems(storedItems);

document.querySelector(".header__theme-icon").addEventListener("click", changeTheme);
document.querySelector(".header__input__field").addEventListener("keyup", createNewToDo);
document.querySelectorAll(".todo-list__filter").forEach(item => {
    item.addEventListener("click", filterItems);
});
document.querySelector(".todo-list__clear-completed").addEventListener("click", clearCompletedItems);
document.querySelectorAll(".todo-list__item").forEach(item => {
    item.setAttribute("draggable", true);
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("drop", drop);
});

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
        newToDoItem.setAttribute("draggable", true);
        newToDoItem.addEventListener("dragstart", dragStart);
        newToDoItem.addEventListener("dragend", dragEnd);
        newToDoItem.addEventListener("dragover", dragOver);
        newToDoItem.addEventListener("dragleave", dragLeave);
        newToDoItem.addEventListener("drop", drop);

        showHideFooter();
        updateRemainingItemCounter();
        updateFilteredItems();
        storeItems();
    }
}

function removeItem(event) {
    event.currentTarget.parentElement.remove();
    showHideFooter();
    updateRemainingItemCounter();
    storeItems();
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
    updateFilteredItems();
    storeItems();
}

function filterItems(event) {
    document.querySelector(".todo-list__filter--active").classList.remove("todo-list__filter--active");
    event.currentTarget.classList.add("todo-list__filter--active");
    updateFilteredItems();
}

function updateFilteredItems() {
    let activeFilter = document.querySelector(".todo-list__filter--active").innerHTML;
    let firstFilteredItem;
    switch(activeFilter) {
        case "All":
            document.querySelectorAll(".todo-list__item").forEach(item => {
                item.style = "";
            });

            document.querySelector(".todo-list__footer").style.borderRadius = "";
            break;

        case "Active":
            document.querySelectorAll(".todo-list .todo-list__item:not(.todo-list__item--selected)").forEach(item => {
                item.style = "";
            });

            document.querySelectorAll(".todo-list__item--selected").forEach(item => {
                item.style.display = "none";
            });

            firstFilteredItem = document.querySelector(".todo-list .todo-list__item:not(.todo-list__item--selected)");
            if(firstFilteredItem != null) {
                firstFilteredItem.style.borderRadius = "5px 5px 0 0";
                document.querySelector(".todo-list__footer").style.borderRadius = "";
            } else {
                document.querySelector(".todo-list__footer").style.borderRadius = "5px";
            }
            break;

        case "Completed":
            document.querySelectorAll(".todo-list__item--selected").forEach(item => {
                item.style = "";
            });

            document.querySelectorAll(".todo-list .todo-list__item:not(.todo-list__item--selected)").forEach(item => {
                item.style.display = "none";
            });

            firstFilteredItem = document.querySelector(".todo-list__item--selected");
            if(firstFilteredItem != null) {
                firstFilteredItem.style.borderRadius = "5px 5px 0 0";
                document.querySelector(".todo-list__footer").style.borderRadius = "";
            } else {
                document.querySelector(".todo-list__footer").style.borderRadius = "5px";
            }
    }
}

function clearCompletedItems() {
    document.querySelectorAll(".todo-list__item--selected").forEach(item => {
        item.remove();
    });
    showHideFooter();
    updateFilteredItems();
    storeItems();
}

function storeItems() {
    let itemList = [];
    let items = document.querySelectorAll(".todo-list .todo-list__item");

    items.forEach(item => {
        let itemIsChecked;
        if(item.classList.contains("todo-list__item--selected")) {
            itemIsChecked = true;
        } else {
            itemIsChecked = false;
        }

        itemList.push({
            text: item.querySelector(".todo-list__text").innerHTML,
            checked: itemIsChecked
        })
    });
    
    let itemListJSON = JSON.stringify(itemList);
    localStorage.setItem("todoList", itemListJSON);
}

function retrieveItems(storedItems) {
    if(storedItems != null && storedItems.length > 0) {
        storedItems.map(item => {
            let newToDoItem = document.querySelector(".item-example .todo-list__item").cloneNode(true);
            newToDoItem.querySelector(".todo-list__text").innerHTML = item.text;
            let lastItem = document.querySelector(".todo-list").lastElementChild;
            if(item.checked == true) {
                newToDoItem.classList.add("todo-list__item--selected");
                newToDoItem.querySelector(".todo-list__check").classList.add("todo-list__check--checked");
                newToDoItem.querySelector(".todo-list__text").classList.add("todo-list__text--selected");
                newToDoItem.querySelector(".todo-list__check-icon").style.display = "inline";
            }
            document.querySelector(".todo-list").insertBefore(newToDoItem, lastItem);
            newToDoItem.querySelector(".todo-list__delete-icon").addEventListener("click", removeItem);
            newToDoItem.querySelector(".todo-list__text").addEventListener("click", checkUncheckItem);
            newToDoItem.querySelector(".todo-list__check").addEventListener("click", checkUncheckItem);
        });
    }

    showHideFooter();
    updateRemainingItemCounter();
}

function dragStart(event) {
    event.currentTarget.classList.add("todo-list__item--dragging");
    event.currentTarget.querySelector(".todo-list__check-bg").classList.add("todo-list__check-bg--dragging");
    if(!event.currentTarget.querySelector(".todo-list__text").classList.contains("todo-list__text--selected")) {
        event.currentTarget.querySelector(".todo-list__text").classList.add("todo-list__text--dragging");
    }
}

function dragEnd(event) {
    event.currentTarget.classList.remove("todo-list__item--dragging");
    event.currentTarget.querySelector(".todo-list__check-bg").classList.remove("todo-list__check-bg--dragging");
    event.currentTarget.querySelector(".todo-list__text").classList.remove("todo-list__text--dragging");
}

function dragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("todo-list__item--dragging-item-hover");
}

function dragLeave(event) {
    event.currentTarget.classList.remove("todo-list__item--dragging-item-hover");
}

function drop(event) {
    let dropedItem = document.querySelector(".todo-list__item--dragging");
    let otherItem = event.currentTarget;
    otherItem.classList.remove("todo-list__item--dragging-item-hover");
    otherItem.parentElement.insertBefore(dropedItem, otherItem);
    storeItems();
}