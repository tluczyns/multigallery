export default class OptionsControllerMulti {

	constructor(isSelectSingleOrAllInDimension = 1, isArrow = true, isSwipe = true, isAutoChangeItem = false, timeChangeItemFirstTime = 5000, timeChangeItem = 2500) {
		this.isSelectSingleOrAllInDimension = isSelectSingleOrAllInDimension;
		this.isArrow = isArrow;
		this.isSwipe = isSwipe;
		this.isAutoChangeItem = isAutoChangeItem;
		this.timeChangeItemFirstTime = timeChangeItemFirstTime;
		this.timeChangeItem = timeChangeItem;
	}
	
}