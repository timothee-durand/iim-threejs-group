import {
	Group, Mesh,
	MeshStandardMaterial, SphereGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import {distanceToSunFactor} from '../utils/config'

export class BasePlanet extends Group implements AnimatedElement, ClickableElement {
	protected material !: MeshStandardMaterial
	protected radius !: number
	protected distanceToSun !: number
	protected speed !: number
	private isHovered = false
	protected planet !: Mesh<SphereGeometry, MeshStandardMaterial>

	constructor() {
		super()
	}


	animate(elapsedTime: number) {

		this.position.x = Math.sin(elapsedTime * this.speed) * this.distanceToSun * distanceToSunFactor
		this.position.z = Math.cos(elapsedTime * this.speed)	* this.distanceToSun * distanceToSunFactor
		this.planet.rotation.y += 0.01
	}

	onClick() {
		this.isHovered = true
	}

}