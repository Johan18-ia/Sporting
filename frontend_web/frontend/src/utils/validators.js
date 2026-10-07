const patterns = {
	name: /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0300-\u036F]+(?:[ '\u2019-][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0300-\u036F]+)*$/,
	digits: /^\d+$/,
	integer: /^\d+$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^\d{7,15}$/,
	year: /^\d{4}$/
}

export const getFieldError = (type, value) => {
	const text = String(value ?? '').trim()
	if (!text) return ''

	switch (type) {
		case 'name':
			return patterns.name.test(text) ? '' : 'Usa solo letras, espacios, guiones o apóstrofes.'
		case 'digits':
			return patterns.digits.test(text) ? '' : 'Usa solo números.'
		case 'email':
			return patterns.email.test(text) ? '' : 'Ingresa un correo electrónico válido.'
		case 'phone':
			return patterns.phone.test(text) ? '' : 'Usa entre 7 y 15 dígitos, sin letras ni símbolos.'
		case 'price':
			return Number.isFinite(Number(text)) && Number(text) >= 0 ? '' : 'Ingresa un valor numérico igual o mayor que cero.'
		case 'integer':
			return patterns.integer.test(text) && Number.isSafeInteger(Number(text)) ? '' : 'Ingresa un número entero no negativo.'
		case 'year': {
			const year = Number(text)
			return patterns.year.test(text) && year >= 1900 && year <= new Date().getFullYear()
				? ''
				: `Ingresa un año entre 1900 y ${new Date().getFullYear()}.`
		}
		case 'url':
			try {
				const url = new URL(text)
				return ['http:', 'https:'].includes(url.protocol) ? '' : 'Ingresa una URL http o https válida.'
			} catch {
				return 'Ingresa una URL http o https válida.'
			}
		default:
			return ''
	}
}
