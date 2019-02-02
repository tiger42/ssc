/**
 * @file An observable module for acquiring the current mouse cursor coordinates.
 * @author Marc-Oliver Stühmer <stuehmer@codefoo.org>
 * @license MIT
 * @copyright 2019 Marc-Oliver Stühmer
 */

/**
 * Cursor coordinates object.
 *
 * @typedef Coordinates
 *
 * @property {number} x  The X-coordinate
 * @property {number} y  The Y-coordinate
 */

/**
 * Callback function to be executed when the mouse cursor position changes.
 *
 * @callback mouseMoveObserverFn
 *
 * @param {Coordinates} coords  The current mouse cursor coordinates
 */

 /**
  * Observer object to be notified when the mouse cursor position changes.
  *
  * @typedef {Object} MouseMoveObserver
  *
  * @property {mouseMoveObserverFn} notify  The observer callback function
  */

window.SSC = window.SSC || {};

/**
 * An observable module for acquiring the current mouse cursor coordinates.
 *
 * @namespace
 *
 * @example
 * SSC.CursorPos.init();
 * SSC.CursorPos.addObserver((coords) => {
 *     console.log(coords.x, coords.y);
 * });
 *
 * // Get the cursor position outside of an observer:
 * console.log(SCC.CursorPos.x, SSC.CursorPos.y);
 */
SSC.CursorPos = (() => {
    'use strict';

    /**
     * Has this module already been initialized?
     *
     * @private
     *
     * @type {boolean}
     */
    let inited = false;

    /**
     * The set of registered observers.
     *
     * @private
     * 
     * @type {Set.<Function>}
     */
    const observers = new Set();

    /**
     * Set the cursor coordinates.
     *
     * @private
     *
     * @param {MouseEvent} ev  The calling event
     */
    const setCoords = (coords) => {
         SSC.CursorPos.x = coords.x;
         SSC.CursorPos.y = coords.y;
    };

    /**
     * Notify all registered observers.
     *
     * @private
     *
     * @param {MouseEvent} ev  The calling event
     */
    const notifyObservers = (ev) => {
        observers.forEach((observer) => {
            if (typeof observer == 'function') {
                observer(SSC.CursorPos.getFromEvent(ev));
            } else if (typeof observer.notify == 'function') {
                observer.notify(SSC.CursorPos.getFromEvent(ev));
            }
        });
    };

    return /** @lends SSC.CursorPos */ {
        /**
         * The X value of the current cursor position.
         *
         * @type {number}
         */
        x : null,

        /**
         * The Y value of the current cursor position.
         *
         * @type {number}
         */
        y : null,

        /**
         * Start to acquire the cursor position.<br />
         * This function must be called once before the cursor coordinates
         * can be read out via observer or SSC.CursorPos.x / SSC.CursorPos.y.
         */
        init : () => {
            if (inited) {
                return;
            }
            inited = true;

            SSC.CursorPos.addObserver(setCoords);
            document.addEventListener('mousemove', notifyObservers);
        },

        /**
         * Fetch the mouse cursor coordinates from the given mouse event.<br />
         * <b>NOTE:</b> The module does not need to be init'ed to use this function.
         *
         * @param {MouseEvent} ev  The mouse event to read the coordinates from
         *
         * @return {Coordinates}  The mouse cursor coordinates
         */
        getFromEvent : (ev) => ({
            x : ev.pageX,
            y : ev.pageY
        }),

        /**
         * Add an observer function or object.
         *
         * @param {mouseMoveObserverFn|MouseMoveObserver} observer  The observer to be notified
         *                                                          when the cursor position changes
         */
        addObserver : (observer) => {
            observers.add(observer);
        },

        /**
         * Remove the given observer from the observer list.
         *
         * @param {mouseMoveObserverFn|MouseMoveObserver} observer  The observer function or object to remove
         */
        removeObserver : (observer) => {
            observers.delete(observer);
        }
    };
})();
