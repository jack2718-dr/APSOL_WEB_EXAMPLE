function VisitChart(_onLoad) {
	DateRangeGrid.call(this);

	this.setUrlPrefix('visitChart');
	this.setRecordUrl('visitChart/chart');

	this.combos = new Array();

	if ($("#clipBoardInp").length == 0) {
		$("body").append('<input id="clipBoardInp" style="position:absolute;top:-9999em;"></input>');
	}

	/**
	 * 업무 구분 필터
	 */
	this.fKind = null;
	/**
	 * 연락 상태 필터
	 */
	this.fState = null;
	/**
	 * 작성자
	 */
	this.fWriter = null;

	this.param;

	this.onLoad = _onLoad;

}
VisitChart.prototype = Object.create(DateRangeGrid.prototype);
VisitChart.prototype.constructor = VisitChart;

VisitChart.prototype.onInitedGrid = function(grid) {
	DateRangeGrid.prototype.onInitedGrid.call(this, grid);

	var me = this;
	this.setOnRowDblClicked(function(rowId, colId) {

		var customer = me.getData('customer', rowId);

		if (!customer)
			return;

		if (colId == 'customerBusinessNumber' || colId == 'customerName')
			popupCustomerWindow(customer);

	});

	grid.attachEvent("onKeyPress", function(code, ctrl, shift) {

		if (code == 67 && ctrl) {

			var businessNumber = me.getData('businessNumber');
			if (!businessNumber)
				businessNumber = me.getData('customerBusinessNumber');

			$('#clipBoardInp').val(businessNumber);
			$('#clipBoardInp').select();

			try {
				var successful = document.execCommand('copy');
			} catch (err) {
				alert('이 브라우저는 지원하지 않습니다.')
			}
		}
		return true;
	});

};

VisitChart.prototype.reload = function() {

	// this.resetFilters();

	var me = this;
	me.loadRecords();

};

VisitChart.prototype.loadRecords = function(onLoaded) {

	var me = this;

	me.onBeforeLoaded();

	var recordUrl = me.getRecordUrl();
	var query = me.buildParams(recordUrl);
	var url = recordUrl + query;

	if (this.onLoad)
		this.onLoad(url, this.param, query);
};

VisitChart.prototype.setCustomerId = function(customerId) {
	this.customerId = customerId;
	return this;
};

VisitChart.prototype.onBeforeParams = function(params) {
	DateRangeGrid.prototype.onBeforeParams.call(this, params);

	if (this.customerId)
		params.customer = this.customerId;

	if (this.fKind)
		params.kind = this.fKind;

	if (this.fWriter)
		params.writer = this.fWriter;

	if (this.fState)
		params.state = this.fState;

	this.param = params;
};

VisitChart.prototype.init = function(container, config) {

	this.initToolbar(container, {
		iconsPath : config.iconsPath,
		xml : "erp/xml/report/visit/toolbar.xml",
	});

};

VisitChart.prototype.onInitedToolbar = function(toolbar) {
	DataGrid.prototype.onInitedToolbar.call(this, toolbar);

	var me = this;

	this.calendar = buildToolbarDateRange(toolbar, 'from', 'to', function(from, to) {
		// 달력내용이 변하면 호출
		me.reload();
	});

	this.calendar.setThisMonth();

	setupDateRangeBtns(toolbar, this.calendar);
};