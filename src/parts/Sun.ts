import {
	Color,
	CylinderGeometry,
	Group,
	Mesh, MeshBasicMaterial, MeshPhongMaterial,
	MeshStandardMaterial,
	PointLight,
	SphereGeometry, TextureLoader
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import sunTexture from '../assets/textures/sun.jpg'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Sun extends Group implements AnimatedElement, ClickableElement {
	private material !: MeshPhongMaterial
	private radius = 5
	private isHovered = false

	private planetGroup = new Group()

	constructor() {
		super()
		this.addMaterial()
		this.add(this.planetGroup)
		this.addBody()
		this.addLight()
	}

	addMaterial() {
		const sunMap = new TextureLoader().load(sunTexture)
		this.material = new MeshPhongMaterial({  map : sunMap, emissive: '#e17500', emissiveIntensity: 20 })
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry, this.material)

		console.log(body.material)
		this.planetGroup.add(body)
	}

	addLight() {
		const pointLight = new PointLight(0xffffff, 0.2)
		pointLight.position.set(0, 2, 4)
		this.add(pointLight)

		const pointLight2 = new PointLight(0xffffff, 0.2)
		pointLight2.position.set(0, -2, 4)
		this.add(pointLight2)
	}

	animate() {
		this.planetGroup.rotateZ(0.001)
	}

	onClick() {
		this.isHovered = true
	}

}