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

export function isHoverableElement(element: any): element is ClickableElement {
	return element.onClick !== undefined
}

