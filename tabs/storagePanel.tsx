import JSONFormatter from "json-formatter-js"
import { useEffect, useRef, useState } from "react"

import { Storage, type StorageAreaName } from "@plasmohq/storage"

/** Devtools storage panel */
function StoragePanel() {
  const [area, setArea] = useState<StorageAreaName>("sync")
  const [data, setData] = useState<Record<string, string>>({})

  useEffect(() => {
    const storageListener = (changes: {
      [key: string]: chrome.storage.StorageChange
    }) => {
      setData(prevData => {
        const newData = { ...prevData }
        Object.entries(changes).forEach(([key, change]) => {
          newData[key] = change.newValue
        })
        return newData
      })
    }

    const storage = new Storage({ area })
    storage.getAll().then(setData)
    storage.primaryClient.onChanged.addListener(storageListener)

    return () => {
      storage.primaryClient.onChanged.removeListener(storageListener)
    }
  }, [area])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 4
      }}>
      <h2>Plasmo Storage Devtools</h2>
      <div>
        Storage Area:{" "}
        <select
          value={area}
          onChange={(e) => setArea(e.target.value as StorageAreaName)}>
          <option>local</option>
          <option>sync</option>
          <option>managed</option>
          <option>session</option>
        </select>
      </div>
      <br />
      <div style={{ display: "flex" }}>
        <div style={{ width: 110 }}>
          <b>Key</b>
        </div>
        <div>
          <b>Value</b>
        </div>
      </div>
      <br />
      {Object.entries(data)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "flex",
              paddingBlock: 3,
              borderBottom: "solid 1px lightgray"
            }}>
            <b
              style={{
                width: 110,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              }}>
              {key}
            </b>
            <div>
              {typeof JSON.parse(value) !== "object" ? (
                value
              ) : (
                <FormattedJSON value={value} />
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default StoragePanel

const FormattedJSON = ({ value }: { value: string }) => {
  const spanRef = useRef<HTMLSpanElement>()
  useEffect(() => {
    const formattedJson = new JSONFormatter(JSON.parse(value)).render()
    spanRef.current?.appendChild(formattedJson)

    return () => {
      spanRef.current?.removeChild(formattedJson)
    }
  }, [value])

  return <span ref={spanRef} />
}
