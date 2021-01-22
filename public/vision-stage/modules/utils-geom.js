//import log from '../z-console.js'
import { equiv } from './utils-core.js'
import { matchDecimalFraction } from './utils-extra.js'

export function distance( ptA, ptB){
	let a = ptA.x - ptB.x,
			b = ptA.y - ptB.y
	return Math.sqrt( a*a + b*b)
}

export function getPolygonCentroid( points){
	let x = 0, y = 0, i, j, f, point1, point2
	for( i = 0, j = points.length - 1; i < points.length; j = i, i += 1){
			point1 = points[i]
			point2 = points[j]
			f = point1.x * point2.y - point2.x * point1.y
			x += (point1.x + point2.x) * f
			y += (point1.y + point2.y) * f
	}
	f = getPolygonArea( points) * 6
	
	return { x: Math.abs(x/f), y: Math.abs(y/f) }
}

export function getPolygonArea( points) {
	//if( !points) debugger
	// log('err','--getPolygonArea, POINTS:', points)
	
	let total = 0, pt, next_pt, len = points.length
	for( let i = 0; i < len; i++){
		pt = points[ i]
		next_pt = points[ (i+1) % len]
		let addX = pt.x 
		let addY = next_pt.y 
		let subX = next_pt.x 
		let subY = pt.y
		total += (addX * addY * 0.5)
		total -= (subX * subY * 0.5)
	}
	return Math.abs( total)
}

export function isPointOnSegment( start, check, end, allow_on_point=false) {
	let d
	if( !allow_on_point && (equiv( start, check) || equiv( end, check)))
		return false
	let A = distance( check, start),
			B = distance( check, end),
			C = distance( start, end)
	if( B*B > A*A + C*C)
    d = A
	else if( A*A > B*B + C*C)
    d = B
	else {
    let s = (A+B+C)/2
    d = 2/C * Math.sqrt(s*(s-A)*(s-B)*(s-C))
	}
	return d < 1
	// return (C.y - A.y) * (B.x - A.x) === (C.x - A.x) * (B.y - A.y)
}

export function getArea( ptA, ptB, ptC){
	let A = distance( ptB, ptA),
			B = distance( ptB, ptC),
			C = distance( ptA, ptC),
			s = (A+B+C)/2
	return Math.sqrt( s*(s-A)*(s-B)*(s-C)) 
}

export function removeMidPoints( points){
	for( let i=points.length-1; i>=0; i--){
		let pt_start = points[i]
		let pt_end = points[(i+2)%points.length]
		let pt_mid = points[(i+1)%points.length]
		if( isPointOnSegment( pt_start, pt_mid, pt_end, false)){
			//log('rem pt_mid:', pt_mid)
			points.splice( (i+1)%points.length, 1)
		}
	}
}

export function angle( ptC, ptB) {
  let dy = ptB.y - ptC.y,
  		dx = ptB.x - ptC.x,
  		theta = Math.atan2( dy, dx) // range (-PI, PI]
  theta *= 180 / Math.PI + 180// rads to degs, range (-180, 180]
  return theta
}

export function unique( arr, compare_objects=false){
	if( !compare_objects)
		return Array.from( new Set( arr))
	else {
		let out = []
		// b won't be compared to a..., so dupes will be added once
		for( let i=0; i<arr.length; i++){
			let a = arr[i]
			let is_unique = true
			for( let j=i+1; j<arr.length; j++){
				let b = arr[j]
				if( equiv( a, b)){
					is_unique = false
					break
				}
			}
			if( is_unique)
				out.push( a)
		}
		return out
	}
}

