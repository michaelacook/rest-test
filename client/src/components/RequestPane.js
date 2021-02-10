import React, { useState, useEffect } from "react"
import { Button, Dropdown, Form, Header, Input } from "semantic-ui-react"

const HTTPVerbDropdownOptions = [
  { key: "get", text: "GET", value: "get" },
  { key: "post", text: "POST", value: "post" },
  { key: "put", text: "PUT", value: "put" },
  { key: "path", text: "PATCH", value: "patch" },
  { key: "delete", text: "DELETE", value: "delete" },
  { key: "options", text: "OPTIONS", value: "options" },
  { key: "trace", text: "TRACE", value: "trace" },
]

function RequestPane({ request, requests, setRequests, index }) {
  const [location, setLocation] = useState(request.location)
  const [verb, setVerb] = useState(request.verb)

  useEffect(() => {
    setLocation(request.location)
    setVerb(request.verb.toLowerCase())
  }, [request])

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
            <Button color="linkedin">Send</Button>
          </Form.Field>
          <Form.Field>
            <Button icon="trash" />
          </Form.Field>
        </Form.Group>
      </Form>
    </React.Fragment>
  )
}

export default RequestPane
