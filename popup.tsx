import { useEffect, useRef, useState } from "react"

import { Storage, type StorageAreaName } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

/** This is just a sample popup in order to test the devtools panel. See `devtools.tsx` */
function IndexPopup() {
  const [storageArea, setStorageArea] = useState<StorageAreaName>(
    (localStorage.getItem("area") as StorageAreaName) || "sync"
  )
  const storageRef = useRef(new Storage({ area: storageArea }))

  const [stringValue, setStringValue] = useStorage<string>(
    { key: "stringValue", instance: storageRef.current },
    ""
  )
  const [numberValue, setNumberValue] = useStorage<number>(
    { key: "numberValue", instance: storageRef.current },
    1
  )
  const [booleanValue, setBooleanValue] = useStorage<boolean>(
    { key: "booleanValue", instance: storageRef.current },
    true
  )
  const [jsonValue, setJsonValue] = useStorage<{ foo: string; bool: boolean }>(
    { key: "jsonValue", instance: storageRef.current },
    {
      foo: "bar",
      bool: true
    }
  )

  return (
    <div
      style={{
        padding: 8
      }}>
      <h2>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h2>
      <div>
        Storage Area:{" "}
        <select
          value={storageArea}
          onChange={(e) => {
            setStorageArea(e.target.value as StorageAreaName)
            localStorage.setItem("area", e.target.value)
            location.reload()
          }}>
          <option>local</option>
          <option>sync</option>
          <option>session</option>
        </select>
      </div>
      <br />
      String value:{" "}
      <input
        value={stringValue}
        onChange={(e) => setStringValue(e.target.value)}
      />
      Number value:{" "}
      <input
        type="number"
        value={numberValue}
        onChange={(e) => setNumberValue(e.target.valueAsNumber)}
      />
      Boolean value:{" "}
      <input
        type="checkbox"
        checked={booleanValue}
        onChange={(e) => setBooleanValue(e.target.checked)}
      />
      <div>JSON value:</div>
      <div>
        foo:{" "}
        <input
          value={jsonValue.foo}
          onChange={(e) => setJsonValue((v) => ({ ...v, foo: e.target.value }))}
        />
      </div>
      <div>
        bool:{" "}
        <input
          type="checkbox"
          checked={jsonValue.bool}
          onChange={(e) =>
            setJsonValue((v) => ({ ...v, bool: e.target.checked }))
          }
        />
      </div>
    </div>
  )
}

export default IndexPopup
