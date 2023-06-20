import {
	CapsuleGeometry,
	DoubleSide,
	Group,
	LinearFilter,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Texture
} from 'three'
import {addFont} from '../utils/loaders'
import edgeOfTheGalaxyFont from '../assets/fonts/edge-of-galaxy-poster.otf'
import jostRegularFont from '../assets/fonts/jost-regular.ttf'
import jostBoldFont from '../assets/fonts/jost-bold.ttf'
import {addText, createHiPPICanvas, getCanvaSizeWithRatio} from '../utils/canvas'
import {gsap} from 'gsap'

interface PlanetInfos {
    name: string
    radius: number
    distance: number
    speed: number
    mass: number
    temperature: number
    description: string
}

interface AnimatedPanelSizes {
    width: number
    height: number
    padding: number
}

export class AnimatedPlanetPanel extends Group {
	private infos: PlanetInfos
	private material!: MeshBasicMaterial
	private sizes: AnimatedPanelSizes
	private readonly distanceFromPlanet: number
	private planetLink!: Mesh
	private panelBorderTop!: Mesh
	private panel!: Mesh
	private canvas!: HTMLCanvasElement
	private canvaHeight!: number
	private panelTexture!: Texture

	constructor(infos: PlanetInfos, distanceFromPlanet: number, sizes: AnimatedPanelSizes = {
		width: 2.3,
		height: 4,
		padding: 0.2
	}) {
		super()
		this.sizes = sizes
		this.infos = infos
		this.distanceFromPlanet = distanceFromPlanet
		this.init()
	}

	private async init() {
		await this.createTexture()
		this.addPanel()
		this.addBorder()

		this.translateX(this.distanceFromPlanet)
		this.lauchAnimation()
	}

	private addPanel() {
		const panelGeometry = new PlaneGeometry(this.sizes.width, this.sizes.height)
		panelGeometry.translate(0, -this.sizes.height / 2, 0)
		const panel = new Mesh(
			panelGeometry,
			this.material
		)
		panel.scale.y = 0
		panel.translateY(this.sizes.height / 2)
		this.add(panel)
		this.panel = panel
	}

	private addBorder() {
		const borderRadius = 0.02
		const borderMaterial = new MeshBasicMaterial({color: '#a0fff1', side: DoubleSide})
		const borderTopX = this.sizes.height / 2 + 0.2
		const borderTopWidth = this.sizes.width + this.sizes.padding * 2
		const capsuleGeometry = new CapsuleGeometry(borderRadius, borderTopWidth, 15)
		capsuleGeometry.translate(0, -borderTopWidth / 2, 0)
		const borderTop = new Mesh(
			capsuleGeometry,
			borderMaterial
		)
		borderTop.scale.y = 0
		borderTop.translateY(borderTopX)
		borderTop.rotateZ(Math.PI / 2)
		borderTop.translateY(borderTopWidth / 2)
		this.add(borderTop)
		this.panelBorderTop = borderTop


		const d1 = this.distanceFromPlanet / 2
		const d2 = this.sizes.height / 2

		const linkHeight = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2))
		const realLinkHeight = linkHeight * 0.7
		const planetLinkGroup = new Group()
		const planetLinkGeometry = new CapsuleGeometry(borderRadius, realLinkHeight, 15)
		planetLinkGeometry.translate(0, -realLinkHeight / 2, 0)
		const planetLink = new Mesh(
			planetLinkGeometry,
			borderMaterial
		)
		planetLink.scale.y = 0
		const linkAngle = Math.atan(d1 / d2)
		planetLinkGroup.add(planetLink)
		planetLinkGroup.translateY(borderTopX)
		planetLinkGroup.translateX(-borderTopWidth / 2)
		// planetLinkGroup.position.set(-borderTopWidth, borderTopX, 0)
		planetLinkGroup.rotateZ(Math.PI / 2 + linkAngle)
		planetLink.translateY(realLinkHeight)
		this.add(planetLinkGroup)
		this.planetLink = planetLink
	}

	private async createTexture() {
		const titleFont = 'edge-galaxy'
		const descriptionFont = 'jost-regular'
		const boldFont = 'jost-bold'
		await addFont(titleFont, edgeOfTheGalaxyFont)
		await addFont(descriptionFont, jostRegularFont)
		await addFont(boldFont, jostBoldFont)

		const canvaSize = 100
		const width = this.sizes.width * canvaSize
		this.canvaHeight = this.sizes.height * canvaSize
		const {context, canvas} = createHiPPICanvas(width, this.canvaHeight)
		addText({
			context,
			text: this.infos.name,
			fontSize: 50,
			y: 0,
			font: titleFont
		})
		const textFontSize = 12

		function addInfo({label, value, y}: { label: string, value: string, y: number }) {
			addText({
				context,
				text: label + ': ',
				fontSize: textFontSize,
				y,
				font: boldFont
			})
			addText({
				context,
				text: value,
				fontSize: textFontSize,
				y,
				x: 100,
				font: descriptionFont
			})
		}

		addInfo({
			label: 'Radius',
			value: this.infos.radius + ' km',
			y: 60
		})
		addInfo({
			label: 'Distance',
			value: this.infos.distance + ' km',
			y: 80
		})
		addInfo({
			label: 'Speed',
			value: this.infos.speed + ' km/h',
			y: 100
		})
		addInfo({
			label: 'Mass',
			value: this.infos.mass + ' kg',
			y: 120
		})
		addInfo({
			label: 'Temperature',
			value: this.infos.temperature + ' °C',
			y: 140
		})
		addText({
			context,
			text: this.infos.description,
			fontSize: textFontSize,
			y: 160,
			font: descriptionFont,
			maxWidth: width
		})


		// canvas contents will be used for a texture
		const texture1 = new Texture(canvas)
		texture1.minFilter = LinearFilter
		texture1.needsUpdate = true

		this.material = new MeshBasicMaterial({
			map: texture1,
		})
		this.material.transparent = true
	}

	public lauchAnimation() {
		return new Promise(resolve => {
			console.log(this.panelTexture)
			const timeline = gsap.timeline({
				onComplete: resolve
			})
			timeline.to(this.planetLink.scale, {
				y: 1,
				duration: 0.2,
				ease: 'easeIn'
			})
			timeline.to(this.panelBorderTop.scale, {
				y:1,
				duration: 0.2,
				ease: 'linear'
			})
			timeline.to(this.panel.scale, {
				y: 1,
				duration: 0.5,
				ease: 'easeOut'
			})
			timeline.play()
		})
	}

}