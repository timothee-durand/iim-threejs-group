import {
	Group,
	Mesh, MeshBasicMaterial,
	MeshStandardMaterial,
	PointLight, RingGeometry, Scene,
	SphereGeometry, TextureLoader, TorusGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import earthTexture from '../assets/textures/earth.jpg'
import {distanceToSunFactor} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Earth extends BasePlanet {
	public panel!: AnimatedPlanetPanel

	constructor(scene: Scene) {
		super()
		this.radius = 0.5
		this.distanceToSun = 5
		this.speed = 1.04
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		this.addPanel()
		this.addOrbit(scene)
	}

	async addMaterial() {
		const texture = new TextureLoader().load(earthTexture)
		this.material = new MeshStandardMaterial({roughness: 1, map: texture})
	}

	addOrbit(scene: Scene) {
		const orbitGroup = new Group() // Create a new group for the orbit

		const geometry = new RingGeometry(this.distanceToSun * distanceToSunFactor - 0.05, this.distanceToSun * distanceToSunFactor  + 0.05, 60)
		const material = new MeshBasicMaterial({ color: '#FFF', side: 2 })
		const orbit = new Mesh(geometry, material)

		orbit.rotation.x = Math.PI / 2
		orbitGroup.add(orbit) // Add the orbit to the orbit group

		scene.add(orbitGroup) // Add the orbit group to the parent group (assuming the parent group is used for the solar system scene)
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
		const earthInfos = {
			'name': 'Earth',
			'radius': 6371, // kilometers
			'distance': 149.6e6, // kilometers (average distance from the Sun)
			'speed': 29.8, // kilometers per second (orbital speed around the Sun)
			'mass': 5.97e24, // kilograms
			'temperature': 15, // degrees Celsius (average surface temperature)
			'description': 'Earth is the third planet from the Sun and the only known celestial body to support life. It has a radius of approximately 6371 kilometers and an average distance from the Sun of about 149.6 million kilometers. Earth orbits the Sun at a speed of around 29.8 kilometers per second. It has a mass of approximately 5.97 × 10^24 kilograms. The average surface temperature on Earth is around 15 degrees Celsius.'
		}
		this.panel = new AnimatedPlanetPanel({
			infos: earthInfos, distanceFromPlanet: 3,  sizes: {width: 3, height : 3, padding: 0.2}
		})
		this.add(this.panel)

	}
}