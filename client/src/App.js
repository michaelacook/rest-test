import React, { useState, useEffect } from "react"
import {
  Button,
  Form,
  Grid,
  GridColumn,
  Icon,
  Menu,
  Tab,
} from "semantic-ui-react"
import RequestView from "./components/RequestView"
import HTTPRequest from "./modules/HTTPRequest.js"

function App() {
  const [requests, setRequests] = useState([])
  const [activeRequest, setActiveRequest] = useState(null)
  const [activeTab, setActiveTab] = useState(-1)

  useEffect(() => {
    setActiveRequest(requests[activeTab])
    if (requests.length === 1) {
      setActiveTab(0)
    }
  }, [activeTab, requests])

  function addRequest() {
    const newRequest = new HTTPRequest()
    setRequests([...requests, newRequest])
    setActiveTab(requests.length)
  }

  function deleteRequest(index) {
    if (requests.length === 1) {
      setRequests([])
      setActiveTab(-1)
      return
    }
    const newState = [...requests]
    newState.splice(index, 1)
    setRequests(newState)
    setActiveTab(activeTab > -1 ? activeTab - 1 : -1)
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
      <Grid.Row style={{ height: "94%", overflowY: "scroll" }}>
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
          {
            <Menu tabular>
              {requests.length
                ? requests.map((request, i) => (
                    <Menu.Item
                      key={i}
                      name={request.title}
                      active={i === activeTab}
                      onClick={() => {
                        setActiveTab(i)
                        setActiveRequest(requests[i])
                      }}
                    />
                  ))
                : null}
              <Menu.Item
                active={!requests.length}
                icon="plus"
                onClick={addRequest}
              />
            </Menu>
          }
          {activeRequest ? (
            <RequestView
              req={activeRequest}
              requests={requests}
              setRequests={setRequests}
              index={requests.indexOf(activeRequest)}
              deleteRequest={deleteRequest}
            />
          ) : null}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default App
