import React, { useState, useEffect } from "react"
import { Table, Input } from "semantic-ui-react"

export default function Headers({ headers, handleHeadersChange }) {
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
        </Table.Row>
      </Table.Header>
      {Object.entries(heads).length ? (
        <Table.Body>
          {Object.entries(heads).map((header, i) => (
            <Table.Row key={i}>
              <Table.Cell size="mini" width={5}>
                <small>{header[0]}</small>
              </Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  value={header[1]}
                  onChange={(e) =>
                    handleHeadersChange(header[0], e.target.value)
                  }
                  size="mini"
                />
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.Cell size="mini">
              <Input
                size="mini"
                fluid
                value={newHeaderName}
                onChange={(e) => setNewHeaderName(e.target.value)}
              />
            </Table.Cell>
            <Table.Cell size="mini">
              <Input
                size="mini"
                fluid
                value={newHeaderValue}
                onChange={(e) => setNewHeaderValue(e.target.value)}
                onBlur={() => handleAddHeader()}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      ) : null}
    </Table>
  )
}
