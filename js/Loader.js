var trace;
if (console.log.bind) trace = console.log.bind(console);
else trace = Function.prototype.bind(console.log, console);

String.prototype.toLowerFirst = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

Function.prototype.inheritsFrom = function (parentClassOrObject) { 
	if (parentClassOrObject.constructor == Function) {
		//Normal Inheritance 
		//this.prototype = new parentClassOrObject;
		this.prototype = Object.create(parentClassOrObject.prototype);
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 
//

/**********package base**********/

var base = new function() {

	//class ClassWithDomElement
	var ClassWithDomElement = function(idDomElement) {
		/*try {a.b} catch (e) {
			console.log (e.stack || e.line)
		}*/
		this.domElement = $("#" + idDomElement);
	}
	
	//package math
	var math = new function() {
		
		var MathExt = function() {}
		MathExt.TO_RADIANS = Math.PI / 180;
		MathExt.TO_DEGREES = 180 / Math.PI;
		MathExt.hypotenuse = function(leg1, leg2) {
			return Math.pow(Math.pow(leg1, 2) + Math.pow(leg2, 2), 0.5);
		}
	
		return {
			MathExt: MathExt
		}
	}
	
	//package loader
	var loader = new function() {
		
		//class LoaderAssets 
		var LoaderAssets = function(onAllLoadCompleteHandler, onAllLoadCompleteScope, objLoaderAssets) {
			EventDispatcher.call(this);
			objLoaderAssets = objLoaderAssets || {};
			objLoaderAssets.isClearAfterAllLoadComplete = objLoaderAssets.isClearAfterAllLoadComplete || true;
			this.isLoading = false;
			this.arrLoadContent = [];
			this.numContentToLoad = -1;
			this.onAllLoadCompleteHandler = onAllLoadCompleteHandler;
			this.onAllLoadCompleteScope = onAllLoadCompleteScope;
			this.isClearAfterAllLoadComplete = objLoaderAssets.isClearAfterAllLoadComplete;
			this.loaderProgress = objLoaderAssets.loaderProgress;
			this.onElementLoadComplete = objLoaderAssets.onElementLoadComplete;
			this.onElementLoadCompleteScope = objLoaderAssets.onElementLoadCompleteScope;
			this.onLoadCompleteBind = this.onLoadComplete.bind(this);
			this.onLoadErrorBind = this.onLoadError.bind(this);
		}
		LoaderAssets.inheritsFrom(EventDispatcher);
		
		LoaderAssets.FINISHED_PROGRESS = "finishedProgress";
    	LoaderAssets.TYPE_MODEL = 0;
    	LoaderAssets.TYPE_TEXTURE = 1;
		
		LoaderAssets.prototype.addToLoadQueue = function(url, weight, isStartLoading, loaderProgress) {
			url = url || "";
			weight = weight || 1;
			isStartLoading = isStartLoading || false;
			loaderProgress = loaderProgress || this.loaderProgress;
			var newObjLoadContent = {url: url, weight: weight, type: this.getContentTypeFromUrl(url), isLoaded: false, loaderProgress: loaderProgress, loader: null}
			this.arrLoadContent.push(newObjLoadContent);
			newObjLoadContent.indLoadContent = this.arrLoadContent.length - 1;
			if (loaderProgress) loaderProgress.addWeightContent(weight);
			if (isStartLoading) this.startLoading();
			return this.arrLoadContent.length - 1;
		}
		
		LoaderAssets.prototype.bringToFrontInLoadQueue = function(url) {
			var indObjLoadContentInLoadQueue = this.arrLoadContent.map(function(el) {return el.url;}).indexOf(url);
			if ((indObjLoadContentInLoadQueue != -1) && (indObjLoadContentInLoadQueue > this.numContentToLoad) && (this.numContentToLoad + 1 < this.arrLoadContent.length))
				this.arrLoadContent.splice(this.numContentToLoad + 1, 0, this.arrLoadContent.splice(indObjLoadContentInLoadQueue, 1)[0]);
		}
		
		LoaderAssets.prototype.startLoading = function() {
			this.isStopLoading = false;
			if (!this.isLoading) {
				this.loadNextElementFromQueue();
			}
		}
		
		LoaderAssets.prototype.onLoadComplete = function(e) {
			var objLoadContent = this.arrLoadContent[this.numContentToLoad];
			objLoadContent.content = e.content;
			//trace("onLoadComplete:", objLoadContent);
			objLoadContent = this.checkAndCorrectTypeFromLoadedContent(objLoadContent);
			objLoadContent.isLoaded = true;
			if ((this.onElementLoadComplete != null) && (this.onElementLoadCompleteScope != null) && (!this.isStopLoading)) 
				this.onElementLoadComplete.apply(this.onElementLoadCompleteScope, [objLoadContent, this.numContentToLoad]);
			if (!this.isStopLoading) this.loadNextElementFromQueue();
		}
		
		LoaderAssets.prototype.onLoadError = function(e) {
            var objLoadContent = this.arrLoadContent[this.numContentToLoad];
			objLoadContent.isLoaded = false;
			if ((this.onElementLoadComplete != null) && (this.onElementLoadCompleteScope != null)) 
				this.onElementLoadComplete.apply(this.onElementLoadCompleteScope, [objLoadContent, this.numContentToLoad]);
			if (!this.isStopLoading) this.loadNextElementFromQueue();
        }
		
		LoaderAssets.prototype.onAllLoadComplete = function(e) {
			if (this.onAllLoadCompleteHandler != null) this.onAllLoadCompleteHandler.apply(this.onAllLoadCompleteScope, [this.arrLoadContent]);
			if (this.isClearAfterAllLoadComplete) {
				if (this.loaderProgress) {
					this.loaderProgress.removeEventListener(LoaderAssets.FINISHED_PROGRESS, this.onAllLoadComplete);
					this.loaderProgress.hide();
					
				}
				for (var i = 0; i < this.arrLoadContent.length; i++) this.arrLoadContent[i] = null;
				this.arrLoadContent = [];
			}
		}
		
        LoaderAssets.prototype.loadNextElementFromQueue = function() {
			//trace("loadNextElementFromQueue", this.numContentToLoad, this.arrLoadContent.length)
			if (this.numContentToLoad + 1 < this.arrLoadContent.length) {
				this.numContentToLoad++;
				this.isLoading = true;
				var objLoadContent = this.arrLoadContent[this.numContentToLoad];
				var onLoadProgress;
				if (objLoadContent.loaderProgress) onLoadProgress = objLoadContent.loaderProgress.onLoadProgress;
				
				var loader;
				if (objLoadContent.type == LoaderAssets.TYPE_MODEL) {
					loader = new THREE.OBJLoader();
				} else if (objLoadContent.type == LoaderAssets.TYPE_TEXTURE) {
					loader = new THREE.ImageLoader();
				} else this.onLoadError(null);
				
				//trace("loader:", loader, objLoadContent.type, objLoadContent.url)
				loader.addEventListener('load', this.onLoadCompleteBind);
				if (onLoadProgress) {
					if (!objLoadContent.onLoadProgressBind) objLoadContent.onLoadProgressBind = onLoadProgress.bind(objLoadContent.loaderProgress);
					loader.addEventListener('progress', objLoadContent.onLoadProgressBind);
				}
				loader.addEventListener('error', this.onLoadError.bind(this));
				loader.load(objLoadContent.url);
				objLoadContent.loader = loader;
				if (objLoadContent.loaderProgress) objLoadContent.loaderProgress.initNextLoad();
			} else {
				this.isLoading = false;
				if (this.loaderProgress) {
					this.loaderProgress.addEventListener(LoaderAssets.FINISHED_PROGRESS, this.onAllLoadComplete.bind(this));
					this.loaderProgress.setLoadProgress(1);
				} else this.onAllLoadComplete();
			}
        }
		
		LoaderAssets.prototype.getContentTypeFromUrl = function(url) {
			var arrExtensionModel = ["obj"];
			var arrExtensionTexture = ["png", "jpg", "jpeg", "gif"];
			var isFoundType = false;
			var type = 0;
			while ((!isFoundType) && (type <= 1)) {
				var arrExtension = [arrExtensionModel, arrExtensionTexture][type];
				var i = 0;
				url = url.toLowerCase();
				while (((url.indexOf("." + arrExtension[i]) == -1) 
					 || (url.indexOf("." + arrExtension[i]) != (url.length - arrExtension[i].length - 1))) 
					&& (i < arrExtension.length)) {
					i++;
				}
				if (i < arrExtension.length) {
					isFoundType = true;
				} else {
					type++;
				}
			}
			if (isFoundType) {
				return type;
			} else {
				return -1;
			}
		}
		
		LoaderAssets.prototype.checkAndCorrectTypeFromLoadedContent = function(objLoadContent) {
			switch (objLoadContent.content.type) {
				case THREE.OBJLoader: objLoadContent.type = LoaderAssets.TYPE_MODEL; break;
				case Image: objLoadContent.type = LoaderAssets.TYPE_TEXTURE; break;
			}
			return objLoadContent;
		}
		
		LoaderAssets.prototype.stopLoading = function() {
			this.isStopLoading = true;
			if (this.isLoading) {
				var objLoadContent = this.arrLoadContent[this.numContentToLoad];
				var loader = objLoadContent.loader;
				loader.removeEventListener('load', this.onLoadCompleteBind);
				if (objLoadContent.loaderProgress) loader.removeEventListener('progress', objLoadContent.onLoadProgressBind);
				loader.removeEventListener('error', this.onLoadErrorBind);
				this.isLoading = false;
			}
		}
		
		//class LoaderProgress
		var LoaderProgress = function(timeFramesTweenPercent) {
			EventDispatcher.call(this);
			this.timeFramesTweenPercent = timeFramesTweenPercent || 0.2;
			this.ratioProgress = this.prevRatioLoadedElement = 0;
			this.arrWeightContentToLoad = [];
			this.numContentToLoad = -1;
			this.setLoadProgress(0);
		}
		LoaderProgress.inheritsFrom(EventDispatcher);
		
		LoaderProgress.prototype.addWeightContent = function(weight) {
			this.arrWeightContentToLoad.push(weight);
			this.weightTotal = 0;
			for (var i = 0; i < this.arrWeightContentToLoad.length; i++)
				this.weightTotal += this.arrWeightContentToLoad[i];
		}
		
		LoaderProgress.prototype.initNextLoad = function() {
			this.numContentToLoad++;
			this.weightForCurrentElement = this.arrWeightContentToLoad[this.numContentToLoad];
			this.weightLoaded = 0;
			for (var i = 0; i < this.numContentToLoad; i++)
				this.weightLoaded += this.arrWeightContentToLoad[i];
			this.setLoadProgress(this.weightLoaded / this.weightTotal);
		}
		
		LoaderProgress.prototype.onLoadProgress = function(event) {
			var ratioLoadedElement = event.bytesLoaded / event.bytesTotal;
			if (isNaN(ratioLoadedElement)) ratioLoadedElement = this.prevRatioLoadedElement;
			ratioLoadedElement = Math.max(0, Math.min(1, ratioLoadedElement));
			this.prevRatioLoadedElement = ratioLoadedElement;
			var ratioLoaded = (this.weightLoaded + ratioLoadedElement * this.weightForCurrentElement) / this.weightTotal;
			this.setLoadProgress(ratioLoaded);
		}
		
		LoaderProgress.prototype.setLoadProgress = function(ratioLoaded) {
			this.updateAndCheckIsFinished();
			TweenLite.killTweensOf(this);
			TweenLite.to(this, this.timeFramesTweenPercent, {ratioProgress: ratioLoaded, onUpdate: this.updateAndCheckIsFinished.bind(this)});
		}
		
		LoaderProgress.prototype.updateAndCheckIsFinished = function() {
			this.update();
			if (this.ratioProgress == 1) {
				TweenLite.killTweensOf(this);
				this.dispatchEvent({type: LoaderAssets.FINISHED_PROGRESS});
			}
		}
		
		LoaderProgress.prototype.update = function() {
			//trace("this.ratioProgress:" + this.ratioProgress);
		}
		
		//class LoaderProgressTextPercent
		var LoaderProgressTextPercent = function(elementText, timeFramesTweenPercent) {
			this.elementText = elementText;
			this.elementText.text("0 %");
			LoaderProgress.call(this, timeFramesTweenPercent);
		}
		LoaderProgressTextPercent.inheritsFrom(LoaderProgress);
		
		LoaderProgressTextPercent.prototype.update = function() {
			this.elementText.text(String(Math.round(this.ratioProgress * 100)) + "%");
			base.loader.LoaderProgress.prototype.update.call(this);
		}
		
		LoaderProgressTextPercent.prototype.hide = function() {
			TweenLite.to(this.elementText, 0.2,  {css: {autoAlpha:0}});
		}
		
		return {
			LoaderAssets: LoaderAssets,
			LoaderProgress: LoaderProgress,
			LoaderProgressTextPercent: LoaderProgressTextPercent,
		}
		
	}

	//package three
	var three = new function() {
		
		//class Stage3D
		var Stage3D = function(idDomElement, fov) {
			ClassWithDomElement.call(this, idDomElement);
			this.scene = new THREE.Scene();
			fov = fov || 45;
			this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000);
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
			$(this.renderer.domElement).css("margin-bottom", -4);
			this.domElement.append(this.renderer.domElement);
			$(window).resize(this.onWindowResize.bind(this));
			window.onresize = this.onWindowResize.bind(this);
			this.onWindowResize();
			//this.animate();
			//this.render();
		}
		Stage3D.inheritsFrom(ClassWithDomElement);
		
		Stage3D.prototype.onWindowResize = function() {
			var heightBarBtns = $("#bar-btns").height();
			this.camera.aspect = $(window).width() / ($(window).height() - heightBarBtns);
			this.camera.updateProjectionMatrix();
			this.renderer.setSize($(window).width(), $(window).height() - heightBarBtns);
			this.render();
		}
        
		Stage3D.prototype.animate = function() {
			requestAnimationFrame(this.animate.bind(this));
			this.render();
		}
		
		Stage3D.prototype.render = function() {
            this.renderer.render(this.scene, this.camera);
        }
		
		Stage3D.hasWebGL = function() {
			try {
				var canvas = document.createElement('canvas'); 
				return !! window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
			} catch(e) { 
				return false; 
			} 
		};
		
		Stage3D.hasFlash = function() {
			var hasFlash = false;
			/*if(FlashDetect.installed){
				hasFlash = true;
			} if(swfobject.hasFlashPlayerVersion("1")) {
				hasFlash = true;
			} else {*/
			try {
				var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (fo) hasFlash = true;
			} catch (e) {
				if ((navigator.mimeTypes) && (navigator.mimeTypes['application/x-shockwave-flash'] != undefined) && (navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin))
					hasFlash = true;
			}
			return hasFlash;
		}
		
		Stage3D.isIE = function() {
			var myNav = navigator.userAgent.toLowerCase();
			return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
		}
		
		Stage3D.isMobile = function() {
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
		}
		
		return {
			Stage3D: Stage3D,
		}
	}
	
	return {
		ClassWithDomElement: ClassWithDomElement,
		math: math,
		loader: loader,
		three: three,
	}

}

//package modelViewer3D
var modelViewer3D = new function() {

	//class LoaderModel3D
	var LoaderModel3D = function(numModelToLoad) {
		EventDispatcher.call(this);
		this.numModelToLoad = numModelToLoad;
		//this.textureMesh = THREE.ImageUtils.loadTexture("asset3d/female_croupier_2013-03-26.png");
		//var loader = new THREE.ImageLoader();
		////loader.load("asset3d/texture/textureBack.jpg", this.initOnLoadTexture.bind(this));
		//loader.addEventListener('load', this.initOnLoadTexture.bind(this));
		//loader.load('asset3d/female_croupier_2013-03-26.obj');
		//var loader = new THREE.OBJLoader();
		////loader.load("asset3d/female_croupier_2013-03-26.obj", this.initOnModelLoaded.bind(this));
        //loader.addEventListener('load', this.initOnModelLoaded.bind(this));
		//loader.load("asset3d/galaxyalpha.obj");
		var loaderProgressModel;
		if (numModelToLoad == 0) loaderProgressModel = new LoaderProgressModel()
		this.loaderAssets = new base.loader.LoaderAssets(this.initOnModelLoaded, this, {loaderProgress: loaderProgressModel});
		/*this.indModel = this.loaderAssets.addToLoadQueue('asset3d/female_croupier_2013-03-26.obj');
		this.indTexture = this.loaderAssets.addToLoadQueue('asset3d/female_croupier_2013-03-26.png');*/
		this.indModel = this.loaderAssets.addToLoadQueue("asset3d/galaxyalpha.obj", 3);
		var objPathImgTexture = {
			9: "asset3d/texture/textureMetal" + String(numModelToLoad) + ".png", //bok
			15: "asset3d/texture/textureButtonBottom" + String(numModelToLoad) + ".png", //środkowy przycisk
			16: "asset3d/texture/textureFront" + String(numModelToLoad) + ".jpg", //przód
			17: "asset3d/texture/textureMetal" + String(numModelToLoad) + ".png", //prawy przycisk
			18: "asset3d/texture/textureMetal" + String(numModelToLoad) + ".png", //lewyPrzycisk
			19: "asset3d/texture/textureBack" + String(numModelToLoad) + ".jpg", //tył
		};
		this.objColorTexture = {
			6: 0x444444, //"asset3d/texture/textureGrey4.png", //dziub od wejścia usb
			8: 0xcccccc, //"asset3d/texture/textureWhite.png", //głośnik
			10: 0x666666, //"asset3d/texture/textureGrey6.png", //wejście usb
			11: 0x666666, //"asset3d/texture/textureGrey6.png", //wejście słuchawkowe
			12: 0x888888, //"asset3d/texture/textureGrey8.png", //paski dół
			13: 0x888888, //"asset3d/texture/textureGrey8.png", //paski góra
			14: 0xcccccc, //"asset3d/texture/textureWhite.png", //obrys środkowego przycisku
		}
		
		this.objTextureFiltering = {
			16:  THREE.LinearFilter
		}
		
		this.objIndImgTexture = {}
		for (var idTexture in objPathImgTexture) {
			var pathImgTexture = objPathImgTexture[idTexture]
			//if (pathImgTexture) objTexture[idTexture] = THREE.ImageUtils.loadTexture(pathImgTexture);
			if (pathImgTexture) this.objIndImgTexture[idTexture] = this.loaderAssets.addToLoadQueue(pathImgTexture, 1);
		}
		var objPathImgTextureNormal = {/*19: "asset3d/texture/textureBackNormal.jpg"*/}
		this.objIndImgTextureNormal = {}
		for (var idTextureNormal in objPathImgTextureNormal) {
			var pathImgTextureNormal = objPathImgTextureNormal[idTextureNormal]
			//if (pathImgTextureNormal) objTextureNormal[idTextureNormal] = THREE.ImageUtils.loadTexture(pathImgTextureNormal);
			if (pathImgTextureNormal) this.objIndImgTextureNormal[idTextureNormal] = this.loaderAssets.addToLoadQueue(pathImgTextureNormal, 1);
		}
		
		var objPathImgTextureSpecular = {9: "asset3d/texture/textureMetalSpecular.png", 16: "asset3d/texture/textureFrontSpecular.png", 19: "asset3d/texture/textureBackSpecular.png"}
		this.objIndImgTextureSpecular = {}
		for (var idTextureSpecular in objPathImgTextureSpecular) {
			var pathImgTextureSpecular = objPathImgTextureSpecular[idTextureSpecular]
			//if (pathImgTextureSpecular) objTextureSpecular[idTextureSpecular] = THREE.ImageUtils.loadTexture(pathImgTextureSpecular);
			if (pathImgTextureSpecular) this.objIndImgTextureSpecular[idTextureSpecular] = this.loaderAssets.addToLoadQueue(pathImgTextureSpecular, 1);
		}
		
		this.loaderAssets.startLoading();
	}
	LoaderModel3D.inheritsFrom(EventDispatcher);
	
	LoaderModel3D.prototype.initOnModelLoaded = function(arrLoadContent) {
		/*var material = new THREE.MeshLambertMaterial({color: 0x5C3A21});
		geometry.children.forEach(function (child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					//child.children[0].material = material;
					child.children[0].material.map = this.textureMesh;
				}
			}
		});*/
		this.objTexture = {};
		for (var idTexture in this.objIndImgTexture)  {
			var indImgTexture = this.objIndImgTexture[idTexture];
			var texture = new THREE.Texture();
			texture.image = arrLoadContent[indImgTexture].content;
			texture.minFilter = this.objTextureFiltering[idTexture] || THREE.LinearMipMapLinearFilter;
			texture.needsUpdate = true;
			this.objTexture[idTexture] = texture;
		}
		this.objTextureNormal = {}
		for (var idTextureNormal in this.objIndImgTextureNormal)  {
			var indImgTextureNormal = this.objIndImgTextureNormal[idTextureNormal];
			var textureNormal = new THREE.Texture();
			textureNormal.image = arrLoadContent[indImgTextureNormal].content;
			textureNormal.needsUpdate = true;
			this.objTextureNormal[idTextureNormal] = textureNormal;
		}
		this.objTextureSpecular = {}
		for (var idTextureSpecular in this.objIndImgTextureSpecular) {
			var indImgTextureSpecular = this.objIndImgTextureSpecular[idTextureSpecular];
			var textureSpecular = new THREE.Texture();
			textureSpecular.image = arrLoadContent[indImgTextureSpecular].content;
			textureSpecular.needsUpdate = true;
			this.objTextureSpecular[idTextureSpecular] = textureSpecular;
		}
		
		this.mesh = arrLoadContent[this.indModel].content;
		this.traverseMesh = function(child) {
			if (child instanceof THREE.Mesh) {
				var material = new THREE.MeshPhongMaterial({
					specular: new THREE.Color(0x333333),
					shading:  THREE.FlatShading,
					shininess: 20,  //200
				});
				var idChild = child.id - this.numModelToLoad * 20;
				var texture = this.objTexture[idChild];
				if (texture) material.map = texture;
				else {
					var colorMaterial = this.objColorTexture[idChild]
					if (colorMaterial) material.color = new THREE.Color(colorMaterial);
				}
				var textureNormal = this.objTextureNormal[idChild];
				if (textureNormal) material.normalMap = textureNormal;
				
				var textureSpecular = this.objTextureSpecular[idChild];
				if (textureSpecular) {
					material.specularMap = textureSpecular;
					material.specular = new THREE.Color(0x888888);
					material.shininess = 80;
					
				}
				child.material = material;
				//child.material.wireframe = true;
				//child.material.specularMap = textureSpecular;
			}
		}
		this.mesh.traverse(this.traverseMesh.bind(this));
		//this.mesh.rotation.x = -90;
		this.mesh.scale.set(0.53, 0.53, 0.53);
		//this.mesh.scale.set(0.25, 0.25, 0.25);
		this.dispatchEvent({type: Application.LOADED_MODEL, loaderModel: this});
	}		

	//class ModelViewer3D
	var ModelViewer3D = function() {
		base.three.Stage3D.call(this, "modelviewer3d");
		//init camera
		this.initCamera();
		//create directionalLight
		this.directionalLight =  new THREE.DirectionalLight(0xffffff, 1);
		this.directionalLight.shadowMapWidth = 1024;
		this.directionalLight.shadowMapHeight = 1024;
		this.scene.add(this.directionalLight);
		//load models
		this.classLoaderModel = LoaderModel3D;
		this.startMixinLoaderModels();
	}
	ModelViewer3D.inheritsFrom(base.three.Stage3D);
	
	ModelViewer3D.prototype.initCamera = function() {
		this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 60;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.camera.up.set(0, 1, 0);
	}
	
	ModelViewer3D.prototype.initAfterFirstModelLoaded = function() {
		this.createControlsForMesh();
		this.initControlsArrowAndZoom();
		this.render();
	}
	
	ModelViewer3D.prototype.removeAddModel = function(isRemoveAdd, numModel) {
		this.scene[["remove", "add"][isRemoveAdd]](this.arrLoaderModel[numModel].mesh);
		if (isRemoveAdd == 1) this.render();
	}

	ModelViewer3D.prototype.createControlsForMesh = function() {
		this.controls = new THREE.ObjectControls(this.camera, this.renderer.domElement, this.renderOnObjectControlsMove, this, {minDistance: 34, maxDistance: 100});
		this.controls.rotateSpeed = 5.0;
		this.controls.zoomSpeed = 5;
		this.controls.panSpeed = 2;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;
		//this.controls.addEventListener('change', this.render.bind(this));
		this.waitAndSetIntervalRotateInDirectionAuto();
	}

	ModelViewer3D.prototype.renderOnObjectControlsMove = function(typeEvent) {
		if ((typeEvent == "move") || (typeEvent == "start") || (typeEvent == "end")) this.render();
		if (typeEvent == "start") this.clearRotateInDirectionAuto();
		//else if (typeEvent == "end") this.waitAndSetIntervalRotateInDirectionAuto();
	}
	
	ModelViewer3D.prototype.rotateInDirectionManual = function(classModelViewer3D, direction, isAuto) {
		if ((!isAuto) || ((classModelViewer3D.prevRotationYCamera <= 0) || (classModelViewer3D.camera.rotation.y >= 0))) {
			classModelViewer3D.controls.rotateInDirectionManual(direction);	
			classModelViewer3D.prevRotationYCamera = classModelViewer3D.camera.rotation.y;
			classModelViewer3D.render();
		} else classModelViewer3D.clearRotateInDirectionAuto();
	}
	
	ModelViewer3D.prototype.initControlsArrowAndZoom = function() {
		$("a").filter(function() {
			return this.href.match(/#(none)?$/);
		}).click(Application.instance.scrollToTopBgModel);
		
		var isMobile = base.three.Stage3D.isMobile();
		var onArrowZoomClick = function() {
			return false;
		}
		
		var onArrowDown = function() {
			var classModelViewer3D =  $(this).data('classModelViewer3D');
			var descriptionArrow = $(this).data('descriptionArrow');
			smartOmni.pageView("arrow" + String(["Left", "Right", "Top", "Bottom"][descriptionArrow[0] * 2 + (descriptionArrow[1] + 1) / 2]) + "Down");
			var direction = new THREE.Vector2();
			direction[["x", "y"][descriptionArrow[0]]] = descriptionArrow[1];
			//classModelViewer3D.controls.rotateInDirectionManual(new THREE.Vector2());
			classModelViewer3D.clearRotateInDirectionAuto();
			clearInterval($(this).data("intervalRotateInDirectionManual"));
			$(this).data("intervalRotateInDirectionManual", setInterval(classModelViewer3D.rotateInDirectionManual, 20, classModelViewer3D, direction));
			return false;
		}
		var onArrowUp = function() {
			clearInterval($(this).data("intervalRotateInDirectionManual"));
			/*var classModelViewer3D =  $(this).data('classModelViewer3D');
			classModelViewer3D.waitAndSetIntervalRotateInDirectionAuto();*/
			return false;
		}
		var objDescriptionArrow = {left: [0, -1], right: [0, 1], top: [1, -1], bottom: [1, 1]};
		for (var nameArrow in objDescriptionArrow) {
			var arrow = $("#arrow-" + nameArrow);
			arrow.data("classModelViewer3D", this);
			arrow.data("descriptionArrow", objDescriptionArrow[nameArrow]);
			if (isMobile) {
				arrow.on('touchstart', onArrowDown);
				arrow.on('touchend', onArrowUp);
			} else {
				arrow.mousedown(onArrowDown);
				arrow.mouseup(onArrowUp);
				arrow.mouseout(onArrowUp);
				arrow.click(onArrowZoomClick);
			}
		}
		
		/*
		var zoomManual = function(classModelViewer3D, direction) {
			classModelViewer3D.controls.zoomManual(direction);
			classModelViewer3D.render();
		}
		var onZoomDown = function() {
			smartOmni.pageView("zoom-down");
			var classModelViewer3D =  $(this).data('classModelViewer3D');
			var descriptionZoom = $(this).data('descriptionZoom');
			//classModelViewer3D.controls.zoomManual(new THREE.Vector2());
			classModelViewer3D.clearRotateInDirectionAuto();
			clearInterval($(this).data("intervalZoomManual"));
			$(this).data("intervalZoomManual", setInterval(zoomManual, 1, classModelViewer3D, descriptionZoom));
			return false;
		}
		var onZoomUp = function() {
			smartOmni.pageView("zoom-up");
			clearInterval($(this).data("intervalZoomManual"));
			var classModelViewer3D =  $(this).data('classModelViewer3D');
			classModelViewer3D.waitAndSetIntervalRotateInDirectionAuto();
			return false;
		}
		var objDescriptionZoom = {in: 1, out: -1};
		for (var nameZoom in objDescriptionZoom) {
			var zoom = $("#zoom-" + nameZoom);
			zoom.data("classModelViewer3D", this);
			zoom.data("descriptionZoom", objDescriptionZoom[nameZoom]);
			if (isMobile) {
				zoom.on('touchstart', onZoomDown);
				zoom.on('touchend', onZoomUp);
			} else {
				zoom.mousedown(onZoomDown);
				zoom.mouseup(onZoomUp);
				zoom.mouseout(onZoomUp);
				zoom.click(onArrowZoomClick);
			}
		}*/
		var onCentralizeClick = function() {
			smartOmni.pageView("centralize");
			var classModelViewer3D =  $(this).data('classModelViewer3D');
			classModelViewer3D.initCamera();
			classModelViewer3D.render();
			//classModelViewer3D.waitAndSetIntervalRotateInDirectionAuto();
			return false;
		}
		var centralize = $("#centralize");
		centralize.data("classModelViewer3D", this);
		if (isMobile) {
			centralize.on('touchstart', onCentralizeClick);
		} else {
			centralize.click(onCentralizeClick);
		}
	}

	ModelViewer3D.prototype.clearRotateInDirectionAuto = function() {
		clearTimeout(this.timeoutRotateInDirectionAuto);
		clearInterval(this.intervalRotateInDirectionAuto);
	}
	
	ModelViewer3D.prototype.waitAndSetIntervalRotateInDirectionAuto = function() {
		if (!this.isRotatedInDirectionAuto) {
			this.prevRotationYCamera = 0;
			this.clearRotateInDirectionAuto();
			this.timeoutRotateInDirectionAuto = setTimeout(this.setIntervalRotateInDirectionAuto, 2000, this);
		}
	}
	
	ModelViewer3D.prototype.setIntervalRotateInDirectionAuto = function(classModelViewer3D) {
		var direction = new THREE.Vector2();
		direction.x = 1;
		classModelViewer3D.intervalRotateInDirectionAuto = setInterval(classModelViewer3D.rotateInDirectionManual, 50, classModelViewer3D, direction, true);
		classModelViewer3D.isRotatedInDirectionAuto = true;
	}
	
	
	ModelViewer3D.prototype.render = function() {
		/*if (this.mesh) {
			this.mesh.rotation.y += 0.006;
			this.mesh.rotation.x += 0.006;
		}*/
		if (this.controls) {
			this.controls.update();
			this.directionalLight.position = this.camera.position;
		}
		base.three.Stage3D.prototype.render.call(this);
	}
	
	ModelViewer3D.prototype.onWindowResize = function() {
		base.three.Stage3D.prototype.onWindowResize.call(this);
		Application.instance.scrollToTopBgModel();
	}
	
	//class LoaderModelImg
	var LoaderModelImg = function(numModelToLoad) {
		EventDispatcher.call(this);
		this.numModelToLoad = numModelToLoad;
		this.loaderAssets = new base.loader.LoaderAssets(this.initOnModelLoaded, this, {loaderProgress: [null, new LoaderProgressModel()][Number(numModelToLoad == 0)]});
		this.indImgModel = this.loaderAssets.addToLoadQueue("img/imgModel" + String(numModelToLoad) + ".png");
		this.loaderAssets.startLoading();
	}
	LoaderModelImg.inheritsFrom(EventDispatcher);

	LoaderModelImg.prototype.initOnModelLoaded = function(arrLoadContent) {
		this.imgModel = arrLoadContent[this.indImgModel].content;
		this.dispatchEvent({type: Application.LOADED_MODEL, loaderModel: this});
	}	
	
	/** Class ModelViewerImg **/
	var ModelViewerImg = function() {
		base.ClassWithDomElement.call(this, "modelviewerimg");
		$(window).resize(this.onWindowResize.bind(this));
		window.onresize = this.onWindowResize.bind(this);
		this.onWindowResize();
		this.initArrElementImg();
		this.classLoaderModel = LoaderModelImg;
		this.startMixinLoaderModels();
	}
	ModelViewerImg.inheritsFrom(base.ClassWithDomElement);
	
	ModelViewerImg.prototype.initArrElementImg = function() {
		this.arrElementImg = new Array(Application.COUNT_MODELS);
		for (var i = 0; i < Application.COUNT_MODELS; i++)
			this.arrElementImg[i] = $("<img src='img/imgModel" + String(i) + ".png' class='imgmodel'></img>");
	}
	
	ModelViewerImg.prototype.onWindowResize = function() {
		var heightBarBtns = $("#bar-btns").height();
		$("#modelviewerimg").width($(window).width());
		$("#modelviewerimg").height($(window).height() - heightBarBtns);
		Application.instance.scrollToTopBgModel();
	}
	
	ModelViewerImg.prototype.initAfterFirstModelLoaded = function() {}
	
	ModelViewerImg.prototype.removeAddModel = function(isRemoveAdd, numModel) {
		if (isRemoveAdd == 0) this.arrElementImg[numModel].remove();
		else if (isRemoveAdd == 1) $("#modelviewerimg").append(this.arrElementImg[numModel]);
	}
	
	//mixin MixinLoaderModels
	var MixinLoaderModels = (function() {
		var startMixinLoaderModels = function() {
			this.numModelToLoad = 0;
			this.arrLoaderModel = new Array(Application.COUNT_MODELS);
			Application.instance.addEventListener(Application.NUM_MODEL_SELECTED_CHANGED, this.onNumModelSelectedChanged.bind(this));
			this.loadNextModel();
		}
		var loadNextModel = function() {
			if (this.numModelToLoad < Application.COUNT_MODELS) {
				//var loaderModel = new LoaderModel3D(this.numModelToLoad);
				var loaderModel = new this.classLoaderModel(this.numModelToLoad);
				//loaderModel.addEventListener(Application.LOADED_MODEL, this.onModelLoaded.bind(this));
				loaderModel.addEventListener(Application.LOADED_MODEL, this.onModelLoaded.bind(this));
				this.arrLoaderModel[this.numModelToLoad] = loaderModel;
				this.numModelToLoad++;
			}
		}
		var onModelLoaded = function(e) {
			var loaderModel = e.loaderModel;
			Application.instance.addLinkColor(loaderModel.numModelToLoad);
			if ((loaderModel.numModelToLoad == 0) && (Application.instance.numSelectedModel == -1)) {
				Application.instance.numSelectedModel = 0;
				this.domElement.css("opacity", 0);
				TweenLite.to(this.domElement, 0.3,  {css: {autoAlpha:1}});
				this.initAfterFirstModelLoaded();
			}
			this.loadNextModel();
		}
		var onNumModelSelectedChanged = function(e) {
			var oldNumSelectedModel = e.oldNumSelectedModel;
			if (Application.instance.numSelectedModel < this.numModelToLoad) {
				if (oldNumSelectedModel > -1) this.removeAddModel(0, oldNumSelectedModel);
				this.removeAddModel(1, Application.instance.numSelectedModel);
				Application.instance.scrollToTopBgModel();
			}
		}
		return function() {
			this.startMixinLoaderModels = startMixinLoaderModels;
			this.loadNextModel = loadNextModel;
			this.onModelLoaded = onModelLoaded;
			this.onNumModelSelectedChanged = onNumModelSelectedChanged;
			return this;
		}
	})(); 	
	MixinLoaderModels.call(ModelViewer3D.prototype);
	MixinLoaderModels.call(ModelViewerImg.prototype);
	
	//class LoaderProgressModel
	LoaderProgressModel = function() {
		base.loader.LoaderProgressTextPercent.call(this, $("#loaderprogress"), 0.2);
	}
	
	LoaderProgressModel.inheritsFrom(base.loader.LoaderProgressTextPercent);
	
	//class ModelViewer3DFlash
	var ModelViewer3DFlash = function() {
		base.ClassWithDomElement.call(this, "modelviewer3dflash");
		$("<div/>", {id: "modelviewer3dflashreplace"}).appendTo("#container-modelviewer");
		var params = {
			menu: "false",
			scale: "noScale",
			allowFullscreen: "true",
			allowScriptAccess: "always",
			bgcolor: "#000000",
			wmode: "direct"
		};
		swfobject.embedSWF("swf/loader.swf", "modelviewer3dflashreplace", "100%", "100%", "11.0", "swf/expressInstall.swf", {pathAssets: "swf/", country: smartOmni.getCountryCode()}, params, {id: "modelviewer3dflash"});
		this.headerIE9Fix();
		$(window).resize(ModelViewer3DFlash.onWindowResize);
		window.onresize = ModelViewer3DFlash.onWindowResize;
	}
	ModelViewer3DFlash.inheritsFrom(base.ClassWithDomElement);
	
	ModelViewer3DFlash.prototype.headerIE9Fix = function() {
		if (base.three.Stage3D.isIE()) {
			var nameClassFlashHide = "flashHide"; 
			$(".nav").mouseover(function() {
				$("#container-modelviewer").width($("#modelviewer3dflash").width());
				$("#container-modelviewer").height($("#modelviewer3dflash").height());
				//$("#modelviewer3dflash").css("display", "none")
				$("#modelviewer3dflash").addClass(nameClassFlashHide); 
			});
			$(".nav").mouseout(function() {
				$("#container-modelviewer").width("inherit");
				$("#container-modelviewer").height("inherit");
				//$("#modelviewer3dflash").css("display", "block");
				$("#modelviewer3dflash").removeClass(nameClassFlashHide); 
			});
		}
	}
	
	window.resizemodelviewer3dflash = function() {
		ModelViewer3DFlash.onWindowResize();
	}
	ModelViewer3DFlash.onWindowResize = function() {
		var heightBarBtns = $("#bar-btns").height();
		$("#modelviewer3dflash").width($(window).width());
		$("#modelviewer3dflash").height($(window).height() - heightBarBtns);
		Application.instance.scrollToTopBgModel();
	}
	
	/** class Application **/
	var Application = function() {
		EventDispatcher.call(this);
		Application.instance = this;
		this.numSelectedModel = -1;
		if (base.three.Stage3D.hasWebGL()) {
			$("#modelviewerimg").remove();
			this.modelViewer3D = new modelViewer3D.ModelViewer3D();
		} else {
			$("#modelviewer3d").remove();
			//if (false) {	
			if ((base.three.Stage3D.hasFlash()) && (!base.three.Stage3D.isMobile())) {	
				$("#modelviewerimg").remove();
				$("#loaderprogress").remove();
				$("#bg-modelviewer").css('opacity', 0);
				this.modelViewer3D = new modelViewer3D.ModelViewer3DFlash();
			} else {
				this.modelViewerImg = new modelViewer3D.ModelViewerImg();
			}
		}
		//this.loadFooterSocial();
		setTimeout(this.scrollToTopBgModel, 1500);
	};
	Application.inheritsFrom(EventDispatcher);
	Application.NUM_MODEL_SELECTED_CHANGED = "numModelSelectedChanged";
	Application.ARR_COLOR_MODELS = ["#e6cb82", "#383838", "#ebeced"];
	Application.COUNT_MODELS = Application.ARR_COLOR_MODELS.length;
	Application.LOADED_MODEL = "loadedModel";

	Application.prototype.addLinkColor = function(numModelLoaded) {
		var linkColor = $("<a href='#' class='color' id='color"+ String(numModelLoaded) + "' data-numcolor='"+ String(numModelLoaded) + "'></a>");
		linkColor.css("top", String(15 + 35 * numModelLoaded) + "px");
		linkColor.css("background", Application.ARR_COLOR_MODELS[numModelLoaded]);
		//linkColor.data("classParent", classParent);
		linkColor.on('click', function() {
			var numColor = $(this).attr('data-numcolor');
			/*$(this).data("classParent")*/
			Application.instance.numSelectedModel = numColor;
			return false;
		});
		$("#container-modelviewer").append(linkColor);
		linkColor.css("opacity", 0);
		TweenLite.to(linkColor, 0.3,  {css: {autoAlpha:1}});
	}
	
	Application.prototype.numSelectedModel = -1;
	Object.defineProperty(Application.prototype, "numSelectedModel", {
		get: function numSelectedModel() {
			return this._numSelectedModel;
		},
		set: function numSelectedModel(value) {
			if (value != this._numSelectedModel) {
				smartOmni.pageView("color" + String(value));
				var oldNumSelectedModel = this._numSelectedModel;
				this._numSelectedModel = value;
				if (this._numSelectedModel > -1) $("#color" + String(oldNumSelectedModel)).removeClass("active");
				$("#color" + String(value)).addClass("active");
				this.dispatchEvent({type: Application.NUM_MODEL_SELECTED_CHANGED, oldNumSelectedModel: oldNumSelectedModel});
			}
		}
	});
	
	Application.prototype.scrollToTopBgModel = function(e) {
		$(document).scrollTop($("#bg-modelviewer").offset().top);
		//window.scrollTo(0, ...);
	}

	/*Application.prototype.loadFooterSocial = function() {
		$("#footer-social").load("footer-social.html", function() {});
	}*/
	
	return {
		Application: Application,
		ModelViewer3D: ModelViewer3D,
		ModelViewerImg: ModelViewerImg,
		ModelViewer3DFlash: ModelViewer3DFlash,
		MixinLoaderModels: MixinLoaderModels,
		LoaderProgressModel: LoaderProgressModel,
	};
};

/**********application**********/

//$(function() {
$(document).ready(function() {
	try {
		var application = new modelViewer3D.Application();
	} catch (ex) {
		/*if (ex !== null && typeof ex !== "undefined") {
			if (ex.message) ex = ex.message;
		} else {
			ex = "An unknown error occurred.";
		}
		$("#console-output").append($("<p/>").text(ex));*/
	}
	//$("#console-output").append($("<p/>").text("WebGL is supported: " + base.three.Stage3D.hasWebGL()));
	
});



