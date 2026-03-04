import { useEffect } from "react"
import { useEngineState } from "./engine-state"

export default function KeyboardShortcut() {
    const { deleteNode, selectedNodeId, startDrawing } = useEngineState();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete" && selectedNodeId) {
                deleteNode(selectedNodeId)
            }

            switch (e.key.toLowerCase()) {
                case "f":
                    startDrawing("frame")
                    break;
                case "t":
                    startDrawing("text")
                    break;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase() === "z") {
                console.log("Undo triggered")
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [deleteNode, selectedNodeId])
    return null
}