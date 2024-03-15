const { Client, Interaction, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const User = require('../../utils/DataBase/userHandler');
const Server = require('../../utils/DataBase/serverHandler');

const Suffix = require('../../utils/math/suffixNumber');
const AfterTax = require('../../utils/math/afterTaxes');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "You can only run this command inside a server.",
                ephemeral: true,
            });
            return;
        }

        let amount = interaction.options.get('amount').value;

        if (amount < 1) amount = 1;

        try {
            let { Data } = await User.getUser(interaction);

            if (amount > Data.balance) {
                amount = Data.balance;
            };

            if (amount <= 0) {
                interaction.reply({ content: "You do not have enough money to run this command.", ephemeral: true });
                return;
            }

            let numCardsPulled = 0;
            let Winner;

            function GetCardsValue(a) {
                var cardArray = [],
                    sum = 0,
                    i = 0,
                    dk = 10.5,
                    doubleking = "QQ",
                    aceCount = 0;
                cardArray = a;
                for (i; i < cardArray.length; i += 1) {
                    if (cardArray[i].rank === "J" || cardArray[i].rank === "Q" || cardArray[i].rank === "K") {
                        sum += 10;
                    } else if (cardArray[i].rank === "A") {
                        sum += 11;
                        aceCount += 1;
                    } else if (cardArray[i].rank === doubleking) {
                        sum += dk
                    } else {
                        sum += cardArray[i].rank;
                    }
                }
                while (aceCount > 0 && sum > 21) {
                    sum -= 10;
                    aceCount -= 1;
                }
                return sum;
            }

            var player = {
                cards: [],
                score: 0,
                display: () => {
                    let cardsMsg = "";

                    player.cards.forEach(function (card) {
                        cardsMsg += "[`" + card.rank.toString();

                        if (card.suit == "hearts") cardsMsg += "♥";
                        if (card.suit == "diamonds") cardsMsg += "♦";
                        if (card.suit == "spades") cardsMsg += "♠";
                        if (card.suit == "clubs") cardsMsg += "♣";

                        cardsMsg += `\`](${process.env.WEBSITE_LINK})`;;
                    });

                    cardsMsg += " --> " + player.score.toString();

                    return cardsMsg;
                },
                hit: function () {
                    this.cards.push(deck.deckArray[numCardsPulled]);
                    this.score = GetCardsValue(this.cards);
                    numCardsPulled++
                    if (this.score === 21) {
                        return checkStatus(true);
                    }
                },
                stand: function () {
                    while (dealer.score < 17) {
                        dealer.hit();
                    }
                }
            };

            var dealer = {
                cards: [],
                score: 0,
                display: (dealerC) => {
                    let dealerMsg = "";

                    dealer.cards.forEach(function (card) {
                        if (!dealerC || dealerC === false) {
                            if (card === dealer.cards[dealer.cards.length - 1]) {
                                dealerMsg += "[`";
                                dealerMsg += ` ? ?\`](${process.env.WEBSITE_LINK})`;
                            } else {
                                dealerMsg += "[`" + card.rank.toString();

                                if (card.suit == "hearts") dealerMsg += "♥";
                                if (card.suit == "diamonds") dealerMsg += "♦";
                                if (card.suit == "spades") dealerMsg += "♠";
                                if (card.suit == "clubs") dealerMsg += "♣";

                                dealerMsg += `\`](${process.env.WEBSITE_LINK})`;
                            }
                        } else {
                            dealerMsg += "[`" + card.rank.toString();

                            if (card.suit == "hearts") dealerMsg += "♥";
                            if (card.suit == "diamonds") dealerMsg += "♦";
                            if (card.suit == "spades") dealerMsg += "♠";
                            if (card.suit == "clubs") dealerMsg += "♣";

                            dealerMsg += `\`](${process.env.WEBSITE_LINK})`;
                        }
                    });

                    if (dealerC) {
                        dealerMsg += " --> " + dealer.score.toString()
                    }

                    return dealerMsg;
                },
                hit: function () {
                    this.cards.push(deck.deckArray[numCardsPulled]);
                    this.score = GetCardsValue(this.cards);
                    numCardsPulled++
                    if (this.score === 21) {
                        return checkStatus(true);
                    }
                }
            };

            var deck = {
                deckArray: [],
                initialize: function () {
                    var suitArray, rankArray, s, r, n;
                    suitArray = ["clubs", "diamonds", "hearts", "spades"];
                    rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
                    n = 13;
                    for (s = 0; s < suitArray.length; s += 1) {
                        for (r = 0; r < rankArray.length; r += 1) {
                            this.deckArray[s * n + r] = {
                                rank: rankArray[r],
                                suit: suitArray[s]
                            };
                        }
                    }
                },
                shuffle: function () {
                    var temp, i, rnd;
                    for (i = 0; i < this.deckArray.length; i += 1) {
                        rnd = Math.floor(Math.random() * this.deckArray.length);
                        temp = this.deckArray[i];
                        this.deckArray[i] = this.deckArray[rnd];
                        this.deckArray[rnd] = temp;
                    }
                }
            };

            const checkStatus = (Done) => {
                if (dealer.score > 21) {
                    Winner = 'Player'
                }
                if (Done === true && dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
                    Winner = 'Player'
                }
                if (player.score > 21) {
                    Winner = 'Dealer'
                }
                if (Done === true && dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
                    Winner = 'Dealer'
                }
                if (Done === true && player.score === dealer.score) {
                    Winner = 'Dealer'
                }
                if (player.score === 21) {
                    Winner = 'Player'
                }
                if (dealer.score === 21) {
                    Winner = 'Dealer'
                }
                return Winner;
            }

            deck.initialize();
            deck.shuffle();

            player.hit();
            dealer.hit();
            player.hit();
            dealer.hit();

            let blackjackEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle("Black Jack")
                .setURL('https://wall-y.ca/')
                .setDescription("Best of luck to you!")

            blackjackEmbed.setFields(
                { name: 'Player', value: player.display() },
                { name: 'Dealer', value: dealer.display() }
            )

            let Reply = await interaction.deferReply({ ephemeral: false });

            await interaction.editReply({
                content: `${interaction.user}'s blackjack table:`, components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('hit').setLabel('Hit').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('stand').setLabel('Stand').setStyle(ButtonStyle.Danger),
                    )], ephemeral: false, embeds: [blackjackEmbed]
            });

            const collector = Reply.createMessageComponentCollector({ componentType: ComponentType.Button });

            let PreviousResponse;

            const EndGame = async (response) => {
                let Status = checkStatus(true);

                if (Status === undefined) {
                    player.stand();
                }

                Status = checkStatus(true);

                const taxed = await AfterTax(amount, interaction.guild.id);

                blackjackEmbed.setFields(
                    { name: 'Player', value: player.display() },
                    { name: 'Dealer', value: dealer.display(true) }
                );

                let Amount = taxed.Amount;

                if (Status === 'Player') {
                    await User.pay(interaction, Amount);
                    blackjackEmbed.setDescription(`**${interaction.member}** is the winner! You won **${Suffix(Amount)}**${process.env.CURRENCY}`);
                } else {
                    await User.charge(interaction, amount);
                    blackjackEmbed.setDescription(`**Dealer** is the winner! You lost **${Suffix(amount)}**${process.env.CURRENCY}`);
                }

                await Server.increase(interaction, "bank", taxed.ServerTax);
                await Server.increase(interaction, "lottery", taxed.LotteryTax);

                if (PreviousResponse) {
                    PreviousResponse.editReply({ ephemeral: false, embeds: [blackjackEmbed], components: [] });
                } else {
                    response.reply({ ephemeral: false, embeds: [blackjackEmbed], components: [] });
                }

                collector.stop();
            }

            collector.on('collect', async response => {
                try {
                    if (response.user.id === interaction.user.id) {
                        await interaction.editReply({ components: [] });

                        if (response.customId == 'hit') {
                            player.hit();

                            let Status = checkStatus();
                            if (Status === undefined) {
                                blackjackEmbed.setFields(
                                    { name: 'Player', value: player.display() },
                                    { name: 'Dealer', value: dealer.display() }
                                )

                                await response.reply({
                                    ephemeral: false, embeds: [blackjackEmbed], components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder().setCustomId('hit').setLabel('Hit').setStyle(ButtonStyle.Success),
                                            new ButtonBuilder().setCustomId('stand').setLabel('Stand').setStyle(ButtonStyle.Danger))
                                    ]
                                });
                            } else {
                                await EndGame(response);
                            }
                        } else if (response.customId == 'stand') {
                            await EndGame(response);
                        }

                        PreviousResponse = response;
                    } else {
                        response.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                    }
                } catch (err) {
                    console.log(err);
                }
            });

            collector.on('end', collected => { return collected });
        } catch (err) {
            console.log(err);
        }
    },

    name: 'blackjack',
    description: "Play a game of blackjack against the bot!",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'amount',
            description: 'The amount you want to gamble.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
    ],

    cooldown: 5,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}