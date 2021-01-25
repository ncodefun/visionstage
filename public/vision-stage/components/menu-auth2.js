const PROD = true /// enables firebase analitycs
const DEBUG = false
// const FIREBASE_CONFIG = {
// 	apiKey: '',
// 	authDomain: '',
// 	databaseURL: '',
// 	projectId: '',
// 	storageBucket: '',
// 	messagingSenderId: '',
// 	appId: '',
// 	measurementId: ""
// }

import { Component, html, define, log, useSVG, unsafeHTML } from '../vision-stage.js'
import { q, ctor, chain } from '../modules/utils-core.js'
import * as _firebase from '../modules/firebase/app.js';
import "/vision-stage/modules/firebase/auth.js"
import "/vision-stage/modules/firebase/firestore.js"
import "/vision-stage/modules/firebase/analytics.js"

Component.load('inputs/button-waiting')
//! popups

const app = q('vision-stage')

const ALLOW_AUTO_SIGNIN = true
const firebase = _firebase.default
app.authentified = false
const app_name = stage.app_name //.localName.replace(/^app-/, '')
//log('err', 'app name:', app_name)
function generatePassword() {
		//! test
    let length = 4,
        charset = '0123456789', // "abcdefghijklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",
        retVal = ""
    for( let i = 0, n = charset.length; i < length; ++i)
      retVal += charset.charAt( Math.floor( Math.random() * n))
    return retVal
}

class AuthMenu extends Component {

	onConnected(){

		app.menu_auth = this
		if( !this.firebase_initialized)
			this.initFirebase()
		this.render()
		this.classList.add('menu-auth')
		this.classList.add('menu')
	}

	template(){
		const verified = this.user && this.user.emailVerified
		const email = this.user ? this.user_email.split('@').join('<wbr>@') : !!this.student_data && this.student_name || ''
		const hide_tabs = !app.has_student_version || !this.auth_ready || !!this.user || !!this.student_data
		//${useSVG('android-person','person abs','xMidYMid slice')}
		return html`
		<div class='menu-body' flow='col top stretch'>
			<header>
				<button ?disabled=${!this.user&&!this.student_data} class='round signout ${app.UI_button_size_class}' @click=${this.signOut}>
					${useSVG('exit','exit abs','xMidYMid slice')}
				</button>
				${
					email ? html`
					<div id='identifier' flow='col' class=${verified?'':'unverified'}>
						<div>${unsafeHTML(email)||'@'}</div>	
						<!-- <small>Adresse courriel ${ verified ? '' : 'non-'}vérifiée</small> -->
					</div>` : 
					html`<h2>${this.form==='signup'?this.$signup:this.$connect}</h2>
						<button @click=${this.toggleForm} class='small abs ${this.form==='signin'?'signup':'signin'}'>${this.form==='signin'?this.$signup:this.$connect}&nbsp;${useSVG('fat-arrow-right2','go-arrow')}</button>`
				}
			</header>

			<section id="unverified-user" class=${ verified||!this.user ? 'hide' : '' }>
				<h2>${ this.$please_verify_email}</h2>
				<p>${ this.$verification_email_sent }</p>
				<!-- <p>Il est important de confirmer votre adresse courriel sans quoi vous ne pourrez pas changer de mot de passe ou vous abonner. </p> -->
				<p lang='fr'>Pour envoyer le courriel de nouveau,<br>cliquez ici&thinsp;:</p>
				<p lang='en'>To send the email again,<br>click here&thinsp;:</p>
				<p>
					<button-waiting id='btn-send-email-confirmation-link'
						class='block'
						strings:fr="label: Envoyez, label-done: Envoyé&thinsp;!" 
						strings:en="label: Send, label-done: Sent&hairsp;!"
						@click=${ this.sendEmailConfirmationLink }>
					</button-waiting>
				</p>
			</section>

			<section class='main' flow='col top stretch'>

				<header>
					<div class='tab-group ${ hide_tabs ? 'hide' : '' }' @click=${ this.selectTab }>
						<button data-index='0' class="tab ${ this.selected_tab===0 ? 'selected' : '' }">PROF</button>
						<button data-index='1' class="tab ${ this.selected_tab===1 ? 'selected' : '' }">ÉLÈVE</button>
					</div>
				</header>
				${ this.auth_ready && this.formTemplate() || '' }
				${ this.auth_ready && this.subsTemplate() || '' }
			</section>
		</div>

		${ this.students_manager_opened ? html`		
			<div class='students-management layer scroll' flow='col top'>
				<button @click=${this.closeStudentsManager} class='close abs square red'>×</button>
				${ this.studentsTemplate() }
			</div>
		` : 
		''
		}`
	}

	closeStudentsManager( e){
		this.students_manager_opened = false
	}

	toggleForm(){
		this.form = this.form==='signup' ? 'signin' : 'signup'
	}

	/* 	
	toggleOpen(){
		//// do not close if:
		if( !app.authentified || this.show_popup_stats || this.show_popup_restrictions){
			this.open = true
			log('err', 'closing forbidden', )
			return
		}
		this.open = !this.open
		this.liveStudentsUpdates( this.open)
	} 
	*/

	initFirebase(){
		//log('info', 'initFirebase, initialized?', this.firebase_initialized)
		this.firebase_initialized = true
		//const other_config = {}
		const firebase_config = ctor( app).firebase_config || FIREBASE_CONFIG
		if( !firebase_config)
			log('err', 'No default firebase_config nor App.firebase_config')
		this.firebase = firebase.initializeApp( firebase_config, 'apps');
		this.auth = this.firebase.auth()
		this.auth.languageCode = stage.lang
		this.auth.onAuthStateChanged( this.onAuthStateChanged.bind( this))
	}

	/** only if teacher is subscribed */
	watchTeacherConnection( user){
		//log('warn', 'watchTeacherConnection, SET CONNECTED FALSE')
		//!! if another is watching, will be signed out
		this.firestore.doc(`users_public/${user.uid}/`).set({ connected:false },{ merge:true })
			.catch( err => log('err', 'err setting connected:', err))
			.then( () => {
				this.firestore.doc(`users_public/${user.uid}/`).onSnapshot( doc => {
					const data = doc.data()
					//log('pink', 'doc data:', this.watchingTeacherConnection , JSON.stringify(data))

					/// skip first and second calls
					if( !this.watchingTeacherConnection){
						this.watchingTeacherConnection = 1
						/// this will trigger a second snapshot callback
						this.firestore.doc(`users_public/${user.uid}/`).set({ connected:true },{ merge:true })
							.catch( err => log('err', 'err setting connected:', err))
						return
					}
					/// make sure it follows above set(), else racing: connected
					else if( this.watchingTeacherConnection === 1){ // 
						this.watchingTeacherConnection = 2
						return
					}

					//! detect possible racing condition: we may arrive here before connected:true response;
					//! b/c of another get()
					
					if( data.role && data.connected===false) /// if role it means we're later
						this.signOut()
					
					//log('warn', 'snapshot listener call; someone else connected? :', conn===false )
	
				})//.catch( err => log('err', 'err:', err))
			})

	}

