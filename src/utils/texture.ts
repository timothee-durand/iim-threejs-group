import {Texture, TextureLoader} from 'three'

export async function loadTexture(path: string): Promise<Texture> {
	return new Promise(resolve => new TextureLoader().load(path, resolve))
}