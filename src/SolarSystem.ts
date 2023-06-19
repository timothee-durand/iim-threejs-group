import {
	AmbientLight,
	PerspectiveCamera, Raycaster,
	Scene, Vector2,
	WebGLRenderer
} from 'three'
import {AnimatedElement, isHoverableElement} from './utils/types'
import {Sun} from './parts/Sun'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export class SolarSystem {
	private scene: Scene
	private renderer: WebGLRenderer
	private camera: PerspectiveCamera
	private animatedChildren: AnimatedElement[] = []
	private controls: OrbitControls
	private ambientLight: AmbientLight
	private mouse = new Vector2()
	private raycaster = new Raycaster()

	constructor(canvas: HTMLCanvasElement) {
		this.initScene(canvas)
		this.addCamera()
		this.addOrbit()
		this.addSun()
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
		const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.scene.add(camera)
		camera.position.z = 5
		this.camera = camera
	}

	private addSun() {
		const sun = new Sun()
		this.scene.add(sun)
		this.animatedChildren.push(sun)
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
		this.renderer.render(this.scene, this.camera)
		this.animatedChildren.forEach(child => child.animate())
		this.controls.update()
		this.checkInteractions()
		window.requestAnimationFrame(() => this.render())
	}
}
