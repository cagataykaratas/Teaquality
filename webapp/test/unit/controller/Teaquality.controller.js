/*global QUnit*/

sap.ui.define([
	"teaquality/controller/Teaquality.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Teaquality Controller");

	QUnit.test("I should test the Teaquality controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
