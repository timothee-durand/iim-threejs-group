import {Texture, TextureLoader} from 'three'

export async function loadTexture(path: string): Promise<Texture> {
	return new Promise(resolve => new TextureLoader().load(path, resolve))
}

export async function addFont(name:string, path: string): Promise<void> {
	try {
		const fontFace = new FontFace(name, `url(${path})`)
		await fontFace.load()
		document.fonts.add(fontFace)
	} catch (e) {
		console.error(e)
	}

}