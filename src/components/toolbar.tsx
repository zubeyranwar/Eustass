import { useState } from "react";
import ComponentPicker from "./component-picker";

export default function Toolbar() {
  const [isRenaming, setIsRenaming] = useState(false)
  const [name, setName] = useState("Untitled")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 1) {
      setName("Untitled")
    } else {
      setName(e.target.value)
    }
  }
  return (
    <nav>
      <div className="h-[40px] fixed top-0 left-0 z-10 bg-[#111111]/90 text-white w-full flex items-center px-2">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-[180px]">
            <h3 className="w-fit">Framer</h3>
            <ComponentPicker />
          </div>
          <div className="flex-1">
            {isRenaming ? (
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                onBlur={() => setIsRenaming(false)}
                className="border-b border-gray-500 focus:outline-none text-center text-white"
              />
            ) : (
              <button className="text-center" onClick={() => setIsRenaming(true)}>{name}</button>
            )}
          </div>
          <div className="">
            <button className="flex justify-end">Publish</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
