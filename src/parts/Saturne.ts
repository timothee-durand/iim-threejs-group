import {
	CylinderGeometry,
	Group,
	Mesh, MeshBasicMaterial,
	MeshStandardMaterial,
	PointLight, RingGeometry, Scene,
	SphereGeometry, TextureLoader, TorusGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import saturnTexture from '../assets/textures/saturn.jpg'


export class Saturne extends BasePlanet {
	constructor(scene: Scene) {
		super()
		this.radius = 0.5
		this.distanceToSun = 11.5
		this.speed = 0.32
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		this.generateDisk()
		this.addOrbit(scene)

	}

	addOrbit(scene: Scene) {
		const orbitGroup = new Group() // Create a new group for the orbit

		const geometry = new RingGeometry(this.distanceToSun - 0.05, this.distanceToSun + 0.05, 60)
		const material = new MeshBasicMaterial({ color: '#FFF', side: 2 })
		const orbit = new Mesh(geometry, material)
		orbit.rotation.x = Math.PI / 2
		orbitGroup.add(orbit) // Add the orbit to the orbit group

		scene.add(orbitGroup) // Add the orbit group to the parent group (assuming the parent group is used for the solar system scene)
	}

	async addMaterial() {
		const texture = new TextureLoader().load(saturnTexture)
		this.material = new MeshStandardMaterial({ roughness: 1, map: texture })	}

	addPosition() {
		this.translateX(this.distanceToSun)
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)

		const body = new Mesh(geometry, this.material)
		this.add(body)
	}



	generateDisk() {
		const geometry = new RingGeometry(0.6, 0.85, 30)
		const material = new MeshBasicMaterial({ color: '#565656', side: 2 })
		const ray = new Mesh(geometry, material)
		ray.rotateX(Math.PI / 3)

		const geometry2 = new RingGeometry(0.9, 1.3, 30)
		const material2 = new MeshBasicMaterial({ color: '#565656', side: 2 })
		const ray2 = new Mesh(geometry2, material2)
		ray2.rotateX(Math.PI / 3)

		this.add(ray)
		this.add(ray2)
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