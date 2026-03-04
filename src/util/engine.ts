import type { CSSProperties } from "react"

export type NodeType = "frame" | "text" | "stack"

export class Node {
    id: string
    parentId?: string | null
    type: NodeType
    parent: Node | null = null
    children: Node[] = []
    deleted = false

    x = 0
    y = 0
    width = 100
    height = 100
    rotation = 0
    color = "red"
    text = "Hello World"
    fontSize = 16

    style: CSSProperties = {}

    constructor(type: NodeType, x = 0, y = 0, w = 100, h = 100, color = "#99EEFF") {
        this.id = crypto.randomUUID()
        this.type = type
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.color = color
    }

    add(child: Node) {
        child.parent = this
        this.children.push(child)
    }
}


export function findParentFrame(nodes: Node[], node: Node) {
    return nodes.find(n => {
        if (n.type !== "frame") return false

        const insideX = node.x >= n.x && node.x <= n.x + n.width
        const insideY = node.y >= n.y && node.y <= n.y + n.height

        return insideX && insideY
    })
}

export function findNodeById(nodes: Node[], id: string): Node | null {
    return nodes.find(n => n.id === id) || null
}