export function mergePoints( ptsA, ptsB){

	/// 1. FIND COMMON POINTS INDICES FOR EACH GROUP
	let common = { a: [], b: [] }
			
	for( let i=0; i < ptsA.length; i++){
		for( let j=0; j < ptsB.length; j++){
			let ptA = ptsA[ i],
					ptB = ptsB[ j]
			if( equiv( ptA, ptB)){
				common.a.push( i)
				common.b.push( j)
			}
		}
	}

	/// common INDICES NEED TO BE IN ORDER TO FIND LAST SEQUENTIAL VALUE 
	
	//log( 'ptsB:', JSON.stringify( ptsB))
	
	let ptsA_wrapped, ptsB_wrapped

	/// USE CROSSING POINTS AS COMMONS
	if( common.a.length < 2){

		for( let i=0; i<ptsA.length; i++){
			let ptA = ptsA[ i]
			for( let j=0; j < ptsB.length; j++){
				let ptB1 = ptsB[ j],
						ptB2 = ptsB[ (j+1)%ptsB.length]
				if( isPointOnSegment( ptB1, ptA, ptB2, false)){
					common.a.push( i)
					common.b.push( j, (j+1)%ptsB.length)
				}
			}
		}
		for( let i=0; i<ptsB.length; i++){
			let ptB = ptsB[ i]
			for( let j=0; j < ptsA.length; j++){
				let ptA1 = ptsA[ j],
						ptA2 = ptsA[ (j+1)%ptsA.length]
				if( isPointOnSegment( ptA1, ptB, ptA2, false)){
					common.b.push( i)
					common.a.push( j, (j+1)%ptsA.length)
				}
			}
		}

		if( common.a.length < 2 && common.b.length < 2)
			return null

		if( common.a.length)//
			common.a = unique( common.a).sort( (a,b) => a-b)
		else 
			ptsA_wrapped = ptsA

		if( common.b.length)
			common.b = unique( common.b).sort( (a,b) => a-b)
		else 
			ptsB_wrapped = ptsB
	}
	else
		common.b.sort( (a,b) => a-b)

	//log('info','common:', JSON.stringify( common))

	/// 2. SHIFT (WRAP) POINTS ARRAYS SO THE COMMON POINTS ARE AT START AND END
	if( !ptsA_wrapped){
		let ptsA_wrap_index = findLastSeqVal( common.a)
		ptsA_wrapped = wrapArrayAt( ptsA, ptsA_wrap_index)
	}
	if( !ptsB_wrapped){
		let ptsB_wrap_index = findLastSeqVal( common.b)
		ptsB_wrapped = wrapArrayAt( ptsB, ptsB_wrap_index)
	}

	/// REMOVE ALL COMMON POINTS BETWEEN FIRST AND LAST
	if( common.a.length > 2){
		let extra = common.a.length - 2
		ptsA_wrapped = ptsA_wrapped.slice( 0, -extra)
	}
	if( common.b.length > 2){
		let extra = common.b.length - 2
		ptsB_wrapped = ptsB_wrapped.slice( 0, -extra)
	}

	//log('check','ptsA_wrapped:', JSON.stringify( ptsA_wrapped))
	//log('ptsB_wrap_index:', ptsB_wrap_index)
	//log('check','ptsB_wrapped:', JSON.stringify( ptsB_wrapped))
	let merged = ptsA_wrapped.concat( ptsB_wrapped)
	return merged
}

/* export function gluePolygon( target){
	
	let sel = target.classList.toggle('selected')
	
	if( sel){ // target is selected ( not unselected)
		if( selected_polygons.length){
			log('glue')
			let p1 = selected_polygons[0],
					p2 = target,
					ia = polygons.indexOf( p1),
					ib = polygons.indexOf( p2),
					ptsA = data.polygons[ ia], 
					ptsB = data.polygons[ ib]
			// use clone so original is not affected
			// (if success, we need to store the unmodified state for undo)
			let merged = mergePoints( clone(ptsA), clone(ptsB))
			
			if( !merged){
				target.classList.remove('selected')
				return
			}
			pushUndo()
			merged = unique( merged, true)
			removeMidPoints( merged)

			log('merged final:', JSON.stringify( merged))

			p1.classList.remove('selected')
			p2.classList.remove('selected')

			// REMOVE PTS A & B (highest first so index of other (lowest) is still valid), PUSH MERGED
			let lo, hi
			if( ia < ib){
				lo = ia
				hi = ib
			}
			else {
				lo = ib
				hi = ia
			}
			data.polygons.splice( hi, 1)
			data.polygons.splice( lo, 1, merged)
			
			selected_polygons.length = 0
			update()
		}
		else {
			selected_polygons.push( target)
		}
	}
	else 
		selected_polygons.length = 0
} */

