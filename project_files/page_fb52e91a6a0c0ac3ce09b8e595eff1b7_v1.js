
; /* Start:"a:4:{s:4:"full";s:107:"/local/templates/aspro-scorp_royaltent/components/bitrix/catalog.smart.filter/123/script.js?167651135621723";s:6:"source";s:91:"/local/templates/aspro-scorp_royaltent/components/bitrix/catalog.smart.filter/123/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function JCSmartFilter(ajaxURL, viewMode, params)
{
	this.ajaxURL = ajaxURL;
	this.form = null;
	this.timer = null;
	this.cacheKey = '';
	this.cache = [];
	this.viewMode = viewMode;
	if (params && params.SEF_SET_FILTER_URL)
	{
		this.bindUrlToButton('set_filter', params.SEF_SET_FILTER_URL);
		this.sef = true;
	}
	if (params && params.SEF_DEL_FILTER_URL)
	{
		this.bindUrlToButton('del_filter', params.SEF_DEL_FILTER_URL);
	}

	this.loadActiveFromCookie();
}

JCSmartFilter.prototype.keyup = function(input)
{
	if(!!this.timer)
	{
		clearTimeout(this.timer);
	}
	this.timer = setTimeout(BX.delegate(function(){
		this.reload(input);
	}, this), 500);
};

JCSmartFilter.prototype.click = function(checkbox)
{
	if(!!this.timer)
	{
		clearTimeout(this.timer);
	}

	this.timer = setTimeout(BX.delegate(function(){
		this.reload(checkbox);
	}, this), 500);
};

JCSmartFilter.prototype.reload = function(input)
{
	if (this.cacheKey !== '')
	{
		//Postprone backend query
		if(!!this.timer)
		{
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(BX.delegate(function(){
			this.reload(input);
		}, this), 1000);
		return;
	}
	this.cacheKey = '|';

	this.position = BX.pos(input, true);
	this.form = BX.findParent(input, {'tag':'form'});
	if (this.form)
	{
		var values = [];
		values[0] = {name: 'ajax', value: 'y'};
		this.gatherInputsValues(values, BX.findChildren(this.form, {'tag': new RegExp('^(input|select)$', 'i')}, true));

		for (var i = 0; i < values.length; i++)
			this.cacheKey += values[i].name + ':' + values[i].value + '|';

		if (this.cache[this.cacheKey])
		{
			this.curFilterinput = input;
			this.postHandler(this.cache[this.cacheKey], true);
		}
		else
		{
			if (this.sef)
			{
				var set_filter = BX('set_filter');
				set_filter.disabled = true;
			}

			this.curFilterinput = input;
			BX.ajax.loadJSON(
				this.ajaxURL,
				this.values2post(values),
				BX.delegate(this.postHandler, this)
			);
		}
	}
};

JCSmartFilter.prototype.updateItem = function (PID, arItem)
{
	if (arItem.PROPERTY_TYPE === 'N' || arItem.PRICE)
	{
		var trackBar = window['trackBar' + PID];
		if (!trackBar && arItem.ENCODED_ID)
			trackBar = window['trackBar' + arItem.ENCODED_ID];

		if (trackBar && arItem.VALUES)
		{
			if (arItem.VALUES.MIN)
			{
				if (arItem.VALUES.MIN.FILTERED_VALUE)
					trackBar.setMinFilteredValue(arItem.VALUES.MIN.FILTERED_VALUE);
				else
					trackBar.setMinFilteredValue(arItem.VALUES.MIN.VALUE);
			}

			if (arItem.VALUES.MAX)
			{
				if (arItem.VALUES.MAX.FILTERED_VALUE)
					trackBar.setMaxFilteredValue(arItem.VALUES.MAX.FILTERED_VALUE);
				else
					trackBar.setMaxFilteredValue(arItem.VALUES.MAX.VALUE);
			}
		}
	}
	else if (arItem.VALUES)
	{
		for (var i in arItem.VALUES)
		{
			if (arItem.VALUES.hasOwnProperty(i))
			{
				var value = arItem.VALUES[i];
				var control = BX(value.CONTROL_ID);

				if (!!control)
				{
					var label = document.querySelector('[data-role="label_'+value.CONTROL_ID+'"]');
					if (value.DISABLED)
					{
						if (label)
							BX.addClass(label, 'disabled');
						else
							BX.addClass(control.parentNode, 'disabled');
					}
					else
					{
						if (label)
							BX.removeClass(label, 'disabled');
						else
							BX.removeClass(control.parentNode, 'disabled');
					}

					if (value.hasOwnProperty('ELEMENT_COUNT'))
					{
						label = document.querySelector('[data-role="count_'+value.CONTROL_ID+'"]');
						if (label)
							label.innerHTML = value.ELEMENT_COUNT;
					}
				}
			}
		}
	}
};

JCSmartFilter.prototype.postHandler = function (result, fromCache)
{
	var hrefFILTER, url, curProp;
	var modef = BX('modef');
	var modef_num = BX('modef_num');

	if (!!result && !!result.ITEMS)
	{
		for(var PID in result.ITEMS)
		{
			if (result.ITEMS.hasOwnProperty(PID))
			{
				this.updateItem(PID, result.ITEMS[PID]);
			}
		}

		if (!!modef && !!modef_num)
		{
			modef_num.innerHTML = result.ELEMENT_COUNT;
			hrefFILTER = BX.findChildren(modef, {tag: 'A'}, true);

			if (result.FILTER_URL && hrefFILTER)
			{
				hrefFILTER[0].href = BX.util.htmlspecialcharsback(result.FILTER_URL);
			}

			if (result.FILTER_AJAX_URL && result.COMPONENT_CONTAINER_ID)
			{
				BX.unbindAll(hrefFILTER[0]);
				BX.bind(hrefFILTER[0], 'click', function(e)
				{
					url = BX.util.htmlspecialcharsback(result.FILTER_AJAX_URL);
					BX.ajax.insertToNode(url, result.COMPONENT_CONTAINER_ID);
					return BX.PreventDefault(e);
				});
			}

			if (result.INSTANT_RELOAD && result.COMPONENT_CONTAINER_ID)
			{
				url = BX.util.htmlspecialcharsback(result.FILTER_AJAX_URL);
				BX.ajax.insertToNode(url, result.COMPONENT_CONTAINER_ID);
			}
			else
			{
				if (modef.style.display === 'none')
				{
					modef.style.display = 'inline-block';
				}
				if (this.viewMode == "vertical")
				{
					curProp = BX.findChild(BX.findParent(this.curFilterinput, {'class':'bx_filter_parameters_box'}), {'class':'bx_filter_container_modef'}, true, false);
					curProp.appendChild(modef);
				}

				if (result.SEF_SET_FILTER_URL)
				{
					this.bindUrlToButton('set_filter', result.SEF_SET_FILTER_URL);
				}
			}
		}
	}

	if (this.sef)
	{
		var set_filter = BX('set_filter');
		set_filter.disabled = false;
	}

	if (!fromCache && this.cacheKey !== '')
	{
		this.cache[this.cacheKey] = result;
	}
	this.cacheKey = '';
};

JCSmartFilter.prototype.bindUrlToButton = function (buttonId, url)
{
	var button = BX(buttonId);
	if (button)
	{
		var proxy = function(j, func)
		{
			return function()
			{
				return func(j);
			}
		};

		if (button.type == 'submit')
			button.type = 'button';

		BX.bind(button, 'click', proxy(url, function(url)
		{
			window.location.href = url;
			return false;
		}));
	}
};

JCSmartFilter.prototype.gatherInputsValues = function (values, elements)
{
	if(elements)
	{
		for(var i = 0; i < elements.length; i++)
		{
			var el = elements[i];
			if (el.disabled || !el.type)
				continue;

			switch(el.type.toLowerCase())
			{
				case 'text':
				case 'textarea':
				case 'password':
				case 'hidden':
				case 'select-one':
					if(el.value.length)
						values[values.length] = {name : el.name, value : el.value};
					break;
				case 'radio':
				case 'checkbox':
					if(el.checked)
						values[values.length] = {name : el.name, value : el.value};
					break;
				case 'select-multiple':
					for (var j = 0; j < el.options.length; j++)
					{
						if (el.options[j].selected)
							values[values.length] = {name : el.name, value : el.options[j].value};
					}
					break;
				default:
					break;
			}
		}
	}
};

JCSmartFilter.prototype.values2post = function (values)
{
	var post = [];
	var current = post;
	var i = 0;

	while(i < values.length)
	{
		var p = values[i].name.indexOf('[');
		if(p == -1)
		{
			current[values[i].name] = values[i].value;
			current = post;
			i++;
		}
		else
		{
			var name = values[i].name.substring(0, p);
			var rest = values[i].name.substring(p+1);
			if(!current[name])
				current[name] = [];

			var pp = rest.indexOf(']');
			if(pp == -1)
			{
				//Error - not balanced brackets
				current = post;
				i++;
			}
			else if(pp == 0)
			{
				//No index specified - so take the next integer
				current = current[name];
				values[i].name = '' + current.length;
			}
			else
			{
				//Now index name becomes and name and we go deeper into the array
				current = current[name];
				values[i].name = rest.substring(0, pp) + rest.substring(pp+1);
			}
		}
	}
	return post;
};

JCSmartFilter.prototype.saveActiveToCookie = function() {
	try{
		var arActiveBoxesIDs = [];
		$('.filter .bx_filter_parameters_box.active').each(function() {
			arActiveBoxesIDs.push($(this).data('id'));
		});
		$.cookie('SCORP_FILTERBOX_ACTIVE', arActiveBoxesIDs.join(','), {path: '/', domain: '', expires: 360});
	}
	catch(e){}
}

JCSmartFilter.prototype.loadActiveFromCookie = function() {
	try{
		arActiveBoxesIDs = $.cookie('SCORP_FILTERBOX_ACTIVE').split(',');
		$('.filter .bx_filter_parameters_box').each(function() {
			var id = $(this).data('id').toString();
			if(!!id){
				if(arActiveBoxesIDs.indexOf(id) != -1){
					$(this).addClass('active');
				}
				else{
					$(this).removeClass('active');
				}
			}
		});
	}
	catch(e){}
}

JCSmartFilter.prototype.hideFilterProps = function(element)
{
	var easing;
	var obj = element.parentNode;
	var filterBlock = BX.findChild(obj, {className:"bx_filter_block"}, true, false);
	var _this = this;

	if(BX.hasClass(obj, "active"))
	{

		easing = new BX.easing({
			duration : 300,
			start : { opacity: 1,  height: filterBlock.offsetHeight },
			finish : { opacity: 0, height:0 },
			transition : BX.easing.transitions.quart,
			step : function(state){
				filterBlock.style.opacity = state.opacity;
				filterBlock.style.height = state.height + "px";
			},
			complete : function() {
				filterBlock.setAttribute("style", "");
				BX.removeClass(obj, "active");
				_this.saveActiveToCookie();
			}
		});
		easing.animate();
	}
	else
	{
		filterBlock.style.display = "block";
		filterBlock.style.opacity = 0;
		filterBlock.style.height = "auto";

		var obj_children_height = filterBlock.offsetHeight;
		filterBlock.style.height = 0;

		easing = new BX.easing({
			duration : 300,
			start : { opacity: 0,  height: 0 },
			finish : { opacity: 1, height: obj_children_height },
			transition : BX.easing.transitions.quart,
			step : function(state){
				filterBlock.style.opacity = state.opacity;
				filterBlock.style.height = state.height + "px";
			},
			complete : function() {
				_this.saveActiveToCookie();
			}
		});
		easing.animate();
		BX.addClass(obj, "active");
	}
};

JCSmartFilter.prototype.showDropDownPopup = function(element, popupId)
{
	var contentNode = element.querySelector('[data-role="dropdownContent"]');
	BX.PopupWindowManager.create("smartFilterDropDown"+popupId, element, {
		autoHide: true,
		offsetLeft: 0,
		offsetTop: 3,
		overlay : false,
		draggable: {restrict:true},
		closeByEsc: true,
		content: contentNode
	}).show();
};

JCSmartFilter.prototype.selectDropDownItem = function(element, controlId)
{
	this.keyup(BX(controlId));

	var wrapContainer = BX.findParent(BX(controlId), {className:"bx_filter_select_container"}, false);

	var currentOption = wrapContainer.querySelector('[data-role="currentOption"]');
	currentOption.innerHTML = element.innerHTML;
	BX.PopupWindowManager.getCurrentPopup().close();
};

BX.namespace("BX.Iblock.SmartFilter");
BX.Iblock.SmartFilter = (function()
{
	var SmartFilter = function(arParams)
	{
		if (typeof arParams === 'object')
		{
			this.leftSlider = BX(arParams.leftSlider);
			this.rightSlider = BX(arParams.rightSlider);
			this.tracker = BX(arParams.tracker);
			this.trackerWrap = BX(arParams.trackerWrap);

			this.minInput = BX(arParams.minInputId);
			this.maxInput = BX(arParams.maxInputId);

			this.minPrice = parseFloat(arParams.minPrice);
			this.maxPrice = parseFloat(arParams.maxPrice);

			this.curMinPrice = parseFloat(arParams.curMinPrice);
			this.curMaxPrice = parseFloat(arParams.curMaxPrice);

			this.fltMinPrice = arParams.fltMinPrice ? parseFloat(arParams.fltMinPrice) : parseFloat(arParams.curMinPrice);
			this.fltMaxPrice = arParams.fltMaxPrice ? parseFloat(arParams.fltMaxPrice) : parseFloat(arParams.curMaxPrice);

			this.precision = arParams.precision || 0;

			this.priceDiff = this.maxPrice - this.minPrice;

			this.leftPercent = 0;
			this.rightPercent = 0;

			this.fltMinPercent = 0;
			this.fltMaxPercent = 0;

			this.colorUnavailableActive = BX(arParams.colorUnavailableActive);//gray
			this.colorAvailableActive = BX(arParams.colorAvailableActive);//blue
			this.colorAvailableInactive = BX(arParams.colorAvailableInactive);//light blue

			this.isTouch = false;

			this.init();

			if ('ontouchstart' in document.documentElement)
			{
				this.isTouch = true;

				BX.bind(this.leftSlider, "touchstart", BX.proxy(function(event){
					this.onMoveLeftSlider(event)
				}, this));

				BX.bind(this.rightSlider, "touchstart", BX.proxy(function(event){
					this.onMoveRightSlider(event)
				}, this));
			}
			else
			{
				BX.bind(this.leftSlider, "mousedown", BX.proxy(function(event){
					this.onMoveLeftSlider(event)
				}, this));

				BX.bind(this.rightSlider, "mousedown", BX.proxy(function(event){
					this.onMoveRightSlider(event)
				}, this));
			}

			BX.bind(this.minInput, "keyup", BX.proxy(function(event){
				this.onInputChange();
			}, this));

			BX.bind(this.maxInput, "keyup", BX.proxy(function(event){
				this.onInputChange();
			}, this));
		}
	};

	SmartFilter.prototype.init = function()
	{
		var priceDiff;

		if (this.curMinPrice > this.minPrice)
		{
			priceDiff = this.curMinPrice - this.minPrice;
			this.leftPercent = (priceDiff*100)/this.priceDiff;

			this.leftSlider.style.left = this.leftPercent + "%";
			this.colorUnavailableActive.style.left = this.leftPercent + "%";
		}

		this.setMinFilteredValue(this.fltMinPrice);

		if (this.curMaxPrice < this.maxPrice)
		{
			priceDiff = this.maxPrice - this.curMaxPrice;
			this.rightPercent = (priceDiff*100)/this.priceDiff;

			this.rightSlider.style.right = this.rightPercent + "%";
			this.colorUnavailableActive.style.right = this.rightPercent + "%";
		}

		this.setMaxFilteredValue(this.fltMaxPrice);
	};

	SmartFilter.prototype.setMinFilteredValue = function (fltMinPrice)
	{
		this.fltMinPrice = parseFloat(fltMinPrice);
		if (this.fltMinPrice >= this.minPrice)
		{
			var priceDiff = this.fltMinPrice - this.minPrice;
			this.fltMinPercent = (priceDiff*100)/this.priceDiff;

			if (this.leftPercent > this.fltMinPercent)
				this.colorAvailableActive.style.left = this.leftPercent + "%";
			else
				this.colorAvailableActive.style.left = this.fltMinPercent + "%";

			this.colorAvailableInactive.style.left = this.fltMinPercent + "%";
		}
		else
		{
			this.colorAvailableActive.style.left = "0%";
			this.colorAvailableInactive.style.left = "0%";
		}
	};

	SmartFilter.prototype.setMaxFilteredValue = function (fltMaxPrice)
	{
		this.fltMaxPrice = parseFloat(fltMaxPrice);
		if (this.fltMaxPrice <= this.maxPrice)
		{
			var priceDiff = this.maxPrice - this.fltMaxPrice;
			this.fltMaxPercent = (priceDiff*100)/this.priceDiff;

			if (this.rightPercent > this.fltMaxPercent)
				this.colorAvailableActive.style.right = this.rightPercent + "%";
			else
				this.colorAvailableActive.style.right = this.fltMaxPercent + "%";

			this.colorAvailableInactive.style.right = this.fltMaxPercent + "%";
		}
		else
		{
			this.colorAvailableActive.style.right = "0%";
			this.colorAvailableInactive.style.right = "0%";
		}
	};

	SmartFilter.prototype.getXCoord = function(elem)
	{
		var box = elem.getBoundingClientRect();
		var body = document.body;
		var docElem = document.documentElement;

		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		var left = box.left + scrollLeft - clientLeft;

		return Math.round(left);
	};

	SmartFilter.prototype.getPageX = function(e)
	{
		e = e || window.event;
		var pageX = null;

		if (this.isTouch && event.targetTouches[0] != null)
		{
			pageX = e.targetTouches[0].pageX;
		}
		else if (e.pageX != null)
		{
			pageX = e.pageX;
		}
		else if (e.clientX != null)
		{
			var html = document.documentElement;
			var body = document.body;

			pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
			pageX -= html.clientLeft || 0;
		}

		return pageX;
	};

	SmartFilter.prototype.recountMinPrice = function()
	{
		var newMinPrice = (this.priceDiff*this.leftPercent)/100;
		newMinPrice = (this.minPrice + newMinPrice).toFixed(this.precision);

		if (newMinPrice != this.minPrice)
			this.minInput.value = newMinPrice;
		else
			this.minInput.value = "";
		smartFilter.keyup(this.minInput);
	};

	SmartFilter.prototype.recountMaxPrice = function()
	{
		var newMaxPrice = (this.priceDiff*this.rightPercent)/100;
		newMaxPrice = (this.maxPrice - newMaxPrice).toFixed(this.precision);

		if (newMaxPrice != this.maxPrice)
			this.maxInput.value = newMaxPrice;
		else
			this.maxInput.value = "";
		smartFilter.keyup(this.maxInput);
	};

	SmartFilter.prototype.onInputChange = function ()
	{
		var priceDiff;
		if (this.minInput.value)
		{
			var leftInputValue = this.minInput.value;
			if (leftInputValue < this.minPrice)
				leftInputValue = this.minPrice;

			if (leftInputValue > this.maxPrice)
				leftInputValue = this.maxPrice;

			priceDiff = leftInputValue - this.minPrice;
			this.leftPercent = (priceDiff*100)/this.priceDiff;

			this.makeLeftSliderMove(false);
		}

		if (this.maxInput.value)
		{
			var rightInputValue = this.maxInput.value;
			if (rightInputValue < this.minPrice)
				rightInputValue = this.minPrice;

			if (rightInputValue > this.maxPrice)
				rightInputValue = this.maxPrice;

			priceDiff = this.maxPrice - rightInputValue;
			this.rightPercent = (priceDiff*100)/this.priceDiff;

			this.makeRightSliderMove(false);
		}
	};

	SmartFilter.prototype.makeLeftSliderMove = function(recountPrice)
	{
		recountPrice = (recountPrice !== false);

		this.leftSlider.style.left = this.leftPercent + "%";
		this.colorUnavailableActive.style.left = this.leftPercent + "%";

		var areBothSlidersMoving = false;
		if (this.leftPercent + this.rightPercent >= 100)
		{
			areBothSlidersMoving = true;
			this.rightPercent = 100 - this.leftPercent;
			this.rightSlider.style.right = this.rightPercent + "%";
			this.colorUnavailableActive.style.right = this.rightPercent + "%";
		}

		if (this.leftPercent >= this.fltMinPercent && this.leftPercent <= (100-this.fltMaxPercent))
		{
			this.colorAvailableActive.style.left = this.leftPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.right = 100 - this.leftPercent + "%";
			}
		}
		else if(this.leftPercent <= this.fltMinPercent)
		{
			this.colorAvailableActive.style.left = this.fltMinPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.right = 100 - this.fltMinPercent + "%";
			}
		}
		else if(this.leftPercent >= this.fltMaxPercent)
		{
			this.colorAvailableActive.style.left = 100-this.fltMaxPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.right = this.fltMaxPercent + "%";
			}
		}

		if (recountPrice)
		{
			this.recountMinPrice();
			if (areBothSlidersMoving)
				this.recountMaxPrice();
		}
	};

	SmartFilter.prototype.countNewLeft = function(event)
	{
		var pageX = this.getPageX(event);

		var trackerXCoord = this.getXCoord(this.trackerWrap);
		var rightEdge = this.trackerWrap.offsetWidth;

		var newLeft = pageX - trackerXCoord;

		if (newLeft < 0)
			newLeft = 0;
		else if (newLeft > rightEdge)
			newLeft = rightEdge;

		return newLeft;
	};

	SmartFilter.prototype.onMoveLeftSlider = function(e)
	{
		if (!this.isTouch)
		{
			this.leftSlider.ondragstart = function() {
				return false;
			};
		}

		if (!this.isTouch)
		{
			document.onmousemove = BX.proxy(function(event) {
				this.leftPercent = ((this.countNewLeft(event)*100)/this.trackerWrap.offsetWidth);
				this.makeLeftSliderMove();
			}, this);

			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
			};
		}
		else
		{
			document.ontouchmove = BX.proxy(function(event) {
				this.leftPercent = ((this.countNewLeft(event)*100)/this.trackerWrap.offsetWidth);
				this.makeLeftSliderMove();
			}, this);

			document.ontouchend = function() {
				document.ontouchmove = document.touchend = null;
			};
		}

		return false;
	};

	SmartFilter.prototype.makeRightSliderMove = function(recountPrice)
	{
		recountPrice = (recountPrice !== false);

		this.rightSlider.style.right = this.rightPercent + "%";
		this.colorUnavailableActive.style.right = this.rightPercent + "%";

		var areBothSlidersMoving = false;
		if (this.leftPercent + this.rightPercent >= 100)
		{
			areBothSlidersMoving = true;
			this.leftPercent = 100 - this.rightPercent;
			this.leftSlider.style.left = this.leftPercent + "%";
			this.colorUnavailableActive.style.left = this.leftPercent + "%";
		}

		if ((100-this.rightPercent) >= this.fltMinPercent && this.rightPercent >= this.fltMaxPercent)
		{
			this.colorAvailableActive.style.right = this.rightPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.left = 100 - this.rightPercent + "%";
			}
		}
		else if(this.rightPercent <= this.fltMaxPercent)
		{
			this.colorAvailableActive.style.right = this.fltMaxPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.left = 100 - this.fltMaxPercent + "%";
			}
		}
		else if((100-this.rightPercent) <= this.fltMinPercent)
		{
			this.colorAvailableActive.style.right = 100-this.fltMinPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.left = this.fltMinPercent + "%";
			}
		}

		if (recountPrice)
		{
			this.recountMaxPrice();
			if (areBothSlidersMoving)
				this.recountMinPrice();
		}
	};

	SmartFilter.prototype.onMoveRightSlider = function(e)
	{
		if (!this.isTouch)
		{
			this.rightSlider.ondragstart = function() {
				return false;
			};
		}

		if (!this.isTouch)
		{
			document.onmousemove = BX.proxy(function(event) {
				this.rightPercent = 100-(((this.countNewLeft(event))*100)/(this.trackerWrap.offsetWidth));
				this.makeRightSliderMove();
			}, this);

			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
			};
		}
		else
		{
			document.ontouchmove = BX.proxy(function(event) {
				this.rightPercent = 100-(((this.countNewLeft(event))*100)/(this.trackerWrap.offsetWidth));
				this.makeRightSliderMove();
			}, this);

			document.ontouchend = function() {
				document.ontouchmove = document.ontouchend = null;
			};
		}

		return false;
	};

	return SmartFilter;
})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:106:"/local/templates/aspro-scorp_royaltent/components/bitrix/map.yandex.view/.default/script.js?16606636691540";s:6:"source";s:91:"/local/templates/aspro-scorp_royaltent/components/bitrix/map.yandex.view/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
if (!window.BX_YMapAddPlacemark)
{
	window.BX_YMapAddPlacemark = function(map, arPlacemark)
	{
		if (null == map)
			return false;

		if(!arPlacemark.LAT || !arPlacemark.LON)
			return false;

		var props = {};
		if (null != arPlacemark.TEXT && arPlacemark.TEXT.length > 0)
		{
			var value_view = '';

			if (arPlacemark.TEXT.length > 0)
			{
				var rnpos = arPlacemark.TEXT.indexOf("\n");
				value_view = rnpos <= 0 ? arPlacemark.TEXT : arPlacemark.TEXT.substring(0, rnpos);
			}

			props.balloonContent = arPlacemark.TEXT.replace(/\n/g, '<br />');
			props.hintContent = value_view;
		}

		var obPlacemark = new ymaps.Placemark(
			[arPlacemark.LAT, arPlacemark.LON],
			props,
			{balloonCloseButton: true}
		);

		map.geoObjects.add(obPlacemark);

		return obPlacemark;
	}
}

if (!window.BX_YMapAddPolyline)
{
	window.BX_YMapAddPolyline = function(map, arPolyline)
	{
		if (null == map)
			return false;

		if (null != arPolyline.POINTS && arPolyline.POINTS.length > 1)
		{
			var arPoints = [];
			for (var i = 0, len = arPolyline.POINTS.length; i < len; i++)
			{
				arPoints.push([arPolyline.POINTS[i].LAT, arPolyline.POINTS[i].LON]);
			}
		}
		else
		{
			return false;
		}

		var obParams = {clickable: true};
		if (null != arPolyline.STYLE)
		{
			obParams.strokeColor = arPolyline.STYLE.strokeColor;
			obParams.strokeWidth = arPolyline.STYLE.strokeWidth;
		}
		var obPolyline = new ymaps.Polyline(
			arPoints, {balloonContent: arPolyline.TITLE}, obParams
		);

		map.geoObjects.add(obPolyline);

		return obPolyline;
	}
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:104:"/local/templates/aspro-scorp_royaltent/components/bitrix/news.list/projects-map/script.js?16909881346767";s:6:"source";s:89:"/local/templates/aspro-scorp_royaltent/components/bitrix/news.list/projects-map/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function () {

  var
    gdpData = {
      "AE": 239.65,
      "AF": 16.63,
      "AG": 1.1,
      "AL": 11.58,
      "AM": 8.83,
      "AO": 85.81,
      "AR": 351.02,
      "AT": 366.26,
      "AU": 1219.72,
      "AZ": 52.17,
      "BA": 16.2,
      "BB": 3.96,
      "BD": 105.4,
      "BE": 461.33,
      "BF": 8.67,
      "BG": 44.84,
      "BH": 21.73,
      "BI": 1.47,
      "BJ": 6.49,
      "BN": 11.96,
      "BO": 19.18,
      "BR": 2023.53,
      "BS": 7.54,
      "BT": 1.4,
      "BW": 12.5,
      "BY": 52.89,
      "BZ": 1.43,
      "CA": 1563.66,
      "CD": 12.6,
      "CF": 2.11,
      "CG": 11.88,
      "CH": 522.44,
      "CI": 22.38,
      "CL": 199.18,
      "CM": 21.88,
      "CN": 5745.13,
      "CO": 283.11,
      "CR": 35.02,
      "CV": 1.57,
      "CY": 22.75,
      "CZ": 195.23,
      "DE": 3305.9,
      "DJ": 1.14,
      "DK": 304.56,
      "DM": 0.38,
      "DO": 50.87,
      "DZ": 158.97,
      "EC": 61.49,
      "EE": 19.22,
      "EG": 216.83,
      "ER": 2.25,
      "ES": 1374.78,
      "ET": 30.94,
      "FI": 231.98,
      "FJ": 3.15,
      "FR": 2555.44,
      "GA": 12.56,
      "GB": 2258.57,
      "GD": 0.65,
      "GE": 11.23,
      "GH": 18.06,
      "GM": 1.04,
      "GN": 4.34,
      "GQ": 14.55,
      "GR": 305.01,
      "GT": 40.77,
      "GW": 0.83,
      "GY": 2.2,
      "HK": 226.49,
      "HN": 15.34,
      "HR": 59.92,
      "HT": 6.5,
      "HU": 132.28,
      "ID": 695.06,
      "IE": 204.14,
      "IL": 201.25,
      "IN": 1430.02,
      "IQ": 84.14,
      "IR": 337.9,
      "IS": 12.77,
      "IT": 2036.69,
      "JM": 13.74,
      "JO": 27.13,
      "JP": 5390.9,
      "KE": 32.42,
      "KG": 4.44,
      "KH": 11.36,
      "KI": 0.15,
      "KM": 0.56,
      "KN": 0.56,
      "KR": 986.26,
      "KW": 117.32,
      "KZ": 129.76,
      "LA": 6.34,
      "LB": 39.15,
      "LC": 1,
      "LK": 48.24,
      "LR": 0.98,
      "LS": 1.8,
      "LT": 35.73,
      "LU": 52.43,
      "LV": 23.39,
      "LY": 77.91,
      "MA": 91.7,
      "MD": 5.36,
      "ME": 3.88,
      "MG": 8.33,
      "MK": 9.58,
      "ML": 9.08,
      "MM": 35.65,
      "MN": 5.81,
      "MR": 3.49,
      "MT": 7.8,
      "MU": 9.43,
      "MV": 1.43,
      "MW": 5.04,
      "MX": 1004.04,
      "MY": 218.95,
      "MZ": 10.21,
      "NA": 11.45,
      "NE": 5.6,
      "NG": 206.66,
      "NI": 6.38,
      "NL": 770.31,
      "NO": 413.51,
      "NP": 15.11,
      "NZ": 138,
      "OM": 53.78,
      "PA": 27.2,
      "PE": 153.55,
      "PG": 8.81,
      "PH": 189.06,
      "PK": 174.79,
      "PL": 438.88,
      "PT": 223.7,
      "PY": 17.17,
      "QA": 126.52,
      "RO": 158.39,
      "RS": 38.92,
      "RU": 1476.91,
      "RW": 5.69,
      "SA": 434.44,
      "SB": 0.67,
      "SC": 0.92,
      "SD": 65.93,
      "SE": 444.59,
      "SG": 217.38,
      "SI": 46.44,
      "SK": 86.26,
      "SL": 1.9,
      "SN": 12.66,
      "SR": 3.3,
      "ST": 0.19,
      "SV": 21.8,
      "SY": 59.63,
      "SZ": 3.17,
      "TD": 7.59,
      "TG": 3.07,
      "TH": 312.61,
      "TJ": 5.58,
      "TL": 0.62,
      "TM": 0,
      "TN": 43.86,
      "TO": 0.3,
      "TR": 729.05,
      "TT": 21.2,
      "TW": 426.98,
      "TZ": 22.43,
      "UA": 136.56,
      "UG": 17.12,
      "US": 14624.18,
      "UY": 40.71,
      "UZ": 37.72,
      "VC": 0.58,
      "VE": 285.21,
      "VN": 101.99,
      "VU": 0.72,
      "WS": 0.55,
      "YE": 30.02,
      "ZA": 354.41,
      "ZM": 15.69,
      "ZW": 5.57,
    },
    placemarkCountries = JSON.parse(BX.message('MAP_COUNTRIES')),
    placemarkLocations = JSON.parse(BX.message('MAP_LOCATIONS')),
    locationBlock = $('div[data-field="LOCATION_DICTIONARY"]'),
    assocMap = JSON.parse(BX.message('ASSOCIATIVE_MAP')),
    map
  ;

  var markersCountries = placemarkCountries.map(function(h){ return {name: h.name, latLng: h.latLng} }),
    markersCountriesOptions = placemarkCountries.reduce(function(p, c, i){ p[i] = c.marker; return p }, {}),
    markersLocations = placemarkLocations.map(function(h){ return {name: h.name, latLng: h.latLng} }),
    markersLocationsOptions = placemarkLocations.reduce(function(p, c, i){ p[i] = c.marker; return p }, {}),
    currentState = 1; // display countries (1) or locations (2)

  map = new jvm.Map({
    container: $('#world-map'),
    map: 'world_mill',
    zoomOnScroll: false,
    markers: markersCountries,
    zoomStep: 2,
    zoomMax: 32,
    labels: {
      markers: {
        render: function(index) {
          if (currentState === 1) {
            return markersCountries[index].name;
          }
        },
        offsets: function(index){
          return [-10, 0];
        }
      }
    },
    series: {
      regions: [{
        values: gdpData,
        scale: ['#D5C5A7'],
        normalizeFunction: 'polynomial'
      }],
      markers: [{
        attribute: 'image',
        scale: {
          'big': '/local/include/images/map_placemark.png',
          'small': '/local/include/images/map_placemark_small.png',
        },
        values: markersCountriesOptions,
      }],
    },
    onRegionTipShow: function(e) {
      e.preventDefault();
    },
    onMarkerClick: function(event, index) {
      locationBlock.find('input').removeAttr("checked");

      if (currentState === 1) {
        var
          id,
          zoomSettings = {scale: 8, lat: placemarkCountries[index].latLng[0], lng: placemarkCountries[index].latLng[1], animate: true}
        ;
        map.setFocus(zoomSettings);
        id = placemarkCountries[index].countryId;
        $.each(assocMap[id], function (index, value) {
          locationBlock.find(`[data-value=${value}]`).trigger('click');
        });
        return;
      }
      else if (currentState === 2) {
        id = placemarkLocations[index].locationId;
        locationBlock.find(`[data-value=${id}]`).trigger('click');
      }
      else {
        return;
      }

      $('#set_filter').trigger('click');
    }
  });

  var allowAddMarkersCountries = false,
    allowAddMarkersLocations = true;
  $('#world-map').on('zoom.jvectormap', function(e, scale) {
    console.log(scale);
    if (scale >= 6) {
      currentState = 2;
      if (allowAddMarkersLocations) {
        map.removeAllMarkers();
        map.addMarkers(markersLocations, []);
        map.series.markers[0].setValues(markersLocationsOptions);
        allowAddMarkersCountries = true;
        allowAddMarkersLocations = false;
      }
    } else {
      currentState = 1;
      if (allowAddMarkersCountries) {
        map.removeAllMarkers();
        map.addMarkers(markersCountries, []);
        map.series.markers[0].setValues(markersCountriesOptions);
        allowAddMarkersCountries = false;
        allowAddMarkersLocations = true;
      }
    }
  });

});

/* End */
;; /* /local/templates/aspro-scorp_royaltent/components/bitrix/catalog.smart.filter/123/script.js?167651135621723*/
; /* /local/templates/aspro-scorp_royaltent/components/bitrix/map.yandex.view/.default/script.js?16606636691540*/
; /* /local/templates/aspro-scorp_royaltent/components/bitrix/news.list/projects-map/script.js?16909881346767*/
