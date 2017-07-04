taEmoji = {};

taEmoji.getInstance = function(){
    if (typeof jQuery == 'undefined') {
        taEmoji.logErr('jQuery not found');
    }

    return jQuery.extend(true, {}, taEmoji);
}

taEmoji.logErr = function(text){
    console.log('TA-EMOJI ERR: ' + text);
};

taEmoji.options = {

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
		}

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
		autoHideInterval:250
	},

    emojiIcoTable:{
        code: [
        ],
        emojiClass: [
        ]
    }
};

taEmoji.baseElement = null;
taEmoji.emojiTextarea = null;
taEmoji.updateBaseElementContentTimer = null;
taEmoji.emojiPanelHideTimer = null;

taEmoji.attach = function(baseElementSelector, options){

    if (typeof jQuery == 'undefined') {
        taEmoji.logErr('Required jQuery not found');
    }

    var $ = jQuery;

    if (typeof baseElementSelector == 'undefined') {
        taEmoji.logErr('Base element not specified');
    }

    taEmoji.baseElement = $(baseElementSelector).first();

    if (!taEmoji.baseElement.length) {
        taEmoji.logErr('Base element not found on page');
    }

    if (typeof options != 'undefined') {
        for(var key in options) {
            if (taEmoji.options.hasOwnProperty(key)) {
                taEmoji.options.key = options.key;
            }
        }
    }

    taEmoji.emojiTextarea = $('<div/>', taEmoji.options.emojiTextarea.attr);

    taEmoji.baseElement.resize(function(){
        taEmoji.emojiTextarea.width(taEmoji.baseElement.width());
        taEmoji.emojiTextarea.height(taEmoji.baseElement.height());
    });
    taEmoji.baseElement.resize();

    taEmoji.emojiTextarea.on('blur drop keyup paste copy cut mouseup', function(){

        if (taEmoji.updateBaseElementContentTimer != null) {
            clearInterval(taEmoji.updateBaseElementContentTimer);
            taEmoji.updateBaseElementContentTimer = null;
        }
        taEmoji.updateBaseElementContentTimer = setTimeout(function(){
            taEmoji.baseElement.val(
                taEmoji.convertEmojiTextToPlainText(
                    taEmoji.emojiTextarea.html()
                )
            );
        }, 1000);

    });

    taEmoji.emojiTextarea.insertAfter(taEmoji.baseElement);

    taEmoji.baseElement.hide();

    taEmoji.emojiTextarea.html(
        taEmoji.convertPlainTextToEmojiText(
            taEmoji.baseElement.val()
        )
    );

    setTimeout(function(){ try { document.execCommand("enableObjectResizing", false, false); } catch(e) {} }, 1);
};

taEmoji.convertEmojiTextToPlainText = function(html){
    var $ = jQuery;
    var text = $("<div/>");
    var emojiIcoTable = taEmoji.options.emojiIcoTable;
    text.append(html);
    text.find('.'+taEmoji.options.emojiTextarea.emojiIco.attr.class).replaceWith(function(){
        var id = +$(this).data(taEmoji.options.emojiTextarea.emojiIco.dataCodeAttr);
        return emojiIcoTable.code[id];
    });
    text.find('br').replaceWith("\n");
    return text.text();
};

taEmoji.convertPlainTextToEmojiText = function(text){
    var $ = jQuery;
    var emojiIcoTable = taEmoji.options.emojiIcoTable;
    for (var i = 0; i < emojiIcoTable.code.length; i++) {
        var code = emojiIcoTable.code[i].trim();
        var alt = emojiIcoTable.alt[i].trim();
		var emoji = null;

		if (alt && (text.indexOf(alt) > -1)) {
			regexAlt = new RegExp(alt, "gu");
			text = text.replace(regexAlt, code);
		}

		if (code && (text.indexOf(code) > -1)) {
			regexCode = new RegExp(code, "g");
			if (emoji == null) emoji = taEmoji.createEmojiFromEmojiTableItem(i);
			text = text.replace(regexCode, emoji[0].outerHTML);
		}

    }
    return text;
};

