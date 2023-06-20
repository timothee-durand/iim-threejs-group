export function createHiPPICanvas(width: number, height: number): {
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
} {
	const ratio = window.devicePixelRatio
	const canvas = document.createElement('canvas')

	canvas.width = width * ratio
	canvas.height = height * ratio
	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'
	const context = canvas.getContext('2d')
	if (!context) throw new Error('No context')
	context.scale(ratio, ratio)
	return {canvas, context}
}

export function addText({context, text, fontSize, x, y, font, maxWidth}: {
    context: CanvasRenderingContext2D,
    text: string,
    fontSize: number,
	x?: number,
	y: number,
    font: string,
	maxWidth?: number
}):void {
	context.font = fontSize + 'px ' + font
	context.fillStyle = 'rgb(255,255,255)'
	if (maxWidth) {
		const lines = getLines(context, text, maxWidth)
		lines.forEach((line, index) => {
			context.fillText(line, 0, fontSize + y + index * fontSize * 1.25)
		})
		return
	}
	context.fillText(text, x ?? 0, fontSize + y)
}

function getLines(ctx :CanvasRenderingContext2D, text : string, maxWidth: number) {
	const words = text.split(' ')
	const lines = []
	let currentLine = words[0]

	for (let i = 1; i < words.length; i++) {
		const word = words[i]
		const width = ctx.measureText(currentLine + ' ' + word).width
		if (width < maxWidth) {
			currentLine += ' ' + word
		} else {
			lines.push(currentLine)
			currentLine = word
		}
	}
	lines.push(currentLine)
	return lines
}