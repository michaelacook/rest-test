/* 
Though JavaScript contains a native Request object, the rationale for writing 
my own here is that the built-in Request lacks flexibility--many of it's 
properties are read-only. This application is designed to give the user a fair 
bit of control and the ability to update request properties as they test their 
endpoints
*/

class HTTPRequest {
  /**
   * @param {String} location - resource URI
   * @param {String} verb - HTTP verb
   * @param {Array || String} headers - Request header(s)
   * @param {String} mode - Request mode (no-cors, *cors, same-origin)
   * @param {String} cache - Request cache option (no-cache, reload, force-cache, only-if-cached)
   * @param {Object} body - HTTP payload
   * @param {Object} authCredentials - object containing email and password keys for Basic Auth header
   * @param {String} credentials - request credentials (include, *same-origin, omit)
   */
  constructor(
    location = null,
    verb = "GET",
    mode = "cors",
    cache = null,
    body = null,
    authCredentials = null,
    credentials = "omit"
  ) {
    this._error = null
    this._response = null
    this._json = null
    this._authCredentials = authCredentials
    this._credentials = credentials
    this._abortController = new AbortController()
    this._location = location
    this._verb = verb.toUpperCase()
    this._mode = mode
    this._cache = cache
    this._title = "Untitled"
    this._body = body ? JSON.stringify(body) : body
    this._headers = {
      "Content-Type": "application/json; charset=utf-8",
      Connection: "keep-alive",
    }
  }

  get headers() {
    return this._headers
  }

  /**
   * Add a header to _headers private property
   * If the supplied key already exists, it will be overwritten
   * @param {String} key - header type e.g "Content-Type"
   * @param {String} val - header
   */
  addHeader(key, val) {
    if (typeof key !== "string" || typeof val !== "string") {
      throw new Error("Header key and val must be string types.")
    } else if (!key && !val) {
      throw new Error("Header key and value must be passed.")
    }
    this._headers[key] = val
  }

  /**
   * Delete a header from the headers private property
   * @param {String} key - header name
   */
  deleteHeader(key) {
    delete this._headers[key]
  }

  /**
   * Public
   * Append a custom header to headers private property
   * @param {String} header - custom header text
   */
  addCustomHeader(header) {
    if (!header) {
      throw new Error("Adding custom header requires header text.")
    }
    if (!this._headers) {
      throw new Error("Headers object does not exist.")
    }
    this._headers["X-Custom-Header"] = header
  }

  /**
   * Private
   * Construct Basic Auth header from private credentials
   * @return {String}
   */
  _buildBasicAuthHeader() {
    return (
      "Basic " +
      btoa(`${this._authCredentials.email}:${this._authCredentials.password}`)
    )
  }

  /**
   * Private
   * Append Basic Auth header to headers private property
   */
  _addBasicAuthHeader() {
    if (!this._authCredentials || !Object.keys(this._authCredentials).length) {
      throw new Error(
        "Setting Basic Auth credentials requires a credentials object with email and password keys."
      )
    } else if (
      !this._authCredentials.email ||
      !this._authCredentials.password
    ) {
      throw new Error("Credentials object requires email and password keys.")
    }
    this._headers["Authorization"] = this._buildBasicAuthHeader()
  }

  /**
   * Private
   * Build an init object for a fetch request
   * If request uses Basic Auth but does not have the Authorization header, add it
   * @return {Object}
   */
  _buildRequestOptions() {
    if (this._authCredentials && !this._headers["Authorization"]) {
      this._addBasicAuthHeader()
    }
    const options = {
      method: this._verb,
      mode: this._mode,
      cache: this._cache || "no-cache",
      headers: this._headers,
      credentials: this._credentials,
      signal: this._abortController.signal,
    }
    if (["post", "put"].includes(this._verb.toLowerCase())) {
      if (this._body) {
        options["body"] = this._body
      }
    }
    return options
  }

  /**
   * Public
   * Cancel a request if it has not resolved
   * Reset the abortController private property
   * @return {String} cancel message
   */
  cancel() {
    this._abortController.abort()
    this._abortController = new AbortController()
    return "Request cancelled."
  }

  get json() {
    return this._json
  }

  get response() {
    return this._response
  }

  set title(title) {
    this._title = title
  }

  get title() {
    return this._title
  }

  set location(location) {
    this._location = location
  }

  get location() {
    return this._location
  }

  /**
   * Validate HTTP verb before setting verb private property
   */
  set verb(verb) {
    const verbs = [
      "connect",
      "get",
      "post",
      "put",
      "patch",
      "delete",
      "head",
      "trace",
      "options",
    ]
    if (!verbs.includes(verb.toLowerCase())) {
      throw new Error("Invalid HTTP verb.")
    }
    this._verb = verb.toUpperCase()
  }

  get verb() {
    return this._verb
  }

  set authCredentials({ email, password }) {
    if (!email || !password) {
      throw new Error(
        "Auth credentials requires object with email and password keys"
      )
    }
    this._authCredentials = { email, password }
  }

  deleteAuthCredentials() {
    this._authCredentials = null
  }

  get authCredentials() {
    return `email: ${this._authCredentials.email}, password: ${this._authCredentials.password}`
  }

  get authCredentialsObj() {
    return this._authCredentials
  }

  set cache(cache) {
    if (typeof cache !== "string") {
      throw new Error("Cache must be a string.")
    }
    this._cache = cache
  }

  get cache() {
    return this._cache
  }

  setBody(body) {
    this._body = body
  }

  get rawBody() {
    return JSON.parse(this._body)
  }

  get body() {
    return this._body
  }

  set mode(mode) {
    if (typeof mode !== "string") {
      throw new Error("Mode must be a string.")
    }
    this._mode = mode
  }

  get mode() {
    return this._mode
  }

  set credentials(credentials) {
    if (typeof credentials !== "string") {
      throw new Error("Credentials must be a string.")
    }
    this._credentials = credentials
  }

  set error(err) {
    if (typeof err !== "string") {
      throw new Error("Error must be a string description.")
    }
    this._error = err
  }

  get error() {
    return this._error
  }

  /**
   * Public
   * Call fetch passing location and options
   * Set response private property to parsed response object
   * Set json private property to response.json()
   */
  async send() {
    const options = this._buildRequestOptions()
    const res = await fetch(this._location, options)
    this._response = res
    const json = await this._response.json()
    this._json = json
  }
}

export default HTTPRequest
