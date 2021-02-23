import React from "react"
import { Table, Input } from "semantic-ui-react"

export default function Headers() {
  return (
    <React.Fragment>
      <Table celled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Key</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
      {/* <Input placeholder="Content-Type" /> */}
    </React.Fragment>
  )
}
