import {
	Group,
	Mesh, MeshBasicMaterial,
	SphereGeometry, TextureLoader, Vector3
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import {gsap} from 'gsap'
import {cameraOffset} from '../utils/config'


export class ButtonPlanet extends Group implements AnimatedElement, ClickableElement {

	private readonly texture !: string
	private readonly radius: number
	private material!: MeshBasicMaterial
	public planet: BasePlanet
	private readonly rotationSpeed: number
	public isTransitionning = false


	constructor(texture: string, planet: BasePlanet) {
		super()
		this.texture = texture
		this.planet = planet
		this.radius = 0.03
		this.addMaterial()
		this.addBody()
		this.rotationSpeed = Math.random() * 0.01
	}

	async addMaterial() {
		const texture = new TextureLoader().load(this.texture)
		this.material = new MeshBasicMaterial({ map: texture })
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry, this.material)
		this.add(body)
	}


	animate() {
		this.rotation.y += this.rotationSpeed
	}

	onClick(buttonGroup: Group) {
		const timeline =  gsap.timeline({
			onStart:() => {
				this.isTransitionning = true
			},
			onComplete: () => {
				this.isTransitionning = false
				this.planet.panel.openPanel()
			}
		})
		timeline.to(buttonGroup.position, {
			x: 0,
			y: 9,
			z: 100,
			duration: 0.5,
			ease: 'power2.out',
		})
		timeline.to(buttonGroup.position, {
			x: this.planet.position.x + cameraOffset.x,
			y: this.planet.position.y + cameraOffset.y,
			z: this.planet.position.z + cameraOffset.z,
			duration: 0.5,
			ease: 'power2.out',
		}, 'planet')

	}

	unselect() {
		this.planet.panel.closePanel()
	}
}