export interface AnimatedElement {
    animate: (elapseTime : number) => void
}

export interface HoverableElement {
    hover: () => void
}

export function isHoverableElement(element: any): element is HoverableElement {
	return element.hover !== undefined
}