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
import neptuneTexture from '../assets/textures/neptune.jpg'
import {distanceToSunFactor, orbitRadius} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'
export class Neptune extends BasePlanet  {

	constructor(scene: Scene) {
		super()
		this.radius = 0.7
		this.distanceToSun = 16
		this.speed = 0.18
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
		const texture = new TextureLoader().load(neptuneTexture)
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
		const neptuneInfos =
			{
				'name': 'Neptune',
				'radius': 24622, // kilometers
				'distance': 4.498e9, // kilometers (average distance from the Sun)
				'speed': 5.4, // kilometers per second (orbital speed around the Sun)
				'mass': 1.024e26, // kilograms
				'temperature': -201, // degrees Celsius (average surface temperature)
				'description': 'Neptune is the eighth and farthest known planet from the Sun in our solar system. It has a radius of approximately 24,622 kilometers and an average distance from the Sun of about 4.498 billion kilometers. Neptune orbits the Sun at a speed of around 5.4 kilometers per second. It has a mass of approximately 1.024 × 10^26 kilograms. The average surface temperature on Neptune is around -201 degrees Celsius.'
			}
		this.panel = new AnimatedPlanetPanel({
			infos: neptuneInfos, distanceFromPlanet: 3,  sizes: {width:2, height : 3.5, padding: 0.2}
		})
		this.add(this.panel)

	}
}