import {
	Group, Mesh,
	MeshStandardMaterial, SphereGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import {distanceToSunFactor} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class BasePlanet extends Group implements AnimatedElement, ClickableElement {
	protected material !: MeshStandardMaterial
	protected radius !: number
	protected distanceToSun !: number
	protected speed !: number
	private isHovered = false
	protected planet !: Mesh<SphereGeometry, MeshStandardMaterial>
	panel !: AnimatedPlanetPanel

	constructor() {
		super()
	}


	animate(elapsedTime: number) {

		this.planet.rotation.y += 0.01
		this.position.x = Math.sin(elapsedTime * this.speed * 0.5) * this.distanceToSun * distanceToSunFactor
		this.position.z = Math.cos(elapsedTime * this.speed * 0.5)	* this.distanceToSun * distanceToSunFactor
	}

	onClick() {
		this.isHovered = true
	}

}