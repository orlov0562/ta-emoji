taEmojiClass = {
    emojiIcoTable:{
        code: [
        ],
        emojiClass: [
        ]
    }
};

taEmojiClass.getInstance = function(){
    if (typeof jQuery == 'undefined') {taEmoji.logErr('jQuery not found');}
    var obj = jQuery.extend(true, {}, taEmojiClass);
    obj.init();
    return obj;
}

taEmojiClass.init = function(){
	this.options = taEmojiClass.getOptions();
    this.baseElement = null;
    this.emojiTextarea = null;
    this.updateBaseElementContentTimer = null;
    this.emojiPanelHideTimer = null;
}

taEmojiClass.logErr = function(text){
    console.log('TA-EMOJI ERR: ' + text);
};

taEmojiClass.getOptions = function(){
	return {
		emojiTextarea:{
			attr: {
				contentEditable:true,
				id:'ta-emoji-textarea',
				class:'ta-emoji-textarea'
			},
			emojiIco: {
				attr:{
					//contentEditable:false,
					src:'ta-emoji/blank.gif',
					class:'ta-emoji-ico'
				},
				dataCodeAttr:'ta-emoji'
			},
			syncBaseElementInterval: 250
		},

		emojiPanel:{
			attr:{
				id:'ta-emoji-panel',
				class:'ta-emoji-panel'
			},
			emojiBtn:{
				attr:{
					class:'ta-emoji-panel-btn'
				},
				emojiIco: {
					attr:{
						src:'ta-emoji/blank.gif',
						class:'ta-emoji-ico'
					}
				}
			},
			autoHide:false,
			autoHideInterval:250,
			hideOnSelectOne: false
		}
	};
}


taEmojiClass.attach = function(baseElementSelector, options){

    if (typeof jQuery == 'undefined') {
    	taEmojiClass.logErr('Required jQuery not found');
    }

    var $ = jQuery;

    if (typeof baseElementSelector == 'undefined') {
    	taEmojiClass.logErr('Base element not specified');
    }

    var _instance = this;

    _instance.baseElement = $(baseElementSelector).first();

    if (!_instance.baseElement.length) {
        taEmojiClass.logErr('Base element not found on page');
    }

    if (typeof options != 'undefined') {
        for(var key in options) {
            if (_instance.options.hasOwnProperty(key)) {
            	_instance.options.key = options.key;
            }
        }
    }

    _instance.emojiTextarea = $('<div/>', _instance.options.emojiTextarea.attr);

    _instance.emojiTextarea.on('blur drop keyup copy cut mouseup', function(){
    	if (!_instance.options.emojiTextarea.syncBaseElementInterval) {
        	_instance.baseElement.val(
    			_instance.convertEmojiTextToPlainText(
					_instance.emojiTextarea.html()
                )
            );
    	} else {
	        if (_instance.updateBaseElementContentTimer != null) {
	            clearInterval(_instance.updateBaseElementContentTimer);
	            _instance.updateBaseElementContentTimer = null;
	        }

	        _instance.updateBaseElementContentTimer = setTimeout(function(){
	        	_instance.baseElement.val(
	    			_instance.convertEmojiTextToPlainText(
						_instance.emojiTextarea.html()
	                )
	            );
	        }, _instance.options.emojiTextarea.syncBaseElementInterval);
    	}
        _instance.emojiTextarea.trigger('input');
    }).on('paste', function(e) {
    	// insert as plain text
        e.preventDefault();
        var text = '';
        if (e.clipboardData || e.originalEvent.clipboardData) {
          text = (e.originalEvent || e).clipboardData.getData('text/plain');
        } else if (window.clipboardData) {
          text = window.clipboardData.getData('Text');
        }
        if (document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, text);
        } else {
          document.execCommand('paste', false, text);
        }
        // update base input
        _instance.emojiTextarea.keyup();
    });

    _instance.emojiTextarea.insertAfter(_instance.baseElement);

    _instance.baseElement.hide();

    _instance.emojiTextarea.html(
		_instance.convertPlainTextToEmojiText(
				_instance.baseElement.val()
        )
    );
    setTimeout(function(){
    	try { document.execCommand("enableObjectResizing", false, false); } catch(e) {};
	}, 1);
};

taEmojiClass.convertEmojiTextToPlainText = function(html){
    var $ = jQuery;
    var _instance = this;
    var text = $("<div/>");
    var emojiIcoTable = taEmojiClass.emojiIcoTable;
    text.append(html);
    text.find('.'+_instance.options.emojiTextarea.emojiIco.attr.class).replaceWith(function(){
        var emojiName = $(this).data(_instance.options.emojiTextarea.emojiIco.dataCodeAttr);
        return ':'+emojiName+':';
    });
    text.find('br').replaceWith("\n");
    return text.text();
};

