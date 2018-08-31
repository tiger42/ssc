'use strict';

const printCoordinates = (coords) => {
    document.getElementById('xpos').innerHTML = coords.x;
    document.getElementById('ypos').innerHTML = coords.y;
};

const CoordinateObserver = {
    notify : (coords) => {
        console.info(coords);
    }
};

document.getElementById('addObserver').addEventListener('click', (ev) => {
    ev.stopPropagation();
    SSC.CursorPos.addObserver(printCoordinates);
});

document.getElementById('removeObserver').addEventListener('click', (ev) => {
    ev.stopPropagation();
    SSC.CursorPos.removeObserver(printCoordinates);
});

document.body.addEventListener('click', (ev) => {
    // Fetch the cursor position "manually"
    alert(SSC.CursorPos.x + ' : ' + SSC.CursorPos.y);
});

// Initialize the module
SSC.CursorPos.init();

// Add an observer function
SSC.CursorPos.addObserver(printCoordinates);

// Add an observer object
SSC.CursorPos.addObserver(CoordinateObserver);
