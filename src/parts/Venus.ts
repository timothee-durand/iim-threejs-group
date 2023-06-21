import {
	CylinderGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PointLight, Scene,
	SphereGeometry, TextureLoader, TorusGeometry
} from 'three'
import {AnimatedElement, HoverableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import venusTexture from '../assets/textures/venus.jpg'
import {distanceToSunFactor} from '../utils/config'

export class Venus extends BasePlanet {
	constructor(scene: Scene) {
		super()
		this.radius = 0.45
		this.distanceToSun = 3.4
		this.speed = 1.26
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		this.addOrbit(scene)
	}
	addOrbit(scene: Scene) {
		const orbitGroup = new Group() // Create a new group for the orbit

		const geometry = new TorusGeometry(this.distanceToSun * distanceToSunFactor, 0.01, 20, 100)
		const material = new MeshStandardMaterial({ color: '#ffffff', roughness: 1 })
		const orbit = new Mesh(geometry, material)
		orbit.rotation.x = Math.PI / 2
		orbitGroup.add(orbit) // Add the orbit to the orbit group

		scene.add(orbitGroup) // Add the orbit group to the parent group (assuming the parent group is used for the solar system scene)
	}

	async addMaterial() {
		const texture = new TextureLoader().load(venusTexture)
		this.material = new MeshStandardMaterial({ roughness: 1, map: texture })	}

	addPosition() {
		this.translateX(this.distanceToSun * distanceToSunFactor)
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry, this.material)
		this.add(body)
	}


	addLight() {
		const pointLight = new PointLight(0xffffff, 0.1)
		pointLight.position.set(0, 2, 4)
		this.add(pointLight)

		const pointLight2 = new PointLight(0xffffff, 0.1)
		pointLight2.position.set(0, -2, -4)
		this.add(pointLight2)
	}
}