	onAuthStateChanged( user){
		
		//console.clear()
		if( q('#btn-ok')) q('#btn-ok').waiting = false

		DEBUG&&log( 'purple','user:', user&&user.email||'none', 'verified:', !!(user&&user.emailVerified))
		//q('.app[user-access-level]').classList.add('show')
		//log('err', 'auth hide splash')
		//q('#splashscreen').classList.add('hide')
		//! TEST
		//stage.app.setAttribute('user-access-level', 1)

		this.user_uid = null
		this.user_signed_in = false
		/// MAYBE STUDENT
		if( !user){
			
			if( this.firestore) return //!! why would this callback fire multiple times?

			// First time only
			if( !this.firestore){
				this.firestore = this.firebase.firestore()
				//!! this.firestore.enablePersistence()
			}
			
			/// try to auto "signin" student
			// has registered with a teacher for this app
			const teacher_email = chain( this.student_apps.apps[ app_name], 'teacher')
			if( ALLOW_AUTO_SIGNIN && this.student_username && teacher_email && !this.prevent_auto_signin){ 
				const path = 'teachers/'+teacher_email+'/students/'+this.student_username
				this.student_doc = this.firestore.doc( path)
				this.student_doc.get().then( doc => {
					if( doc && doc.exists){						
						let data = doc.data()
						DEBUG && log('info', 'student data:', data)
						this.student_name = data.name
						/// student doc exists, but check apps
						if( data.apps[ app_name]){

							DEBUG && log('purple', 'Auto-signin student')
							this.student_data = data
							this.selected_tab = 1
							this.stats = data.apps[ app_name].stats
							this.restrictions = data.apps[ app_name].restrictions

							app.authentified = true
							
							if( app.onStudentDataReady) /// set student mode
								app.onStudentDataReady( this.student_data, this.stats, this.restrictions) 
							else if( app.onUserDataReady) /// if we differenciate students in another way?
								app.onUserDataReady( data) /// we normally use this to set allowed = true

							this.watchStudentDoc()

							if( PROD)
							this.firebase.analytics().logEvent('app_loaded', {
								title: app.$title,
								scene: app.scene||'none',
								role: "student"
							})
							DEBUG && log('info', '-> Analytics; app title:', app.$title, 'scene:', app.scene||'none')
						}
						else {
							DEBUG && log('pink', 'Could not auto-signin student, not registered')
							this.open = true
						}
					}
					else { //!! we could have registered but w/ another app, or been removed from teacher's list
						DEBUG && log('pink', 'Could not auto-signin student, no student doc @ path:', path)
						this.open = true
					}
				})
				.catch( err => {
					DEBUG && log('err', 'err:', err)
				})
			}
			else {
				//log('warn', 'Cannot auto signin; prevented by signout or no teacher in student_apps')
				if( app.menu_scenes && app.menu_scenes.open)
					app.menu_scenes.open = false
				setTimeout( e => {
					this.open = true
				}, 500)
			}
		}
		/// USER => TEACHER
		else {
			this.user = user

			//if( !this.user_email) /// erased data
			this.user_email = user.email

			/// @TO CHECK
			if( this.send_email_verification){
				this.send_email_verification = false
				user.sendEmailVerification()
					.catch( err => {
						this.message = "<p>Error, please try again later by clicking the button below.</p><p>Impossible d'envoyer un courriel de vérification pour l'instant, veuillez essayer plus tard en cliquant sur le bouton <em>Envoyer</em> plus bas.</p>"
					})
					.then( () => log('err','sent email verif email...'))
			}

			//// First time only
			if( !this.firestore){
				this.firestore = this.firebase.firestore()
				//!! this.firestore.enablePersistence()
				if( PROD){
					this.firebase.analytics().logEvent('app_loaded', {
						title: app.$title,
						scene: app.scene||'none',
						role: "teacher"
					})
					DEBUG && log('info', '-> Analytics; app title:', app.$title, 'scene:', app.scene||'none')
				}
			}

			/// get user data and call if app.onUserDataReady 
			/// => set as this.user_data
			if( !this.user_data) //// first time only
			this.firestore.doc(`users_public/${user.uid}/`).get()
				.then( doc => {
					if( doc && doc.exists)
						this.user_data = doc.data()
					else {
						DEBUG && log('purple', 'no user data')
						this.user_data = {
							role: 'teacher',
							subs: {

							}
						}
						/// must continue below... do not return
					}
					////  MANAGE USER ACCESS LEVEL  ////

					const app_lvl = app.access_level||1 /// 1: ifConnected, 2: ifSubscribed
					DEBUG && log('purple', 'required access level:', app_lvl)
					this.subs = this.user_data.subs || {}
					this.user_role = this.user_data.role || 'teacher'
					q('.app').setAttribute('user-role', this.user_role)
					
					/// get OBJECT WITH KEY=(APP ID), VAL=(SUBS ACTIVE? 0:FALSE, 1:TRUE)
					this.subscriptions = Object
						.entries( this.subs)
						.filter( ([k,v]) => v!=0)
						.map( ([k,v]) => k)

					const app_name = stage.app_name /// => store attribute value minus "defimath-"
					const safe_email = this.user_email //.replace(/\./g,'_dot_')
					DEBUG && this.subscriptions.length && log('purple', 'subscriptions:', this.subscriptions)
					this.user_subscribed = //false
						this.subscriptions.some( sub => app_name.includes( sub))
						||
						this.subscriptions.includes('all')

					if( this.user_subscribed){
						DEBUG && log('purple', 'subscribed; app_name:', app_name)
						this.watchTeacherConnection( user)
						//log('err', 'safe_email:', safe_email, app_name)
						this.teacher_doc = this.firestore.doc(`teachers/${safe_email}`)
						const getAppDoc = () => {
							const app_doc = this.teacher_doc.collection('apps').doc( app_name)
							app_doc.get().then( doc => {
								if( doc.exists){
									let data = doc.data()
									DEBUG && log('purple', 'app data:', JSON.stringify( data)) /// num / max students , restricted
									this.max_students = data.max_students
									this.num_students = data.num_students
									this.live_students_updates_ready = true
									//// students app restrictions editor 
									/// data.restrictions
								}
								else { //
									DEBUG && log('warn', 'subs, but no app doc (will create); safe_email:', safe_email,'app_name:',app_name)
									// this.firestore.doc( path)
									app_doc.set({
										num_students: 0, max_students: 20 //!! default if we are subscribed
									})
									.catch( err => log('err', 'cannot set app_doc default:', err))
								}
							})
							.catch( err => log('err', 'err get app_doc:', err))
						}

						/// First check if teacher_doc exists; if not we need to create it
						this.teacher_doc.get().then( doc => {
							if( !doc.exists){
								
								this.teacher_doc.set({})
									.then( () => getAppDoc())
									.catch( err => log('err', 'could not create empty doc for teacher:', err))
							}
							else {
								getAppDoc()
							}
						})
						.catch( err => log('err', 'could not get doc for teacher:', err))
					}
					else {
						DEBUG && log('purple', 'not subscribed to this app:', app_name)
					}
					
					DEBUG && log('purple', 'user_role:', this.user_role)
					DEBUG && log('purple', 'user_subscribed:', this.user_subscribed)
					//log('purple', 'subs in data:', this.subs, 'check against stage.app.localName:',stage.app.localName)

					if( app_lvl === 2 && !this.user_subscribed){ 
						//// SHOW SUBSCRIBE PAGE/SECTION
						//console.clear()
						DEBUG && log('err', 'not subscribed')
						setTimeout( e => {
							app.popup.setMessage(["Cette application requiert un abonnement.","<a href='/abonnement'>Abonnez-vous ici</a>"])
						}, 0)
						return
					}

					if( app_lvl === 3 && this.user_role !== 'admin'){
						stage.innerHTML = '<p class="warning">Cette page est réservée aux administrateurs du site.</p>'
						return
					}

					//// OK, hide menu-auth	
					if( this.open){
						if( this.just_signed_up){
							this.just_signed_up = false
							// keep menu open so we can read the "validate your email address" msg...
						}
						else {
							this.open = false
						}
					}
					else { /// we now allow closing auth menu even if not connected
						// app.authentified = true
						// app.onAllowed && app.onAllowed()
						// app.onAll owed = null
					}
					//stage.onUserDataReady( this.user_data)

					app.authentified = true
					if( app.onUserDataReady)
						app.onUserDataReady( this.user_data)
					//else alert ('no callback')
					// 	log('info', 'no onUserDataReady callback:', app)
				})
				/*.catch( err => {
					//alert ("ERR: "+err)
					log('warn','error while user_public:', err)
					//! we cannot know if user is subscribed...
					/// this should not happen even offline (firestore persistance is enabled)
					/// so do not show the page...
				})*/
		}

		// log('purple', 'AUTH READY')
		this.auth_ready = true
		this.render() /// sets view according to !!this.user
	}

