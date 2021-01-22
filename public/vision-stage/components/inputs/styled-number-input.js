import { q, tempClass, chunksOfLength } from '../../modules/utils-core.js'
import { Component, html, define, log, getStage } from '../../vision-stage.js'

const stage = getStage()
const app = stage.app
const allowed_keys = ['Backspace', 'ArrowLeft', 'ArrowRight']


class StyledNumberInput extends Component {

	onConnected(){
		this.render()
	}

	template(){
		return html`
		<input .value=${this.string_value}
			type='text'
			id='total' 
			class='input-number-field ${ this.state }' 
			data-flow='col'
			@click=${ this.onClick }
			@input=${ this.onInput }
			@keydown=${ this.onKeydown }
			@blur=${ this.onBlur }
			>
		<div id="total-stylistic" class='abs'>${ this.total_stylistic }</div>`
	}

	onKeydown( e){
		const key = e.key

		if( key==='Enter'){
			this.q('input').blur()
			return
		}
		
		const val = e.target.value
		
		const MAX = val.includes('.') ? this.max_nums : this.max_nums-1
		let prevent = 
			val.length > MAX
			||
			(key === ',' || key === '.') && val.includes('.') 
			||
			/[^\d,.]/.test(key)
		
		if( !allowed_keys.includes( key) && key !== 'Enter' && prevent){
			e.preventDefault()
			return false
		}
		//this.onKey && this.onKey(e.key, e)
	}

	onInput( e){
		this.value = e.target.value.replace(/,/g,'.') || ''
		app.need_update = true
		//log('check', 'onInput(), value:', this.value)
		//this.onInput && this.onInput( this.value) // external effect
	}

	onClick( e){
		/// we don't want a zero to be there when input, remove it
		//log('check', 'e.target.value:', e.target.value)
		if( e.target.value == '0')
			this.value = this.string_value = ''
	}

	onBlur(){
		//log('check', 'onBlur(), this.string_value:', this.string_value)
		this.total_stylistic = this.formatNum( this.string_value)
		//log('check', 'onBlur, stylistic:', this.total_stylistic, this.string_value)
	}

	commitChange(){
		this.normalizeInputValue()
		app.totalToNumbers( this.string_value)
		app.need_update = false // hide the update btn
	}

	normalizeInputValue(){
		if( this.value.endsWith('.'))
			this.value = this.value.slice(-1)
		if( this.value.startsWith('.'))
			this.value = '0'+this.value
		else if( this.value !== '0' && this.value.startsWith('0'))
			this.value = this.value.replace(/^0+(?=\d)/,'')

		if( app.mode !== 'free'){
			let MAX = this.value.includes('.') ? this.max_nums+1 : this.max_nums
			if( this.value.length > MAX){
				this.value = this.value.slice( 0, MAX)
				if( this.value.endsWith('.'))
					this.value = this.value.slice( -1)
				this.onBlur()
			}
		} 
	}

	trim(){
		// TRIM IF NECESSARY (REMOVE EXTRA, TRAILING ZERO, DOT)
		let decs = app.decimals
		if( this.value.includes('.')){
			//log('info', 'value include a dot')
			this.value = this.value.split('.')
				// if decimal part and it's longer than needed decimals, splice
				.map( (p,i) => 
					i===1 && p.length > decs ? p.slice( 0, decs) : 
					i===0 ? p.slice( -(10-decs)) :
					p
				)
				.filter( p => p.length) // avoid end with . if no more decimals
				.join('.')
		}
		else {
			// remove extra numbers if value too big
			this.value = this.value.slice( -(10-decs))
		}
	}

	afterFirstRender(){ // SET INPUT VALUE AND STRING_VALUE
		this.string_value =
			this.separator === ',' ? 
				this.value.replace(/\./g,',') : 
				this.value
	}

	formatNum( num){
		//log('check', 'format num:', num)
		if( num === undefined) return
		const SEP = this.separator
		let [units, decimals] = num.split(/\.|\,/)
		if( !units) units = '0'
		if( !decimals) decimals = ''
		
		let chunks1 = chunksOfLength( units.split('').reverse(), 3).map( i => i.reverse()).reverse()
		let decimals_arr = decimals.split('')
		let pre = [decimals_arr.splice(0,2)]
		let chunks2 = decimals.length > 3 ?
			pre.concat( chunksOfLength( decimals_arr, 3)) : 
			chunksOfLength( decimals.split(''), 10)

		if( chunks2.length)
			return (
				chunks1.map( chnk => chnk.join('')).join(' ') +
				SEP + 
				chunks2.map( chnk => chnk.join('')).join(' ')
			)
		return chunks1.map( chnk => chnk.join('')).join(' ')
	}
}



StyledNumberInput.properties = {
	max_nums: 10,
	total_stylistic:'',
	separator: {
		value: stage.lang === 'fr' ? ',' : '.',
		init_watcher: true,
		watcher( val){
			this.value = this.value // re-set string_value
			this.onBlur()
			//log('check', 'separator:', val, stage.lang)
			//custom @onChange()
		}
	},
	string_value: '',
	min: 0,
	max: 999999999,
	step: { // computed prop
		value: 1,
		transform: () => 1 / 10 ** app.decimals
		// !!(z = comp('input-decimals').value) && (1 / 10**z) || 1
	},

	state: '', // => CSS class = .{state}   (attention, ... )

	value: { // sets up internals
		value: '',
		watcher( val){
			//log('err','total watcher:', val, this.el)
			if( val === undefined) return
			this.string_value =	this.separator === ',' ? val.replace(/\./g,',') : val 
			//log('err','this.string_value:', this.string_value)
			//this.q('input').value = this.string_value
			//!! ???
			let inp = this.q('input')
			let start = inp.selectionStart,
					end = inp.selectionEnd
			inp.setSelectionRange( start, end)
		}
	},

}

StyledNumberInput.strings = {

}

define( 'styled-number-input', StyledNumberInput)
