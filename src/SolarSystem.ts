import {
	AmbientLight, Clock, Group,
	PerspectiveCamera, Raycaster,
	Scene, Vector2, Vector3,
	WebGLRenderer
} from 'three'
import {AnimatedElement, isAnimatedElement, isHoverableElement} from './utils/types'
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
import { BasePlanet } from './parts/BasePlanet'
import { ButtonPlanet } from './parts/ButtonPlanet'
import earthTexture from './assets/textures/earth.jpg'
import mercuryTexture from './assets/textures/mercure.jpg'
import venusTexture from './assets/textures/venus.jpg'
import marsTexture from './assets/textures/mars.jpg'
import jupiterTexture from './assets/textures/jupiter.jpg'
import saturneTexture from './assets/textures/saturn.jpg'
import uranusTexture from './assets/textures/uranus.jpg'
import neptuneTexture from './assets/textures/neptune.jpg'
import {addFont} from './utils/loaders'
import {fonts} from './utils/config'
import edgeOfTheGalaxyFont from './assets/fonts/edge-of-galaxy-poster.otf'
import jostRegularFont from './assets/fonts/jost-regular.ttf'
import jostBoldFont from './assets/fonts/jost-bold.ttf'

export class SolarSystem {
	private static instance: SolarSystem | null= null
	private scene!: Scene
	private renderer!: WebGLRenderer
	private camera!: PerspectiveCamera
	private buttonGroup !: Group
	private animatedChildren: AnimatedElement[] = []
	private controls!: OrbitControls
	private mouse = new Vector2()
	private raycaster = new Raycaster()
	private clock = new Clock()

	constructor(canvas: HTMLCanvasElement) {

		this.initRenderer(canvas)

		this.buttonGroup = new Group()
		this.scene.add(this.buttonGroup)

		this.addCamera()
		//this.addOrbit()
		this.init()
	}
	private async init() {
		await this.loadFonts()
		this.addSun()
		this.addPlanets()

		this.clock.start()

		this.addLight()
		this.initAnimatedChildren()
		this.render()
		this.addListeners()
	}

	private initRenderer(canvas: HTMLCanvasElement) {
		this.scene = new Scene()
		this.renderer = new WebGLRenderer({
			antialias: true,
			canvas : canvas
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}
    
	private addCamera() {
		const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.buttonGroup.add(camera)
		camera.position.z = 5
		camera.position.y = 0
		this.camera = camera

		this.buttonGroup.position.z = 125
		this.buttonGroup.position.y = 9
	}

	private addSun() {
		const sun = new Sun()
		this.scene.add(sun)
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

		this.buttonGroup.add(new ButtonPlanet(earthTexture, earth))
		this.buttonGroup.add(new ButtonPlanet(mercuryTexture, mercury))
		this.buttonGroup.add(new ButtonPlanet(venusTexture, venus))
		this.buttonGroup.add(new ButtonPlanet(marsTexture, mars))
		this.buttonGroup.add(new ButtonPlanet(jupiterTexture, jupiter))
		this.buttonGroup.add(new ButtonPlanet(saturneTexture, saturne))
		this.buttonGroup.add(new ButtonPlanet(uranusTexture, uranus))
		this.buttonGroup.add(new ButtonPlanet(neptuneTexture, neptune))

		this.positionButtonInGroup()

		this.scene.add(venus)
		this.scene.add(mercury)
		this.scene.add(earth)
		this.scene.add(mars)
		this.scene.add(jupiter)
		this.scene.add(saturne)
		this.scene.add(uranus)
		this.scene.add(neptune)

	}


	private positionButtonInGroup(){
		console.log(this.camera.position)
		const buttonGroup = this.buttonGroup.children
		const cameraAspect = this.camera.aspect
		const cameraViewHeight = this.camera.getFilmHeight()
		const buttonWidth = 0.1 // Adjust the width of each button as desired
		const buttonDistance = 4 // Adjust the distance of the buttons from the camera

		const totalButtons = buttonGroup.length - 1
		const xOffset = -((totalButtons * buttonWidth) / 2)

		for (let i = 1; i < buttonGroup.length; i++) {
			const buttonPlanet = buttonGroup[i] as ButtonPlanet // Type assertion
			buttonPlanet.position.x = xOffset + ((i-0.5) * buttonWidth)
			buttonPlanet.position.y = -(cameraViewHeight / 2)  +10.3
			buttonPlanet.position.z = buttonDistance
			console.log(buttonPlanet.position)
		}
	}
	private addLight() {
		const ambientLight = new AmbientLight(0xffffff, 0.5)
		this.scene.add(ambientLight)
	}

	private addOrbit() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
	}

	private initAnimatedChildren() {
		this.scene.traverse((child) => {
			if (isAnimatedElement(child)) {
				this.animatedChildren.push(child)
			}
		})
	}

	private addListeners() {
		window.addEventListener('resize', () => this.onResize())
		window.addEventListener('mousemove', (event) => this.onMouseMove(event))

		window.addEventListener('beforeunload', () => {
			window.removeEventListener('resize', () => this.onResize())
			window.removeEventListener('mousemove', (event) => this.onMouseMove(event))
		})

		window.addEventListener('click', () => this.checkInteractions())
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
					object.onClick(this.buttonGroup)
					return
				}
			})
		})
	}

	private async loadFonts() {
		await addFont(fonts.titleFont, edgeOfTheGalaxyFont)
		await addFont(fonts.descriptionFont, jostRegularFont)
		await addFont(fonts.boldFont, jostBoldFont)
	}
    
	private render() {
		const elapsedTime = 0 // this.clock.getElapsedTime()
		this.renderer.render(this.scene, this.camera)
		this.animatedChildren.forEach(child => child.animate(elapsedTime))
		//this.controls.update()
		window.requestAnimationFrame(() => this.render())
	}
}