	/**  switches b/w teacher and student signin forms  */
	selectTab( e){
		//return //!
		let btn = e.target
		this.selected_tab = parseInt( btn.dataset.index)
	}

	formSignin(){
		//-- placeholder needs not be empty (CSS is using :placeholder-shown)
		//-- .value=${ this.user_password || '' }
		const hide_signin = !this.auth_ready || !!this.user 
		if( hide_signin) return ''
		return html`
		<form class='signin' flow='col top stretch' novalidate spellcheck="false">

			<div flow='row' class='input email'>
				<div flow class='icon abs left'>${useSVG('envelope')}</div>
				<input type='email' required
					id='user-email-input' 
					placeholder=${this.$email}
					autocomplete='username email' 
					pattern='\\S+@\\S+?\\.\\S{2,}'
					value=${ this.user_email || '' }
					@input=${ this.onEmailInput }>
			</div>

			<div flow='row' class='input password'>
				<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
				<input type=${ this.show_password ? 'text':'password' } required
					id='user-password-input'
					placeholder=${this.$password}
					autocomplete='current-password' 
					pattern='.{6,}'
					@input=${ this.onPasswordInput }
					@keydown=${ this.signinOnEnter }
					@invalid=${ this.onInvalid }>
				<button type='button' id='btn-show-password' class='round bare' 
					@click=${ this.togglePasswordVis }>
					${ useSVG( 'eye-' + (this.show_password ? "hide" : "show") )}
				</button>
			</div>

			<button-waiting id='btn-ok' color=''
				.waiting=${ this.waiting }
				aria-label=${ this.$connect }
				@click='${ this.signIn }'
				>
				${ useSVG('fat-arrow-right2','','none') }
			</button-waiting>

			<p flow id='auth-message' class="${ this.message_type||'' }">${ this.message||'' }</p>

			<button type='button' id='btn-forgot-password' class='small' 
				info-tip=${this.$forgot_password_tip}
				@click='${ this.sendPasswordResetEmail }'>
				${ this.$forgot_password }
			</button>

		</form>`
	}

	formSignup(){
		return html`
		<form class='signup' flow='col top stretch' novalidate spellcheck="false">
			<div flow='row' class='input email'>
				<div flow class='icon abs left'>${useSVG('envelope')}</div>
				<input type='email' required
					id='user-email-input' 
					placeholder=${this.$email}
					autocomplete='username email' 
					pattern='\\S+@\\S+?\\.\\S{2,}'
					value=${ this.user_email || '' }
					@input=${ this.onEmailInput }>
			</div>

			<div flow='row' class='input password'>
				<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
				<input type=${ this.show_password ? 'text':'password' } required
					id='user-password-input'
					placeholder=${this.$password}
					autocomplete='new-password' 
					pattern='.{6,}'
					@input=${ this.onPasswordInput }
					@invalid=${ this.onInvalid }>
				<button type='button' id='btn-show-password' class='round bare' 
					@click=${ this.togglePasswordVis }>
					${ useSVG( 'eye-' + (this.show_password ? "hide" : "show") )}
				</button>
			</div>

			<div flow='row' class='input password'>
				<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
				<input type=${ this.show_password ? 'text':'password' } required
					id='user-password-input2'
					placeholder=${this.$password_again}
					autocomplete='new-password' 
					pattern='.{6,}'
					@keydown=${ this.signupOnEnter }
					@invalid=${ this.onInvalid }>
			</div>

			<button-waiting id='btn-ok' color=''
				.waiting=${ this.waiting }
				aria-label=${ this.$connect }
				@click='${ this.signUp }'
				>
				${ useSVG('fat-arrow-right2','','none') }
			</button-waiting>

			<p flow id='auth-message' class="${ this.message_type||'' }">${ this.message||'' }</p>

		</form>
		`
	}
	// #region – teacher 

