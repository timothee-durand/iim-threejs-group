import {Vector3} from 'three'

export const fonts = {
	titleFont : 'edge-galaxy',
	descriptionFont : 'jost-regular',
	boldFont : 'jost-bold',
}

export const distanceToSunFactor = 6

export  const cameraOffset = new Vector3(2, 1, 2)

export const initialCameraPosition = new Vector3(0, 30, 125)

export const cameraRotation = new Vector3(- Math.PI / 8, 0, 0)

export const orbitRadius = 0.1