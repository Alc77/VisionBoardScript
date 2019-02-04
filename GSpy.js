class SaveManager {
	constructor() {
		this.saveSource = this.saveSource.bind(this);
	}

	saveSource(src) {
		if(!src) {
			alert("No source for this image. Please try some other image.");
			return;
		}
		console.log('src: ', src);
		var iframe = document.createElement('IFRAME');
		iframe.setAttribute('src', 'js-frame:GSpy:' + src);
		// For some reason we need to set a non-empty size for the iOS6 simulator...
		iframe.setAttribute('height', '1px');
		iframe.setAttribute('width', '1px');
		console.log("iframe: ", iframe);
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	}
}

class GSpy {
	constructor() {
		this.handleDOMNodeInserted = this.handleDOMNodeInserted.bind(this);
		this.deleteNavs = this.deleteNavs.bind(this);
		this.deleteLinks = this.deleteLinks.bind(this);
		this.start = this.start.bind(this);
	}

	start() {
		this.deleteNavs();
		var images = document.getElementsByTagName("img");
		for(let img of images) {
			img.addEventListener("click", this.handleClick);
		}
		document.body.addEventListener('DOMNodeInserted', this.handleDOMNodeInserted);
	}

	deleteNavs() {
		document.querySelector('header').remove();
		document.body.querySelector('[role = "navigation"]').remove();
		document.querySelector('footer').remove();
		this.deleteLinks();
	}
	
	deleteLinks() {
		let links = document.body.querySelectorAll('[role = "link"]');
		for (var i = 0; i < links.length; ++i) {
			if (links[i].childElementCount > 1) {
				links[i].lastElementChild.remove();
			}			
		}
	}

	handleClick() {
		var imgId = this.offsetParent.offsetParent.offsetParent.getAttribute("data-tbnid");
		console.log('imageId: ', imgId);
		let src = document.querySelector(`[data-tbnid='` + imgId + `']`).getElementsByTagName("img")[0].src;
		const saveManager = new SaveManager();
		saveManager.saveSource(src);
	}

	handleDOMNodeInserted(e) {
		this.deleteLinks();
		var imgs = document.getElementsByTagName("img");
		// refresh all listeners
		for(var i = 0; i < imgs.length; ++i) {
			imgs[i].removeEventListener("click", this.handleClick);
			imgs[i].addEventListener("click", this.handleClick);
		}		 
	}
}

const SPY = new GSpy();
SPY.start();