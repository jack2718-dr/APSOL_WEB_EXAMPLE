function ProductGrid(container, config) {
	var grid;
	var toolbar;

	var searchPopup;
	var searchForm;

	var loader;

	var keywordInp;
	var selectedRowId = null;

	var selectFilterDatas = config.grid.collectValues;

	this.reloadSelectFilter = function(_selectFilterDatas) {
		selectFilterDatas = _selectFilterDatas;
		grid.refreshFilters();
	};

	this.setRowData = function(result) {
		setRowData(grid, result.id, result.data);
	};

	this.reload = function() {
		loader.reload();
	};

	this.getData = function(field) {
		return getData(grid, grid.getSelectedRowId(), field);
	};

	this.getRowId = function() {
		return grid.getSelectedRowId();
	};

	this.deleteSelectedRows = function() {
		grid.deleteSelectedRows();
	};

	this.init = function() {

		toolbar = container.attachToolbar();
		toolbar.setIconsPath("img/18/");
		toolbar.loadStruct(config.toolbar.xml, function() {
			setToolbarStyle(toolbar);

			keywordInp = toolbar.getInput("inpKeyword");

			dhtmlxEvent(keywordInp, "focus", function(ev) {
				keywordInp.select();
			});

			setupSearch();
		});

		grid = container.attachGrid();
		grid.setImagePath(imageUrl);
		grid.load(config.grid.xml, function() {
			grid.setDateFormat("%Y-%m-%d", "%Y-%m-%d");
			grid.setActive(true);

			loader = new GridLoader(container, grid, {
				recordUrl : config.recordsUrl,
				onBeforeReload : function() {
					if (config.grid.callback.onBeforeReload)
						config.grid.callback.onBeforeReload();
				},
				onBeforeParams : function(grid) {

					if (!toolbar) {
						return '';
					}
					var params = '' ; // 'showAll=' + toolbar.getItemState('btnShowAll');

					var detailParams = formToParams(searchForm);

					if (detailParams) {
						params += "&" + detailParams;
						keywordInp.value = '';
					}

					if (keywordInp.value)
						params += "&keyword=" + encodeURIComponent(keywordInp.value);

					return params;
				}
			});

			loader.reload();

			grid.attachEvent("onCollectValues", function(_index) {

				if (!selectFilterDatas)
					return true;

				for (i = 0; i < selectFilterDatas.length; ++i) {

					var colName = selectFilterDatas[i].colName;
					if (_index == grid.getColIndexById(colName)) {
						return selectFilterDatas[i].values;
					}
				}
			});

		});

		setEvent();
	};

	this.setRowValue = function(rowId, colInd, value) {
		grid.cells(rowId, colInd).setValue(value);
	};

	function setupSearch() {
		searchPopup = new dhtmlXPopup({
			toolbar : toolbar,
			id : "btnDetailSearch"
		});

		searchForm = searchPopup.attachForm();

		searchForm.loadStruct('xml/base/customer/searchForm.xml', function() {

			var employeePopup = new FormEmployeePopup(searchForm, 'managerName', {
				fields : {
					managerName : 'name',
				},
				onSelected : function(data) {
				},

			});

			searchForm.attachEvent("onButtonClick", function(id) {

				if (id == 'btnSearch') {
					searchPopup.hide();
					loader.reload();
				} else if (id == 'btnClear') {
					searchForm.clear();
					searchForm.setFocusOnFirstActive();
				}
			});

			searchForm.attachEvent("onEnter", function() {
				searchPopup.hide();
				loader.reload();
			});

			searchPopup.attachEvent("onBeforeHide", function(type, ev, id) {
				return false;
			});

			searchPopup.attachEvent("onShow", function() {

				searchForm.setFocusOnFirstActive();

			});

			searchPopup.attachEvent("onHide", function() {

				employeePopup.hide();

			});

		});
	}

	function setEvent() {

		toolbar.attachEvent("onClick", function(id) {

			switch (id) {
			case 'btnSearch':
				searchForm.clear();
				loader.reload();
				break;

			case 'btnExcel':
				loader.toExcel("customer/excel", '거래처 현황');
				break;

			case 'btnOpen':
				var rowId = grid.getSelectedRowId();
				if (!rowId) {
					dhtmlx.alert({
						type : "alert-error",
						text : "선택된 가맹점이 없습니다.",
						callback : function() {
						}
					});
					return;
				} else {
					openCustomerInfoWindow(rowId);
				}
				break;

			case 'btnNew':

				openNewContractWindow();

				break;
			case 'btnEdit':
				var rowId = grid.getSelectedRowId();

				if (!rowId) {
					dhtmlx.alert({
						type : "alert-error",
						text : "선택된 가맹점이 없습니다.",
						callback : function() {
						}
					});
					return;
				} else {
					openNewContractWindow(rowId);
				}
			}

			if (id != 'btnDetailSearch') {
				searchPopup.hide();
			}

		});

		toolbar.attachEvent("onEnter", function(id) {
			if (id == 'inpKeyword') {
				searchForm.clear();
				loader.reload();
			}
		});

		toolbar.attachEvent("onStateChange", function(id, state) {
			searchPopup.hide();

			switch (id) {
			case 'btnShowAll':
				loader.reload();
				break;
			}
		});

		grid.attachEvent("onRowSelect", function(id, ind) {

			try {
				config.grid.callback.onRowSelect(grid, id);
			} catch (e) {
			}
		});

		grid.attachEvent("onRowDblClicked", function(rId, cInd) {

			try {
				config.grid.callback.onRowDblClicked(grid, rId, cInd);
			} catch (e) {
				console.error(e.message);
			}

			return true;
		});

	}

}