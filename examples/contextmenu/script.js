'use strict';

let handleClick = function (ev, el) {
    console.info(`clicked: ${ev.target.label}`);
    console.info('element:', el);
};

let handleCheckboxClick = function (ev, el) {
    console.info((ev.target.checked ? 'checked' : 'unchecked') + ': ' + ev.target.label
         + (ev.target.id ? ` with ID ${ev.target.id}` : ''));
    console.info('element:', el);
};

let divMenuConfig = [{
    label   : 'Menu item',
    icon    : 'icons/computer.png',
    onclick : handleClick
}, {
    label : 'Submenu',
    sub: [{
        label   : 'Submenu item 1',
        icon    : 'icons/snow.png',
        onclick : handleClick
    }, {
        label   : 'Submenu item 2',
        icon    : 'icons/star.png',
        onclick : handleClick
    }]
}, {
    label : 'Deep submenu',
    sub : [{
        label    : 'This is disabled',
        disabled : true,
        onclick  : handleClick
    }, {
        label : 'foo',
        sub : [{
            label   : 'bar',
            onclick : handleClick
        }, {
            label   : 'baz',
            onclick : handleClick
        }]
    }]
}];

let bodyMenuConfig = [{
    label   : 'Hello world',
    type    : 'command',
    onclick : handleClick
}, {
    type : 'separator'
}, {
    label : 'Checkbox test',
    sub : [{
        id      : 'checkbox1',
        label   : 'one',
        type    : 'checkbox',
        onclick : handleCheckboxClick
    }, {
        id      : 'checkbox2',
        label   : 'two',
        type    : 'checkbox',
        checked : true,
        onclick : handleCheckboxClick
    }]
},
'-',
{
    label : 'Radiobutton test',
    sub : [{
        label      : 'first',
        type       : 'radio',
        checked    : true,
        radiogroup : 'radioGroup1',
        onclick    : handleCheckboxClick
    }, {
        label      : 'second',
        type       : 'radio',
        radiogroup : 'radioGroup1',
        onclick    : handleCheckboxClick
    }, {
        label      : 'third',
        type       : 'radio',
        radiogroup : 'radioGroup1',
        onclick    : handleCheckboxClick

    },
    '-',
    {
        label      : 'red',
        type       : 'radio',
        radiogroup : 'radioGroup2',
        onclick    : handleCheckboxClick
    }, {
        label      : 'blue',
        type       : 'radio',
        radiogroup : 'radioGroup2',
        onclick    : handleCheckboxClick
    }]
}];

let alternativeBodyMenuConfig = [{
    label   : 'Lorem ipsum...',
    onclick : handleClick
}];

let switchBodyMenuConfig = (function () {
    let alternativeConfig = false;
    return function () {
        bodyMenu.setConfig(alternativeConfig ? bodyMenuConfig : alternativeBodyMenuConfig);
        alternativeConfig = !alternativeConfig;
    };
}());

// Initialize buttons
let buttons = document.querySelectorAll('div button');
for (let i = 0, len = buttons.length; i < len; i++) {
    buttons[i].addEventListener('click', function (ev) {
        if (buttons[i].className == 'add') {
            divMenu.attachTo(this.parentNode);
        } else {
            divMenu.remove(this.parentNode);
        }
    });
}
document.getElementById('removeAll').addEventListener('click', function (ev) {
    divMenu.remove();
});
document.querySelector('body > button.add').addEventListener('click', function (ev) {
    bodyMenu.attachTo(document.body);
});
document.querySelector('body > button.remove').addEventListener('click', function (ev) {
    bodyMenu.remove();
});
document.querySelector('body > button.switchConfig').addEventListener('click', function (ev) {
    switchBodyMenuConfig();
});

// Context menu of div element
let divMenu = new SSC.ContextMenu();
divMenu.setConfig(divMenuConfig);
divMenu.attachTo(document.getElementsByClassName('testDiv'));

// Context menu of document body
let bodyMenu = new SSC.ContextMenu(bodyMenuConfig, 'bodyContextMenu');
bodyMenu.attachTo(document.body);
