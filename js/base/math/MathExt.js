let MathExt = (() => {
	const toRadians = Math.PI / 180;
	const toDegrees = 180 / Math.PI;
	
	class MathExt {
		static get TO_RADIANS() {return toRadians;}
		static get TO_DEGREES() {return toDegrees;}
		
		//floorRange(13.5, 4) = 12, floorRange(-7.3, 5) = -10
		static floorRange(val, range) {
			return Math.floor(val / range) * range;
		}

		//moduloRangePositive(-7.3, 5) = 2.7, moduloRangePositive(8, 5) = 3
		static moduloPositive(val, range) {
			return val - MathExt.floorRange(val, range);
		}
    	
		//moduloOnePositive(5.25) = 0.25, moduloOnePositive(-5.25) = 0.75
		static moduloOnePositive(val) {
			return val - Math.floor(val);
		}
		
    	static randomBool() {
             return (Math.random() > 0.5);    	
    	}
		
		static getDigitArray(num) {
			const lengthNumber = String(Math.floor(num)).length;
			const arrDigit = new Array(lengthNumber);
			for (let i = 0; i < lengthNumber; i++) {
				arrDigit[i] = Math.floor(num / (Math.pow(10, lengthNumber - i - 1))) % 10
			}
			return arrDigit;
		}
		
		static distanceBetweenTwoPoints(point1, point2) {
			return Math.pow(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2), 0.5);
		}
		
		//różnica kątów ze znakiem (stopnie)
		static getAngleSmallestDifference(angle1, angle2) {
			let diff;
			angle1 = (angle1 + 360) % 360;
			angle2 = (angle2 + 360) % 360;
			if (Math.abs(angle1 - angle2) > 180) {
				if (angle1 < 180) { //angle2 jest większe od 180
					diff = - (angle1 + (360 - angle2));
				} else { //angle1 jest większe od 180
					diff = angle2 + (360 - angle1);
				}
			} else {
				diff = angle2 - angle1;
			}
			return diff;
		}
		
		//różnica kątów bezwzględna (radiany)
		static minDiffAngle(angle1, angle2) {
			angle1 = (angle1 + (Math.PI * 2)) % (Math.PI * 2);
			angle2 = (angle2 + (Math.PI * 2)) % (Math.PI * 2);
			return MathExt.minDiff(angle1, angle2, Math.PI * 2);
		}
		
		
		//2 minDiff 7 w range 8 = 3
		static minDiff(val1, val2, range) {
			const diff = Math.abs(val1 - val2) % range;
			return Math.min(diff, range - diff);
		}
		
		//2 minDiffWithSign 7 w range 8 = -3, 0 minDiffWithSign 1.25 w range 1.5 = 0.25
		static minDiffWithSign(val1, val2, range) {
			let diff = (val1 - val2) % range;
			if (diff != diff % (range / 2))
				diff = ((diff < 0) ? diff + range : diff - range) % range;
			return diff;
		}
		
		//roundPrecision(1.95583, 2);  // 1.96
		static roundPrecision(val, precision) {
			const powPrecision = Math.pow(10, precision);
			return (Math.round(val * powPrecision) / powPrecision);
		}
		
		static equals(val1, val2, precision) {
			return Boolean(MathExt.roundPrecision(val1, precision) == MathExt.roundPrecision(val2, precision));
		}
		
		static equalsWithMarginError(val1, val2, marginError) {
			return (Math.abs(val1 - val2) < marginError);
		}
		
		//długość przeciwprostokątnej
		static hypotenuse(leg1, leg2) {
			return Math.pow(Math.pow(leg1, 2) + Math.pow(leg2, 2), 0.5);
		}
		
		static polarToCartesian(radius, angle) {
			return new Point(radius * Math.cos(angle * Math.PI / 180), radius * Math.sin(angle * Math.PI / 180));
		}
		
		//numChannel; 0-alpha, 1-red, 2-green, 3-blue
		static extractChannel(color, numChannel = 0) {
			let channel = (color >> ((3 - numChannel) * 8)) & 0xFF;
			if (numChannel == 0) channel = (channel || 0xFF) / 255; //alpha równe 0 to jest 1;
			return channel;
		}
		
		static splitRGB(color) {			
			return [color >> 16 & 0xff, color >> 8 & 0xff, color & 0xff];
		}
		
		static joinRGB(arrChannel) {			
			return arrChannel[0] << 16 | arrChannel[1] << 8 | arrChannel[2];
		}
		
		static convertColorHTMLToUint(colorHTML) {
			return Number(colorHTML.replace("#", "0x"));
		}
		
		static addZerosBeforeNumberAndReturnString(num, digitCount) {
			let numStr = String(num);
			while (numStr.length < digitCount) {
				numStr = "0" + numStr;
			}
			return numStr;
		}
		
		static convertColorUintToHTML(color) {
            const arrRGBColor = MathExt.splitRGB(color);
            let colorHTML = "#";
			for (let i = 0; i < arrRGBColor.length; i++) colorHTML += MathExt.addZerosBeforeNumberAndReturnString(arrRGBColor[i].toString(16), 2);
            return colorHTML;
        }
		
		static log2(val) {
			return Math.log(val) * Math.LOG2E;
		}
		
		static log10(val) {
			return Math.log(val) * Math.LOG10E;
		}
	}
    return MathExt;
})();

export default MathExt;