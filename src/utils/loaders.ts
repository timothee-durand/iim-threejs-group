import {Texture, TextureLoader} from 'three'
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export async function loadTexture(path: string): Promise<Texture> {
	return new Promise(resolve => new TextureLoader().load(path, resolve))
}

export async function addFont(name: string, path: string): Promise<void> {
	try {
		const fontFace = new FontFace(name, `url(${path})`)
		await fontFace.load()
		document.fonts.add(fontFace)
	} catch (e) {
		console.error(e)
	}

}

export async function loadModel(path: string): Promise<GLTF> {
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader()
		loader.load(path, resolve, undefined, reject)
	})
}