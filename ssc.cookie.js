/**
 * @file    Cookie handling class.
 * @author  Marc-Oliver Stühmer <marc-oliver@stuehmer.info>
 */

window.SSC = window.SSC || {};

/**
 * <b>NOTE:</b> The cookie cannot be instantiated directly! Use [SSC.Cookie.getInstance()]{@link SSC.Cookie.getInstance} instead.
 * @class
 * @classdesc   Cookie handling class.
 * @see         SSC.Cookie.getInstance
 *
 * @example
 * const cookie = SSC.Cookie.getInstance('testcookie');
 * cookie
 *     .set('foo', 'bar')
 *     .set('baz', 42)
 *     .setSecure()
 *     .write();
 * console.log(cookie.getAll());
 */
SSC.Cookie = (() => {
    'use strict';

    /**
     * Container object with Singleton instances of Cookie class
     * @private
     * @type    {Object}
     */
    const instances = {};

    /**
     * The actual cookie class.
     * @private
     *
     * @param   {string} [cookieName]       The name of the cookie
     */
    const Cookie = function (cookieName) {
        /**
         * The current cookie name
         * @private
         * @type    {string}
         */
        let cname = cookieName;

        /**
         * The cookie's data
         * @private
         * @type    {Object}
         */
        let data = {};

        /**
         * The cookie's expiry time
         * @private
         * @type    {string}
         */
        let expires;

        /**
         * The path for which the cookie is active
         * @private
         * @type    {string}
         */
        let path = '/';

        /**
         * The cookie domain
         * @private
         * @type    {string}
         */
        let domain;

        /**
         * Use SSL when sending the cookie to the server?
         * @private
         * @type    {boolean}
         */
        let sec = false;

        /**
         * Write the internal data object into the document cookie.
         * @private
         *
         * @throws  {RangeError}                If the cookie size exceeds 4093 bytes
         */
        const write = () => {
            let str = cname + '=' + encodeURIComponent(JSON.stringify(data));

            if (str.length > 4093) {
                throw new RangeError('Cookie size exceeds 4093 bytes');
            }

            if (expires) {
                str += '; expires=' + expires;
            }
            str += '; path=' + path;
            if (domain) {
                str += '; domain=' + domain;
            }
            if (sec) {
                str += '; secure';
            }
            document.cookie = str;
        };

        /**
         * Read the document cookie into the internal data object.
         * @private
         *
         * @return  {boolean}                   Was the operation successful?
         */
        const read = () => {
            let start;
            let str = document.cookie;
            if (str.length > 0 && (start = str.indexOf(cname + '=')) != -1) {
                const end = str.indexOf(';', start);
                if (end == -1) {
                    str = str.substring(start + cname.length + 1);
                } else {
                    str = str.substring(start + cname.length + 1, end);
                }

                data = JSON.parse(decodeURIComponent(str));

                return true;
            }
            data = {};

            return false;
        };

        /**
         * Persist the set data and all settings into the document cookie.
         * @method      write
         * @instance
         * @memberOf    SSC.Cookie
         */
        this.write = () => {
            write();
        };

        /**
         * Retrieve the value for the given key.
         * @method      get
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {string} key                The key to get the value for
         * @return  {mixed|undefined}           The value for the given key
         */
        this.get = (key) => {
            if (typeof key == 'string') {
                return data[key];
            }
            return undefined;
        };

        /**
         * Set the value of the given key.<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the data into the document cookie.
         * @method      set
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {string} key                The key to set the value of
         * @param   {mixed} value               The value to set
         * @return  {SSC.Cookie}                The Cookie object (for method chaining)
         * @throws  {TypeError}                 If "key" is not a string or "value" is undefined
         */
        this.set = (key, value) => {
            if (typeof key != 'string') {
                throw new TypeError('Key must be a string');
            }
            if (value === undefined) {
                throw new TypeError(`Value must not be undefined for key "${key}"`);
            }

            data[key] = value;

            return this;
        };

        /**
         * Remove the element with the given key.<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the data into the document cookie.
         * @method      remove
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {string} key                The key of the element to remove
         * @return  {mixed|undefined}           The value of the removed element
         */
        this.remove = (key) => {
            if (typeof key == 'string') {
                const value = data[key];
                delete data[key];

                return value;
            }
            return undefined;
        };

        /**
         * Return all cookie data as an object.
         * @method      getAll
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @return  {Object}                    The cookie's data
         */
        this.getAll = () => {
            return data;
        };

        /**
         * Set the cookie's expiry time in RFC-2822 format (DAY, DD MMM YYYY hh:mm:ss GMT) or
         * from an instantiated Date object (defaults to end of session).<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the setting into the document cookie.
         * @method      setExpiry
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {string|Date} expiry        The expiry time to set
         * @return  {SSC.Cookie}                The Cookie object (for method chaining)
         */
        this.setExpiry = (expiry) => {
            if (Object.prototype.toString.call(expiry) == '[object Date]') {
                expiry = expiry.toGMTString();
            }
            expires = expiry;

            return this;
        };

        /**
         * Set the expiry time as Unix timestamp.<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the setting into the document cookie.
         * @method      setExpiryTimestamp
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {number} expiry             The expiry time to set
         * @return  {SSC.Cookie}                The Cookie object (for method chaining)
         */
        this.setExpiryTimestamp = (expiry) => {
            this.setExpiry(new Date(expiry * 1000));

            return this;
        };

        /**
         * Set the path for which the cookie is active (defaults to "/").<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the setting into the document cookie.
         * @method      setPath
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {string} cookiePath         The path to set
         * @return  {SSC.Cookie}                The Cookie object (for method chaining)
         */
        this.setPath = (cookiePath) => {
            path = cookiePath;

            return this;
        };

        /**
         * Set the cookie domain (defaults to current domain).<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the setting into the document cookie.
         * @method      setDomain
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {string} cookieDomain       The domain to set
         * @return  {SSC.Cookie}                The Cookie object (for method chaining)
         */
        this.setDomain = (cookieDomain) => {
            domain = cookieDomain;

            return this;
        };

        /**
         * Set secure mode (SSL) when sending the cookie to the server (defaults to false).<br />
         * Call the [write()]{@link SSC.Cookie#write} function to persist the setting into the document cookie.
         * @method      setSecure
         * @instance
         * @memberOf    SSC.Cookie
         *
         * @param   {boolean} [secure=true]     Use secure mode?
         * @return  {SSC.Cookie}                The Cookie object (for method chaining)
         */
        this.setSecure = (secure = true) => {
            sec = secure;

            return this;
        };

        /**
         * Delete the cookie.
         * @method      destroy
         * @instance
         * @memberOf    SSC.Cookie
         */
        this.destroy = () => {
            this.setExpiry('Tue, 01 Jan 2008 00:00:00 GMT');
            write();
            data = {};
        };

        // Constructor
        read();
    };

    return /** @lends SSC.Cookie */ {
        /**
         * Get Singleton instance of Cookie, depending on the given name.
         *
         * @param   {string} [name=sscdata]     The name of the cookie
         * @return  {SSC.Cookie}                Singleton instance of Cookie class
         */
        getInstance : (name = 'sscdata') => {
            if (!instances[name]) {
                instances[name] = new Cookie(name);
            }
            return instances[name];
        },

        /**
         * Test whether the user's browser accepts cookies.
         *
         * @return  {boolean}                   Are cookies allowed?
         */
        isWritable : () => {
            if (typeof document.cookie != 'string') {
                return false;
            }
            document.cookie = '_testcookie=test;';
            const writable = document.cookie.indexOf('_testcookie=test') != -1 ? true : false;
            document.cookie = '_testcookie=; expires=Tue, 01 Jan 2008 00:00:00 GMT;';

            return writable;
        }
    };
})();
