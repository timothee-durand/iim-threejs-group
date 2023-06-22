import {
	CylinderGeometry, DodecahedronGeometry,
	Group,
	Mesh, MeshBasicMaterial,
	MeshStandardMaterial,
	PointLight, RingGeometry, Scene,
	SphereGeometry, TextureLoader, TorusGeometry
} from 'three'
import {AnimatedElement, ClickableElement} from '../utils/types'
import { BasePlanet } from './BasePlanet'
import saturnTexture from '../assets/textures/saturn.jpg'
import {distanceToSunFactor, orbitRadius} from '../utils/config'
import {AnimatedPlanetPanel} from './AnimatedPanel'


export class Saturne extends BasePlanet {
	private asteroidBelt!: Group
	constructor(scene: Scene) {
		super()
		this.radius = 0.5
		this.distanceToSun = 11.5
		this.speed = 0.32
		this.addMaterial()
		this.addBody()
		this.addLight()
		this.addPosition()
		//this.generateDisk()
		this.generateAsteroidBelt()
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
		const texture = new TextureLoader().load(saturnTexture)
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

	generateAsteroidBelt() {
		const numberOfAsteroids = 1000
		const asteroidBelt = new Group()
		const minDistanceFromPlanet = 5 // Distance minimale par rapport à la planète
		const maxDistanceFromPlanet = 10 // Distance maximale par rapport à la planète
		const maxDistanceXZ = 15
		for (let i = 0; i < numberOfAsteroids; i++) {
			const geometry = new DodecahedronGeometry(Math.random()*0.2, 0)
			const material = new MeshStandardMaterial({ color: '#777777' })
			const asteroid = new Mesh(geometry, material)
			const distanceFromPlanet = Math.random() * (maxDistanceFromPlanet - minDistanceFromPlanet) + minDistanceFromPlanet
			const randomX = (Math.random() > 0.5 ? -1 : 1) * Math.random() * maxDistanceXZ
			const randomZ = (Math.random() > 0.5 ? -1 : 1) * Math.random() * maxDistanceXZ

			const asteroidX = randomX * distanceFromPlanet
			const asteroidY = Math.random() / 10 - 0.05
			const asteroidZ = randomZ * distanceFromPlanet
			asteroid.position.set(asteroidX, asteroidY, asteroidZ)
			asteroid.position.normalize()
			asteroid.position.multiplyScalar(0.9 + Math.random() * 0.1)
			asteroid.lookAt(0, 0, 0)
			asteroid.scale.set(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2)
			asteroidBelt.add(asteroid)
		}
		asteroidBelt.rotateX(Math.PI / 3)
		this.asteroidBelt = asteroidBelt
		this.add(asteroidBelt)
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
		const saturneInfos = {
			'name': 'Saturn',
			'radius': 58232, // kilometers
			'distance': 1.429e9, // kilometers (average distance from the Sun)
			'speed': 9.7, // kilometers per second (orbital speed around the Sun)
			'mass': 5.683e26, // kilograms
			'temperature': -139, // degrees Celsius (average cloud-top temperature)
			'description': 'Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. It has a radius of approximately 58,232 kilometers and an average distance from the Sun of about 1.429 billion kilometers. Saturn orbits the Sun at a speed of around 9.7 kilometers per second. It has a mass of approximately 5.683 × 10^26 kilograms. The average cloud-top temperature on Saturn is around -139 degrees Celsius.'
		}
		this.panel = new AnimatedPlanetPanel({
			infos: saturneInfos, distanceFromPlanet: 3,  sizes: {width:2.5, height : 3, padding: 0.2}
		})
		this.add(this.panel)

	}

	animate(elapsedTime: number) {
		super.animate(elapsedTime)
		this.asteroidBelt.rotateY(0.005)
		this.asteroidBelt.rotateX(0.005)
	}
}