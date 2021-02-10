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
    headers = "application/json; charset=utf-8",
    mode = "cors",
    cache = null,
    body = null,
    authCredentials = null,
    credentials = "omit"
  ) {
    this._response = null
    this._authCredentials = authCredentials
    this._credentials = credentials
    this._abortController = new AbortController()
    this._location = location
    this._verb = verb.toUpperCase()
    this._mode = mode
    this._cache = cache
    this._title = "Untitled"
    this._body = JSON.stringify(body)
    this._headers = new Headers()
    if (typeof headers === "string") {
      this._headers.append("Content-Type", headers)
    } else if (Array.isArray(headers)) {
      headers.forEach((header) => {
        this._headers.append("Content-Type", header)
      })
    }
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
    this._headers.append("X-Custom-Header", header)
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
    this._headers.append("Authorization", this._buildBasicAuthHeader())
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
      // signal: this._abortController.signal,
    }
    if (this._body) {
      options["body"] = this._body
    }
    return options
  }

  /**
   * Public
   * Call fetch passing location and options
   * Set response private property to parsed response object
   */
  async send() {
    const options = this._buildRequestOptions()
    const res = await fetch(this._location, options)
    this._response = await res.json()
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

  set title(title) {
    this._title = title
  }

  get title() {
    return this._title
  }

  /**
   * Validate location URI before setting location private property
   */
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

  /**
   * Set headers private property
   * @param {Array} headers - array of headers
   */
  set headers(headers) {
    if (!headers.length) {
      throw new Error("Setting headers property requires headers array.")
    }
    const hdrs = new Headers()
    headers.forEach((header) => {
      hdrs.append("Content-Type", header)
    })
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
    hdrs.append(
      "Authorization",
      "Basic " +
        btoa(`${this._authCredentials.email}:${this._authCredentials.password}`)
    )
    this._headers = hdrs
  }

  get headers() {
    return this._headers
  }

  set authCredentials({ email, password }) {
    if (!email || !password) {
      throw new Error(
        "Auth credentials requires object with email and password keys"
      )
    }
    this._authCredentials = { email, password }
  }

  get authCredentials() {
    return `email: ${this._authCredentials.email}, password: ${this._authCredentials.password}`
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
    if (typeof body !== "object") {
      throw new Error("HTTP payload must be a JavaScript object or array")
    }
    this._body = JSON.stringify(body)
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
}

export default HTTPRequest
