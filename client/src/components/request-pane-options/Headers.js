import React, { useState, useEffect } from "react"
import { Button, Table, Input } from "semantic-ui-react"

export default function Headers({
  headers,
  handleHeadersChange,
  handleDeleteHeader,
}) {
  const [heads, setHeads] = useState([])
  const [newHeaderName, setNewHeaderName] = useState("")
  const [newHeaderValue, setNewHeaderValue] = useState("")

  useEffect(() => {
    setHeads(headers)
  }, [headers])

  function handleAddHeader() {
    if (newHeaderName && newHeaderValue) {
      handleHeadersChange(newHeaderName, newHeaderValue)
      setNewHeaderName("")
      setNewHeaderValue("")
    }
  }

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Key</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      {Object.entries(heads).length ? (
        <Table.Body>
          {Object.entries(heads).map((header, i) => (
            <Table.Row key={i}>
              <Table.Cell size="mini" width={5}>
                <small>{header[0]}</small>
              </Table.Cell>
              <Table.Cell width={11}>
                <Input
                  fluid
                  size="mini"
                  value={header[1]}
                  onChange={(e) =>
                    handleHeadersChange(header[0], e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell width={1}>
                <Button
                  icon="trash"
                  onClick={() => handleDeleteHeader(header[0])}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      ) : null}
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell>
            <Input
              fluid
              size="mini"
              value={newHeaderName}
              onChange={(e) => setNewHeaderName(e.target.value)}
            />
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Input
              fluid
              size="mini"
              value={newHeaderValue}
              onChange={(e) => setNewHeaderValue(e.target.value)}
              onBlur={() => handleAddHeader()}
            />
          </Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}
