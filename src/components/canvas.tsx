import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Rect, Transformer, Text } from "react-konva"
import { useEngineState } from "./engine-state"
import { findParentFrame, Node } from "../util/engine"
import KeyboardShortcut from "./keyboard-shortcut"

export default function Canvas() {
    const stageRef = useRef(null)

    const trRef = useRef(null)
    const textInputRef = useRef(null)

    const { nodes, setNodes, selectedNodeId, setSelectedNodeId, isDrawing, stopDrawing, drawingType } = useEngineState()
    const [isEditingMode, setIsEditingMode] = useState(false)
    const [editingTextNode, setEditingNode] = useState<Node | null>(null)

    const [drawingNode, setDrawingNode] = useState<Node | null>(null)

    useEffect(() => {
        console.log({ selectedNodeId })
        if (!stageRef.current || !trRef.current) return

        if (!selectedNodeId) {
            trRef.current.nodes([])
            return
        }

        const selectedNode = stageRef.current.findOne(`#${selectedNodeId}`)
        if (selectedNode) {
            trRef.current.nodes([selectedNode])
            trRef.current.getLayer().batchDraw()
        }
    }, [selectedNodeId, nodes])

    useEffect(() => {
        if (isEditingMode && textInputRef.current) {
            textInputRef.current.focus()
        }
    }, [isEditingMode])

    const handleTextDoubleClick = (node: Node) => {
        const textNode = stageRef.current.findOne(`#${node.id}`)
        console.log({ textNode })
        if (!textNode) return
        console.log({ stageRef: stageRef?.current })

        const updatedNode = { ...node, }
        setEditingNode(node)
        setIsEditingMode(true)
    }

    const handleTextChange = (e) => {
        setEditingNode((prev) => ({ ...prev, text: e.target.value }))
    }

    const handleTextBlur = () => {
        finishEditing()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            finishEditing()
        } else if (e.key === 'Escape') {
            cancelEditing()
        }
    }

    const finishEditing = () => {
        if (editingTextNode?.id && editingTextNode?.text?.trim()) {
            setNodes(prev => prev.map(node =>
                node.id === editingTextNode?.id
                    ? { ...node, text: editingTextNode?.text }
                    : node
            ))
        }
        cancelEditing()
    }

    const cancelEditing = () => {
        setIsEditingMode(false)
        setEditingNode(null)
    }

    const displayNodes = () => {
        return nodes.filter(n => !n.deleted).map(node => {
            switch (node.type) {
                case "frame":
                    return (
                        <Rect
                            id={node.id}
                            key={node.id}
                            x={node.x}
                            y={node.y}
                            width={node.width}
                            height={node.height}
                            fill={node.color}
                            draggable
                            onClick={() => setSelectedNodeId(node.id)}
                        />
                    )
                case "text":
                    return (
                        <>
                            <Text
                                id={node.id}
                                key={node.id}
                                x={node.x}
                                y={node.y}
                                text={node.text}
                                fontSize={node.fontSize}
                                fill="black"
                                draggable
                                onClick={() => setSelectedNodeId(node.id)}
                                onDblClick={() => handleTextDoubleClick(node)}
                                visible={editingTextNode?.id !== node.id}
                            />
                        </>
                    )
                default:
                    return null
            }
        })
    }

    return (
        <div className={`w-screen h-screen flex-1 bg-gray-200 ${isDrawing ? "cursor-crosshair" : ""}`}>
            <Stage
                ref={stageRef}
                width={window.innerWidth - 440}
                height={window.innerHeight - 40}
                onMouseDown={(e) => {
                    const stage = e.target.getStage()
                    if (e.target == stage) {
                        setSelectedNodeId(null)
                    }

                    if (!drawingType) return

                    const node = new Node(drawingType)

                    node.x = stage?.getPointerPosition()?.x as number
                    node.y = stage?.getPointerPosition()?.y as number
                    node.width = 0
                    node.height = 0

                    setDrawingNode(node)
                }}
                onMouseMove={(e) => {
                    const stage = e.target.getStage()

                    if (!drawingNode) return

                    const width = stage.getPointerPosition().x - drawingNode.x
                    const height = stage?.getPointerPosition().y - drawingNode.y

                    setDrawingNode(prev => ({ ...prev, width, height } as Node))
                }}
                onMouseUp={() => {
                    if (!drawingNode) return

                    const parent = findParentFrame(nodes, drawingNode)

                    if (parent) {
                        drawingNode.parentId = parent.id
                        drawingNode.x -= parent.x
                        drawingNode.y -= parent.y
                    }

                    setNodes(prev => ([...prev, drawingNode]))
                    setSelectedNodeId(drawingNode.id)
                    setDrawingNode(null)
                    stopDrawing()
                }}
            >
                <Layer>
                    {displayNodes()}

                    {drawingNode && (
                        drawingNode.type === "frame" ? <Rect
                            x={drawingNode.x}
                            y={drawingNode.y}
                            width={drawingNode.width}
                            height={drawingNode.height}
                            fill="rgba(0,0,255,0.3)"
                        /> : <Text
                            x={drawingNode.x}
                            y={drawingNode.y}
                            text="Text"
                            fontSize={16}
                            fill="rgba(0,0,255,0.3)"
                        />
                    )}

                    <Transformer ref={trRef} />
                </Layer>
            </Stage>
            {isEditingMode && editingTextNode?.id && (
                <input
                    ref={textInputRef}
                    type="text"
                    value={editingTextNode?.text}
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    onKeyDown={handleKeyDown}
                    style={{
                        position: 'absolute',
                        left: editingTextNode.x,
                        top: editingTextNode.y,
                        width: "fit-content",
                        height: "fit-content",
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        background: 'white',
                        padding: '2px',
                        margin: 0,
                        outline: 'none',
                        zIndex: 1000,
                        transform: 'translate(0, 0)',
                    }}
                />
            )}
            <KeyboardShortcut />
        </div>
    )
}