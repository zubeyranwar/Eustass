import { useMemo } from "react"
import { findNodeById } from "../util/engine"
import { useEngineState } from "./engine-state"

export default function PropertiesPanel() {
    const { selectedNodeId, nodes, setNodes } = useEngineState()

    const selectedNode = useMemo(() => {
        if (!selectedNodeId) return null
        return findNodeById(nodes, selectedNodeId)
    }, [selectedNodeId, nodes])

    return (
        <div className="w-[240px] h-full bg-[#111111] text-white">
            <div className="flex flex-col h-fit">
                <h2 className="text-lg font-bold p-4">Properties</h2>
                <div className="p-4">
                    {selectedNodeId ? (
                        <div>
                            <div className="flex">
                                <input
                                    type="text"
                                    name="x"
                                    value={selectedNode?.x}
                                    onChange={(e) => {
                                        const newX = parseInt(e.target.value) || 0
                                        setNodes(nodes.map(n => n.id === selectedNodeId ? { ...n, x: newX } : n))
                                    }}
                                />
                                <input
                                    type="text"
                                    name="y"
                                    value={selectedNode?.y}
                                    onChange={(e) => {
                                        const newY = parseInt(e.target.value) || 0
                                        setNodes(nodes.map(n => n.id === selectedNodeId ? { ...n, y: newY } : n))
                                    }}
                                />
                            </div>
                            <p>
                                Size: {selectedNode?.width} x {selectedNode?.height}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400">Select a node to see its properties</p>
                    )}
                </div>
            </div>
        </div>
    )
}