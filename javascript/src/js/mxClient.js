/**
 * $Id: mxClient.js,v 1.203 2012-07-19 15:19:07 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
var mxClient = (function() {
	
    var IS_IE = (document.attachEvent && !document.addEventListener) || typeof document.documentMode == 'number';
    
    var IS_VML = (function() {
        var el = document.createElement('div');
        el.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
        var elFirstChild = el.firstChild;
        if (elFirstChild) {
            elFirstChild.style.behavior = "url(#default#VML)";
            return typeof elFirstChild.adj == "object";
        }
        return false;
    })();
	
    var result = {

	/**
	 * Class: mxClient
	 *
	 * Bootstrapping mechanism for the mxGraph thin client. The production version
	 * of this file contains all code required to run the mxGraph thin client, as
	 * well as global constants to identify the browser and operating system in
	 * use. You may have to load chrome://global/content/contentAreaUtils.js in
	 * your page to disable certain security restrictions in Mozilla.
	 * 
	 * Variable: VERSION
	 *
	 * Contains the current version of the mxGraph library. The strings that
	 * communicate versions of mxGraph use the following format.
	 * 
	 * versionMajor.versionMinor.buildNumber.revisionNumber
	 * 
	 * Current version is 1.10.3.2.
	 */
	VERSION: '1.10.3.2',

	/**
	 * Variable: IS_IE
	 * Deprecated
	 *
	 * True if the current browser is Internet Explorer.
	 */
	IS_IE: IS_IE,

	/**
	 * Variable: IS_IE6
	 * Deprecated
	 *
	 * True if the current browser is Internet Explorer 6.x.
	 */
	IS_IE6: IS_IE && !window.XMLHttpRequest,

	/**
	 * Variable: IS_QUIRKS (IS_IE_QUIRKS is a better name)
	 * Deprecated
	 *
	 * True if the current browser is Internet Explorer and it is in quirks mode.
	 */
	IS_QUIRKS: IS_IE && (typeof document.compatMode == 'undefined' || document.compatMode == 'BackCompat'),

	/**
	 * Variable: IS_NS
	 * Deprecated
	 *
	 * True if the current browser is Netscape (including Firefox).
	 */
    IS_NS: navigator.userAgent.indexOf('Mozilla/') >= 0 && navigator.userAgent.indexOf('MSIE') < 0,

	/**
	 * Variable: IS_OP
	 * Deprecated
	 *
	 * True if the current browser is Opera.
	 */
    IS_OP: !!window.opera,

	/**
	 * Variable: IS_OT
	 *
	 * True if -o-transform is available as a CSS style. This is the case
	 * for Opera browsers that use Presto/2.5 and later.
	 */
    IS_OT: typeof document.documentElement.style.OTransform != 'undefined',
    
	/**
	 * Variable: IS_SF
	 * Deprecated
	 *
	 * True if the current browser is Safari.
	 */
    IS_SF: navigator.userAgent.indexOf('AppleWebKit/') >= 0 && navigator.userAgent.indexOf('Chrome/') < 0,

	/**
	 * Variable: IS_GC
	 * Deprecated
	 *
	 * True if the current browser is Google Chrome.
	 */
    IS_GC: navigator.userAgent.indexOf('Chrome/') >= 0,

	/**
	 * Variable: IS_MT
	 *
	 * True if -moz-transform is available as a CSS style. This is the case
	 * for all Firefox-based browsers newer than or equal 3, such as Camino,
	 * Iceweasel, Seamonkey and Iceape.
	 */
    IS_MT: typeof document.documentElement.style.MozTransform != 'undefined',

	/**
	 * Variable: IS_SVG
	 *
	 * True if the browser supports SVG.
	 */
    IS_SVG: !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect,
    IS_VML_BAD: IS_VML && document.documentMode == 8,
	/**
	 * Variable: NO_FO
	 * Deprecated
	 *
	 * True if foreignObject support is not available. This is the case for
	 * Opera and older SVG-based browsers. IE does not require this type
	 * of tag.
	 */
    NO_FO: navigator.userAgent.indexOf('Firefox/1.') >= 0 ||
  		navigator.userAgent.indexOf('Iceweasel/1.') >= 0 ||
  		navigator.userAgent.indexOf('Firefox/2.') >= 0 ||
	  	navigator.userAgent.indexOf('Iceweasel/2.') >= 0 ||
	  	navigator.userAgent.indexOf('SeaMonkey/1.') >= 0 ||
	  	navigator.userAgent.indexOf('Iceape/1.') >= 0 ||
	  	navigator.userAgent.indexOf('Camino/1.') >= 0 ||
	  	navigator.userAgent.indexOf('Epiphany/2.') >= 0 ||
	  	navigator.userAgent.indexOf('Opera/') >= 0 ||
	  	navigator.userAgent.indexOf('MSIE') >= 0 ||
	  	navigator.userAgent.indexOf('Mozilla/2.') >= 0, // Safari/Google Chrome

	/**
	 * Variable: IS_VML
	 *
	 * True if the browser supports VML.
	 */
	IS_VML: IS_VML,

	/**
	 * Variable: IS_MAC
	 * Deprecated
	 *
	 * True if the client is a Mac.
	 */
  	IS_MAC: navigator.userAgent.toUpperCase().indexOf('MACINTOSH') > 0,

	/**
	 * Variable: IS_TOUCH
	 * Deprecated
	 *
	 * True if this client uses a touch interface (no mouse). Currently this
	 * detects IPads, IPods, IPhones and Android devices.
	 */
  	IS_TOUCH: (function() {
  		
  		// NOTE: Known to "false" in some older Chrome versions
  		//       Preferable to a UA sniff for our immediate purposes
  		
  	    // FIXME: Mouse/touch switching (need to attach both)
  		
		var el = document.createElement('div');
	    if (el && el.setAttribute) {
	      if (typeof el.ontouchstart == 'undefined') {
	        el.setAttribute('ontouchstart', 'window.alert(" ");');
	        return typeof el.ontouchstart == 'function';
	      }
	    }
	    return false;
  	})(),

	/**
	 * Variable: IS_LOCAL
	 *
	 * True if the documents location does not start with http:// or https://.
	 */
  	IS_LOCAL: document.location.href.indexOf('http://') < 0 &&
  			  document.location.href.indexOf('https://') < 0,

	/**
	 * Function: isBrowserSupported
	 *
	 * Returns true if the current browser is supported, that is, if
	 * <mxClient.IS_VML> or <mxClient.IS_SVG> is true.
	 * 
	 * Example:
	 * 
	 * (code)
	 * if (!mxClient.isBrowserSupported())
	 * {
	 *   mxUtils.error('Browser is not supported!', 200, false);
	 * }
	 * (end)
	 */
	isBrowserSupported: function()
	{
		return mxClient.IS_VML || mxClient.IS_SVG;
	},

	/**
	 * Function: link
	 *
	 * Adds a link node to the head of the document. Use this
	 * to add a stylesheet to the page as follows:
	 *
	 * (code)
	 * mxClient.link('stylesheet', filename);
	 * (end)
	 *
	 * where filename is the (relative) URL of the stylesheet. The charset
	 * is hardcoded to ISO-8859-1 and the type is text/css.
	 * 
	 * Parameters:
	 * 
	 * rel - String that represents the rel attribute of the link node.
	 * href - String that represents the href attribute of the link node.
	 * doc - Optional parent document of the link node.
	 */
	link: function(rel, href, doc)
	{		
		// Use document.write as MXGraph script(s) may be in the HEAD
		// Not a good idea to mutate a DOM structure while it is still parsing
		// See: IE Operation Aborted
		
		(doc || document).write('<link rel="'+rel+'" href="'+href+'" type="text/css"/>');
	},
	
	/**
	 * Function: include
	 *
	 * Dynamically adds a script node to the document header.
	 * 
	 * In production environments, the includes are resolved in the mxClient.js
	 * file to reduce the number of requests required for client startup. This
	 * function should only be used in development environments, but not in
	 * production systems.
	 */
	include: function(src)
	{
		document.write('<script type="text/javascript" src="' + src + '"><\/script>');
	},
	
	/**
	 * Function: dispose
	 * Deprecated
	 * 
	 * Frees up memory in IE by resolving cyclic dependencies between the DOM
	 * and the JavaScript objects. This is always invoked in IE when the page
	 * unloads.
	 * 
	 * FIXME: Don't create cyclic dependencies between...
	 * 
	 */
	dispose: function()
	{
		// Cleans all objects where listeners have been added
		for (var i = 0; i < mxEvent.objects.length; i++)
		{
			if (mxEvent.objects[i].mxListenerList != null)
			{
				mxEvent.removeAllListeners(mxEvent.objects[i]);
			}
		}
	}

};

