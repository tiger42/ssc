'use strict';

let printCoordinates = function (coords) {
    document.getElementById('xpos').innerHTML = coords.x;
    document.getElementById('ypos').innerHTML = coords.y;
};

let CoordinateObserver = {
    notify : function (coords) {
        console.warn(coords);
    }
};

document.getElementById('addObserver').addEventListener('click', function (ev) {
    ev.stopPropagation();
    SSC.CursorPos.addObserver(printCoordinates);
});

document.getElementById('removeObserver').addEventListener('click', function (ev) {
    ev.stopPropagation();
    SSC.CursorPos.removeObserver(printCoordinates);
});

document.body.addEventListener('click', function (ev) {
    // Fetch the cursor position "manually"
    alert(SSC.CursorPos.x + ' : ' + SSC.CursorPos.y);
});

// Initialize the module
SSC.CursorPos.init();

// Add an observer function
SSC.CursorPos.addObserver(printCoordinates);

// Add an observer object
SSC.CursorPos.addObserver(CoordinateObserver);
