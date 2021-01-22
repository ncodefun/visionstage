/// console-log.js -> stupid browsers / ad blockers block log.js... looks suspiciously dangerous! so obvious, sure. lol
// export const log = ( () => {
const PROD = false

const COLORS = true

const NO_LOG = ['debug']
const ONLY_LOG = [] //'debug'

const common = 'padding:0 10px; border-radius:10px 0 0 10px;';
const commonsub = 'padding:0 10px; border-radius:0 10px 10px 0;';
const cstyles = {
	white: 'background:white; color: black;'+common,
	black: 'background:black; color: white;'+common,
	green: 'background:green; color: white;'+common,
	yellow: 'background:yellow; color: black;'+common,
	blue: 'background:#0080FF; color: white;'+common,
	gold: 'background:Goldenrod; color: black;'+common,
	orange: 'background:#DB7800; color: white;'+common,
	pink: 'background:deeppink; color: white;'+common,
	purple: 'background:#B700FF; color: white;'+common,
	red: 'background:darkred; color: white;'+common,
	greenorange: 'background: #778111; color: white; border:1px solid orange;'+common,
};
/// Add alternative keys
Object.assign( cstyles, {
	info: cstyles.blue,
	check: cstyles.yellow,
	ok: cstyles.green,
	notok: cstyles.greenorange,
	err: cstyles.red,
	warn: cstyles.orange,
	debug: cstyles.black,
})

/// Darker style variations for subsequent values
const csubstyles = {
	green: 'background:darkgreen; color: white;'+commonsub,
	yellow: 'background:#7D7D00; color: white; font-weight:bold;'+commonsub,
	blue: 'background:#0058B0; color: white;'+commonsub,
	orange: 'background:#A9691B; color: white;'+commonsub,
	orangered: 'background:#887400; color: white;'+commonsub,
	red: 'background:#5F0207; color: white;'+commonsub,
	greenorange: 'background: #585F0D; color: white; border:1px solid orange;'+commonsub,
	pink: 'background:#AC1B68; color: white;'+commonsub,
	purple: 'background:purple; color: white;'+commonsub,
	black: 'background:#111; color: #eee;'+commonsub,
	white: 'background:#eee; color: black;'+commonsub,
	gold: 'background:gold; color: black;'+commonsub,
};
/// Add alternative keys
Object.assign( csubstyles, {
	info: csubstyles.blue,
	check: csubstyles.yellow,
	ok: csubstyles.green,
	notok: csubstyles.greenorange,
	err: csubstyles.red,
	warn: csubstyles.orange,
	debug: csubstyles.black,
})

NO_LOG.length>1 && console.log('LOG DISABLED FOR STYLES:', NO_LOG.join(' , '))

export default function( style, ...msg){

	if( PROD && style !== 'prod'){
		return
		let message = !msg.length ? style : msg
		if( Array.isArray(message) ? !message[0].startsWith('--') : typeof message === 'string' && !message.startsWith('--'))
			return
		if( Array.isArray(message))
			message[0] = message[0].slice(2)
		else if( typeof message === 'string')
			message = message.slice(2)
	}
	else if( PROD){
		style = 'info'
	}

	if( !msg.length){
		console.log( style); //* one param == only a message
	}
	else {

		if( NO_LOG.includes( style) || ONLY_LOG.length && !ONLY_LOG.includes( style)){
			//console.error('LOG BLOCKED:', style)
			return
		}
		
		if( !COLORS){
			if( style==='info' || style==='check' || style==='pink' || style==='purple')
				console.info( ...msg)
			else if( style==='warn') 
				console.warn( ...msg)
			else if( style==='err') 
				console.error( ...msg)
			else
				console.log( ...msg)
		}
		/// first part is a colored label
		/// rest is the data
		else if( msg.length>1){
			//console.warn('logging')
			let not_prim = msg.find( part => !isPrimitive( part))
			if( not_prim){
				//console.log('part to log are not primitive::')
				//console.log(not_prim)
				msg.forEach( (part,i) => {
					if( i) console.log( part)
					else console.log( '%c'+part+ ' ↓', cstyles[ style], )
				})
				return
			}
			//msg.map( part => isPrimitive( part) ? '%c'+part : part ).join(','),

			console.log(
				'%c'+msg.join('%c'),
				cstyles[ style], 
				...Array( msg.length-1).fill( csubstyles[ style]) 
			);//'%c'+msg.join('%c'),
		}
		else
			console.log( '%c'+msg, cstyles[ style]);
	}
}

function isPrimitive( val){
	return typeof val === 'string' || 
				 typeof val === 'number' || 
				 typeof val === 'boolean' || 
				 false
}
