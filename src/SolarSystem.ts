import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {dimensions} from './config'
import {AnimatedElement} from './types'

export class SolarSystem {
	private scene: Scene
	private renderer: WebGLRenderer
	private camera: PerspectiveCamera
	private animatedChildren: AnimatedElement[] = []

	constructor(canvas: HTMLCanvasElement) {
		this.initScene(canvas)
		this.addCamera()

		const cube = new TestCube()
		this.scene.add(cube)
		this.animatedChildren.push(cube)

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
    
	render() {
		this.renderer.render(this.scene, this.camera)
		this.animatedChildren.forEach(child => child.animate())
		window.requestAnimationFrame(() => this.render())
	}
}

class TestCube extends Mesh implements AnimatedElement {
	constructor() {
		super()
		this.geometry = new BoxGeometry(1, 1, 1)
		this.material = new MeshBasicMaterial({color: 0x00ff00})
	}
	animate() {
		this.rotation.x += 0.01
		this.rotation.y += 0.01
	}
}