/// MANAGE POSSIBLE SPLITTING; operates on data.polygons
export function cutPolygon( x, y, polygons_data, app){
	//log('err','cutPolygon')
	let nope = false
	let sct = {x,y}
	//let s = 1
	let first_click = !app.candidates.length
	//log('err','cut, first click:', first_click, sct)
	for( let p of polygons_data){
		
		let pts = p.points

		for( let i=1; i <= pts.length; i++){

			let ptA = pts[ (i-1) % pts.length],
					ptB = pts[ i % pts.length],
					int = isPointOnSegment(ptA, sct, ptB, true) /// can be on point

			if( int){
				//log('ok', 'on segment', )

				/// FIRST POINT, store group which line intersects
				if( first_click && (!app.section_pts.length || !app.candidates.find( grp => grp===pts))){ 
					//log('err','STORE FIRST POINT')
					if( !app.section_pts.length){
						app.section_pts.push( roundPoint(sct))
						//is_corner = equiv( int, ptA) || equiv( int, ptB)
					}
					app.candidates.push( pts)
					app.update( app.candidates)
					//app.setGuideCoor( app.dot2, sct)
					app.dot2_point = sct
					//console.warn('Set dot2_point:', sct)
					app.grp_first = ptA
					app.render()
					break
				}
				else { /// SECOND POINT
					let candidate = app.candidates.find( grp => grp===pts)
					//log('err','SECOND POINT')//, !!candidate, !same_line)

					if( !!candidate){ //&& !same_line

						app.section_pts.push( roundPoint( sct))
						let splitted = splitPolygon( pts, app.section_pts[0], app.section_pts[1])
						if( splitted && splitted.every( arr => arr.length)){
							app.pushUndo()
							//log('err', 'p:', p)
							let selected = p.selected
							polygons_data.splice( polygons_data.indexOf( p), 1)
							polygons_data.push( ...splitted.map( p => ({ points:p, selected }) ))
							//log('splitted:', splitted)
							//log('successful split, data.polygons:', JSON.stringify(data.polygons))
						}
						else {

							//console.warn( 'failed splitted:', splitted)

						}
						app.resetInteraction( false)
						return !!candidate
					}
					else { /// START OVER
						nope = true
						// log('warn','START OVER')
					}
				}
			}
			//else log('err', 'not on segment',ptA, sct, ptB)
		}
	}
	if( nope) app.resetInteraction()
	return false
}

// vals are index reference, returns the last that is sequencial
export function findLastSeqVal( arr){

	//warn( 'findLastSeqVal in:', arr)
	let last = null
	for( let i=0; i<arr.length; i++){
		let val = arr[ i]
		let next = arr[ i+1]
		if( next !== null && next !== val+1){
			//log('return val:', val)
			return val
		}
		last = val
	}
	//log('return last:', last)
	return last
}

// use findLastSeqVal to find at which index to wrap at
export function wrapArrayAt( arr, index){
	//console.log('wrap at:', index)
	let start = arr.splice( 0, index)
	return arr.concat( start)
}

function roundPoint( pt){
	//log('ROUND:',pt)
	return {
		x: Math.round( pt.x *1000) /1000,
		y: Math.round( pt.y *1000) /1000
	}
}

function splitPolygon( points, sA, sB){
	//log( 'SPLIT GROUP:', JSON.stringify(points))
	let one = [], two = []
	let pts = points//JSON.parse( JSON.stringify( points))
	//pts.push( pts[0])
	//log('pts:', pts.length)
	let current, first, first_intersection, sec_intersection, 
			end = pts.length+1
	let finish = false
	//warn('loops:', end)
	for( let i=1; i <= end; i++){
		let ptA = pts[ (i-1)%pts.length],
				ptB = pts[ i%pts.length]
		//warn('A,B:', JSON.stringify( ptA), JSON.stringify( ptB))
		//warn('S:', JSON.stringify( sA), JSON.stringify( sB))
		//let intersect = linesIntersect( ptA.x, ptA.y, ptB.x, ptB.y, sA.x, sA.y, sB.x, sB.y)
		let intersect = isPointOnSegment( ptA, sA, ptB, true) ? sA : isPointOnSegment( ptA, sB, ptB, true) ? sB : null
		//warn('intersect:', intersect)
		if( intersect){
			if( !finish){
				//warn('INTERSECTION LINE ', JSON.stringify( sA), JSON.stringify( sB))
				//warn( 'INTERSECTION PT:', intersect)
				if( !first_intersection) 
					first_intersection = intersect
				else if( equiv(intersect, first_intersection))
					continue
				// else if( !sec_intersection)
				// 	sec_intersection = intersect

				if( !current){ /// FIRST INTERSECTION
					first = ptA
					current = one
					current.push( intersect)
					//log('pushed first intersection to one (NOW CURRENT):', JSON.stringify( intersect))
				}
				else { /// SECOND INTERSECTION; END ONE, START TWO
					let pt = equiv( ptA, intersect) ? ptB : ptA
					current.push( pt, intersect)
					//log('pushed point and last intersection to one:', JSON.stringify( pt), JSON.stringify( intersect))
					current = two
					current.push( intersect)
					//log('pushed last intersection to two (NOW CURRENT):', JSON.stringify( intersect))
					finish = true
				}
			}
		}
		else if( current){ 
			current.push( ptA)
			//log('pushed point A to current:', JSON.stringify( ptA))
		}
		else { // // NOT STARTED YET SO AUGMENT LOOP (WRAP) SO WE CAN REACH THE END
			//pts.push( ptB)
			//warn("AUG")
			if( end>10) return null
			++end
		}
		
		if( ptB == first){
			let pt = equiv( ptB, first_intersection) ? ptA : ptB
			current.push( pt, first_intersection)
			//log('pushed pt and sA to current:', JSON.stringify( pt), JSON.stringify( first_intersection))
			//warn('return one, two:', one, two)
			return [ one, two ]
		}
		else {
			//log('NOT LAST, actual, first:', ptB, first)
		}
	}
	return null
}

