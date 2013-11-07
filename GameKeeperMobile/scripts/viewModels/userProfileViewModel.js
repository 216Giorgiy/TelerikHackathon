﻿define([], function () {
    "use strict";

    var vm = kendo.observable ({
        id: kendo.guid(),
        name: "Joe Bag O'Donuts",
        email: "jeff.fritz@telerik.com",
        createdAt: new Date(2013, 10, 6),
        recentMatches: 14,
        recentWins: 3,
        topGames: [
            {name: "Chess", wins: 10},
            { name: "Checkers", wins: 8 },
            { name: "Backgammon", wins: 6 },
            { name: "Dominoes", wins: 4 },
            { name: "Settlers of Catan", wins: 3 }
        ],
        formattedCreateDate: function() {
            return kendo.toString(vm.createdAt, "MMM d, yyyy");
        }
    });

    return vm;

});