	formTemplate(){
		if( this.selected_tab === 1){
			//log('warn', 'return student template')
			return this.studentFormTemplate()
		}

		/// @invalid='${ e => e.target.setCustomValidity( this.$email_format) }'
		return this.form==='signin' ? this.formSignin() : this.formSignup()

		const verified = this.user && this.user.emailVerified
		//// SIGN IN ////
		return (
			!this.user ?
			html`
			<form novalidate class='auth-form fadein' spellcheck="false">

				<div class='auth-inputs' flow='col top'>

					<!-- placeholder needs not be empty (CSS is using :placeholder-shown) -->
					<label for='user-email-input'>${ this.$email }</label>
					<input type='email' id='user-email-input' required placeholder=' '
						autocomplete='username email' 
						pattern='\\S+@\\S+?\\.\\S{2,}'
						value=${ this.user_email || '' }
						@input=${ this.onEmailInput }
						>
					<!-- .value=${ this.user_password || '' } -->
					<label for='user-password-input'>${ this.$password }</label>
					<input id='user-password-input' placeholder=' '
						
						type=${ this.show_password ? 'text':'password' }
						autocomplete='current-password' required
						pattern='.{6,}'
						@input=${ this.onPasswordInput }
						@keydown=${ this.signinOnEnter }
						@invalid=${ this.onInvalid }>

					<label for='user-password-input2'>${ this.$password_again }</label>
					<input id='user-password-input2' placeholder=' '
						
						type=${ this.show_password ? 'text':'password' }
						autocomplete='current-password' required
						pattern='.{6,}'
						@input=${ this.onPasswordInput }
						@keydown=${ this.signinOnEnter }
						@invalid=${ this.onInvalid }>



				</div>

			</form>`:
			//// SIGN OUT ////
			html`
			<div id='signout-form' class='fadein' flow='col'>
				
				<!-- <div id='user-email-display' flow='col' class=${ verified ? '' : 'unverified' }>
					${ this.user_email || '@' }
					<small>[adresse ${ verified ? '' : 'non-'}vérifiée]</small>	
					<button class='white bold small' @click=${ this.signOut }>${ this.$signout||'??' }</button>
				</div> -->




			</div>`
		)
	}

	subsTemplate(){
		//!! subscribe here
		return this.user_data && !this.user_subscribed ? 
			html`
			<div class='text-center'>
				<!-- <p>Abonnez-vous <a disabled href="#">ici</a></p> -->
				<!-- <p>L'abonnement vous permet de gérer un accès pour vos élèves</p> -->
			</div>`

		: this.user_data && this.user_subscribed ? 
			html`<p><button id='show-students' @click=${this.onClickShowStudents}>${this.$show_students}</button></p>`
			// /// manage students here ?
	
		// : this.user ?
		// 	html`<p>Chargement des données de votre compte…</p>`

		: ''
	}

	onClickShowStudents( e){
		if( !app.authentified || this.show_popup_stats || this.show_popup_restrictions)
			return
		this.students_manager_opened = true
		
	}

	signUp( e){
		this.show_password = false
		if( q('form.signup').reportValidity()){
			const confirm_password = this.q('#user-password-input2').value
			//log('check', 'user_password VS confirm_password:', this.user_password, confirm_password)
			
			if( this.user_password === confirm_password){
				this.firebase.auth()
					.createUserWithEmailAndPassword( this.user_email, this.user_password)
					/// THEN => ONAUTHCHANGED
					.then( () => {
						this.just_signed_up = true
						this.message = 
						this.message_type = 
						//this.register_user_password = 
						this.user_password = ''
						this.send_email_verification = true
						q('#btn-ok').waiting = false
						this.form = 'signin' /// will hide b/c !!user
					})
					.catch( err => {
						this.message = this.getString( err.code)
						this.message_type = 'error'
						q('#btn-ok').waiting = false
					})
			}
			else {
				DEBUG && log('err','passwords do not match')
				this.message = this.getString('passwords-do-not-match')
				this.message_type = 'error'
				//this.register_user_password = ''
				//this.user_password = ''
				q('#btn-ok').waiting = false
			}
		}
		else {
			q('#btn-ok').waiting = false
		}
	}

	signIn( e){
		this.show_password = false
		if( q('form.signin').reportValidity()){

			this.firebase.auth()
				.signInWithEmailAndPassword( this.user_email, this.user_password)
				/// THEN => ONAUTHCHANGED, active_section = scenes
				.then( () => {
					this.message = 
					this.message_type = 
					this.register_user_password = 
					this.user_password = ''

					this.student_data = null
					this.prevent_auto_signin = true

					//this.signOutStudent()
				})
				//// CANNOT SIGN IN
				.catch( err => { 
					log('err', 'FIREBASE ERROR', err.code, err.message)
					this.message = this.getString( err.code) || err.code /// this['$'+err.code]
					this.message_type = 'error'
					this.user_password = ''
				})
		}
		else {
			q('#btn-ok').waiting = false
		}
	}

	signOut( e){
		if( !this.user){
			this.signOutStudent()
			return
		}
		DEBUG && log('check','signout')
		//if( !e) debugger
		//this.waiting = true
		app.authentified = false
		this.firebase.auth().signOut()
			.catch( err => console.log( err))
			.then( () => {
				DEBUG && log('signed out!')
				this.watchingTeacherConnection = 0
				this.signOutStudent()
				this.user = null
				this.user_data = null
				this.user_role = ''
				this.user_email = ''
				this.render()
			})
	}

	signinOnEnter( e){
		if( e.key==='Enter'){
			q('#btn-ok').waiting = true
			e.preventDefault()
			this.signIn()
		}
	}

	signupOnEnter( e){
		if( e.key==='Enter'){
			q('#btn-ok').waiting = true
			e.preventDefault()
			this.signUp()
		}
	}
	
	onInvalid( e){
		e.target.setCustomValidity( this.$password_format)
	}

	onEmailInput( e){
		this.user_email = e.target.value
		this.register_user_password = ''
		this.message = ''
		//this.message_type = ''
		e.target.setCustomValidity('')
	}

	onPasswordInput( e){
		this.user_password = e.target.value
		e.target.setCustomValidity('') 
	}

	togglePasswordVis(){
		// log('err','click')
		this.show_password = !this.show_password
	}

	/// for button-waiting only; only triggers if not .done
	sendEmailConfirmationLink( e){
		const t = e.currentTarget //!! currentTarget is a moving target... (will change); need to store it in a ref
		// log('warn','sending confirmation link,e.currentTarget:', t)
		this.firebase.auth().currentUser.sendEmailVerification().then( () => {
			e.currentTarget.done = true /// button-waiting
			.then( () => log('err','sent email verif email (2)...'))
		})
		.catch( err => {
			this.message = "Une erreur s'est produite, veuillez réessayer de nouveau."
		});
	}

