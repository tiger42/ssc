/**
 * @file    Helper for generating HTML5 context menus.
 * @author  Marc-Oliver Stühmer <marc-oliver@stuehmer.info>
 * @see     {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contextmenu|Documentation on MDN}
 */

/**
 * Mouse event handler function.
 *
 * @callback    clickHandler
 * @param       {MouseEvent} ev         The fired event
 */

if (!window.SSC) {
    window.SSC = {};
}

/**
 * Create a new SSC.ContextMenu instance.
 * @class
 * @classdesc   Helper for generating HTML5 context menus.<br />
 *              NOTE: The browser support is {@link http://caniuse.com/#feat=menu|very limited} at the moment!
 *
 * @example
 * var handleClick = function (ev) { console.log(ev.target.id, ev.target.checked); };
 * var config = [{
 *     label   : 'Menu item',
 *     icon    : 'icon.png',
 *     onclick : function (ev) { console.log(ev.target.label); }
 * }, {
 *     type : 'separator'
 * }, {
 *     label : 'Submenu',
 *     sub: [{
 *         id      : 'cb',
 *         label   : 'Checkbox',
 *         type    : 'checkbox',
 *         onclick : handleClick
 *     }]
 * }, {
 *     label : 'Deep submenu',
 *     sub : [{
 *         label    : 'This is disabled',
 *         disabled : true,
 *     },
 *     '-',   // alternative separator notation
 *     {
 *         label : 'Radio group',
 *         sub : [{
 *             id    : 'r1',
 *             label : 'Radio button 1',
 *             type  : 'radio',
 *             checked    : true,
 *             radiogroup : 'myGroup',
 *             onclick    : handleClick
 *         }, {
 *             id    : 'r2',
 *             label : 'Radio button 2',
 *             type  : 'radio',
 *             radiogroup : 'myGroup',
 *             onclick    : handleClick
 *         }]
 *     }]
 * }];
 * var contextMenu = new SSC.ContextMenu(config);
 * contextMenu.attachTo(document.body);
 *
 * @param   {Array} [config]            The menu configuration data
 * @param   {string} [id]               The HTML element ID of the context menu to set
 */
