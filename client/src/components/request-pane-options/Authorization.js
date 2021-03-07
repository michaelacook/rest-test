import React, { useState, useEffect } from "react"
import {
  Checkbox,
  Dropdown,
  Divider,
  Header,
  Grid,
  Input,
} from "semantic-ui-react"

const dropDownOptions = [
  {
    key: "none",
    text: "None",
    value: "none",
  },
  {
    key: "basic",
    text: "Basic",
    value: "basic",
  },
]

export default function Authorization({
  authCredentials,
  handleAuthCredentialsChange,
  deleteAuthCredentials,
}) {
  const [showPass, setShowPass] = useState(false)
  const [authType, setAuthType] = useState("none")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (authCredentials) {
      setAuthType("basic")
    } else {
      setAuthType("none")
    }
  }, [authCredentials])

  useEffect(() => {
    if (authCredentials) {
      setUsername(authCredentials.email)
      setPassword(authCredentials.password)
    } else {
      setUsername("")
      setPassword("")
    }
  }, [authCredentials])

  useEffect(() => {
    if (username && password) {
      handleAuthCredentialsChange(username, password)
    }
  }, [username, password])

  function handleChangeAuthTypeDropdown({ value }) {
    if (value === "none") {
      deleteAuthCredentials()
    } else {
      setAuthType(value)
    }
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={5}>
          <Header as="h5">Type</Header>
          <Dropdown
            fluid
            selection
            options={dropDownOptions}
            value={authType || "none"}
            onChange={(e, data) => handleChangeAuthTypeDropdown(data)}
          />
        </Grid.Column>
        <Divider vertical />
        <Grid.Column width={11}>
          <Header as="h5">Credentials</Header>
          <Grid.Row>
            <Input
              disabled={authType === "none" ? true : false}
              fluid
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid.Row>
          <Grid.Row style={{ marginTop: "8px", marginBottom: "5px" }}>
            <Input
              disabled={authType === "none" ? true : false}
              fluid
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid.Row>
          <Checkbox
            disabled={authType === "none" ? true : false}
            label="Show password"
            onChange={(e) => setShowPass(!showPass)}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