	sendPasswordResetEmail( e){
		
		const email_input = this.q('#user-email-input')

		if( !this.user_email){
			email_input.reportValidity()
			email_input.setCustomValidity( this.getString('no-email'))
		}
		else if( email_input.validity.patternMismatch) {
			email_input.reportValidity()
			/// disable next line to have specific native error about email format (missing @ etc.)
			/// but if missing .com (not natively checked, using pattern), 
			/// the generic message is bof (please respect the required format)
			/// uncomment to have always a custom message (badly formated email adress)
			email_input.setCustomValidity( this.getString('email-format'))
		}
		else /// OK
			this.firebase.auth()
			.sendPasswordResetEmail( this.user_email)
			.then( () => {
				this.message_type = 'success'
				this.message = this.getString( 'password-reset-email-sent')
				email_input.setCustomValidity('') /// in case user sign-in right after and was an error
			})
			.catch( err => {
				log('err', err.code, err.message)
				/// TODO
				//w.setMessage( 'error', string( err.code, 'raw') || err.message)
			})
	}

	// #endregion


	// #region – teacher's students management

	studentsTemplate(){
		/// could contain students for other apps; so we filter them
		DEBUG && log('purple', 'list Students:', this.students)

		return this.students.length ? html`
		<h2>${ app.$title }</h2>
		<section id='students-list'>
			<h3>Élèves (max: ${ this.max_students})</h3>
			<table>
			${ this.students.filter( s => !!s.data.apps[ app_name]).map( s => {
				const stats = s.data.apps[ app_name].stats || ''
				const restrictions = s.data.apps[ app_name].restrictions //|| app.restrictions
				//if( !restrictions) alert ()
				//log('pink','student stats:', stats)
				//stats = stats && JSON .parse( stats) || ''
				return html`
				<tr @click=${this.onClickStudent} .stats=${stats} .student_username=${s.username} .restrictions=${restrictions||null}>
					<td class="section">
						<span>Nom d'élève&thinsp;: </span>
						<span class="name">${ s.data.name }</span>
					</td>
					<td class="section">
						<span>Nom d'utilisateur&thinsp;: </span>
						<span class='username'>${ s.username }</span>
					</td>
					<td><button class='stats small'>Stats</button></td>
					<td><button class="restrictions" ?disabled=${!restrictions}>Restrictions</button></td>
					<td><button class='delete square small'>×</button></td>
				</tr>`
			})}
			</table>
		</section>
		<section flow='col top' class='popup stats scroll layer ${this.stats_modified?'dirty':''} ${this.show_popup_stats?'':'hide'}' >
			<button class='abs close bare' @click=${this.closeStatsPopup}>×</button>
			<h1 flow>${ this.student_username }</h1>
			<header flow='row left' class='line'>
				<span class="scene">Jeu</span>
				<span flow='col' class="col">Sans chrono.<br><small>(&thinsp;bronze, argent, or&thinsp;)</small></span>
				<span flow='col' class="col">Avec chrono.<br><small>(&thinsp;bronze, argent, or&thinsp;)</small></span>
			</header>
			${ this.show_popup_stats && app.statsTemplate( this.student_stats) }
		</section>
		<section flow='col top' class='popup restrictions layer ${this.show_popup_restrictions?'':'hide'}' >
			<button class='abs close bare' @click=${this.closeRestrictionsPopup}>×</button>
			<h1 flow>${ this.student_username || 'no username' }</h1>
			<header class='line'>
				<h2>Cochez les cases pour bloquer l'accès de l'élève aux jeux / niveaux de difficulté.</h2>
				<div flow>
				<span class='scene'></span>
				<span class='level'>Br.</span>
				<span class='level'>Ar.</span>
				<span class='level'>Or</span>
				</div>
			</header>
			<div @click=${this.onClickRestrictions}>
				${ this.show_popup_restrictions && app.restrictionsTemplate( this.student_restrictions) }
			</div>
		</section>`
		:
		''
	}

	/** 
	 * when we open menu-auth: listen in real-time to keep this.students up to date 
	 * either when stats changes
	 * or when we delete a student
	 */ 
	liveStudentsUpdates( val, onReady){
		//
		if( !this.live_students_updates_ready){
			DEBUG && log('warn', 'NOT live_students_updates_ready')
			return
		}
		if( val){
			DEBUG && log('pink', 'liveStudentsUpdates')
			this.students.length = 0
			this.unsubscribeLiveStudents = 
				this.teacher_doc.collection('students')
				.onSnapshot( snapshot => {
					//log('pink', 'snapshot')
					snapshot.docChanges().forEach( change => {

						//log('pink', 'change:', change)

						if( change.type === "added"){ //// runs on the first call
							this.students.push( { username: change.doc.id, data: change.doc.data() })
							this.render()
						}
						else if( change.type === "removed"){
							this.students.splice( this.students.indexOf( this.students.find( s=>s.username === change.doc.id)), 1)
							this.render()
						}
						else if( change.type === "modified" && !this.local_changes){
							//log('pink', 'doc modified; update stats')
							let s = this.students.find( s => s.username === change.doc.id)
							s.data = change.doc.data()
							const stats = s.data.apps[ app_name].stats
							if( typeof stats === 'string')
								this.student_stats = stats && JSON.parse( stats)
							else if( stats)
								this.student_stats = stats
						
							this.stats_modified = true
							setTimeout( e => {
								this.stats_modified = false
							}, 600)
						}
					})
					//onReady && onReady()
				})
		}
		else {
			DEBUG && log('pink', 'unsubscribeLiveStudents')
			this.unsubscribeLiveStudents()
		}
	}

