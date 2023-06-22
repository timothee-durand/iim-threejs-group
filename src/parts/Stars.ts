import {Group, Mesh, MeshPhongMaterial, SphereGeometry} from 'three'


function random(min: number, max: number) {
	return Math.random() * (max - min) + min
}

function randomInArray<T>(array:T[]) : T {
	return array[Math.floor(Math.random() * array.length)]
}

export class Stars extends Group {
	constructor() {
		super()
		this.initStars()
	}

	initStars() {
		const starGeometry = new SphereGeometry(0.05, 10, 10)
		const materials = [
			new MeshPhongMaterial({color: 'white', emissive: 'white', emissiveIntensity: 10}),
			new MeshPhongMaterial({color: '#42a9ff', emissive: '#42a9ff', emissiveIntensity: 10}),
			new MeshPhongMaterial({color: '#ff4242', emissive: '#ff4242', emissiveIntensity: 10}),
		]
		const starMesh = new Mesh(starGeometry, materials[0])
		for (let i = 0; i < 10000; i++) {
			const star = starMesh.clone()
			star.material = randomInArray(materials)
			star.position.set(random(-100, 100), random(-100, 100), random(-100, 100))
			const scale = random(0.5, 1)
			star.scale.set(scale, scale, scale)
			this.add(star)
		}
	}

}