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
    item.addEventListener("touchmove", dragItemTouch);
    item.addEventListener("touchend", dropItemTouch);
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

function createNewToDo(evt) {
    if(evt.key == "Enter") {
        let newToDoItem = document.querySelector(".item-example .todo-list__item").cloneNode(true);
        newToDoItem.querySelector(".todo-list__text").innerHTML = evt.currentTarget.value;
        let lastItem = document.querySelector(".todo-list").lastElementChild;
        document.querySelector(".todo-list").insertBefore(newToDoItem, lastItem);
        evt.currentTarget.value = "";
        newToDoItem.querySelector(".todo-list__delete-icon").addEventListener("click", removeItem);
        newToDoItem.querySelector(".todo-list__text").addEventListener("click", checkUncheckItem);
        newToDoItem.querySelector(".todo-list__check").addEventListener("click", checkUncheckItem);
        newToDoItem.setAttribute("draggable", true);
        newToDoItem.addEventListener("dragstart", dragStart);
        newToDoItem.addEventListener("dragend", dragEnd);
        newToDoItem.addEventListener("dragover", dragOver);
        newToDoItem.addEventListener("dragleave", dragLeave);
        newToDoItem.addEventListener("drop", drop);
        newToDoItem.addEventListener("touchmove", dragItemTouch);
        newToDoItem.addEventListener("touchend", dropItemTouch);

        showHideFooter();
        updateRemainingItemCounter();
        updateFilteredItems();
        storeItems();
    }
}

function removeItem(evt) {
    evt.currentTarget.parentElement.remove();
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

function checkUncheckItem(evt) {
    let item = evt.currentTarget.parentElement;
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

function filterItems(evt) {
    document.querySelector(".todo-list__filter--active").classList.remove("todo-list__filter--active");
    evt.currentTarget.classList.add("todo-list__filter--active");
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

function dragStart(evt) {
    evt.currentTarget.classList.add("todo-list__item--dragging");
    evt.currentTarget.querySelector(".todo-list__check-bg").classList.add("todo-list__check-bg--dragging");
    if(!evt.currentTarget.querySelector(".todo-list__text").classList.contains("todo-list__text--selected")) {
        evt.currentTarget.querySelector(".todo-list__text").classList.add("todo-list__text--dragging");
    }
}

function dragEnd(evt) {
    evt.currentTarget.classList.remove("todo-list__item--dragging");
    evt.currentTarget.querySelector(".todo-list__check-bg").classList.remove("todo-list__check-bg--dragging");
    evt.currentTarget.querySelector(".todo-list__text").classList.remove("todo-list__text--dragging");
}

function dragOver(evt) {
    evt.preventDefault();
    evt.currentTarget.classList.add("todo-list__item--dragging-item-hover");
}

function dragLeave(evt) {
    evt.currentTarget.classList.remove("todo-list__item--dragging-item-hover");
}

function drop(evt) {
    let dropedItem = document.querySelector(".todo-list__item--dragging");
    let otherItem = evt.currentTarget;
    otherItem.classList.remove("todo-list__item--dragging-item-hover");
    otherItem.parentElement.insertBefore(dropedItem, otherItem);
    storeItems();
}

function dragItemTouch(evt) {
    document.body.style.overflow = "hidden";
    
    let touch = evt.touches[0];
    let item = evt.currentTarget;

    let itemClone = document.querySelector(".todo-list__item-clone");
    if(itemClone == null) {
        itemClone = item.cloneNode(true);
        itemClone.classList.add("todo-list__item-clone");
        item.parentElement.appendChild(itemClone);
    }
    

    let rightSideOfItem = touch.pageX + item.clientWidth/2;
    let leftSideOfItem = touch.pageX - item.clientWidth/2;

    if(rightSideOfItem < screen.width && leftSideOfItem > 0) {
        itemClone.style.top = touch.pageY - (item.clientHeight / 2) + "px";
        itemClone.style.left = touch.pageX - (item.clientWidth / 2) + "px";
    } else {
        itemClone.style.top = touch.pageY - (item.clientHeight / 2) + "px";
    }
    

    let itemPositionY = itemClone.getBoundingClientRect().top + (itemClone.clientHeight / 2);
    let itemPositionX = itemClone.getBoundingClientRect().left + (itemClone.clientWidth / 2);

    item.classList.add("todo-list__item--dragging");
    item.querySelector(".todo-list__check-bg").classList.add("todo-list__check-bg--dragging");
    if(!item.querySelector(".todo-list__text").classList.contains("todo-list__text--selected")) {
        item.querySelector(".todo-list__text").classList.add("todo-list__text--dragging");
    }

    let dropAreas = document.querySelectorAll(".todo-list .todo-list__item:not(.todo-list__item--dragging, .todo-list__item-clone)");

    dropAreas.forEach(dropArea => {
        let dropAreaPosition = dropArea.getBoundingClientRect();
        if(itemPositionX >= dropAreaPosition.left && itemPositionX <= dropAreaPosition.right &&
        itemPositionY >= dropAreaPosition.top && itemPositionY <= dropAreaPosition.bottom) {
            dropArea.classList.add("todo-list__item--dragging-item-hover");
        } else {
            dropArea.classList.remove("todo-list__item--dragging-item-hover");
        }
    })
}

function dropItemTouch() {
    let item = document.querySelector(".todo-list__item--dragging");
    let dropArea = document.querySelector(".todo-list__item--dragging-item-hover");
    let itemClone = document.querySelector(".todo-list__item-clone");

    if(item != null) {
        item.classList.remove("todo-list__item--dragging");
        item.querySelector(".todo-list__check-bg").classList.remove("todo-list__check-bg--dragging");
        item.querySelector(".todo-list__text").classList.remove("todo-list__text--dragging");

        if(dropArea != null) {
            dropArea.classList.remove("todo-list__item--dragging-item-hover");
            dropArea.parentElement.insertBefore(item, dropArea);
        }

        itemClone.remove();
        storeItems();
    }
    
    document.body.style = "";
}