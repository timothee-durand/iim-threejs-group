import {
	AmbientLight, Clock, Group,
	PerspectiveCamera, Raycaster,
	Scene, Vector2,
	WebGLRenderer
} from 'three'
import {AnimatedElement, isAnimatedElement, isClickable, isHoverable} from './utils/types'
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
import {cameraOffset, cameraRotation, fonts, initialCameraPosition} from './utils/config'
import edgeOfTheGalaxyFont from './assets/fonts/edge-of-galaxy-poster.otf'
import jostRegularFont from './assets/fonts/jost-regular.ttf'
import jostBoldFont from './assets/fonts/jost-bold.ttf'
import {gsap} from 'gsap'
import {Stars} from './parts/Stars'
import {hidePlayButton, showPlayButton} from './utils/html'

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
	private selectedButton: ButtonPlanet | null = null
	private oldElapsedTime = 0
	private returnButton!:HTMLButtonElement
	private previousIntersectObject: Set<string> = new Set()
	private isPaused = false

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
		this.addStars()
		this.addPlanets()

		this.clock.start()
		this.addReturnButton()

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

		this.buttonGroup.position.copy(initialCameraPosition)
		this.buttonGroup.rotation.x = cameraRotation.x
	}

	private addSun() {
		const sun = new Sun()
		this.scene.add(sun)
	}

	private addStars() {
		const stars = new Stars()
		this.scene.add(stars)
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
		const cameraViewHeight = this.camera.getFilmHeight()
		const buttonWidth = 0.1 // Adjust the width of each button as desired
		const buttonDistance = 4 // Adjust the distance of the buttons from the camera

		const totalButtons = buttonGroup.length - 1
		const xOffset = -((totalButtons * buttonWidth) / 2)

		for (let i = 1; i < buttonGroup.length; i++) {
			const buttonPlanet = buttonGroup[i] as ButtonPlanet // Type assertion
			buttonPlanet.position.x = xOffset + ((i-0.5) * buttonWidth)
			buttonPlanet.position.y = -0.3
			buttonPlanet.position.z = buttonDistance
			console.log(buttonPlanet.position)
		}
	}
	private addLight() {
		const ambientLight = new AmbientLight(0xffffff, 0.5)
		this.scene.add(ambientLight)
	}

	private initAnimatedChildren() {
		this.scene.traverse((child) => {
			if (isAnimatedElement(child)) {
				this.animatedChildren.push(child)
			}
		})
	}

	private togglePlanetRotation() {
		this.isPaused = !this.isPaused
		if(this.isPaused) {
			showPlayButton()
		} else {
			hidePlayButton()
		}
	}

	private addListeners() {
		const playButton = document.getElementById('pause')!
		playButton.addEventListener('click', () => this.togglePlanetRotation())

		window.addEventListener('resize', () => this.onResize())
		window.addEventListener('mousemove', (event) => this.onMouseMove(event))

		window.addEventListener('beforeunload', () => {
			window.removeEventListener('resize', () => this.onResize())
			window.removeEventListener('mousemove', (event) => this.onMouseMove(event))
		})

		window.addEventListener('click', () => this.raycastOnClick())
	}

	private onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	private onMouseMove(event: MouseEvent) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

		if(!this.isTransitionning) {
			this.raycastOnHover()
			gsap.to(this.buttonGroup.rotation, {
				x:  cameraRotation.x - this.mouse.y * 0.1,
				y:  cameraRotation.y - this.mouse.x * 0.1,
				duration: 2,
				ease: 'power2.out'
			})
		}
	}

	private raycastOnClick() {
		this.raycaster.setFromCamera(this.mouse, this.camera)
		const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true)
		intersectedObjects.forEach(intersectedObject => {
			const object = intersectedObject.object
			object.traverseAncestors((object) => {
				if (isClickable(object)) {
					object.onClick(this.buttonGroup)

					if(object instanceof ButtonPlanet){
						if(this.selectedButton !== null) {
							this.selectedButton.unselect()
						}
						this.selectedButton = object
					}
				}
			})
		})
	}

	private raycastOnHover() {
		this.raycaster.setFromCamera(this.mouse, this.camera)
		const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true)
		const hoverableIntersectedObjects: Set<string> = new Set()
		intersectedObjects.forEach(intersectedObject => {
			const object = intersectedObject.object
			object.traverseAncestors((object) => {
				//console.log(object)
				if(isHoverable(object)) {
					hoverableIntersectedObjects.add(object.uuid)
					if(!this.previousIntersectObject.has(object.uuid)) {
						object.onMouseEnter()
					}
					this.previousIntersectObject.add(object.uuid)
				}
			})
		})
		this.previousIntersectObject.forEach(uuid => {
			if(!hoverableIntersectedObjects.has(uuid)) {
				const object = this.scene.getObjectByProperty('uuid', uuid)
				if(object && isHoverable(object)) {
					object.onMouseLeave()
					this.previousIntersectObject.delete(uuid)
				}
			}
		})
	}

	private async loadFonts() {
		await addFont(fonts.titleFont, edgeOfTheGalaxyFont)
		await addFont(fonts.descriptionFont, jostRegularFont)
		await addFont(fonts.boldFont, jostBoldFont)
	}

	private stickToSelectedPlanet() {
		if(this.selectedButton !== null && !this.selectedButton.isTransitionning){
			this.returnButton.classList.remove('hide')
			this.buttonGroup.position.copy(this.selectedButton.planet.position).add(cameraOffset)
		}
	}

	private get isTransitionning() {
		return this.selectedButton && this.selectedButton.isTransitionning
	}
    
	private render() {
		if((this.isTransitionning || this.isPaused) && this.clock.running) {
			this.clock.stop()
			this.clock.elapsedTime = this.oldElapsedTime
		}
		if(!this.isTransitionning && !this.isPaused && !this.clock.running) {
			this.clock.start()
			this.clock.elapsedTime = this.oldElapsedTime
		}
		const elapsedTime = this.clock.getElapsedTime()
		this.renderer.render(this.scene, this.camera)
		this.animatedChildren.forEach(child => child.animate(elapsedTime))
		this.stickToSelectedPlanet()
		window.requestAnimationFrame(() => this.render())
		this.oldElapsedTime = elapsedTime
	}

	private addReturnButton() {
		const button = document.createElement('button')
		button.type = 'button'
		button.classList.add('return-button')
		button.innerHTML = 'Return'
		button.addEventListener('click', () => {
			gsap.to(this.buttonGroup.position, {
				x : initialCameraPosition.x,
				y: initialCameraPosition.y,
				z: initialCameraPosition.z,
				duration : 0.5,
				ease : 'power2.out'
			})
			this.selectedButton?.unselect()
			this.selectedButton = null
			this.returnButton.classList.add('hide')
		})
		document.body.appendChild(button)
		this.returnButton = button
		this.returnButton.classList.add('hide')
	}
}