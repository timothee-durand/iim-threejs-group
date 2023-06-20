import {
	AmbientLight, Clock, Fog,
	PerspectiveCamera, Raycaster,
	Scene, Vector2,
	WebGLRenderer
} from 'three'
import {AnimatedElement, isHoverableElement} from './utils/types'
import {Sun} from './parts/Sun'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { Earth } from './parts/Earth'
import { Mercury } from './parts/Mercury'
import { Venus } from './parts/Venus'
import { Mars } from './parts/Mars'
import { Jupiter } from './parts/Jupiter'
import { Saturne } from './parts/Saturne'
import { Uranus } from './parts/Uranus'
import { Neptune } from './parts/Neptune'

export class SolarSystem {
	private scene!: Scene
	private renderer!: WebGLRenderer
	private camera!: PerspectiveCamera
	private animatedChildren: AnimatedElement[] = []
	private controls!: OrbitControls
	private ambientLight!: AmbientLight
	private mouse = new Vector2()
	private raycaster = new Raycaster()
	private clock = new Clock()

	constructor(canvas: HTMLCanvasElement) {
		this.initScene(canvas)
		this.addCamera()
		this.addOrbit()
		this.addSun()
		this.addPlanets()

		this.clock.start()

		this.addLight()
		this.render()
		this.addListeners()

	}

	private initScene(canvas: HTMLCanvasElement) {
		this.scene = new Scene()
		this.renderer = new WebGLRenderer({
			antialias: true,
			canvas : canvas
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	private addCamera() {
		const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.scene.add(camera)
		camera.position.z = 5
		this.camera = camera
	}

	private addSun() {
		const sun = new Sun()
		this.scene.add(sun)
		this.animatedChildren.push(sun)
	}

	private addPlanets() {
		const mercury = new Mercury(this.scene)
		const earth = new Earth(this.scene)
		const venus = new Venus(this.scene)
		const mars = new Mars(this.scene)
		const jupiter = new Jupiter(this.scene)
		const saturne = new Saturne(this.scene)
		const uranus = new Uranus(this.scene)
		const neptune = new Neptune(this.scene)

		this.scene.add(venus)
		this.scene.add(mercury)
		this.scene.add(earth)
		this.scene.add(mars)
		this.scene.add(jupiter)
		this.scene.add(saturne)
		this.scene.add(uranus)
		this.scene.add(neptune)

		this.animatedChildren.push(venus)
		this.animatedChildren.push(earth)
		this.animatedChildren.push(mercury)
		this.animatedChildren.push(mars)
		this.animatedChildren.push(jupiter)
		this.animatedChildren.push(saturne)
		this.animatedChildren.push(uranus)
		this.animatedChildren.push(neptune)
		this.animatedChildren.push(earth)
	}

	private addLight() {
		this.ambientLight = new AmbientLight(0xffffff, 0.5)
		this.scene.add(this.ambientLight)
	}

	private addOrbit() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
	}

	private addListeners() {
		window.addEventListener('resize', () => this.onResize())
		window.addEventListener('mousemove', (event) => this.onMouseMove(event))

		window.addEventListener('beforeunload', () => {
			window.removeEventListener('resize', () => this.onResize())
			window.removeEventListener('mousemove', (event) => this.onMouseMove(event))
		})
	}

	private onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	private onMouseMove(event: MouseEvent) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	}

	private checkInteractions() {
		this.raycaster.setFromCamera(this.mouse, this.camera)
		const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true)
		intersectedObjects.forEach(intersectedObject => {
			const object = intersectedObject.object
			object.traverseAncestors((object) => {
				if (isHoverableElement(object)) {
					object.hover()
					return
				}
			})
		})
	}
    
	render() {
		const elapsedTime = this.clock.getElapsedTime()
		this.renderer.render(this.scene, this.camera)
		this.animatedChildren.forEach(child => child.animate(elapsedTime))
		this.controls.update()
		this.checkInteractions()
		window.requestAnimationFrame(() => this.render())
	}
}
