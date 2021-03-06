function VanContractGrid(container, config) {

	var toolbar;
	var grid;

	var loader;

	var copyDialog;
	var copyForm;

	var calendar;
	var index;

	this.setStyle = function(style) {
		grid.setRowTextStyle(grid.getSelectedRowId(), style);
	}

	this.setData = function(field, val) {
		setData(grid, grid.getSelectedRowId(), field, val);
	}

	this.getData = function(field) {
		return getData(grid, grid.getSelectedRowId(), field);
	}

	this.getRowId = function() {
		return grid.getSelectedRowId();
	}

	this.init = function() {
		setupToolbar();
		setupGrid();
	};

	this.getGrid = function() {
		return grid;
	};
	
	this.load = function(){
		index = 1;
		reload();
	}
	





	function setupGrid() {
		grid = container.attachGrid();
		grid.setImagePath(config.imageUrl);
		grid.load(config.grid.xml, function() {
			// 그리드 기본 설정. 필수항목!!!
			setupDefaultGrid(grid);


		});

		grid.attachEvent("onRowSelect", function(id, ind) {
			if (config.onRowSelect)
				config.onRowSelect(grid, id);
		});

	}


	function reload() {

		if (grid == null)
			return;

	}

	function onClosedEdit(rId, colId, nValue, oValue, fnOnUpdated) {

		if (nValue == oValue)
			return;

		fnOnUpdated(rId);
	}



	function setupToolbar() {
		toolbar = container.attachToolbar();
		toolbar.setIconsPath(config.iconsPath);
		toolbar.loadStruct(config.toolbar.xml, function() {

			// 기본 툴바 스타일
			setToolbarStyle(toolbar);

		});

		toolbar.attachEvent("onClick", function(id) {
			switch (id) {
		
			case 'btnAdd':
				
				
				insertRowWithIndex(grid, "newContract/insert", 'no', 0, index++, function(grid, id, data) {
					if (config.onInserted)
						config.onInserted(grid, id, data);
				});
				break;

			
			case 'btnDelete':

				if (!grid.getSelectedRowId()) {
					dhtmlx.alert({
						type : "alert-error",
						text : "선택된 항목이 없습니다.",
						callback : function() {
						}
					});

					return;
				}

				dhtmlx.confirm({
					title : "선택한 항목들을 삭제하시겠습니까?",
					type : "confirm-warning",
					text : "삭제된 항목은 복구할 수 없습니다.",
					callback : function(r) {
						if (r) {
							container.progressOn();
							$.post('newContract/delete', {
								ids : grid.getSelectedRowId(),
							}, function(result) {

								container.progressOff();

								if (result.error) {
									dhtmlx.alert({
										title : "삭제된 항목을 삭제할 수 없습니다.",
										type : "alert-error",
										text : result.error
									});

									return;
								}

								// TODO 에러처리
								console.log(result);

								grid.deleteSelectedRows();

								if (config.onDeleted)
									config.onDeleted();

							});
						}
					}
				});

				break;


			}
		});
	}
}