taEmoji.createEmojiFromEmojiTableItem = function(emojiTableItemId){
	var emojiIcoTable = taEmoji.options.emojiIcoTable;
	var emoji = $('<img/>', taEmoji.options.emojiTextarea.emojiIco.attr);
	emoji.resize(function(){return false;});
	emoji.addClass(emojiIcoTable.emojiClass[emojiTableItemId]);
	emoji.attr('alt', emojiIcoTable.alt[emojiTableItemId]);
	emoji.attr('data-'+taEmoji.options.emojiTextarea.emojiIco.dataCodeAttr, emojiTableItemId);
	emoji.data(taEmoji.options.emojiTextarea.emojiIco.dataCodeAttr, emojiTableItemId);
	return emoji;
}

// https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
// https://stackoverflow.com/questions/16736680/get-caret-position-in-contenteditable-div-including-tags
// https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
taEmoji.pasteHtmlAtCaret = function(html) {

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

taEmoji.hideEmojiPanel = function(timeout){
    var $ = jQuery;
    var emojiPanel = $('#'+taEmoji.options.emojiPanel.attr.id+':visible');

    if (!emojiPanel.length) return false;

    if(typeof timeout == 'undefined'){
        timeout = 0;
    }

    if(!timeout) {
        emojiPanel.hide();
    } else {
        if (taEmoji.emojiPanelHideTimer != null) {
            clearInterval(taEmoji.emojiPanelHideTimer);
            taEmoji.emojiPanelHideTimer = null;
        }
        taEmoji.emojiPanelHideTimer = setTimeout(function(){emojiPanel.hide();}, timeout);
    }
};

taEmoji.loadEmojiPanel = function(){
    emojiPanel = $('<div/>', taEmoji.options.emojiPanel.attr);

    if (taEmoji.options.emojiPanel.autoHide) {

		emojiPanel.mouseenter(function(){
			if (taEmoji.emojiPanelHideTimer != null) {
				clearInterval(taEmoji.emojiPanelHideTimer);
				taEmoji.emojiPanelHideTimer = null;
			}
		});

        emojiPanel.mouseleave(function(){
            taEmoji.hideEmojiPanel(taEmoji.options.emojiPanel.autoHideInterval);
        });
    }

    var emojiIcoTable = taEmoji.options.emojiIcoTable;

    for (var i=0; i<emojiIcoTable.code.length; i++) {
        var emoji = $('<img/>',  taEmoji.options.emojiPanel.emojiBtn.emojiIco.attr);
        emoji.addClass(emojiIcoTable.emojiClass[i]);
        emoji.attr('alt', emojiIcoTable.alt[i]);

        var panelBtn = $('<span/>', taEmoji.options.emojiPanel.emojiBtn.attr);
        panelBtn.attr('data-ta-emoji', i);
        panelBtn.append(emoji);
        panelBtn.click(function(){
            taEmoji.emojiTextarea.focus();
            var emojiTableItemId = +$(this).data('ta-emoji');
            var emoji = taEmoji.createEmojiFromEmojiTableItem(emojiTableItemId);
            taEmoji.pasteHtmlAtCaret(emoji[0].outerHTML);
            return false;
        });

        emojiPanel.append(panelBtn);
    }

    emojiPanel.hide();
    $('body').append(emojiPanel);
};

taEmoji.showEmojiPanel = function(position){

    var $ = jQuery;

    var emojiPanel = $('#'+taEmoji.options.emojiPanel.attr.id);

    if (emojiPanel.is(':visible')) return;

    if (!emojiPanel.length) {
		taEmoji.loadEmojiPanel();
	}

	position.top -= emojiPanel.height();
	emojiPanel.css(position);
	emojiPanel.show();
};
