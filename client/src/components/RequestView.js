import React, { useState, useEffect } from "react"
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Input,
  Menu,
  Message,
  Popup,
} from "semantic-ui-react"
import { theme, themeOptions } from "../theme"
import { HTTPVerbDropdownOptions } from "../options"
import Headers from "./request-pane-options/Headers"
import Body from "./request-pane-options/Body"
import Authorization from "./request-pane-options/Authorization"
import JSONTree from "react-json-tree"

function RequestView({ req, requests, setRequests, index, deleteRequest }) {
  const [request, setRequest] = useState(req)
  const [location, setLocation] = useState(req.location)
  const [headers, setHeaders] = useState(req.headers)
  const [verb, setVerb] = useState(req.verb.toLowerCase())
  const [body, setBody] = useState(null)
  const [response, setResponse] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [responseColor, setResponseColor] = useState("")
  const [authCredentials, setAuthCredentials] = useState(null)
  const [darkTheme, setDarkTheme] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requestMenuItem, setRequestMenuItem] = useState("authorization")

  useEffect(() => {
    setRequest(req)
    setRequestMenuItem(req.optionsTab || "authorization")
    setBody(req.body)
    setHeaders(req.headers)
    setAuthCredentials(req.authCredentialsObj)
  }, [req])

  useEffect(() => {
    setLocation(request.location || "")
    setVerb(request.verb.toLowerCase() || "")
    setResponse(request.response)
    setResponseText(request.json || "")
    setError(request.error || null)
    setBody(request.body)
    setHeaders(request.headers)
    setAuthCredentials(request.authCredentialsObj)
  }, [request])

  useEffect(() => {
    if (response) {
      setResponseText(req.json)
      if (response.status < 200) {
        setResponseColor("teal")
      } else if (response.status < 300 && response.status > 199) {
        setResponseColor("#78B302")
      } else if (response.status < 400 && response.status > 299) {
        setResponseColor("blue")
      } else if (response.status < 500 && response.status > 399) {
        setResponseColor("gold")
      } else if (response.status > 499) {
        setResponseColor("red")
      }
    }
  }, [response])

  /**
   * Save open options tab
   * Save options tab selection to request object, save request
   * Persists options tab selection between tab change
   * @param {String} value - options tab name
   */
  function handleChangeRequestOptionsTab(value) {
    setRequestMenuItem(value)
    request.optionsTab = value
    saveRequest()
  }

  /**
   * Save a new copy of the request object to state in App.js
   */
  function saveRequest() {
    const newState = [...requests]
    newState.splice(index, 1, request)
    setRequests(newState)
  }

  /**
   * Set basic auth credentials on the request object, save to state
   * @param {String} email
   * @param {String} password
   */
  function handleAuthCredentialsChange(email, password) {
    setAuthCredentials({ email, password })
    request.authCredentials = { email, password }
    saveRequest()
  }

  /**
   * Handle change of input from textarea for Body
   * Add to request and save
   * @param {String} value - user input for HTTP payload
   */
  function handleBodyChange(value) {
    if (value) {
      setBody(`${value}`)
      request.setBody(value)
      saveRequest()
    }
  }

  /**
   * Add or update a header on the request in state
   * @param {String} key
   * @param {String} val
   */
  function handleHeadersChange(key, val) {
    request.addHeader(key, val)
    setRequest(request)
    saveRequest()
  }

  /**
   * Handle deleting a header and saving request to state
   * @param {String} key - header name
   */
  function handleDeleteHeader(key) {
    request.deleteHeader(key)
    setRequest(request)
    saveRequest()
  }

  /**
   * Handle change to URL location
   * Add to request and save
   * @param {Object}
   */
  function handleLocationChange({ value }) {
    setLocation(value)
    request.location = value
    saveRequest()
  }

  /**
   * Handle change of HTTP verb
   * Add to request and save
   * @param {Object}
   */
  function handleVerbChange({ value }) {
    setVerb(value)
    request.verb = value
    saveRequest()
  }

  /**
   * Send the request
   * Set response to request
   * Save request
   */
  async function sendRequest() {
    try {
      setError(null)
      setResponseText("")
      setLoading(true)
      await request.send()
      setResponse(request.response)
    } catch (e) {
      const msg = "Could not send request"
      setError(msg)
      req.error = msg
      saveRequest()
    }
    setLoading(false)
    saveRequest()
  }

  return (
    <React.Fragment>
      <Header as="h5" color="grey">
        {request.title} Request
      </Header>
      <Form>
        <Form.Group inline>
          <Form.Field width={14}>
            <Input
              fluid
              onChange={(e) => handleLocationChange(e.target)}
              value={location || ""}
              size="small"
              label={
                <Dropdown
                  value={verb}
                  options={HTTPVerbDropdownOptions}
                  onChange={(e, data) => handleVerbChange(data)}
                />
              }
              action={{
                color: "linkedin",
                labelPosition: "right",
                icon: "send",
                content: "Send",
                onClick: sendRequest,
                loading: loading,
              }}
              labelPosition="left"
              placeholder="Enter request URL"
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <Popup
              content="Close tab"
              trigger={
                <Button
                  circular
                  onClick={() => deleteRequest(index)}
                  icon="close"
                />
              }
            />
            <Popup
              content="Save"
              trigger={
                <Button style={{ marginLeft: "3px" }} circular icon="save" />
              }
            />
            <Popup
              content="Delete request"
              trigger={
                <Button style={{ marginLeft: "3px" }} circular icon="trash" />
              }
            />
          </Form.Field>
        </Form.Group>
        <Menu pointing secondary>
          <Menu.Item
            name="authorization"
            active={requestMenuItem === "authorization"}
            onClick={(e) => handleChangeRequestOptionsTab("authorization")}
          />
          <Menu.Item
            name="headers"
            active={requestMenuItem === "headers"}
            onClick={(e) => handleChangeRequestOptionsTab("headers")}
          />
          <Menu.Item
            name="body"
            active={requestMenuItem === "body"}
            onClick={(e) => handleChangeRequestOptionsTab("body")}
          />
        </Menu>
        <Grid>
          <Grid.Row>
            <Grid.Column width="14">
              {requestMenuItem === "headers" ? (
                <Headers
                  headers={headers}
                  handleHeadersChange={handleHeadersChange}
                  handleDeleteHeader={handleDeleteHeader}
                />
              ) : requestMenuItem === "body" ? (
                <Body body={body} handleBodyChange={handleBodyChange} />
              ) : requestMenuItem === "authorization" ? (
                <Authorization
                  authCredentials={authCredentials}
                  handleAuthCredentialsChange={handleAuthCredentialsChange}
                />
              ) : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      <Divider style={{ marginTop: "25px" }} />
      <Header style={{ marginTop: "15px" }} as="h5" color="grey">
        Response
      </Header>
      {responseText ? (
        <Grid columns={5}>
          <Grid.Row>
            <Grid.Column>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: responseColor,
                  display: "inline-block",
                  marginRight: "3px",
                }}
              ></div>
              <span style={{ color: "grey" }}>
                {response.status} {response.statusText}
              </span>
            </Grid.Column>
            <Grid.Column floated="right">
              <Dropdown
                text="Theme"
                onChange={(e, data) => setDarkTheme(data.value)}
                options={themeOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={14}>
              <JSONTree
                data={responseText}
                theme={theme}
                invertTheme={!darkTheme}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : null}
      {error ? <Message error>{error}</Message> : null}
    </React.Fragment>
  )
}

export default RequestView
