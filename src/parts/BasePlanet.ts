import {
	Group,
	MeshStandardMaterial
} from 'three'
import {AnimatedElement, HoverableElement} from '../utils/types'
import {distanceToSunFactor} from '../utils/config'

export class BasePlanet extends Group implements AnimatedElement, HoverableElement {
	protected material !: MeshStandardMaterial
	protected radius !: number
	protected distanceToSun !: number
	protected speed !: number
	private isHovered = false

	constructor() {
		super()
	}


	animate(elapsedTime: number) {
		this.position.x = Math.sin(elapsedTime * this.speed) * this.distanceToSun * distanceToSunFactor
		this.position.z = Math.cos(elapsedTime * this.speed)	* this.distanceToSun * distanceToSunFactor
	}

	hover() {
		this.isHovered = true
	}

}