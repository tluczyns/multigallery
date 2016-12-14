export function getElementInsideContainer(idElemContainer, idElemChild) {
    let elem;
    const elems = document.getElementById(idElemContainer).getElementsByTagName("*");
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].id === idElemChild) {
            elem = elems[i];
            break;
        }
    }
    return elem;
}

/*function getElementInsideContainer(idElemContainer, idElemChild) {
    const elem = document.getElementById(idElemChild);
    const parent = elem ? elem.parentNode : {};
    return (parent.id && parent.id === idElemContainer) ? elem : undefined;
}*/

export function isElementInsideContainer(elemContainer, elemChild) {
	const elems = elemContainer.getElementsByTagName("*");
    for (var i = 0; i < elems.length; i++) {
        if (elems[i] == elemChild) return true;
    }
    return false;
}

export function isIdElementInsideContainer(idElemContainer, idElemChil) {
	return (getElementInsideContainer(idElemContainer, idElemChil) != undefined)
}


export function getStyleFromClass(nameClass, elemContainer = undefined) {
	var elem = document.createElement("div");
	//elem.style.display = "none";
	if (elemContainer === undefined) elemContainer = document.body;
	elemContainer.appendChild(elem);
	elem.className = nameClass;
	let style = window.getComputedStyle(elem);
	var objStyle = {};
	for (nameStyleRule of style)
		objStyle[nameStyleRule] = style.getPropertyValue(nameStyleRule); //style[nameStyleRule]
	elemContainer.removeChild(elem);
	return objStyle;
}