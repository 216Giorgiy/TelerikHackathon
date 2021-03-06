﻿define(["azure-client", "datasources"], function (azureClient, datasources) {
    "use strict";

    var vm = kendo.observable ({
        id: kendo.guid(),
        name: "",
        email: "",
        createdAt: new Date(2013, 10, 6),
        recentMatches: 0,
        recentWins: 0,
        topGames: new kendo.data.DataSource({
            data: []
        }),
        winLoss: [],
        formattedCreateDate: function () {
            return kendo.toString(vm.createdAt, "MMM d, yyyy");
        }, /**
        frequentOpp: "Mary Contrary",
        frequentOppWins: 10,
        frequentOppLosses: 8,
        winOpp: "Jeff Fritz",
        winOppWins: 13,
        winOppLosses: 3,
        lossOpp: "Phil Japikse",
        lossOppWins: 4,
        lossOppLosses: 8,
        **/ 

        gotoProfile: function(e) {

            var gotoPlayerId = e.currentTarget.attributes["playerId"].value.toString();
            window.app.application.navigate(kendo.format("views/userProfile.html?playerid=" + gotoPlayerId));
        },

        onShow: function (e) {
            console.log(e.view.params.playerid);
            var playerId = (e.view.params.playerid) ? parseInt(e.view.params.playerid,10) : 8;

            var playerTable = azureClient.getTable('player');
            var winTable = azureClient.getTable('matchwinner');
            var loseTable = azureClient.getTable('matchloser');

            // HACK: right now, the "last 90 days" is a total lie.
            winTable.where({ PlayerID: playerId }).read().done(function(wins) {
                loseTable.where({ PlayerID: playerId }).read().done(function(losses) {
                    vm.set("recentWins", wins.length);
                    vm.set("recentMatches", wins.length + losses.length);
                    vm.set("winLoss", [
                        { name: "Wins", count: wins.length },
                        { name: "Losses", count: losses.length }
                    ]);

                    e.view.scroller.reset();
                });
            });

            // Frequent games
            var prefGames = azureClient.invokeApi("preferredgamesforplayer", {
                method: 'get',
                parameters: {playerid: playerId}
            }).then(function(result) {
                vm.set("topGames", new kendo.data.DataSource({
                    data: JSON.parse(result.response)
                }))
            })

            // Profile Noteable Opponents
            var notableOpponents = azureClient.invokeApi("profilenotableopponents", {
                method: 'get',
                parameters: { playerid: playerId }
            }).then(function (nResult) {

                var nPlayers = JSON.parse(nResult.response);
                vm.set("frequentOpp", nPlayers[0].Name);
                vm.set("frequentOppId", nPlayers[0].PlayerId);
                vm.set("frequentOppEmail", nPlayers[0].EmailAddress);
                vm.set("frequentOppWins", nPlayers[0].Wins);
                vm.set("frequentOppLosses", nPlayers[0].Losses);
                vm.set("lossOpp", nPlayers[1].Name);
                vm.set("lossOppId", nPlayers[1].PlayerId);
                vm.set("lossOppEmail", nPlayers[1].EmailAddress);
                vm.set("lossOppWins", nPlayers[1].Wins);
                vm.set("lossOppLosses", nPlayers[1].Losses);
                vm.set("winOpp", nPlayers[2].Name);
                vm.set("winOppId", nPlayers[2].PlayerId);
                vm.set("winOppEmail", nPlayers[2].EmailAddress);
                vm.set("winOppWins", nPlayers[2].Wins);
                vm.set("winOppLosses", nPlayers[2].Losses);

                vm.set("topGames", new kendo.data.DataSource({
                    data: JSON.parse(result.response)
                }))
            })

            playerTable.lookup(playerId).done(function (player) {
                vm.set("name", player.Name);
                vm.set("email", player.EmailAddress);
                vm.set("createdAt", player.CreatedDate);
            });
        }
    });

    return vm;

});