
/**
 * Select component which manages a list of items object with a name prop, and sets index on a target
 * we can directly select, rename, delete an item
 * we can also add a new item or reset the list by defining apropriate methods 
 * Usage:

		<super-selector 
			prop-for-selected-index='selected_list_index'
			prop-for-items='lists'
			.target=${ this }
			.addItem=${ this.addList }
			.resetItems=${ this.resetLists }
			@>
		</super-selector>
 */


// log('ok', '-> super-selector', )
import { Component, html, define, log, getStage, useSVG } from '../../vision-stage.js'
import {q} from '../../modules/utils-core.js'

const stage = getStage()
const app = stage.app

 //// cote de performance globale -> donne une mauvaise réponse ... 0

class SuperSelector extends Component {
	
	template(){
		const items = this.items()
		let index = this.index()
		if( index < 0) index = 0
		else if( index > items.length-1) index = items.length-1

		//!! warn only if not readonly
		// if( !items[ index].name){
		// 	log('err', 'Items for super-selector must be objects with a .name property')
		// 	throw Error
		// }
		const READ_ONLY = this.hasAttribute('read-only')
		//!! newline in .label (after value) cause lit-html error ?
		return html`
		<header flow='row left'>
			${
				READ_ONLY 
				? html`
				<div class='label' @click=${ this.toggleOpen }>${ this.localizedName( items[ index]) }</div>` 
				
				: html`
				<div class='label'
					contenteditable='true'
					@keydown=${ this.onKey }
					@input=${ this.onInput }
					@paste=${ this.onPaste }>
					${ this.localizedName( items[ index]) }</div>`
			}
			<div flow class='toggle' @click=${ this.toggleOpen }>${ useSVG("chevron-down") }</div>
		</header>
		<div class='items'>
			<ul @click=${ this.onClickItems }>
				${ items.map( (item,i) => 
						html`<li .index=${i} .val=${ this.name( item) }><span class='delete ${!READ_ONLY&&items.length>1?'':'hide'}'>×</span><span class='name'>${ this.localizedName( item) }</span></li>`)
				}
			</ul>
			${
				READ_ONLY
				? ''
				: html`
				<footer flow='row space-evenly'>
					<button class='reset round red' @click=${ this._resetItems }>${ useSVG('reset') }</button>
					<button class='add round green' @click=${ this._addItem }>${ useSVG('plus') }</button>
				</footer>`
			}
		</div>`
	}

	onConnected(){
		// if( !this.hasAttribute('prop-for-selected-index') || !this.hasAttribute('prop-for-items'))
		// 	throw '<super-selector> missing attribute(s): prop-for-selected-index, prop-for-items'
		// if( !this.target)
		// 	throw '<super-selector> missing .target property'
		this.index_prop = this.getAttribute('index-prop')
		this.removeAttribute('index-prop')

		this.value_prop = this.getAttribute('value-prop')
		this.removeAttribute('value-prop')

		this.items_prop = this.getAttribute('items-prop')
		this.removeAttribute('items-prop')

		this.localized = this.getAttribute('localized-items')==='true'
		this.removeAttribute('localized-items')
		//log('check','items:', this.items_prop, '->', this.target[ this.items_prop])
		/// auto render when items change on target (reset, )
		this.uses( [[ this.target, this.items_prop]])
		if( !app.popup){
			/// insert instance
			q('app-main').insertAdjacentHTML('beforeend','<popup-full>')
		}
		this.render()

		/// prob. better to be an own responsibility, rather than collect all in app and have a single listener
		document.addEventListener('click', e => { 
			//log('check', 'target now:', e.target)
			if( e.target.closest('super-selector') !== this && !e.target.closest('popup-full')){
				this.open = false
			}
		})
	}

	name( item){ //log('err', 'item name:', item.name || item)
		return item.name || item 
	}
	localizedName( item){
		return this.localized ? 
			this.target.getString( this.name( item)) :
			this.name( item)
	}

	items(){ return this.target[ this.items_prop] }
	index(){ //log('err', 'this.items_prop:', this.items_prop, '==>', this.target)
		return this.index_prop ? this.target[ this.index_prop] : this.items().indexOf( this.target[ this.value_prop]) }


	toggleOpen( e){
		this.open = !this.open
	}

	/** select or remove */
	onClickItems( e){
		if( e.target.localName !== 'span') return

		const item_index = e.target.parentElement.index
		const item_value = e.target.parentElement.val /// .value is a reserved word
		//log('ok', 'item value:', item_value )
		if( e.target.classList.contains('name')){
			if( this.index_prop!==undefined) this.target[ this.index_prop] = item_index
			if( this.value_prop) this.target[ this.value_prop] = item_value
			this.open = false
		}
		else if( e.target.classList.contains('delete')){
			const msg =  (this.getAttribute('delete-message') || "Effacer cet item : ") + item_value

			app.popup.setMessage( msg, ['Annuler','OK'])
				.then( answer => {
					if( answer === 1){
						/// remove
						const items = this.items()
						items.splice( item_index, 1)
						/// stay at current index (will be the following item) unless it was last
						this.target[ this.index_prop] = Math.min( this.index(), items.length-1)
						this.render()
					}
				})
		}
	}

	_resetItems( e){
		log('err', 'reset ALL ?', )
		if( !this.resetItems) throw '→ Missing this.resetItems on super-selector'
		const msg = this.getAttribute('reset-message') || "Réinitialiser tous les items ?"
		app.popup.setMessage( msg, ['Annuler','OK'])
			.then( answer => {
				if( answer === 1){
					this.resetItems.call( this.target)
				}
			})
	}

	_addItem( e){
		this.addItem.call( this.target)

		/// optional: select and close
		this.target[ this.index_prop] = this.items().length - 1
		this.open = false
		this.render()
		this.q('.label').focus()
		requestAnimationFrame( t => {
			document.execCommand('selectAll', false, null)
		})
	}

	onInput( e){
		this.items()[ this.index()].name = e.target.textContent.trim()
		this.target.render()
		//log('check', 'item name changed; item:', this.items()[ this.index()])
	}

	onKey( e){
		//log('check', 'e.key:', e.key)
		if(/[–—\^`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/gi.test( e.key)){
			log('warn', 'forbidden char:', e.key)
			e.preventDefault()
		}
		else if( e.key==='Enter'){
			e.preventDefault()
			e.target.blur()
		}
	}

	onPaste( e){
		log('warn', 'pasting is forbidden…')
		e.preventDefault()
		//const paste = (event.clipboardData || window.clipboardData).getData('text');
	}
}

SuperSelector.properties = {
	open: {
		value: false,
		class: 'open',
		// watcher( val){
		// 	log('check', 'open:', val)
		// }
	},
}

SuperSelector.strings = {

}

define( 'super-selector', SuperSelector, ['popup-full'])

/// connexion
