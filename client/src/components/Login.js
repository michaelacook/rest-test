import React from "react"
import { Button, Grid, Header, Icon } from "semantic-ui-react"

export default function Login() {
  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h1" style={{ marginTop: "100px" }}>
            Welcome to REST Test
          </Header>
          <p>
            Test your API endpoints in the browser, save and export collections.
            Fast, free, easy.
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width="4" textAlign="center" style={{ marginTop: "50px" }}>
          <Button size="big" fluid>
            <Icon name="user circle" />
            Continue as guest
          </Button>
          <p style={{ margin: "14px 0 14px 0" }}>Or</p>
          <Button
            color="black"
            size="big"
            fluid
            style={{ marginBottom: "17px" }}
          >
            <Icon name="github" />
            Login with GitHub
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
