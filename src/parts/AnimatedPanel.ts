import {
	CapsuleGeometry,
	CylinderGeometry,
	DoubleSide,
	Group,
	LinearFilter,
	Mesh,
	MeshBasicMaterial,
	NearestFilter,
	PlaneGeometry,
	Texture
} from 'three'
import {addFont} from '../utils/loaders'
import edgeOfTheGalaxyFont from '../assets/fonts/edge-of-galaxy-poster.otf'
import jostRegularFont from '../assets/fonts/jost-regular.ttf'
import jostBoldFont from '../assets/fonts/jost-bold.ttf'
import {addText, createHiPPICanvas} from '../utils/canvas'

interface PlanetInfos {
    name: string
    radius: number
    distance: number
    speed: number
    mass: number
    temperature: number
    description: string
}

export class AnimatedPlanetPanel extends Group {
	private infos: PlanetInfos
	private material!: MeshBasicMaterial
	private sizes = {
		width: 2.3,
		height: 4
	}
	private readonly distanceFromPlanet: number
	private padding = 0.2

	constructor(infos: PlanetInfos, distanceFromPlanet:number) {
		super()
		this.infos = infos
		this.distanceFromPlanet = distanceFromPlanet

		this.init()
	}

	private async init() {
		await this.createTexture()
		this.addPanel()
		this.addBorder()

		this.translateX(this.distanceFromPlanet)
	}

	private addPanel() {
		const panel = new Mesh(
			new PlaneGeometry(this.sizes.width, this.sizes.height),
			this.material
		)
		this.add(panel)
	}

	private addBorder(){
		const borderRadius = 0.02
		const borderMaterial = new MeshBasicMaterial({ color: '#a0fff1', side: DoubleSide })
		const borderTopX =this.sizes.height / 2 +0.2
		const borderTopWidth = this.sizes.width + this.padding * 2
		const borderTop = new Mesh(
			new CapsuleGeometry(borderRadius, borderTopWidth, 15),
			borderMaterial
		)
		borderTop.translateY(borderTopX)
		borderTop.rotateZ(Math.PI / 2)

		this.add(borderTop)


		const d1 = this.distanceFromPlanet / 2
		const d2 =this.sizes.height / 2

		const linkHeight = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2))
		const realLinkHeight = linkHeight * 0.7
		const planetLinkGroup = new Group()
		const planetLink = new Mesh(
			new CapsuleGeometry(borderRadius, realLinkHeight, 15),
			borderMaterial
		)
		const linkAngle = Math.atan(d1 / d2)
		planetLink.translateY(-realLinkHeight / 2)
		planetLinkGroup.add(planetLink)
		planetLinkGroup.position.set(-borderTopWidth / 2, borderTopX, 0)
		planetLinkGroup.rotateZ(-linkAngle)
		this.add(planetLinkGroup)
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
		const {context, canvas} = createHiPPICanvas(width, this.sizes.height * canvaSize)
		addText({
			context,
			text: this.infos.name,
			fontSize: 50,
			y: 0,
			font: titleFont
		})
		const textFontSize = 12

		function addInfo({label, value, y}: {label :string, value: string, y: number}) {
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
		texture1.needsUpdate = true
		texture1.minFilter = LinearFilter

		this.material = new MeshBasicMaterial({
			map: texture1,
		})
		this.material.transparent = true


	}


}