sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel) {
		"use strict";

		var emptyListPlayers = [];
		var emptyListA = [];
		var emptyListB = [];
		return Controller.extend("teaquality.controller.Teaquality", {
			onInit: function () {
				var oModel = new JSONModel();
				this.getView().byId("records").setModel(oModel);
				this.getView().byId("players").setModel(oModel);

				var oPlayerModelA = new JSONModel();
				this.getView().byId("table1").setModel(oPlayerModelA);
				
				var oPlayerModelB = new JSONModel();
				this.getView().byId("table2").setModel(oPlayerModelB);
			},

			onAdd: function() {
				// Get the values of the header input fields
				var tc = this.getView().byId("tc").getValue();
				var ad = this.getView().byId("ad").getValue();
				var soyad = this.getView().byId("soyad").getValue();
				var rank = this.getView().byId("rank").getValue();
				var position = String(this.getView().byId("position").getSelectedKey());

				if(tc == "" || ad == "" || soyad == "" || rank == "" || position == ""){
					alert("Tüm boşlukları doldurun");
				}

				var itemRow = {
					Tc : tc,
					Ad : ad,
					Soyad : soyad,
					Position : position,
					Rank : rank
				};

				var oModel = this.getView().byId("records").getModel();
				var itemData = oModel.getProperty("/data");

				if(typeof itemData !== "undefined") {
					// Append the data 
					itemData.push(itemRow);
				} else {
					itemData = [];
					itemData.push(itemRow);
				}

				/*for(var i=0; i<itemData.length; i++){
					emptyListPlayers.push(itemData[i]);
				}*/

				// Set Model
				oModel.setData({
					data: itemData
				});

				emptyListPlayers.push(itemRow);

				// Clear the input fields
				this.getView().byId("tc").setValue("");
				this.getView().byId("ad").setValue("");
				this.getView().byId("soyad").setValue("");
				this.getView().byId("rank").setValue("");
			},

			onDelete: function() {
				var oTable = this.getView().byId("records");
				var oModel = oTable.getModel();
				var aRows = oModel.getData().data;
				var aContexts = oTable.getSelectedContexts();

				for (var i = aContexts.length - 1; i >= 0; i--){
					// Selected Row(s)
					var oThisObj = aContexts[i].getObject();

					// $.map() is used for changing the values of array
					// Here we are trying to find the index of the selected row

					var index = $.map(aRows, function(obj,index) {
						if(obj === oThisObj){
							return index;
						}
					});

					// the splice() method adds/removes items to/from an array,
					// here we are deleting the selected index row
					aRows.splice(index,1);
					for(var a=0; a<aRows.length; a++){
						if(emptyListPlayers[a] == oThisObj){
							emptyListPlayers.splice(a,1);
						}
					}
				}

				// set the model with the updated data
				oModel.setData({
					data: aRows
				});
			},
			onMix: function() {

				emptyListPlayers = [];
				var temp;
				var oModel = this.getView().byId("records").getModel();
				var aRows = oModel.getData().data;
				var oPlayerModelA = this.getView().byId("table1").getModel();
				var oPlayerModelB = this.getView().byId("table2").getModel();
				var sum = 0;
				var total = 0;

				for(var j = 0; j<aRows.length; j++){
					for (var z = j+1; z<aRows.length; z++ ){
						if(aRows[j].Position > aRows[z].Position){
							temp = aRows[z];
							aRows[z] = aRows[j];
							aRows[j] = temp
						}
					}
				}

				for(j=0; j<aRows.length; j++){
					if(j%2 == 0){
						emptyListA.push(aRows[j]);
					}
					else {
						emptyListB.push(aRows[j]);
					}
				}


				if(emptyListB.length == emptyListA.length){
					var a=0;
					while(a<emptyListB.length){
						sum= 0 ;  //B
						total = 0;  //A
						for(var i = 0; i<emptyListB.length; i++){
							var rankB = parseInt(emptyListB[i].Rank);
							sum = sum+rankB;
						}
						for(var z = 0; z<emptyListA.length; z++){
							var rankA = parseInt(emptyListA[z].Rank);
							total = total+rankA;
						}
						if(sum-total>2){
							var temporary=[];
							var k = a;
							if(emptyListB[k].Rank>emptyListA[k].Rank){
								temporary = emptyListA[k];
								emptyListA[k]=emptyListB[k];
								emptyListB[k]=temporary;
							}
							continue;
						}
						else if(total-sum>2){
							var temporary2=[];
							var l = a;
								if(emptyListA[l].Rank>emptyListB[l].Rank){
									temporary2 = emptyListA[l];
									emptyListA[l]=emptyListB[l];
									emptyListB[l]=temporary2;
								}
						}
						a=a+1
					}
				}
				
				for(var b = 0; b<aRows.length; b++){
					for(var c=0; c<emptyListA.length; c++){
						if(aRows[b] == emptyListA[c]){
							aRows.splice(b,1);
						}
					}
				}

				for(b = 0; b<aRows.length; b++){
					for(var c=0; c<emptyListB.length; c++){
						if(aRows[b] == emptyListB[c]){
							aRows.splice(b,1);
						}
					}
				}
				
				oPlayerModelA.setData({
					playersA : emptyListA
				});

				oPlayerModelB.setData({
					playersB : emptyListB
				});

				oModel.setData({
					data : aRows
				});
			},

			moveToTable1: function(){

				var oModel = this.getView().byId("players").getModel();
				var aRows = oModel.getData().data;
				var aContexts = this.getView().byId("players").getSelectedContexts();
				var oPlayerModelA = this.getView().byId("table1").getModel();
				for(var i=aContexts.length-1; i>=0; i--){
					var oThisObj = aContexts[i].getObject();
					emptyListA.push(oThisObj)

					var index = $.map(aRows, function(obj,index) {
						if(obj === oThisObj){
							return index;
						}
					});

					// the splice() method adds/removes items to/from an array,
					// here we are deleting the selected index row
					aRows.splice(index,1);
					for(var a=0; a<aRows.length; a++){
						if(emptyListPlayers[a] == oThisObj){
							emptyListPlayers.splice(a,1);
						}
					}
					
				}


				oPlayerModelA.setData({
					playersA: emptyListA
					});
				// set the model with the updated data
				oModel.setData({
					data: aRows
				});
			},

			moveToTable2: function(){

				var oModel = this.getView().byId("players").getModel();
				var aRows = oModel.getData().data;
				var aContexts = this.getView().byId("players").getSelectedContexts();
				var oPlayerModelB = this.getView().byId("table2").getModel();
				for(var i=aContexts.length-1; i>=0; i--){
					var oThisObj = aContexts[i].getObject();
					emptyListB.push(oThisObj)

					var index = $.map(aRows, function(obj,index) {
						if(obj === oThisObj){
							return index;
						}
					});

					// the splice() method adds/removes items to/from an array,
					// here we are deleting the selected index row
					aRows.splice(index,1);
					for(var a=0; a<aRows.length; a++){
						if(emptyListPlayers[a] == oThisObj){
							emptyListPlayers.splice(a,1);
						}
					}
				}

				oPlayerModelB.setData({
					playersB: emptyListB
					});
				// set the model with the updated data
				oModel.setData({
					data: aRows
				});
			},

			moveToPlayers: function(){
				var oPlayerModelA =  this.getView().byId("table1").getModel();
				var aRows = emptyListA	
				var aContexts = this.getView().byId("table1").getSelectedContexts();
				var oModel = this.getView().byId("players").getModel();
				for(var i=aContexts.length-1; i>=0; i--){
					var oThisObj = aContexts[i].getObject();
					emptyListPlayers.push(oThisObj)

					for(var a=0; a<aRows.length; a++){
						if(emptyListA[a] == oThisObj){
							emptyListA.splice(a,1);
						}
					}
				}
				
				oModel.setData({
					data : emptyListPlayers
				});

				oPlayerModelA.setData({
					playersA : emptyListA
				});
			},

			moveToPlayers2: function(){
				var oPlayerModelB =  this.getView().byId("table2").getModel();
				var aRows = emptyListB
				var aContexts = this.getView().byId("table2").getSelectedContexts();
				var oModel = this.getView().byId("players").getModel();
				for(var i=aContexts.length-1; i>=0; i--){
					var oThisObj = aContexts[i].getObject();
					emptyListPlayers.push(oThisObj)

					for(var a=0; a<aRows.length; a++){
						if(emptyListB[a] == oThisObj){
							emptyListB.splice(a,1);
						}
					}
				}
				
				oModel.setData({
					data : emptyListPlayers
				});

				oPlayerModelB.setData({
					playersB : emptyListB
				});
			}

		});
	}
);