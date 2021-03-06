/**
 * 입출금 폼
 */
function StandardSlipWorkForm(config) {
	WorkForm.call(this);

	this.ignoreCells = [ 'amount' ];
	
	this.tabbar;
}

StandardSlipWorkForm.prototype = Object.create(WorkForm.prototype);
StandardSlipWorkForm.prototype.constructor = StandardSlipWorkForm;

StandardSlipWorkForm.prototype.init = function(container) {
	
	this.initToolbar(container, {
		iconsPath : "img/18/",
		xml : 'erp/xml/work/form/standardSlip/toolbar.xml',
	});
	
	var layout = container.attachLayout('2U');
	this.layout = layout;

	layout.cells('a').hideHeader();
	layout.cells('b').hideHeader();
	layout.cells('a').setWidth(500);

	layout.cells('a').fixSize(true, true);
		
	this.tabbar = layout.cells('a').attachTabbar({
		tabs: [
			{id: "a1", text: "입금/출금", active: true},
			{id: "a2", text: "문서 설정"}
		]
	});

	this.initForm(this.tabbar.cells('a1'), {
		xml : 'erp/xml/work/form/standardSlip/form.xml',
	});

	this.editor = layout.cells('b').attachEditor();

	WorkForm.prototype.init.call(this, container);
}

StandardSlipWorkForm.prototype.onInitedForm = function(form) {
	WorkForm.prototype.onInitedForm.call(this, form);

	var me = this;
	
	me.tabbar.cells("a2").attachObject("standardSlipSettingForm");

	form.attachEvent("onInputChange", function(name, value, form) {

		if (name == 'amount') {
			form.setItemValue('tax', Number(value) * 0.1);
		}
	});

	/*form.attachEvent("onChange", function(name, value) {

		console.log(name);
		if (name == 'slipKind') {
			if( value == "S10001")
				form.reloadOptions("account", "bascode/select/WA");
			else
				form.reloadOptions("account", "bascode/select/WA");
		}

	});*/

	this.addCustomerCell('customerName').setFieldMap({
		customer : {
			name : 'uuid',
			required : true,
		},
		customerName : {
			name : 'name',
		},
		project : {
			name : 'project'
		},
		projectName : {
			name : 'projectName'
		}
	}).setOnSuccessed(function(data) {

		if (me.getItemValue('slipKind') == 'S10002')
			me.setItemValue('memo', data.bankAccount);
		
	}).setOnFailed(function(name){		
		this.focusCell();
	});
	
	this.addBascodeCell('projectName', 'PJ').setFieldMap({
		project : {
			name : 'uuid',
			required : true,
		},
		projectName : {
			name : 'name',
		}
	}).setOnFailed(function(name){		
		this.focusCell();
	});

}

StandardSlipWorkForm.prototype.onAfterLoaded = function(result) {
	WorkForm.prototype.onAfterLoaded.call(this, result);
	
	var me = this;
	
	this.form.forEachItem(function(name){
		if( name.includes('dhxId_'))
			return;
		
		me.form.enableItem(name);
	});	
	
	if( result.data.workType == 'DK0002'){
		// 보고일 때 
		this.form.forEachItem(function(name){
			if( name.includes('dhxId_'))
				return;
			
			me.form.disableItem(name);
		});
		
		me.form.enableItem('title');
		me.form.enableItem('memo');
		me.form.enableItem('btnSend');
	}
	
}