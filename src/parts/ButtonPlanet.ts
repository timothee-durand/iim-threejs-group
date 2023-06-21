import {
	Camera,
	CylinderGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PointLight, Scene,
	SphereGeometry, TextureLoader, TorusGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'


export class ButtonPlanet extends Group implements AnimatedElement, ClickableElement {

	private texture !: string
	private radius: number
	private material!: MeshStandardMaterial
	private planet: BasePlanet

	constructor(texture: string, planet: BasePlanet) {
		super()
		this.texture = texture
		this.planet = planet
		this.radius = 0.03
		this.addMaterial()
		this.addBody()
		this.addLight()
	}

	async addMaterial() {
		const texture = new TextureLoader().load(this.texture)
		this.material = new MeshStandardMaterial({ roughness: 1, map: texture })
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

	animate() {
		this.rotation.y += 0.02
	}

	onClick(buttonGroup: Group) {
		console.log(buttonGroup.position)
		buttonGroup.position.set(this.planet.position.x + 1, this.planet.position.y, this.planet.position.z)
	}
}