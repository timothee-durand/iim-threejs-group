import {
	Group,
	Mesh, MeshBasicMaterial,
	SphereGeometry, TextureLoader
} from 'three'
import {AnimatedElement, ClickableElement, HoverableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import {gsap} from 'gsap'
import {cameraOffset} from '../utils/config'
import {endHover, startHover} from '../utils/html'
import {random} from '../utils/random'


export class ButtonPlanet extends Group implements AnimatedElement, ClickableElement, HoverableElement {

	private readonly texture !: string
	private readonly radius: number
	private material!: MeshBasicMaterial
	public planet: BasePlanet
	private readonly rotationSpeed: number
	private currentRotation = 0
	public isTransitionning = false


	constructor(texture: string, planet: BasePlanet) {
		super()
		this.texture = texture
		this.planet = planet
		this.radius = 0.03
		this.addMaterial()
		this.addBody()
		this.rotationSpeed = Math.random() * 0.01
		this.currentRotation = this.rotationSpeed
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
		this.rotation.y += this.currentRotation
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

	onMouseEnter(): void {
		startHover()
		this.currentRotation = this.rotationSpeed * 10
		this.animateScale(1.2)
	}

	onMouseLeave(): void {
		endHover()
		this.currentRotation = this.rotationSpeed
		this.animateScale(1)
	}

	private animateScale(newScale: number) {
		gsap.to(this.scale, {
			x: newScale,
			y: newScale,
			z: newScale,
			duration: 0.5,
			ease: 'power2.out',
		})
	}
}