/**
 * Variable: mxLoadResources
 * 
 * Optional global config variable to toggle loading of the two resource files
 * in <mxGraph> and <mxEditor>. Default is true. NOTE: This is a global variable,
 * not a variable of mxClient.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLoadResources = false;
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 */

if (typeof mxLoadResources == 'undefined')
{
	mxLoadResources = true;
}

/**
 * Variable: mxLoadStylesheets
 * 
 * Optional global config variable to toggle loading of the CSS files when
 * the library is initialized. Default is true. NOTE: This is a global variable,
 * not a variable of mxClient.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLoadStylesheets = false;
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 */

if (typeof mxLoadStylesheets == 'undefined')
{
	mxLoadStylesheets = true;
}

/**
 * Variable: basePath
 *
 * Basepath for all URLs in the core without trailing slash. Default is '.'.
 * Set mxBasePath prior to loading the mxClient library as follows to override
 * this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxBasePath = '/path/to/core/directory';
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 * 
 * When using a relative path, the path is relative to the URL of the page that
 * contains the assignment. Trailing slashes are automatically removed.
 */

if (typeof mxBasePath != 'undefined' && mxBasePath.length > 0)
{
	// Adds a trailing slash if required
	if (mxBasePath.substring(mxBasePath.length - 1) == '/')
	{
		mxBasePath = mxBasePath.substring(0, mxBasePath.length - 1);
	}

	result.basePath = mxBasePath;
}
else
{
	result.basePath = '.';
}

