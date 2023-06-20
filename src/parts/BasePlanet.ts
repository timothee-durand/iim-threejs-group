import {
	Clock,
	CylinderGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PointLight, Scene,
	SphereGeometry, TorusGeometry
} from 'three'
import {AnimatedElement, HoverableElement} from '../utils/types'

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
		this.position.x = Math.sin(elapsedTime * this.speed) * this.distanceToSun
		this.position.z = Math.cos(elapsedTime * this.speed)	* this.distanceToSun
	}

	hover() {
		this.isHovered = true
	}

}