SSC.ContextMenu = function (config, id) {
    'use strict';

    /**
     * The HTML elements this context menu is attached to.
     * @private
     * @type    {Set}
     */
    let attachedTo = new Set();

    /**
     * Test whether the given object is an Array.
     * @private
     *
     * @param   {Object} obj                The object to test
     * @return  {boolean}                   Is the object an Array?
     */
    const isArray = (obj) => {
        return Object.prototype.toString.call(obj) == '[object Array]';
    };

    /**
     * Test whether the given object is a NodeList.
     * @private
     *
     * @param   {Object} obj                The object to test
     * @return  {boolean}                   Is the object a NodeList?
     */
    const isNodeList = (obj) => {
        return Object.prototype.toString.call(obj) == '[object NodeList]';
    };

    /**
     * Test wether the given object is a HTMLCollection.
     * @private
     *
     * @param   {Object} obj                The object to test
     * @return  {boolean}                   Is the object an HTMLCollection?
     */
    const isHTMLCollection = (obj) => {
        return Object.prototype.toString.call(obj) == '[object HTMLCollection]';
    };

    /**
     * Create the HTML element for the context menu.
     * @private
     *
     * @param   {string} id                 The element ID to set
     * @return  {HTMLMenuElement}           The created menu element
     */
    const createMenuElement = (id) => {
        const element = document.createElement('menu');
        element.type = 'context';
        element.id   = id;
        element.style.display = 'none';   // Workaround for Chrome displaying "hr"s in document

        return element;
    };

    /**
     * Iterate through the configuration and build the menu structure.
     * @private
     *
     * @param   {Array} conf                The menu configuration data
     * @param   {HTMLMenuElement} menuElem  The parent menu element
     * @throws  {TypeError}                 If the menu configuration is not an Array
     * @throws  {TypeError}                 If an invalid menu item type was given
     */
    const iterateConfig = (conf, menuElem) => {
        if (!isArray(conf)) {
            throw new TypeError('(Sub)menu configuration must be an Array');
        };

        for (let i = 0, len = conf.length; i < len; i++) {
            if (conf[i] == '-' || (conf[i].type && conf[i].type == 'separator')) {
                const separator = document.createElement('hr');
                menuElem.appendChild(separator);
                continue;
            }

            let menuItem;
            if (conf[i].sub) {
                menuItem = document.createElement('menu');
                iterateConfig(conf[i].sub, menuItem);
            } else {
                menuItem = document.createElement('menuitem');

                Object.keys(conf[i]).forEach((key) => {
                    switch (key) {
                        case 'onclick':
                            menuItem.addEventListener('click', (ev) => {
                                // Workaround for Chrome fetching wrong checkbox state
                                window.setTimeout(() => { conf[i].onclick(ev); }, 0);
                            }, false);
                            break;
                        case 'type':
                            if (!['command', 'checkbox', 'radio'].includes(conf[i].type)) {
                                throw new TypeError(`Invalid menu item type "${conf[i].type}"`);
                            };
                            menuItem.type = conf[i].type;
                            break;
                        default:
                            menuItem[key] = conf[i][key];
                    }
                });
            }
            menuItem.label = conf[i].label;

            menuElem.appendChild(menuItem);
        }
    };

    /**
     * Set the menu configuration data.<br />
     * The config array must contain one object per menu item.<br />
     *
     * @param   {Object[]} config                  The configuration data.<br />
     *                                             Any global HTML element attribute not documented here can be set too,
     *                                             though it may have no effect on the menu item.
     * @param   {string} config[].label            The menu item label
     * @param   {string} [config[].icon]           URL of an icon image to display
     * @param   {string} [config[].type=command]   The menu item type (command|checkbox|radio|separator)
     * @param   {clickHandler} [config[].onclick]  The event handler function for the menu item click
     * @param   {boolean} [config[].disabled]      If true, render the menu item in disabled state
     * @param   {boolean} [config[].checked]       If true, render the menu item initially checked<br />(only for checkbox and radio types)
     * @param   {string} [config[].radiogroup]     A radio group name (only for radio type)
     * @param   {Object[]} [config[].sub]          A submenu configuration
     */
    this.setConfig = (config) => {
        // Remove all current menu items
        while (menuElement.lastChild) {
            menuElement.removeChild(menuElement.lastChild);
        }
        iterateConfig(config, menuElement);
    };

    /**
     * Attach the context menu to the given HTML element(s).
     *
     * @param   {(HTMLElement|Array|NodeList|HTMLCollection)} elements  The element(s) to attach to
     */
    this.attachTo = (elements) => {
        if (!(isArray(elements) || isNodeList(elements) || isHTMLCollection(elements))) {
            elements = [elements];
        }

        for (let i = 0, len = elements.length; i < len; i++) {
            elements[i].setAttribute('contextmenu', id);
            attachedTo.add(elements[i]);
        }
    };

    /**
     * Remove the context menu from the given HTML element(s).<br />
     * If no element is given, the menu will be removed from all elements it is attached to.
     *
     * @param   {(HTMLElement|Array|NodeList|HTMLCollection)} [elements]  The element(s) to remove from
     */
    this.remove = (elements) => {
        if (elements == null) {
            elements = Array.from(attachedTo);
        }
        if (!(isArray(elements) || isNodeList(elements) || isHTMLCollection(elements))) {
            elements = [elements];
        }

        for (let i = 0, len = elements.length; i < len; i++) {
            if (attachedTo.has(elements[i])) {
                elements[i].removeAttribute('contextmenu');
                attachedTo.delete(elements[i]);
            }
        }
    };

    // Constructor
    id = id == null ? 'contextmenu' + (('_' + Math.random()).replace(/0\./, '')) : id;
    const menuElement = createMenuElement(id);
    document.body.appendChild(menuElement);
    if (config) {
        this.setConfig(config);
    }
};