/**
 * Variable: imageBasePath
 *
 * Basepath for all images URLs in the core without trailing slash. Default is
 * <mxClient.basePath> + '/images'. Set mxImageBasePath prior to loading the
 * mxClient library as follows to override this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxImageBasePath = '/path/to/image/directory';
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 * 
 * When using a relative path, the path is relative to the URL of the page that
 * contains the assignment. Trailing slashes are automatically removed.
 */

if (typeof(mxImageBasePath) != 'undefined' && mxImageBasePath.length > 0)
{
	// Adds a trailing slash if required
	if (mxImageBasePath.substring(mxImageBasePath.length - 1) == '/')
	{
		mxImageBasePath = mxImageBasePath.substring(0, mxImageBasePath.length - 1);
	}

	result.imageBasePath = mxImageBasePath;
}
else
{
	result.imageBasePath = result.basePath + '/images';	
}

/**
 * Variable: language
 *
 * Defines the language of the client, eg. en for english, de for german etc.
 * The special value 'none' will disable all built-in internationalization and
 * resource loading. See <mxResources.getSpecialBundle> for handling identifiers
 * with and without a dash.
 * 
 * Set mxLanguage prior to loading the mxClient library as follows to override
 * this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxLanguage = 'en';
 * </script>
 * <script type="text/javascript" src="js/mxClient.js"></script>
 * (end)
 * 
 * If internationalization is disabled, then the following variables should be
 * overridden to reflect the current language of the system. These variables are
 * cleared when i18n is disabled.
 * <mxEditor.askZoomResource>, <mxEditor.lastSavedResource>,
 * <mxEditor.currentFileResource>, <mxEditor.propertiesResource>,
 * <mxEditor.tasksResource>, <mxEditor.helpResource>, <mxEditor.outlineResource>,
 * <mxElbowEdgeHandler.doubleClickOrientationResource>, <mxUtils.errorResource>,
 * <mxUtils.closeResource>, <mxGraphSelectionModel.doneResource>,
 * <mxGraphSelectionModel.updatingSelectionResource>, <mxGraphView.doneResource>,
 * <mxGraphView.updatingDocumentResource>, <mxCellRenderer.collapseExpandResource>,
 * <mxGraph.containsValidationErrorsResource> and
 * <mxGraph.alreadyConnectedResource>.
 */

