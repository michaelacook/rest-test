import React, { useState, useEffect } from "react"
import { Button, Form, Grid, Icon, Menu, Tab } from "semantic-ui-react"
import RequestPane from "./components/RequestPane"
import HTTPRequest from "./modules/HTTPRequest.js"

function App() {
  const [requests, setRequests] = useState([])
  const [activeRequest, setActiveRequest] = useState(null)
  const [activeTab, setActiveTab] = useState(-1)

  useEffect(() => {
    setActiveRequest(requests[activeTab])
  }, [activeTab])

  function addRequest() {
    const newRequest = new HTTPRequest()
    newRequest.index = activeTab + 1
    setRequests([...requests, newRequest])
    setActiveTab(activeTab + 1)
  }

  return (
    <Grid celled padded style={{ height: "100vh" }}>
      <Grid.Row color="black" style={{ height: "6%" }}>
        <Grid.Column>
          <Button size="tiny" color="orange" onClick={addRequest}>
            <Icon name="plus" />
            New
          </Button>
          <Button size="tiny" style={{ marginLeft: "7px" }}>
            Import
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ height: "94%" }}>
        <Grid.Column width={2}>
          <Form>
            <Form.Input
              icon="search"
              iconPosition="left"
              placeholder="Filter"
            />
          </Form>
        </Grid.Column>
        <Grid.Column width={14}>
          {requests.length ? (
            <Menu tabular>
              {requests.map((request, i) => (
                <Menu.Item
                  key={i}
                  name={request.title}
                  active={i === activeTab}
                  onClick={() => {
                    setActiveTab(i)
                    setActiveRequest(requests[i])
                  }}
                />
              ))}
            </Menu>
          ) : null}
          {activeRequest ? (
            <RequestPane
              request={activeRequest}
              requests={requests}
              setRequests={setRequests}
              index={activeRequest.index}
            />
          ) : null}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default App
