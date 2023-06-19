import {CylinderGeometry, Group, Mesh, MeshStandardMaterial, PointLight, SphereGeometry} from 'three'
import {AnimatedElement, HoverableElement} from '../utils/types'

export class Sun extends Group implements AnimatedElement, HoverableElement {
	private material = new MeshStandardMaterial({color: 0xffff00})
	private radius = 1
	private pointLight: PointLight
	private isHovered = false

	constructor() {
		super()
		this.addBody()
		this.addRays()
		this.addLight()
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry,this.material)
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
		const ray = new Mesh(geometry,this.material)
		return ray
	}

	addLight() {
		this.pointLight = new PointLight(0xffffff, 0.5)
		this.pointLight.position.set(0, 2, 4)
		this.add(this.pointLight)
	}

	animate() {
		this.rotateZ(0.001)
		if (this.isHovered) {
			this.material.color.set(0xff0000)
			this.isHovered = false
		} else {
			this.material.color.set(0xffff00)
		}
	}

	hover() {
		this.isHovered = true
	}
}