if (typeof mxLanguage != 'undefined')
{
	result.language = mxLanguage;
}
else
{
	result.language = navigator.userLanguage || navigator.language || 'en';
}

/**
 * Variable: defaultLanguage
 * 
 * Defines the default language which is used in the common resource files. Any
 * resources for this language will only load the common resource file, but not
 * the language-specific resource file. Default is 'en'.
 * 
 * Set mxDefaultLanguage prior to loading the mxClient library as follows to override
 * this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxDefaultLanguage = 'de';
 * </script>
 * <script type="text/javascript" src="js/mxClient.js"></script>
 * (end)
 */

if (typeof mxDefaultLanguage != 'undefined')
{
	result.defaultLanguage = mxDefaultLanguage;
}
else
{
	result.defaultLanguage = 'en';
}

// Adds all required stylesheets and namespaces

if (mxLoadStylesheets)
{
	result.link('stylesheet', result.basePath + '/css/common.css');
}

/**
 * Variable: languages
 *
 * Defines the optional array of all supported language extensions. The default
 * language does not have to be part of this list. See
 * <mxResources.isLanguageSupported>.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLanguages = ['de', 'it', 'fr'];
 * </script>
 * <script type="text/javascript" src="js/mxClient.js"></script>
 * (end)
 * 
 * This is used to avoid unnecessary requests to language files, ie. if a 404
 * will be returned.
 */

if (typeof mxLanguages != 'undefined')
{
	mxClient.languages = mxLanguages;
}

if (result.IS_VML && typeof document.namespaces != 'undefined' && typeof document.namespaces.add != 'undefined' && typeof document.createStyleSheet != 'undefined')
{

	// Enables support for IE8 standards mode. Note that this requires all attributes for VML
	// elements to be set using direct notation, ie. node.attr = value. The use of setAttribute
	// is not possible. See mxShape.init for more code to handle this specific document mode.
			
	if (result.IS_VML_BAD)
	{
		document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
		document.namespaces.add('o', 'urn:schemas-microsoft-com:office:office', '#default#VML');
	}
	else
	{
		document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
		document.namespaces.add('o', 'urn:schemas-microsoft-com:office:office');
	}
	
    var ss = document.createStyleSheet();
    ss.cssText = 'v\\:*{behavior:url(#default#VML)}o\\:*{behavior:url(#default#VML)}';
    
    if (mxLoadStylesheets)
    {
    	result.link('stylesheet', result.basePath + '/css/explorer.css');
    }

	// Cleans up resources when the application terminates (IE 8-)
            
    if (window.attachEvent && !window.addEventListener) {
		window.attachEvent('onunload', result.dispose);
	}
}

