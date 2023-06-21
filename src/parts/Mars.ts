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
import marsTexture from '../assets/textures/mars.jpg'
import {distanceToSunFactor} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Mars extends BasePlanet {
	public panel!: AnimatedPlanetPanel
	constructor(scene: Scene) {
		super()
		this.radius = 0.37
		this.distanceToSun = 6.4
		this.speed = 0.86
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		this.addOrbit(scene)
		this.addPanel()
	}

	addOrbit(scene: Scene) {
		const orbitGroup = new Group() // Create a new group for the orbit

		const geometry = new RingGeometry(this.distanceToSun* distanceToSunFactor  - 0.05, this.distanceToSun* distanceToSunFactor  + 0.05, 60)
		const material = new MeshBasicMaterial({ color: '#FFF', side: 2 })
		const orbit = new Mesh(geometry, material)
		orbit.rotation.x = Math.PI / 2
		orbitGroup.add(orbit) // Add the orbit to the orbit group

		scene.add(orbitGroup) // Add the orbit group to the parent group (assuming the parent group is used for the solar system scene)
	}

	async addMaterial() {
		const texture = new TextureLoader().load(marsTexture)
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

	addPanel() {
		const marsInfos =
			{
				'name': 'Mars',
				'radius': 3389, // kilometers
				'distance': 227.9e6, // kilometers (average distance from the Sun)
				'speed': 24.1, // kilometers per second (orbital speed around the Sun)
				'mass': 6.39e23, // kilograms
				'temperature': -63, // degrees Celsius (average surface temperature)
				'description': 'Mars is the fourth planet from the Sun and the second-smallest planet in our solar system. It has a radius of approximately 3,389 kilometers and an average distance from the Sun of about 227.9 million kilometers. Mars orbits the Sun at a speed of around 24.1 kilometers per second. It has a mass of approximately 6.39 × 10^23 kilograms. The average surface temperature on Mars is around -63 degrees Celsius.'
			}
		this.panel = new AnimatedPlanetPanel({
			infos: marsInfos, distanceFromPlanet: 3,  sizes: {width:3.5, height : 2.5, padding: 0.2}
		})
		this.add(this.panel)

	}

}