	/**  clicked a student row */
	onClickStudent( e){
		if( e.target.classList.contains('delete')){
			if( !app.popup){
				log('err', 'no popup component in app')
				return
			}
			const to_delete = e.currentTarget.student_username
			app.popup.setMessage(["Effacer cet élève ?", "Il n'aura plus accès à cette application et ses statistiques seront perdues."], ['Annuler', 'OK'])
				.then( answer => {
					if( answer===1){
						DEBUG && log('err','to delete:', to_delete)
						this.teacher_doc.collection('students').doc( to_delete).delete()
						this.teacher_doc.collection('apps').doc( app_name).update({
							num_students: firebase.firestore.FieldValue.increment(-1) 
						}).catch( err => log('err','erreur on decrement:', err))
					}
				})
		}
		else if( e.target.classList.contains('stats')){
			//alert ( JSON.stringify( e.currentTarget.stats, null, 2))
			//// show popup w/ statsTemplate()
			//log('err', 'e.currentTarget.stats:', e.currentTarget.stats)
			if( e.currentTarget.stats && typeof e.currentTarget.stats === 'string')
				this.student_stats = JSON.parse( e.currentTarget.stats)
			else if( e.currentTarget.stats)
				this.student_stats = e.currentTarget.stats
			else
				this.student_stats = {}
			this.student_username = e.currentTarget.student_username
			//log('err', 'this.student_stats:', this.student_stats)
			this.show_popup_stats = true
		}

		else if( e.target.classList.contains('restrictions')){
			/// show a restrictions editor
			this.student_username = e.currentTarget.student_username
			this.student_restrictions = e.currentTarget.restrictions
			this.show_popup_restrictions = true
		}
	}

	/** resetting a student's stats for a scene */
	resetStats( scene){
		this.local_changes = true
		const app_data = this.students.find( s => s.username === this.student_username).data.apps[ app_name]
		/// string
		const stats = app_data.stats && JSON.parse( app_data.stats) || {}
		//log('err', 'stats:', stats)
		stats[ scene] =
		this.student_stats[ scene] = {
			'sans-chrono': [
				{ good: 0, total: 0 },
				{ good: 0, total: 0 },
				{ good: 0, total: 0 },
			],
			'avec-chrono': [
				{ good: 0, total: 0 },
				{ good: 0, total: 0 },
				{ good: 0, total: 0 },
			]
		}
		app_data.stats = JSON.stringify( stats)

		//return
		this.teacher_doc.collection('students').doc( this.student_username)
			.update({
				[`apps.${app_name}.stats`]: JSON.stringify( this.student_stats),
			})
			.then( () => { /// regen ALL? list
				this.local_changes = false
				this.render()
			})
	}

	/** editing a student's restrictions */
	onClickRestrictions( e){
		if( e.target.classList.contains('level')){
			const level = e.target.level-1
			const scene = e.target.parentElement.scene
			const checked = e.target.dataset.checked
			//log('check', 'scene, level, checked:', scene, level, checked)

			const current = this.student_restrictions[ scene][ level]
			/// if clicked X, reset all to false 
			/// else set all according to clicked level; ex: level 2 => 2 & 3 are false, 1 is true
			if( checked==='true')
				this.student_restrictions[ scene] = [false,false,false]
			else 
				this.student_restrictions[ scene] = level===0 ? [true,true,true] : level===1 ? [false,true,true] : [false,false,true]
			
			this.render()
			//!! we buffer these changes and write all only once when closing this popup...
		}
	}

	closeStatsPopup( e){
		this.show_popup_stats = false
	}

	closeRestrictionsPopup(){
		this.local_changes = true /// prevents re-updating stats on Change
		this.teacher_doc.collection('students').doc( this.student_username).update({
			[`apps.${app_name}.restrictions`]: this.student_restrictions
		})//!catch
		.then( () => {
			//this.student_username = ''
			this.student_restrictions = null
			this.local_changes = false
		})
		this.show_popup_restrictions = false
	}

	// #endregion


	// #region – student

	studentFormTemplate(){
		//log('pink', 'this.student_name:', this.student_name)
		const teacher_email = chain( this.student_apps.apps[ app_name], 'teacher') || ''
		//this.student_apps.apps[ app_name]?.teacher || ''
		return !this.student_data ? 
		html`
		<form novalidate class='signin student' spellcheck="false">

			<div flow='row' class='input email'>
				<div flow class='icon abs left'>${useSVG('envelope')}</div>
				<!-- <label for='teacher-email'>${ this.$teacher_email }</label> -->
				<input id='teacher-email' required
					type='email' 
					pattern='\\S+@\\S+?\\.\\S{2,}'
					placeholder=${ this.$teacher_email }
					value=${ teacher_email }>
			</div>

			<div flow='row' class='input'>
				<div flow class='icon abs left'>${useSVG('android-person','person','xMidYMid meet')}</div>
				<input id='student-name' type='text' required
					placeholder=${ this.$student_name } 
					@keydown=${ this.onStudentNameKey }
					.value=${ this.student_name||'' }>
			</div>
			${
				this.form==='signin' ? html`
				<div flow='row' class='input code'>
					<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
					<input type='text' required
						id='student-code-input'
						@keydown=${ this.signinStudentOnEnter }
						placeholder=${this.$student_code}>
				</div>`
				: ''
			}

			<button-waiting id='btn-ok' color=''
				.waiting=${ this.waiting }
				aria-label=${ this.$connect }
				@click='${ this.signInStudent }'
				>
				${ useSVG('fat-arrow-right2','','none') }
			</button-waiting>

			<p flow id='auth-message' class="${ this.message_type||'' }">${ this.message||'' }</p>

		</form>` : 
		''
	}
	// @input=${ this.onStudentCodeInput }
	// @invalid=${ this.onInvalid }
	// @input=${ this.onStudentNameInput }

