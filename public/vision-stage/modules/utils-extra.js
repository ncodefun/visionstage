import log from '../z-console.js'

export function visible( val, ...elements){
	for( let el of elements){
		let element = (typeof el === 'string' ? q(el) : el)
		element && element.classList.toggle('hide', !val)
		if( !element) log('err', 'NO EL:', el)
	}
}
export function getGlobalRect( elem){
	let r = {left:0,top:0,width:0,height:0}
	//let el = elem.parentElement
	while( elem){
		let rect = elem.getBoundingClientRect()
		//log('check', 'elem, rect:', elem, rect.left, rect.top)
		r.left += rect.left
		r.top += rect.top
		elem = elem.parentElement
	}
	//log('check', 'returning rect:', r)
	return r
}
export function incrementColor( color, step){
	const colorToInt = parseInt( color.substr(1), 16),/// Convert HEX color to integer
				nstep = parseInt( step)											/// Convert step to integer
	if( !isNaN( colorToInt) && !isNaN( nstep)){	/// Make sure that color has been converted to integer
			colorToInt += nstep	/// Increment integer with step
			var ncolor = colorToInt.toString(16) /// Convert back integer to HEX
			ncolor = '#' + (new Array(7-ncolor.length).join(0)) + ncolor/// Left pad "0" to make HEX look like a color
			if(/^#[0-9a-f]{6}$/i.test(ncolor)) /// Make sure that HEX is a valid color
			return ncolor
	}
	return color
}

const smoothing = 0.15

const line = (pointA, pointB) => {
	if( !pointA || !pointB) debugger
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}
const controlPoint = (current, previous, next, reverse) => {
  const p = previous || current
  const n = next || current
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}
const bezierCommand = (point, i, a) => {

  // start control point
  const cps = controlPoint(a[i - 1], a[i - 2], point)

  // end control point
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}
const svgPath = (points, command, exclude_first_move=false) => {
  /// build the d attributes by looping over the points
  return points.reduce((acc, point, i, a) => 
    i === 0 ? 
      `M ${Math.round(point[0])},${Math.round(point[1])}` :
      `${acc} ${command(point, i, a)}`
  , '')
}
/// const d = svgPath( points, bezierCommand)

export const smoothPath = (points, exclude_first_move=false) => svgPath( points, bezierCommand, exclude_first_move)


/** */
const DENOMINATORS = [2,3,4,5,6,7,8,9,10,12,14,15,16,18,20,21,24,25,28,30,32,35,36,40,42,48,50,60].reverse()

function generateFractions( denominators){
	let fracts = new Map()
	//let total = 0
	for( let denom of denominators){
		for( let numerator=1; numerator<denom; numerator++){
			let num = numerator / denom
			fracts.set( num, [numerator,denom]) /// later overwrites are wanted
			//total++
		}
	}
	const result = [...fracts].sort( (a,b) => a[0]-b[0] )
	//log('check', 'total:', total, '->', result.length)
	//log('check', result.map( ([dec,fract]) => fract.join('/')))
	return result
}
/** higher level than generate fractions: return an array with also 0 and one at start/end */
function makeFractions( denominators){
	//// also prefix and suffix with 0 and 1 as first and last fractions so they're avail to match
	const fracts = [ [0,[0,1]] ]
	fracts.push( ...generateFractions( denominators) )
	fracts.push( [1,[1,1]] )
	return fracts
}
/*
function setFractionsBase( base){
	//log("check",'setFractionsBase:', base)
	if( !fractions_A){
		fractions_A = FRACTIONS_FILTERED[ base]
		fractions_A_base = base
	}
	else if( base !== fractions_A_base){ /// if base not already used
		fractions_B = FRACTIONS_FILTERED[ base]
		fractions_B_base = base
	}
}*/

let all_fractions

/** returns true if target is a multiple of num AND none of excluded are multiple of base */
export function isMultipleOf( num, base, exclude_bases){
	//exclude_bases = false //? disabled for now
	return num % base === 0 && 
		(!exclude_bases || exclude_bases.every( base => num % base !== 0))
}

/** 
 * this matches the closest decimal number in a list of pre-generated fractions, 
 * each in the form of: [decimal,[numerator,denominator]]
 * so even with a bit of imprecision from calculating areas from points also with possible precision error
 * returns => [decimal, [top, bottom]]
 */
export function matchDecimalFraction( approx_fraction, debug=false){

	if( typeof approx_fraction === 'string')
		approx_fraction = parseFloat( approx_fraction)

	if( !all_fractions){ //// init fractions only on demand
		all_fractions = makeFractions( DENOMINATORS)
		//log('pink', 'all_fractions:', all_fractions.map( f => f[1].join('/')) )
	}
	let result = closestFractionIn( all_fractions, approx_fraction)
	if( !result){
		log('err', 'no match for approx. fraction:', approx_fraction)
	}
	return result
}

/// find the f with smallest diff compared to approx_fraction
function closestFractionIn( fractions, approx_fraction, debug=false){
	if( !fractions) {
		log('err','closestFractionIn -> NO FRACTIONS')
		return null
	}
	let lowest_deviation = 1000, 
			match
	for( let f of fractions){
		let [num,[top,bottom]] = f
		/// how far is the approximation relative to this fraction
		let deviation = Math.abs( num - approx_fraction)
		if( deviation < lowest_deviation){
			lowest_deviation = deviation
			match = f
		}
		else {
			/// we're getting away from the lowest deviation
			break
		}
	}
	//if( debug) log('pink','lowest_deviation:',lowest_deviation)
	return match
}

export function rectFromPoints( pts, round=false){
	let lo_x=100, hi_x=0, lo_y=100, hi_y=0
	for( let pt of pts){
		if( pt.x < lo_x) lo_x = pt.x
		else if( pt.x > hi_x) hi_x = pt.x
		if( pt.y < lo_y) lo_y = pt.y
		else if( pt.y > hi_y) hi_y = pt.y
	}
	//log('warn', '--lo/hi x:', lo_x, hi_x, 'lo/hi y:', lo_y, hi_y)
	if( lo_x===100) debugger
	let r = {
		width: hi_x - lo_x,
		height: hi_y - lo_y,
		x: lo_x,
		y: lo_y
	}
	/// round is useful if we need to compare two rects
	if( round){
		r.x = Math.round( r.x)
		r.y = Math.round( r.y)
		r.width = Math.round( r.width)
		r.height = Math.round( r.height)
	}
	return r
}

export const hitTestRectsPoints = ( a, b, round=false) => {
	//log('err', '--hitTestRectsPoints:', a, b)
	let r1 = rectFromPoints( a, round),
			r2 = rectFromPoints( b, round),
			result = hitTestRects( r1, r2)
			//if( result) log('pink','--touch')
	return result
}
export const hitTestRects = (rect1, rect2) => 
	rect1.x < rect2.x + rect2.width &&
	rect1.x + rect1.width > rect2.x &&
	rect1.y < rect2.y + rect2.height &&
	rect1.y + rect1.height > rect2.y;

export const pointsContained = (source_pts, target_pts) => {
	//let source_rect = rectFromPoints( source_pts)
	let target_rect = rectFromPoints( target_pts)
	//log('pink','--target_rect:', target_rect)
	source_pts.forEach( pt => { if( !rectContainsPoint( target_rect, pt, true)) log('purple','--pt NOT contained:', pt) })
	return source_pts.every( pt => rectContainsPoint( target_rect, pt, true))
	// log('warn', 'source_rect,target_rect:', source_rect, target_rect)
	// rectContains
}

const rectContainsPoint = (rect, pt, round=false) => {
	if( round){
		const eps = 1, mult = 10**eps

		let rX = Math.round( rect.x * mult)-1,
				rY = Math.round( rect.y * mult)-1,
				rH = Math.round( rect.height * mult)+2,
				rW = Math.round( rect.width * mult)+2,
				ptX =  Math.round( pt.x * mult),
				ptY =  Math.round( pt.y * mult)

		let is_contained = rX <= ptX && ptX <= rX + rW && rY <= ptY && ptY <= rY + rH
		if( !is_contained){
			log('check', '--ptX,Y:', ptX, ptY)
			log('check', '--NOT contained in:', rX, rY, rW, rH)
		}
		return is_contained
	}
	else {
		return rect.x <= pt.x && pt.x <= rect.x + rect.width &&
		rect.y <= pt.y && pt.y <= rect.y + rect.height
	}
}