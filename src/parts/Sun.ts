import {
	CylinderGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PointLight,
	SphereGeometry
} from 'three'
import {AnimatedElement, HoverableElement} from '../utils/types'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Sun extends Group implements AnimatedElement, HoverableElement {
	private material !: MeshStandardMaterial
	private radius = 1
	private isHovered = false
	private panel!: AnimatedPlanetPanel
	private planetGroup = new Group()

	constructor() {
		super()
		this.addMaterial()
		this.add(this.planetGroup)
		this.addBody()
		this.addRays()
		this.addLight()
		this.addAnimatedPanel()
	}

	addMaterial() {
		this.material = new MeshStandardMaterial({ color: '#ffdd00',  roughness:1 })
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry, this.material)
		this.planetGroup.add(body)
	}

	addRays() {
		const rays = new Group()
		for (let i = 0; i < 8; i++) {
			const ray = this.generateRay()

			ray.rotateZ(i * Math.PI / 4)
			ray.translateX(1)
			ray.rotateX(-Math.PI / 2)

			rays.add(ray)
		}
		this.planetGroup.add(rays)
	}

	generateRay(): Mesh {
		const radius = this.radius * 0.3
		const geometry = new CylinderGeometry(radius, radius, 0.1)
		const ray = new Mesh(geometry, this.material)
		return ray
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

	hover() {
		this.isHovered = true
	}

	private addAnimatedPanel() {
		this.panel = new AnimatedPlanetPanel({
			name: 'Sun',
			radius: 696340,
			distance: 0,
			speed: 0,
			mass: 1988500,
			temperature: 5778,
			description:'The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core, radiating the energy mainly as light and infrared radiation. It is by far the most important source of energy for life on Earth. Its diameter is about 1.39 million kilometers, or 109 times that of Earth, and its mass is about 330,000 times that of Earth. It accounts for about 99.86% of the total mass of the Solar System. Roughly three quarters of the Sun\'s mass consists of hydrogen (~73%); the rest is mostly helium (~25%), with much smaller quantities of heavier elements, including oxygen, carbon, neon, and iron.'
		}, 4)
		this.add(this.panel)
	}
}