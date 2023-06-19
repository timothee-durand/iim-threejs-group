import {
	AmbientLight,
	PerspectiveCamera,
	PointLight,
	Scene,
	WebGLRenderer
} from 'three'
import {dimensions} from './utils/config'
import {AnimatedElement} from './utils/types'
import {Sun} from './parts/Sun'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export class SolarSystem {
	private scene: Scene
	private renderer: WebGLRenderer
	private camera: PerspectiveCamera
	private animatedChildren: AnimatedElement[] = []
	private controls: OrbitControls
	private ambientLight: AmbientLight

	constructor(canvas: HTMLCanvasElement) {
		this.initScene(canvas)
		this.addCamera()
		this.addOrbit()
		this.addSun()
		this.addLight()
		this.render()
	}

	private initScene(canvas: HTMLCanvasElement) {
		this.scene = new Scene()
		this.renderer = new WebGLRenderer({
			antialias: true,
			canvas : canvas
		})
		this.renderer.setSize(dimensions.width, dimensions.height)
	}

	private addCamera() {
		const camera = new PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000)
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
    
	render() {
		this.renderer.render(this.scene, this.camera)
		this.animatedChildren.forEach(child => child.animate())
		this.controls.update()
		window.requestAnimationFrame(() => this.render())
	}
}
