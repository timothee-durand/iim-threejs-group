import {SolarSystem} from '../SolarSystem'
import { Camera, Group } from 'three'

export interface AnimatedElement {
    animate: (elapseTime : number) => void
}

export function isAnimatedElement(element: any) : element is AnimatedElement {
	return element !== undefined && element.animate !== undefined
}

export interface ClickableElement {
    onClick: (buttonGroup: Group) => void
}

export function isClickable(element: any): element is ClickableElement {
	return element.onClick !== undefined
}

export interface HoverableElement {
    onMouseEnter: () => void
    onMouseLeave: () => void
}

export function isHoverable(element: any): element is HoverableElement {
	return element.onMouseEnter !== undefined && element.onMouseLeave !== undefined
}