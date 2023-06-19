import {
	CylinderGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	PointLight,
	SphereGeometry
} from 'three'
import {AnimatedElement, HoverableElement} from '../utils/types'

export class Sun extends Group implements AnimatedElement, HoverableElement {
	private material !: MeshStandardMaterial
	private radius = 1
	private isHovered = false

	constructor() {
		super()
		this.addMaterial()
		this.addBody()
		this.addRays()
		this.addLight()
	}

	async addMaterial() {
		this.material = new MeshStandardMaterial({ color: '#ffdd00',  roughness:1})
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry, this.material)
		this.add(body)
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
		this.add(rays)
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
		this.rotateZ(0.001)
	}

	hover() {
		this.isHovered = true
	}
}