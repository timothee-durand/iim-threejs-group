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
import venusTexture from '../assets/textures/venus.jpg'
import {distanceToSunFactor} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'

export class Venus extends BasePlanet {

	constructor(scene: Scene) {
		super()
		this.radius = 0.45
		this.distanceToSun = 3.4
		this.speed = 1.26
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
		const texture = new TextureLoader().load(venusTexture)
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
		const venusInfos =
			{
				'name': 'Venus',
				'radius': 6051, // kilometers
				'distance': 108.2e6, // kilometers (average distance from the Sun)
				'speed': 35.0, // kilometers per second (orbital speed around the Sun)
				'mass': 4.867e24, // kilograms
				'temperature': 464, // degrees Celsius (average surface temperature)
				'description': 'Venus is the second planet from the Sun and the hottest planet in our solar system. It has a radius of approximately 6,051 kilometers and an average distance from the Sun of about 108.2 million kilometers. Venus orbits the Sun at a speed of around 35.0 kilometers per second. It has a mass of approximately 4.867 × 10^24 kilograms. The average surface temperature on Venus is around 464 degrees Celsius, making it the hottest planet due to its thick atmosphere and greenhouse effect.'
			}
		this.panel = new AnimatedPlanetPanel({
			infos: venusInfos, distanceFromPlanet: 3,  sizes: {width:3.4, height : 2.8, padding: 0.2}
		})
		this.add(this.panel)

	}
}