	signInStudent( e){ // also for signup
		if( q('form.student').reportValidity()){ 
			this.student_name = q('#student-name').value.trim()
			const teacher_email = q('#teacher-email').value.trim()
			const safe_student_name = this.student_name.replace(/\./g, '').trim().toLowerCase()
			const app_name = stage.app_name
			this.teacher_doc = this.firestore.doc( `teachers/${ teacher_email }`)
			const app_doc = this.teacher_doc.collection('apps').doc( app_name)
			app_doc.get().then( doc => {
				if( doc && doc.exists){
					let app_data = doc.data()
					//let student_doc
					this.max_students = app_data.max_students
					this.num_students = app_data.num_students

					if( this.form==='signin'){
						//!!? student could not be registered for THIS app...
						//!!? we need then to create the doc

						this.student_name = safe_student_name//.slice(0,-9)
						this.student_password = this.q('#student-code-input').value //safe_student_name.slice(-8)
						this.student_username = safe_student_name + '#' + this.student_password
						//log('check', 'now values:', this.student_name, this.student_password, this.student_username)
						this.student_doc = this.teacher_doc.collection('students').doc( this.student_username)
						this.student_doc.get()
							.then( doc => {
								if( doc && doc.exists){
									this.student_data = doc.data() //// name, apps/app/restrictions|stats 

									//// NO DATA FOR THIS APP, CREATE IT
									if( !this.student_data.apps[ app_name]){
										//log('warn', 'no student data', )
										const s = chain(app, 'avail_restrictions', 'scenes')
										const student_data = {
											apps: {
												[app_name]: {
													stats: {},
													/// array vals to object keys, all = false (allowed by default)
													restrictions: s && s.reduce( (cumul, item) => (cumul[ item] = [false,false,false], cumul), {}) || {}
														//app?.avail_restrictions?.scenes
												}
											}
										}
										this.student_doc.set( student_data, { merge: true }).catch( err => {
											//alert ( 'error setting student doc')
											log('err', 'error setting student doc:', err)
										}, {merge: true}) /// data for other apps might exist; don't overwrite!

										this.student_data = student_data /// useful?
										this.stats = student_data.apps[ app_name].stats
										this.restrictions = student_data.apps[ app_name].restrictions
										/// then catch
									}
									else {
										this.stats = this.student_data.apps[ app_name].stats
										this.restrictions = this.student_data.apps[ app_name].restrictions
										//log('ok', 'got stats:', stats)
									}

									//// UPDATE; to reuse for auto-signin, student_apps is only used locally
									if( !this.student_apps.apps[ app_name])
										this.student_apps.apps[ app_name] = { teacher: teacher_email }
									else
										this.student_apps.apps[ app_name].teacher = teacher_email
									
									this.prevent_auto_signin = false
									this.open = false
									app.onStudentDataReady && app.onStudentDataReady( this.student_data, this.stats, this.restrictions)

									this.watchStudentDoc()
								}
								else {
									//! No student; bad name / pass
									// this.student_name = ''
									// this.student_username = ''
									//alert ( "Ce nom d'utilisateur n'est pas enregistré : " + this.student_username)
									app.popup.setMessage(["Ce nom d'utilisateur n'est pas enregistré : ", this.student_username],["OK"])
									q('#btn-ok').waiting = false

								}
							})
							.catch( err => {
								log('err','error get student_doc:', err)
								//if( stage.is_iOS) alert ( err)
							})
					}
					// student signup
					else if( app_data.num_students < app_data.max_students){
						// NEW student 
						// make sure student doc doesn't already exists
						this.teacher_doc.collection('students').where("name", "==", safe_student_name).get()
							.then( querySnapshot => {
								this.student_doc = null
								querySnapshot.forEach( doc => { /// will be only one doc
									DEBUG && log('pink', 'stud:', doc.id, doc.data().name)
									this.student_doc = doc
								})

								if( this.student_doc){
									//let d = this.student_doc?.data() || 'no data'
									DEBUG && log('pink', 'Already registered')
									app.popup.setMessage(["Ce nom est déjà enregistré", "Cliquez sur 'Connexion' pour vous connecter "],['OK'])
									q('#btn-ok').waiting = false
								}
								else {
									DEBUG && log('pink', 'CREATING NEW STUDENT DOC' )
									this.student_name = safe_student_name
									this.student_password = generatePassword()
									this.student_username = safe_student_name + '#' + this.student_password
									//// create
									this.student_apps.apps[ app_name] = { teacher: teacher_email }
									this.prevent_auto_signin = false
									this.createStudentDoc( app_doc)
									++this.num_students /// useful?
								}
							})
					}
					else {
						//alert ("Erreur: Le maximum d'élèves est atteint (" + app_data.max_students + ")")
						app.popup.setMessage("Le maximum d'élèves est atteint ("+app_data.max_students+")", ['OK'])
						q('#btn-ok').waiting = false
						//! ERROR MESSAGE
					}
				}
				else {
					log('err', 'No app_doc => no teacher or not subscribed', teacher_email, app_name)
					///alert ("L'enseignant(e) n'est pas abonné(e) à cette application ou n'est pas enregistré(e) à cette adresse courriel.")
					app.popup.setMessage("L'enseignant(e) n'est pas abonné(e) à cette application<br>ou l'adresse courriel est erronée.", ['OK'])
					q('#btn-ok').waiting = false
					//! ERROR MESSAGE
				}
			})
		}
		else {
			q('#btn-ok').waiting = false
		}
	}

	signOutStudent( e){
		this.student_data = null
		this.student_username =
		this.student_name = ''
		this.prevent_auto_signin = true
		//debugger
		if( stage.app_name === 'tomathina')
			location.reload() //!! required otherwize weird things happen!!
	}

	onStudentNameKey( e){
		DEBUG && log('check', 'key')
		if( /\s/.test( e.key)){
			DEBUG && log('check', 'space')
			e.preventDefault()
			//this.student_username =
			this.student_name = (e.target.value + '_') 
			DEBUG && log('check', 'this.student_name:', this.student_name)
			this.render()
			return false
		}
		//return true
	}

	signinStudentOnEnter( e){
		/// prevent space in name; replace by underscore

		if( e.key==='Enter'){
			q('#btn-ok').waiting = true
			e.preventDefault()
			this.signInStudent()
		}
	}

	/// runs after new student, auto signin or manual signin
	/// live listener to refresh page after either student is deleted or some stats have been reset
	watchStudentDoc(){
		this.student_doc.set({ connected: false },{ merge:true })

		this.student_doc.onSnapshot( doc => {
			/// bypasss if change is local (when updating stats)
			if( this.local_changes) 
				return

			const conn = doc.data().connected
			//return
			//// skip first call (instant)
			if( !this.student_doc_watched){
				//log('err', 'first call, conn:', conn)
				this.student_doc_watched = true
				this.watching_student_connection = 1
				this.student_doc.set({ connected:true },{ merge:true })
			}
			else if( this.watching_student_connection === 1){
				//log('err', 'second call, conn:', conn)
				this.watching_student_connection = 2
				return
			}
			else if( conn === false){ //!! someone else connected
				//log('err', 'conn is false, signout student')
				//debugger
				this.signOutStudent()
			}
			else {  /// subsequent times, if teacher modifies doc
				//log('err', 'conn is true')
				//debugger
				/// check if student have been deleted ?? each time stats change...
				//location.reload()
			}
		})
	}

	createStudentDoc( app_doc){

		this.student_doc = this.teacher_doc.collection('students').doc( this.student_username)
		const s = chain(app, 'avail_restrictions', 'scenes')
		this.student_data = {
			name: this.student_name,
			apps: {
				[app_name]: {
					stats: {},
					restrictions: s ? s.reduce( (cumul, item) => (cumul[ item] = [false,false,false], cumul), {}) : {}
				}
			}
		}

		this.student_doc.set( this.student_data)
			.then( () => {
				this.open = false
				this.stats = this.student_data.apps[ app_name].stats
				this.restrictions = this.student_data.apps[ app_name].restrictions
				app.onStudentDataReady && app.onStudentDataReady( this.student_data, this.stats, this.restrictions)
			})
		
		//// increment num_students
		/// note: statics are not on instance of firebase but the imported object (top level firebase)
		app_doc.update({
			num_students: firebase.firestore.FieldValue.increment(1)
		})
		.then( () => {
			DEBUG && log('ok', 'increment num_students success')
			this.watchStudentDoc()
		})
		.catch( err => {
			log('err', 'app_doc increment update error:', err)
			app.popup.setMessage("L'enseignant n'est pas abonné à cette application.", ['OK'])
		})
	}

