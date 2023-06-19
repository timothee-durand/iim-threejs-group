import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from 'three'

const dimensions = {
	width: 500,
	height: 500,
}

const scene = new Scene()

const canvas = document.querySelector('#canvas')
if(!canvas) { 
	throw new Error('Canvas not found')
}
const renderer = new WebGLRenderer({
	antialias: true,
	canvas : canvas
})
renderer.setSize(dimensions.width, dimensions.height)

const camera = new PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000)
scene.add(camera)
camera.position.z = 5

const cube = new Mesh(
	new BoxGeometry(1, 1, 1),
	new MeshBasicMaterial({ color: 0x00ff00 })
)
scene.add(cube)


function animate() {
	requestAnimationFrame(animate)
	cube.rotation.x += 0.01
	cube.rotation.y += 0.01
	renderer.render(scene, camera)
}

animate()