function ToggleFullScreen() {
			var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
			(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
			(document.msFullscreenElement && document.msFullscreenElement !== null);
			
			var element = document.body.getElementsByClassName("webgl-content")[0];
			
			if (!isInFullScreen) {
				//document.getElementById("fullScreenButton").classList.toggle("icon-resize-full");
				return (element.requestFullscreen ||
				element.webkitRequestFullscreen ||
				element.mozRequestFullScreen ||
				element.msRequestFullscreen).call(element);
			}
			else {
				//document.getElementById("fullScreenButton").classList.toggle("icon-resize-full");
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		}
		
		function CheckCompatibility(gameInstance, onsuccess, onerror)
		{
			if (!UnityLoader.SystemInfo.hasWebGL) {
				document.getElementById("errorBrowserBlock").style.display = "inherit";
				onerror();
			} else if (UnityLoader.SystemInfo.mobile) {
				document.getElementById("warningMobileBlock").style.display = "inherit";
				onsuccess();
			} else if (["Firefox", "Chrome", "Safari"].indexOf(UnityLoader.SystemInfo.browser) == -1) {
				document.getElementById("warningBrowserBlock").style.display = "inherit";
				onsuccess();
			} else {
				onsuccess();
			}
		}
		
		function RuntimeInitialized(){
		}
		
		function UnityProgress(gameInstance, progress) {
			if (!gameInstance.Module)
			return;
			document.getElementById("loadingBlock").style.display = "inherit";	 	
			document.getElementById("fullBar").style.width = (100 * progress) + "%";
			document.getElementById("emptyBar").style.width = (100 * (1 - progress)) + "%";
			if (progress == 1)
			{
				setTimeout(function(){ document.getElementById("loadingBlock").style.display = "none"; }, 1000);
			}	
		}
		
		var gameInstance = UnityLoader.instantiate("gameContainer", "Build/webglgd.json", {
			onProgress: UnityProgress,
			compatibilityCheck:CheckCompatibility,
			Module: {
				//TOTAL_MEMORY: 268435456,
				onRuntimeInitialized:RuntimeInitialized,
			},		
		});