taEmojiClass.convertPlainTextToEmojiText = function(text){
    var $ = jQuery;
    var _instance = this;
    var emojiIcoTable = taEmojiClass.emojiIcoTable;

    for(emojiIcoName in emojiIcoTable) {
        var code = ':'+emojiIcoName.trim()+':';
        var alt = emojiIcoTable[emojiIcoName].alt.trim();
        var emoji = null;

        if (alt && (text.indexOf(alt) > -1)) {
            regexAlt = new RegExp(alt, "gu");
            text = text.replace(regexAlt, code);
        }

        if (code && (text.indexOf(code) > -1)) {
            regexCode = new RegExp(code, "g");
            if (emoji == null) emoji = _instance.createEmojiEl(emojiIcoName, emojiIcoTable[emojiIcoName].alt);
            text = text.replace(regexCode, emoji[0].outerHTML);
        }

    }

    return text;
};

taEmojiClass.createEmojiEl = function(emojiName, emojiAlt){
    var $ = jQuery;
	var _instance = this;
	var emojiIcoTable = taEmojiClass.emojiIcoTable;
	var emoji = $('<img/>', _instance.options.emojiTextarea.emojiIco.attr);
	emoji.resize(function(){return false;});

	emoji.addClass(_instance.options.emojiTextarea.emojiIco.attr.class+"-"+emojiName);
	emoji.attr('alt', emojiAlt);
	emoji.attr('data-'+_instance.options.emojiTextarea.emojiIco.dataCodeAttr, emojiName);
	emoji.data(_instance.options.emojiTextarea.emojiIco.dataCodeAttr, emojiName);
	return emoji;
}

taEmojiClass.pasteHtmlAtCaret = function(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }

            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }

};

taEmojiClass.hideEmojiPanel = function(timeout){
    var $ = jQuery;
	var _instance = this;
    var emojiPanel = $('#'+_instance.options.emojiPanel.attr.id+':visible');

    if (!emojiPanel.length) return false;

    if(typeof timeout == 'undefined'){
        timeout = 0;
    }

    if(!timeout) {
        emojiPanel.hide();
    } else {
        if (_instance.emojiPanelHideTimer != null) {
            clearInterval(_instance.emojiPanelHideTimer);
            _instance.emojiPanelHideTimer = null;
        }
        _instance.emojiPanelHideTimer = setTimeout(function(){emojiPanel.hide();}, timeout);
    }
};

taEmojiClass.loadEmojiPanel = function(){
    var $ = jQuery;
	var _instance = this;

    emojiPanel = $('<div/>', _instance.options.emojiPanel.attr);
    emojiPanel.on('mousedown click',function(e){
    	e.stopPropagation();
    	e.preventDefault();
    	return false;
    });

    if (_instance.options.emojiPanel.autoHide) {

        emojiPanel.mouseenter(function(){
                if (_instance.emojiPanelHideTimer != null) {
                        clearInterval(_instance.emojiPanelHideTimer);
                        _instance.emojiPanelHideTimer = null;
                }
        });

        emojiPanel.mouseleave(function(){
        	_instance.hideEmojiPanel(_instance.options.emojiPanel.autoHideInterval);
        });
    }

    var emojiIcoTable = taEmojiClass.emojiIcoTable;

    panelBtns = [];
    for(emojiIcoName in emojiIcoTable) {
        var emoji = $('<img/>', _instance.options.emojiPanel.emojiBtn.emojiIco.attr);
        emoji.addClass(_instance.options.emojiPanel.emojiBtn.emojiIco.attr.class+'-'+emojiIcoName);
        emoji.attr('alt', emojiIcoTable[emojiIcoName].alt);

        var panelBtn = $('<span/>', _instance.options.emojiPanel.emojiBtn.attr);
        panelBtn.attr('data-ta-emoji', emojiIcoName);
        panelBtn.append(emoji);
        panelBtn.click(function(){
        	$('#'+_instance.options.emojiTextarea.attr.id).focus();
            var emojiIcoName = $(this).data('ta-emoji');
            var emoji = _instance.createEmojiEl(emojiIcoName, emojiIcoTable[emojiIcoName].alt);
            _instance.pasteHtmlAtCaret(emoji[0].outerHTML);
            _instance.emojiTextarea.keyup();
            if (_instance.options.emojiPanel.hideOnSelectOne) {
            	hideEmojiPanel();
            }
            return false;
        });

        panelBtns[emojiIcoTable[emojiIcoName].sort] = panelBtn;
    }
    for (key in panelBtns) emojiPanel.append(panelBtns[key]);

    emojiPanel.hide();
    $('body').append(emojiPanel);
};

taEmojiClass.showEmojiPanel = function(position){
    var $ = jQuery;
    var _instance = this;

    var emojiPanel = $('#'+_instance.options.emojiPanel.attr.id);

    if (emojiPanel.is(':visible')) return;

    if (!emojiPanel.length) {
    	_instance.loadEmojiPanel();
	}

	emojiPanel.css(position);
	emojiPanel.show();
};
