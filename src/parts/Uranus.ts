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
import uranusTexture from '../assets/textures/uranus.jpg'
import {distanceToSunFactor} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Uranus extends BasePlanet {
	private panel!: AnimatedPlanetPanel
	constructor(scene: Scene) {
		super()
		this.radius = 0.7
		this.distanceToSun = 14
		this.speed = 0.22
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		this.addOrbit(scene)
		this.addPanel()
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
		const texture = new TextureLoader().load(uranusTexture)
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
		const uranusInfos =
			{
				'name': 'Uranus',
				'radius': 25362, // kilometers
				'distance': 2.871e9, // kilometers (average distance from the Sun)
				'speed': 6.8, // kilometers per second (orbital speed around the Sun)
				'mass': 8.681e25, // kilograms
				'temperature': -197, // degrees Celsius (average surface temperature)
				'description': 'Uranus is the seventh planet from the Sun and the third-largest planet in our solar system. It has a radius of approximately 25,362 kilometers and an average distance from the Sun of about 2.871 billion kilometers. Uranus orbits the Sun at a speed of around 6.8 kilometers per second. It has a mass of approximately 8.681 × 10^25 kilograms. The average surface temperature on Uranus is around -197 degrees Celsius.'
			}
		this.panel = new AnimatedPlanetPanel({
			infos: uranusInfos, distanceFromPlanet: 3,  sizes: {width:2.5, height : 3, padding: 0.2}
		})
		this.add(this.panel)

	}
}