	// onStudentNameInput( e){
	// 	this.student_username = e.target.value
	// 	log('warn', 'student_username modified:', this.student_username)
	// }

	/// may be called by an app in student mode after adding stats
	updateStats(){
		/// student app is listening for changes in case is deleted or stats are reset => app is refreshed
		/// to prevent refresh =>
		this.local_changes = true
		this.student_doc.update( {
			[`apps.${app_name}.stats`]: JSON.stringify( this.stats)
		})
		.then( () => {
			this.local_changes = false
		})
	}

	// #endregion
}


AuthMenu.properties = {
	students_manager_opened: {
		value: false,
		watcher( val){
			this.classList.toggle('managing-students', val)
			/// live update
			this.liveStudentsUpdates( val)
		}
	},
	form: 'signin',
	open: {
		value: false,
		class: 'open',
		watcher( val){
			app.opened_menu = val&&'auth'||''
		}
	},
	message: { value: '', watcher( val){ if( !!val){ this.waiting = false }}},
	waiting: { 
		value: '', 
		watcher( val){ 
			//log('info','waiting changed:', val); 
			if( !!val){ this.message = '' }
		}},
	show_password: false,
	user_email: {
		value: '',
		stored: true
	},
	user_password: '',
	user_data: null,
	selected_tab: {
		value: 0,
		//stored: true, 
		// init_watcher: true,
		// watcher( val){
		// 	this.student_signin_mode = val===1

		// }
	},
	access_level_label: '',
	subscriptions: null,
	// teacher_email: { value:'', stored:true },
	//student_name: { value:'', stored:true },
	//student_input_name: { value:'', stored:true },
	student_username: { value:'', stored:ALLOW_AUTO_SIGNIN },
	//student_password: { value:'', stored:false },
	students: [],
	student_data: null,
	//// local only
	student_apps: {
		value: {
			name: '',
			password: '',
			username: '',
			apps: {
				// tomathina: {
				// 	teacher: 'joserouxx@gmail.com'
				// },
				// visionneuse: {
				// 	teacher: 'joseroux@outlook.com'
				// }
			}
		},
		stored: true
	},
	prevent_auto_signin: {
		value: false,
		stored: true
	},
	show_popup_stats: false,
	show_popup_restrictions: false,
	stats_modified: false
	
	// stats: {
	// 	value: null,
	// 	watcher( val){
	// 		if( !this.student_doc){
	// 			log('err', 'no this.student_doc')
	// 			return
	// 		}
	// 		//log('pink', 'stats:', val)

	// 	}
	// }
}
///Pensez à regardez dans la section pourriels (spam) si vous ne l'avez pas reçu promptement.
///  If you haven't received this email, make sure to check your spam folder.
AuthMenu.strings = {
	en: {
		'student-code': 'Access code',
		'email': "Email",
		'password': "Password",
		'password_again': "Confirm password",
		'please_verify_email': "Verify<br>your email address",
		'verification-email-sent':
			"An email has been sent to you – please verify your email address by clicking on the link provided.",
		'password-reset-email-sent': "You will soon receive an email with a reset link.",
		'forgot-password': "Forgotten password",	
		'forgot-password-tip': "We'll send you an email to change your password.",	
		'connect': "signin",
		'signup': "signup",
		'connected': "Signed in",
		'passwords-do-not-match': ">The two passwords do not match",
		'email-format': "Email address is badly formated",
		'password-format': "6 characters minimum",
		'no-email': "Missing email address",
		/// ERRORS
		'auth/wrong-password': "Wrong password",
		//'auth/user-not-found': "<p>Please confirm your password to create a new account, or correct the email address if you're already registered.</p>", 
		'auth/email-already-in-use': "Email already registered",
		'auth/user-disabled': "Account disabled",
		'auth/internal-error': "Server error",
		'is-student': "I am a student",
		'signout': "Sign out",
		'account': "Account",
		'subscribe': "Subscription",
		//'show-students': "Students",
		'goto-apps': "All our apps",
		'account': "My account",
		show_students: "Show registered students",
		'student_name': "Student's name",
		'teacher_email': "Teacher's email",
	},
	fr: {
		'student-code': "Code d'accès",
		'email': "Courriel",
		'password': "Mot de passe",
		'password_again': "Confirmez le mot de passe",
		'please_verify_email': "Confirmez<br>votre adresse courriel",
		'verification-email-sent':
			"Vous recevrez un courriel d'ici peu,<br>veuillez cliquer sur le lien qu'il contient afin de confirmer votre adresse courriel.",
		'password-reset-email-sent': "Vous recevrez un courriel contenant un lien de réinitialisation.",
		'forgot-password': "Mot de passe oublié",	
		'forgot-password-tip': "Un courriel vous sera envoyer pour changer votre mot de passe.",		
		'connect': "Connexion",
		'signup': "Enregistrement",
		'connected': "Connecté",
		'passwords-do-not-match': ">Les deux mots de passes ne sont pas identiques",
		'email-format': "L'adresse courriel n'est pas bien formatée.",
		'password-format': "Minimum de 6 caractères",
		'no-email': "Adresse courriel manquante",
		/// ERRORS
		'auth/wrong-password': "Mot de passe non valide",
		//'auth/user-not-found': "<p>Afin de créer votre nouveau compte, veuillez confirmer votre mot de passe<br>ou corrigez votre adresse courriel si vous êtes déjà enregistré(e).</p>",
		'auth/email-already-in-use': "Cette adresse courriel est déjà enregistrée",
		'auth/user-disabled': "Compte désactivé",
		'auth/internal-error': "Erreur du server",
		'is-student': "Je suis un(e) élève",
		'signout': "Déconnexion",
		'account': "Compte",
		'subscribe': "Abonnement",
		//'show-students': "Élèves",
		'goto-apps': "Toutes nos applications",
		'home': "Voir toutes les apps",
		'account': "Mon compte",
		'student_name': "Nom de l'élève",
		'teacher_email': "Courriel de l'enseignant(e)",
		show_students: "Afficher les élèves inscrits",
	}
}

define( 'menu-auth2', AuthMenu, ['popup-full'])