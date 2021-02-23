import React, { useState, useEffect } from "react"
import ReactPrismEditor from "react-prism-editor"

export default function Body({ body, handleBodyChange }) {
  const [code, setCode] = useState(body || " ")

  useEffect(() => {
    handleBodyChange(code)
  }, [code])

  return (
    <ReactPrismEditor
      style={{ border: "none" }}
      language="json"
      theme="tomorrow"
      code={code}
      lineNumber={true}
      readOnly={false}
      clipboard={true}
      changeCode={(code) => setCode(code)}
    />
  )
}
