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
} from "semantic-ui-react"
import { theme, themeOptions } from "../theme"
import { HTTPVerbDropdownOptions } from "../options"
import Headers from "./request-pane-options/Headers"
import Body from "./request-pane-options/Body"
import JSONTree from "react-json-tree"

function RequestView({ req, requests, setRequests, index, deleteRequest }) {
  const [request, setRequest] = useState(req)
  const [location, setLocation] = useState(req.location)
  const [verb, setVerb] = useState(req.verb.toLowerCase())
  const [body, setBody] = useState(null)
  const [response, setResponse] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [responseColor, setResponseColor] = useState("")
  const [darkTheme, setDarkTheme] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requestMenuItem, setRequestMenuItem] = useState("params")

  useEffect(() => {
    setRequest(req)
    setRequestMenuItem(req.optionsTab || "params")
    setBody(req.body)
  }, [req])

  useEffect(() => {
    setLocation(request.location || "")
    setVerb(request.verb.toLowerCase() || "")
    setResponse(request.response)
    setResponseText(request.json || "")
    setError(request.error || null)
    setBody(request.body)
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
   * Handle change of input from textarea for Body
   * Add to request and save
   * @param {String} value - user input for HTTP payload
   */
  function handleBodyChange(value) {
    if (value) {
      // value = value.replace(/\s+/g, "")
      setBody(`${value}`)
      request.setBody(value)
      saveRequest()
    }
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
          <Form.Field width={13}>
            <Input
              fluid
              onChange={(e) => handleLocationChange(e.target)}
              value={location || ""}
              label={
                <Dropdown
                  value={verb}
                  options={HTTPVerbDropdownOptions}
                  onChange={(e, data) => handleVerbChange(data)}
                />
              }
              labelPosition="left"
              placeholder="Enter request URL"
            />
          </Form.Field>
          <Form.Field>
            <Button loading={loading} onClick={sendRequest} color="linkedin">
              Send
            </Button>
          </Form.Field>
          <Form.Field>
            <Button onClick={() => deleteRequest(index)} icon="trash" />
          </Form.Field>
        </Form.Group>
        <Menu pointing secondary>
          <Menu.Item
            name="params"
            active={requestMenuItem === "params"}
            onClick={(e) => handleChangeRequestOptionsTab("params")}
          />
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
                <Headers />
              ) : requestMenuItem === "body" ? (
                <Body body={body} handleBodyChange={handleBodyChange} />
              ) : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      <Divider style={{ marginTop: "80px" }} />
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
