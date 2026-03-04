import { useEngineState } from "./engine-state"

export default function ComponentPicker() {
    const { startDrawing } = useEngineState()
    return (
        <div className="w-full">
            <div className="w-1/4 flex items-center gap-8">
                <button onClick={() => startDrawing("frame")}>Frame</button>
                <button onClick={() => startDrawing("stack")}>Stack</button>
                <button onClick={() => startDrawing("text")}>Text</button>
            </div>
        </div>
    )
}