export function getPolygonFraction( points, fract_format=false, debug=false){

	const area = getPolygonArea( points) / (100*100)
	let result = matchDecimalFraction( area, debug)
	if( result && result[1][0]>1){
		//log('err', '--area, result:', area, result)
	}
	return fract_format ? (result&&result[1]||[0,0]) : (result&&result[0]||0)
}
export function getPolygonPoints( target){
	const points = []
	for( let i = 0; i < target.points.numberOfItems; i++){
		let {x,y} = target.points.getItem(i)
		points.push( {x,y})
	}
	return points
}
export function closestNumber( num, precision=3){
	/// toFixed rounds last num, so inc by one before and strip it after
	let str = num.toFixed( precision+1).slice(0,-1)
	/// remove very small deviation from .0 that may remain
	str = str.replace('.000', '').replace('.001', '').replace('.002', '')
	//console.log('STR::',str)
	// if deviation is towards 1, remove it also, but then round up (add 1)
	if( str.endsWith('.999')){
		str = str.replace('.999', '')
		return (parseInt( str)+1).toString()
	}
	// strip all trailing 0s after dot
	while( str.includes('.') && str.endsWith('0')) 
		str = str.slice( 0, -1)
	return str
}

/// FORMAT AN ARRAY OF POINTS {X,Y} FOR USE IN SVG POLYGON'S PONITS ATTR
export function getPointsString( pts, scale=1){
	let str = []
	for( let pt of pts){
		let x = pt.x*scale,
				y = pt.y*scale
		//log('info', 'x,y:', x,y)
		str.push( x+','+y)
	}
	//warn('getPointsString:', pts, str)
	return str.join(' ')
}

/** use a string for fraction: will use inverse op to avoid floating ops errors */
export const floor = (num, step=1) => 
	typeof step === 'string' ?
		Math.floor( num * parseInt(step)) / parseInt(step) : //? step is symbolic fraction, e.g. '2' means 1/2
		Math.floor( num / step) * step // step is integer





// function gcd(a, b) {
// 	return (b) ? gcd(b, a % b) : a;
// }
// /** from stack overflow, last resort */
// /** DOES NOT MANAGE PRECISION ERRORS; JUST FINDS ANY (BIG!) FRACTION OR NONE*/
// export const decimalToFraction = _decimal => {
// 	if( _decimal == parseInt(_decimal)){
// 		return [parseInt(_decimal), 1]
// 		/// display: parseInt(_decimal) + '/' + 1
// 	}
// 	else {
// 		let top = _decimal.toString().includes(".") ? _decimal.toString().replace(/\d+[.]/, '') : 0;
// 		let bottom = Math.pow(10, top.toString().replace('-','').length);
// 		if (_decimal >= 1) {
// 			top = +top + (Math.floor( _decimal) * bottom)
// 		}
// 		else if (_decimal <= -1) {
// 			top = +top + (Math.ceil( _decimal) * bottom)
// 		}
// 		let x = Math.abs( gcd( top, bottom))
// 		return [
// 			(top / x),
// 			(bottom / x)
// 		]
// 		//	display: (top / x) + '/' + (bottom / x)
// 		//}
// 	}
// }



// // SORT POINTS BY ANGLE AND REMOVE MID SEGMENT POINTS
// export function cleanPolygon( points, remove_mid=false){
// 	//log('cleanPolygon:', JSON.stringify(points))
// 	let center = getPolygonCentroid( points)
// 	//warn( 'center:',center)
// 	points.sort( ( a, b) => angle( center, a) > angle( center, b))
// 	//log('sorted:', JSON.stringify(points))
// 	if( remove_mid){
// 		for( let i=points.length-1; i>=0; i--){
// 			let pt_start = points[i]
// 			let pt_end = points[(i+2)%points.length]
// 			let pt_mid = points[(i+1)%points.length]
// 			if( isPointOnSegment( pt_start, pt_mid, pt_end)){
// 				log('rem pt_mid:', pt_mid)
// 				points.splice( (i+1)%points.length, 1)
// 			}
// 		}
// 	}
// }
// MANAGE POSSIBLE MERGING
/*
	for polygons sharing 1 or more points (assumed consecutive...)
	- find common points indices for each group and store them
		- using these, each group's array must be shifted so common points are placed at the end
		// - only the first of these is kept; other after are deleted
	- groups are concatenated

	for polygons sharing no points:
	- find 2 intersecting points indices in one group and store them, and the intersected pair
		- using these indices, each group's array is shifted 
			so the 2 intersecting points or interected points are placed one at start and one at the end
	- groups are concatenated


*/