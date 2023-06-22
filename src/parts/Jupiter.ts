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
import jupiterTexture from '../assets/textures/jupiter.jpg'
import {distanceToSunFactor, orbitRadius} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Jupiter extends BasePlanet {

	constructor(scene: Scene) {
		super()
		this.radius = 1
		this.distanceToSun = 8.5
		this.speed = 0.47
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		this.addOrbit(scene)
		this.addPanel()
	}

	addOrbit(scene: Scene) {
		const orbitGroup = new Group() // Create a new group for the orbit
		const geometry = new TorusGeometry(this.distanceToSun * distanceToSunFactor, orbitRadius, 2, 100)
		const material = new MeshBasicMaterial({ color: '#FFF', side: 2 })
		const orbit = new Mesh(geometry, material)
		orbit.rotation.x = Math.PI / 2
		orbitGroup.add(orbit) // Add the orbit to the orbit group

		scene.add(orbitGroup) // Add the orbit group to the parent group (assuming the parent group is used for the solar system scene)
	}

	async addMaterial() {
		const texture = new TextureLoader().load(jupiterTexture)
		this.material = new MeshStandardMaterial({ roughness: 1, map: texture })
	}

	addPosition() {
		this.translateX(this.distanceToSun * distanceToSunFactor)
	}

	addBody() {
		const geometry = new SphereGeometry(this.radius, 20, 20)
		const body = new Mesh(geometry, this.material)
		this.planet = body
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

	addPanel() {
		const jupiterInfos = {
			'name': 'Jupiter',
			'radius': 69911, // kilometers
			'distance': 778.3e6, // kilometers (average distance from the Sun)
			'speed': 13.1, // kilometers per second (orbital speed around the Sun)
			'mass': 1.898e27, // kilograms
			'temperature': -108, // degrees Celsius (average cloud-top temperature)
			'description': 'Jupiter is the fifth planet from the Sun and the largest planet in our solar system. It has a radius of approximately 69,911 kilometers and an average distance from the Sun of about 778.3 million kilometers. Jupiter orbits the Sun at a speed of around 13.1 kilometers per second. It has a mass of approximately 1.898 × 10^27 kilograms. The average cloud-top temperature on Jupiter is around -108 degrees Celsius.'
		}
		this.panel = new AnimatedPlanetPanel({
			infos: jupiterInfos, distanceFromPlanet: 3,  sizes: {width: 2.5, height : 4, padding: 0.2}
		})
		this.add(this.panel)

	}
}