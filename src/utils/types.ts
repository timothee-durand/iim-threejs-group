import {SolarSystem} from '../SolarSystem'

export interface AnimatedElement {
    animate: (elapseTime : number) => void
}

export function isAnimatedElement(element: any) : element is AnimatedElement {
	return element !== undefined && element.animate !== undefined
}

export interface HoverableElement {
    hover: () => void
}

export function isHoverableElement(element: any): element is HoverableElement {
	return element.hover !== undefined
}

