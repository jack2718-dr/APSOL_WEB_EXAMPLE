function ProductForm() {

	DataForm.call(this);

	this.setUrlPrefix('product');

	var me = this;

	this.id = 0;
	this.editorContent;
	this.editorEdition;
	this.editorSystem;
}

ProductForm.prototype = Object.create(DataForm.prototype);
ProductForm.prototype.constructor = ProductForm;

ProductForm.prototype.init = function(container) {
	this.initToolbar(container, {
		iconsPath : "../img/18/",
		xml : 'xml/product/formToolbar.xml',
	});

	var tabbar = container.attachTabbar({
		tabs : [ {
			id : "a1",
			text : "품목 정보",
			active : true
		}, {
			id : "a2",
			text : "품목 소개"
		}, {
			id : "a3",
			text : "에디션 소개"
		}, {
			id : "a4",
			text : "시스템 사양"
		}, ]
	});

	this.initForm(tabbar.cells('a1'), {
		xml : 'xml/product/form.xml',
	});

	tabbar.cells('a2').attachURL("editor");
	var obj = tabbar.cells('a2').getFrame();
	this.editorContent = obj.contentWindow || obj.contentDocument;

	tabbar.cells('a3').attachURL("editor");
	var obj = tabbar.cells('a3').getFrame();
	this.editorEdition = obj.contentWindow || obj.contentDocument;

	tabbar.cells('a4').attachURL("editor");
	var obj = tabbar.cells('a4').getFrame();
	this.editorSystem = obj.contentWindow || obj.contentDocument;
}

ProductForm.prototype.onInitedForm = function(form) {

	DataForm.prototype.onInitedForm.call(this, form);

	this.addProductCell('parentName', 'PK0001,PK0002').setFieldMap({
		parent : {
			name : 'uuid',
			required : true
		},
		parentName : {
			name : 'name',
		}
	});

	form.attachEvent("onImageUploadSuccess", function(name, value, extra) {
	});

	form.attachEvent("onImageUploadFail", function(name, extra) {
	});

	this.form.setItemValue('image', "0");
	this.form.setItemValue('editionImage', "0");

	this.form.setItemValue('unitPrice', "0");
	this.form.setItemValue('discount', "0");
	this.form.setItemValue('savingRate', "0");
	this.form.setItemValue('limitedOrderDay', "0");
	this.form.setItemValue('limitedOrderQty', "0");
	this.form.setItemValue('metacritic', "0");
	

};

ProductForm.prototype.onClickFormButton = function(name) {
	DataForm.prototype.onClickFormButton.call(this, name);

	if (name == 'btnOption') {

		this.optionDlg.open(true);
		this.optionDlg.setModal(true);

	}
}

ProductForm.prototype.onClear = function() {
	DataForm.prototype.onClear.call(this);

	this.form.setItemValue('image', "0");
	this.form.setItemValue('editionImage', "0");

	this.form.setItemValue('unitPrice', "0");
	this.form.setItemValue('discount', "0");
	this.form.setItemValue('savingRate', "0");
	this.form.setItemValue('limitedOrderDay', "0");
	this.form.setItemValue('limitedOrderQty', "0");
	this.form.setItemValue('metacritic', "0");
		
	if( this.editorContent.setContent )
		this.editorContent.setContent('');
	
	if( this.editorSystem.setContent )
		this.editorSystem.setContent('');
	
	if( this.editorEdition.setContent )
		this.editorEdition.setContent('');
};

ProductForm.prototype.onClickAdded = function() {
	DataForm.prototype.onClickAdded.call(this);

	this.form.setItemFocus('name');
	this.form.setItemValue('image', "1");
	this.form.setItemValue('editionImage', "1");

	this.form.setItemValue('unitPrice', "0");
	this.form.setItemValue('discount', "0");
	this.form.setItemValue('savingRate', "0");
	this.form.setItemValue('limitedOrderDay', "0");
	this.form.setItemValue('limitedOrderQty', "0");
	this.form.setItemValue('metacritic', "0");
	
	if( this.editorContent.setContent )
		this.editorContent.setContent('');
	
	if( this.editorSystem.setContent )
		this.editorSystem.setContent('');
	
	if( this.editorEdition.setContent )
		this.editorEdition.setContent('');

};

ProductForm.prototype.onAfterLoaded = function(result) {
	DataForm.prototype.onAfterLoaded.call(this, result);

	this.editorContent.setContent(result.data.content);
	this.editorSystem.setContent(result.data.system);
	this.editorEdition.setContent(result.data.editionContent);

};

ProductForm.prototype.onBeforeUpdate = function(json) {
	DataForm.prototype.onBeforeUpdate.call(this, json);

	json.data.content = this.editorContent.getContent();
	json.data.system = this.editorSystem.getContent();
	json.data.editionContent = this.editorEdition.getContent();

	return true;
};

ProductForm.prototype.onSuccessedUpdateEvent = function(result) {
	DataForm.prototype.onSuccessedUpdateEvent.call(this, result);

};

ProductForm.prototype.onSuccessedRemoveEvent = function(result) {
	DataForm.prototype.onSuccessedRemoveEvent.call(this, result);
	this.form.setItemValue('image', "1");
};
