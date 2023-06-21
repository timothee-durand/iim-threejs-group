import {
	Group,
	Mesh, MeshBasicMaterial,
	MeshStandardMaterial,
	PointLight, RingGeometry, Scene,
	SphereGeometry, TextureLoader, TorusGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import mercuryTexture from '../assets/textures/mercure.jpg'
import {distanceToSunFactor} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Mercury extends BasePlanet {
	public panel!: AnimatedPlanetPanel
	constructor(scene: Scene) {
		super()
		this.radius = 0.35
		this.distanceToSun = 2
		this.speed = 1.7
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
		const texture = new TextureLoader().load(mercuryTexture)
		this.material = new MeshStandardMaterial({ roughness: 1, map: texture })	}

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
		const mercuryInfos =

			{
				'name': 'Mercury',
				'radius': 2439, // kilometers
				'distance': 57.9e6, // kilometers (average distance from the Sun)
				'speed': 47.9, // kilometers per second (orbital speed around the Sun)
				'mass': 3.3011e23, // kilograms
				'temperature': 167, // degrees Celsius (average surface temperature)
				'description': 'Mercury is the smallest and innermost planet in our solar system. It has a radius of approximately 2,439 kilometers and an average distance from the Sun of about 57.9 million kilometers. Mercury orbits the Sun at a speed of around 47.9 kilometers per second. It has a mass of approximately 3.3011 × 10^23 kilograms. The average surface temperature on Mercury is around 167 degrees Celsius.'
			}
		this.panel = new AnimatedPlanetPanel({
			infos: mercuryInfos, distanceFromPlanet: 3,  sizes: {width:3.5, height : 2.5, padding: 0.2}
		})
		this.add(this.panel)

	}
}