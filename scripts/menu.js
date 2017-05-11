let Menu = (function (App) {

    "use strict";

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // H E L P E R    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    function clickInsideElement(e, className) {
        let el = e.srcElement || e.target.parentNode;

        if (el.classList.contains(className)) {
            return el;
        } else {
            while (el = el.parentNode) {
                if (el.classList && el.classList.contains(className)) {
                    return el;
                }
            }
        }

        return false;
    }


    function getPosition(e) {
        let posx = 0;
        let posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {

            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        }

        return {
            x: posx,
            y: posy
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // C O R E    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    let menuActions = {};

    let contextMenuClassName = "context-menu";
    let contextMenuItemClassName = "context-menu__item";
    let contextMenuLinkClassName = "context-menu__link";
    let contextMenuActive = "context-menu--active";

    let fileItemClassName = "file";
    let fileItemInContext;

    let clickCoords;
    let clickCoordsX;
    let clickCoordsY;

    let menu = document.querySelector("#context-menu");
    let menuItems = menu.querySelectorAll(".context-menu__item");
    let menuState = 0;
    let menuWidth;
    let menuHeight;
    let menuPosition;
    let menuPositionX;
    let menuPositionY;

    let windowWidth;
    let windowHeight;

    /**
     * Initialise our application's code.
     */
    function init() {
        contextListener();
        clickListener();
        resizeListener();
    }

    /**
     * Listens for contextmenu events.
     */
    function contextListener() {
        document.addEventListener("contextmenu", function (e) {
            fileItemInContext = clickInsideElement(e, fileItemClassName);
            if (fileItemInContext) {
                e.preventDefault();
                if (e.movementX > toggleMenuOn() || e.movementY)
                    toggleMenuOn();
                positionMenu(e);
            } else {
                fileItemInContext = null;
                toggleMenuOff();
            }
        });
    }

    /**
     * Listens for click events.
     */
    function clickListener() {

        bindAction("delete", "click", menuActions.deleteElement);
        bindAction("add", "click", menuActions.addElement);
        bindAction("rename", "click", menuActions.renameElement);

    }

    function bindAction(el, eventName, fn) {
        let a = document.getElementById(el);
        a.addEventListener(eventName, fn, false);
        return;
    }

    /**
     * Window resize event listener
     */
    function resizeListener() {
        window.onresize = function (e) {
            toggleMenuOff();
        };
    }

    /**
     * Turns the custom context menu on.
     */
    function toggleMenuOn() {
        if (menuState !== 1) {
            menuState = 1;
            menu.classList.add(contextMenuActive);
        }
    }

    /**
     * Turns the custom context menu off.
     */
    function toggleMenuOff() {
        if (menuState !== 0) {
            menuState = 0;
            menu.classList.remove(contextMenuActive);
        }
    }

    function positionMenu(e) {
        clickCoords = getPosition(e);
        clickCoordsX = clickCoords.x;
        clickCoordsY = clickCoords.y;

        menuWidth = menu.offsetWidth + 4;
        menuHeight = menu.offsetHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        let maxCoords = (e.clientX + 400);

        if (clickCoordsX < maxCoords) {
            menu.style.left = e.clientX + window.pageXOffset + "px";
        } else {
            menu.style.left = e.clientX - window.pageXOffset + "px";
        }

        if (clickCoordsY) {
            menu.style.top = e.clientY + window.pageYOffset + "px";
        } else {
            menu.style.top = e.clientX - window.pageXOffset + "px";
        }
    }

    function menuItemListener(link) {
        console.log("file ID - " + fileItemInContext.getAttribute("id") + ", file action - " + link.getAttribute("data-action"));
        toggleMenuOff();
    };

    menuActions.deleteElement = () => {
        let element = fileItemInContext.getAttribute("id");
        App.deleteFile(element);
        toggleMenuOff();
    };

    menuActions.addElement = () => {
        App.addFile();
        toggleMenuOff();
    };

    menuActions.renameElement = () => {
        let element = fileItemInContext.getAttribute("id");
        App.renameFile(element);
        toggleMenuOff();
    };

    init();
})(window.App);