import { createContext, useContext, useState } from "react";
import type { Node, NodeType } from "../util/engine";
import { useLocalStorage } from "../hooks/use-localstorage";

interface EngineState {
    nodes: Node[]
    setNodes: (nodes: Node[]) => void
    selectedNodeId: string | null
    setSelectedNodeId: (id: string | null) => void
    drawingType?: NodeType | null
    isDrawing: boolean
    startDrawing: (type: NodeType) => void;
    stopDrawing: () => void
    deleteNode: (id: string) => void
}

const EngineStateContext = createContext<EngineState | null>(null)

export default function EngineStateProvider({ children }: { children: React.ReactNode }) {
    const [engineState, setEngineState] = useLocalStorage("engineState", {
        nodes: [] as Node[],
        selectedNodeId: null as string | null
    })

    const [nodes, setNodes] = useState<Node[]>(engineState.nodes)
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(engineState.selectedNodeId)

    if (engineState.nodes !== nodes || engineState.selectedNodeId !== selectedNodeId) {
        setEngineState({
            nodes,
            selectedNodeId
        })
    }
    const [drawingType, setDrawingType] = useState<NodeType | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    const deleteNode = (id: string) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, deleted: true } : n) as Node[])
        setSelectedNodeId(null)
    }

    const startDrawing = (type: NodeType) => {
        setDrawingType(type)
        setIsDrawing(true)
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        setDrawingType(null)
    }

    return (
        <EngineStateContext.Provider value={{
            nodes,
            setNodes,
            selectedNodeId,
            setSelectedNodeId,
            drawingType,
            isDrawing,
            startDrawing,
            stopDrawing,
            deleteNode
        }}>
            {children}
        </EngineStateContext.Provider>
    )
}

export function useEngineState() {
    const context = useContext(EngineStateContext)
    if (!context) {
        throw new Error("useEngineState must be used within an EngineStateProvider")
    }
    return context
}