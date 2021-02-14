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
import JSONTree from "react-json-tree"

function RequestView({ req, requests, setRequests, index, deleteRequest }) {
  const [request, setRequest] = useState(req)
  const [location, setLocation] = useState(req.location)
  const [verb, setVerb] = useState(req.verb.toLowerCase())
  const [response, setResponse] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [responseColor, setResponseColor] = useState("")
  const [darkTheme, setDarkTheme] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requestMenuItem, setRequestMenuItem] = useState("params")

  useEffect(() => {
    setRequest(req)
  }, [req])

  useEffect(() => {
    setLocation(request.location || "")
    setVerb(request.verb.toLowerCase() || "")
    setResponse(request.response)
    setResponseText(request.json || "")
    setError(request.error || null)
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

  function saveRequest() {
    const newState = [...requests]
    newState.splice(index, 1, request)
    setRequests(newState)
  }

  function handleLocationChange({ value }) {
    setLocation(value)
    request.location = value
    saveRequest()
  }

  function handleVerbChange({ value }) {
    setVerb(value)
    request.verb = value
    saveRequest()
  }

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
            onClick={(e) => setRequestMenuItem("params")}
          />
          <Menu.Item
            name="authorization"
            active={requestMenuItem === "authorization"}
            onClick={(e) => setRequestMenuItem("authorization")}
          />
          <Menu.Item
            name="headers"
            active={requestMenuItem === "headers"}
            onClick={(e) => setRequestMenuItem("headers")}
          />
          <Menu.Item
            name="body"
            active={requestMenuItem === "body"}
            onClick={(e) => setRequestMenuItem("body")}
          />
        </Menu>
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