result.include(result.basePath+'/js/util/mxLog.js');
result.include(result.basePath+'/js/util/mxObjectIdentity.js');
result.include(result.basePath+'/js/util/mxDictionary.js');
result.include(result.basePath+'/js/util/mxResources.js');
result.include(result.basePath+'/js/util/mxPoint.js');
result.include(result.basePath+'/js/util/mxRectangle.js');
//result.include(result.basePath+'/js/util/mxEffects.js');
result.include(result.basePath+'/js/util/mxUtils.js');
result.include(result.basePath+'/js/util/mxConstants.js');
result.include(result.basePath+'/js/util/mxEventObject.js');
result.include(result.basePath+'/js/util/mxMouseEvent.js');
result.include(result.basePath+'/js/util/mxEventSource.js');
result.include(result.basePath+'/js/util/mxEvent.js');
//result.include(result.basePath+'/js/util/mxXmlRequest.js');
//result.include(result.basePath+'/js/util/mxClipboard.js');
result.include(result.basePath+'/js/util/mxWindow.js');
result.include(result.basePath+'/js/util/mxForm.js');
result.include(result.basePath+'/js/util/mxImage.js');
result.include(result.basePath+'/js/util/mxDivResizer.js');
//result.include(result.basePath+'/js/util/mxDragSource.js');
//result.include(result.basePath+'/js/util/mxToolbar.js');
result.include(result.basePath+'/js/util/mxSession.js');
result.include(result.basePath+'/js/util/mxUndoableEdit.js');
result.include(result.basePath+'/js/util/mxUndoManager.js');
result.include(result.basePath+'/js/util/mxUrlConverter.js');
//result.include(result.basePath+'/js/util/mxPanningManager.js');
result.include(result.basePath+'/js/util/mxPath.js');
//result.include(result.basePath+'/js/util/mxPopupMenu.js');
result.include(result.basePath+'/js/util/mxAutoSaveManager.js');
//result.include(result.basePath+'/js/util/mxAnimation.js');
//result.include(result.basePath+'/js/util/mxMorphing.js');
result.include(result.basePath+'/js/util/mxImageBundle.js');
result.include(result.basePath+'/js/util/mxImageExport.js');
result.include(result.basePath+'/js/util/mxXmlCanvas2D.js');
result.include(result.basePath+'/js/util/mxSvgCanvas2D.js');
result.include(result.basePath+'/js/util/mxGuide.js');
result.include(result.basePath+'/js/shape/mxShape.js');
result.include(result.basePath+'/js/shape/mxStencil.js');
result.include(result.basePath+'/js/shape/mxStencilRegistry.js');
result.include(result.basePath+'/js/shape/mxStencilShape.js');
result.include(result.basePath+'/js/shape/mxMarker.js');
result.include(result.basePath+'/js/shape/mxActor.js');
result.include(result.basePath+'/js/shape/mxCloud.js');
result.include(result.basePath+'/js/shape/mxRectangleShape.js');
result.include(result.basePath+'/js/shape/mxEllipse.js');
result.include(result.basePath+'/js/shape/mxDoubleEllipse.js');
result.include(result.basePath+'/js/shape/mxRhombus.js');
result.include(result.basePath+'/js/shape/mxPolyline.js');
result.include(result.basePath+'/js/shape/mxArrow.js');
result.include(result.basePath+'/js/shape/mxText.js');
result.include(result.basePath+'/js/shape/mxTriangle.js');
result.include(result.basePath+'/js/shape/mxHexagon.js');
result.include(result.basePath+'/js/shape/mxLine.js');
result.include(result.basePath+'/js/shape/mxImageShape.js');
result.include(result.basePath+'/js/shape/mxLabel.js');
result.include(result.basePath+'/js/shape/mxCylinder.js');
result.include(result.basePath+'/js/shape/mxConnector.js');
result.include(result.basePath+'/js/shape/mxSwimlane.js');
result.include(result.basePath+'/js/layout/mxGraphLayout.js');
result.include(result.basePath+'/js/layout/mxStackLayout.js');
//result.include(result.basePath+'/js/layout/mxPartitionLayout.js');
//result.include(result.basePath+'/js/layout/mxCompactTreeLayout.js');
//result.include(result.basePath+'/js/layout/mxFastOrganicLayout.js');
//result.include(result.basePath+'/js/layout/mxCircleLayout.js');
//result.include(result.basePath+'/js/layout/mxParallelEdgeLayout.js');
//result.include(result.basePath+'/js/layout/mxCompositeLayout.js');
//result.include(result.basePath+'/js/layout/mxEdgeLabelLayout.js');
//result.include(result.basePath+'/js/layout/hierarchical/model/mxGraphAbstractHierarchyCell.js');
//result.include(result.basePath+'/js/layout/hierarchical/model/mxGraphHierarchyNode.js');
//result.include(result.basePath+'/js/layout/hierarchical/model/mxGraphHierarchyEdge.js');
//result.include(result.basePath+'/js/layout/hierarchical/model/mxGraphHierarchyModel.js');
//result.include(result.basePath+'/js/layout/hierarchical/stage/mxHierarchicalLayoutStage.js');
//result.include(result.basePath+'/js/layout/hierarchical/stage/mxMedianHybridCrossingReduction.js');
//result.include(result.basePath+'/js/layout/hierarchical/stage/mxMinimumCycleRemover.js');
//result.include(result.basePath+'/js/layout/hierarchical/stage/mxCoordinateAssignment.js');
//result.include(result.basePath+'/js/layout/hierarchical/mxHierarchicalLayout.js');
result.include(result.basePath+'/js/model/mxGraphModel.js');
result.include(result.basePath+'/js/model/mxCell.js');
result.include(result.basePath+'/js/model/mxGeometry.js');
result.include(result.basePath+'/js/model/mxCellPath.js');
result.include(result.basePath+'/js/view/mxPerimeter.js');
//result.include(result.basePath+'/js/view/mxPrintPreview.js');
result.include(result.basePath+'/js/view/mxStylesheet.js');
result.include(result.basePath+'/js/view/mxCellState.js');
result.include(result.basePath+'/js/view/mxGraphSelectionModel.js');
result.include(result.basePath+'/js/view/mxCellEditor.js');
result.include(result.basePath+'/js/view/mxCellRenderer.js');
result.include(result.basePath+'/js/view/mxEdgeStyle.js');
result.include(result.basePath+'/js/view/mxStyleRegistry.js');
result.include(result.basePath+'/js/view/mxGraphView.js');
result.include(result.basePath+'/js/view/mxGraph.js');
result.include(result.basePath+'/js/view/mxCellOverlay.js');
result.include(result.basePath+'/js/view/mxOutline.js');
result.include(result.basePath+'/js/view/mxMultiplicity.js');
result.include(result.basePath+'/js/view/mxLayoutManager.js');
result.include(result.basePath+'/js/view/mxSpaceManager.js');
result.include(result.basePath+'/js/view/mxSwimlaneManager.js');
result.include(result.basePath+'/js/view/mxTemporaryCellStates.js');
result.include(result.basePath+'/js/view/mxCellStatePreview.js');
result.include(result.basePath+'/js/view/mxConnectionConstraint.js');
result.include(result.basePath+'/js/handler/mxGraphHandler.js');
//result.include(result.basePath+'/js/handler/mxPanningHandler.js');
result.include(result.basePath+'/js/handler/mxCellMarker.js');
result.include(result.basePath+'/js/handler/mxSelectionCellsHandler.js');
result.include(result.basePath+'/js/handler/mxConnectionHandler.js');
result.include(result.basePath+'/js/handler/mxConstraintHandler.js');
result.include(result.basePath+'/js/handler/mxRubberband.js');
result.include(result.basePath+'/js/handler/mxVertexHandler.js');
result.include(result.basePath+'/js/handler/mxEdgeHandler.js');
result.include(result.basePath+'/js/handler/mxElbowEdgeHandler.js');
result.include(result.basePath+'/js/handler/mxEdgeSegmentHandler.js');
result.include(result.basePath+'/js/handler/mxKeyHandler.js');
//result.include(result.basePath+'/js/handler/mxTooltipHandler.js');
result.include(result.basePath+'/js/handler/mxCellTracker.js');
result.include(result.basePath+'/js/handler/mxCellHighlight.js');
result.include(result.basePath+'/js/editor/mxDefaultKeyHandler.js');
//result.include(result.basePath+'/js/editor/mxDefaultPopupMenu.js');
//result.include(result.basePath+'/js/editor/mxDefaultToolbar.js');
//result.include(result.basePath+'/js/editor/mxEditor.js');
result.include(result.basePath+'/js/io/mxCodecRegistry.js');
result.include(result.basePath+'/js/io/mxCodec.js');
result.include(result.basePath+'/js/io/mxObjectCodec.js');
result.include(result.basePath+'/js/io/mxCellCodec.js');
result.include(result.basePath+'/js/io/mxModelCodec.js');
result.include(result.basePath+'/js/io/mxRootChangeCodec.js');
result.include(result.basePath+'/js/io/mxChildChangeCodec.js');
result.include(result.basePath+'/js/io/mxTerminalChangeCodec.js');
result.include(result.basePath+'/js/io/mxGenericChangeCodec.js');
result.include(result.basePath+'/js/io/mxGraphCodec.js');
result.include(result.basePath+'/js/io/mxGraphViewCodec.js');
result.include(result.basePath+'/js/io/mxStylesheetCodec.js');
result.include(result.basePath+'/js/io/mxDefaultKeyHandlerCodec.js');
//result.include(result.basePath+'/js/io/mxDefaultToolbarCodec.js');
//result.include(result.basePath+'/js/io/mxDefaultPopupMenuCodec.js');
//result.include(result.basePath+'/js/io/mxEditorCodec.js');

return result;

})();
