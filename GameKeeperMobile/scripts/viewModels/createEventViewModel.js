﻿define(["radio"], function (radio) {
    "use strict";

    var vm = kendo.observable({
        title: "",
        location: "",
        date: "",

        onUseCurrentLocationTapped: function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                vm.set("location", kendo.format("{0}, {1}", position.coords.latitude, position.coords.longitude));
            });
        },
        onSaveTapped: function (e) {
            var validator = $("#create-event-form").kendoValidator().data("kendoValidator");
            e.preventDefault();
            if (validator.validate()) {
                radio("event/created").broadcast({
                    Name: vm.get("title"),
                    Location: vm.get("location"),
                    StartDate: vm.get("date")
                });
                vm.clear();
            }
        },
        clear: function() {
            vm.set("title", "");
            vm.set("location", "");
            vm.set("date", "");
        }
    });
    return vm;
});