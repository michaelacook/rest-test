import React, { useState, useEffect } from "react"
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Input,
  Message,
} from "semantic-ui-react"
import JSONTree from "react-json-tree"

const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
}

const themeOptions = [
  {
    key: "light",
    text: "light",
    value: true,
  },
  {
    key: "dark",
    text: "dark",
    value: false,
  },
]

const HTTPVerbDropdownOptions = [
  { key: "get", text: "GET", value: "get" },
  { key: "post", text: "POST", value: "post" },
  { key: "put", text: "PUT", value: "put" },
  { key: "path", text: "PATCH", value: "patch" },
  { key: "delete", text: "DELETE", value: "delete" },
  { key: "options", text: "OPTIONS", value: "options" },
  { key: "trace", text: "TRACE", value: "trace" },
]

function RequestView({ req, requests, setRequests, index, deleteRequest }) {
  const [request, setRequest] = useState(req)
  const [location, setLocation] = useState(req.location)
  const [verb, setVerb] = useState(req.verb.toLowerCase())
  const [response, setResponse] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [responseColor, setResponseColor] = useState("")
  const [lightTheme, setLightTheme] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      </Form>
      <Divider style={{ marginTop: "55px", marginBottom: "5px" }} />
      <Header style={{ marginTop: "0" }} as="h5" color="grey">
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
                onChange={(e, data) => setLightTheme(data.value)}
                options={themeOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={14}>
              <JSONTree
                data={responseText}
                theme={theme}
                invertTheme={lightTheme}
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
