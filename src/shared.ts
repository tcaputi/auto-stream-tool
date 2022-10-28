import { gql } from "@apollo/client";

export interface PlayerInfoModel {
  pronouns?: string;
  prefix?: string;
  tag: string;
  twitterHandle?: string;
  twitchHandle?: string;
}

export interface PlayerStateModel {
  score: number;
  characterID: number;
  characterAltID: number;
}

export interface MatchInfoModel {
  id: string;
  tournamentName: string;
  roundName: string;
  players: PlayerInfoModel[];
}

export interface ScoreboardPlayerInfo {
  name: string;
  team: string;
  pronouns: string;
  score: number;
  character: string;
  skin: string;
}

export interface ScoreboardInfo {
  players: ScoreboardPlayerInfo[];
  bestOfText: string;
  roundName: string;
  tournamentName: string;
}

const CHARACTERS = [
  "Unknown",
  "Mario",
  "Donkey Kong",
  "Link",
  "Samus",
  "Yoshi",
  "Kirby",
  "Fox",
  "Pikachu",
  "Unlockable",
  "Dark Samus*",
  "Luigi",
  "Ness",
  "Captain Falcon",
  "Jigglypuff",
  "Peach",
  "Daisy",
  "Bowser",
  "Ice Climbers",
  "Sheik",
  "Zelda",
  "Dr. Mario",
  "Pichu",
  "Falco",
  "Marth",
  "Lucina",
  "Young Link",
  "Ganondorf",
  "Mewtwo",
  "Roy",
  "Chrom",
  "Mr. Game & Watch",
  "Meta Knight",
  "Pit",
  "Dark Pit",
  "Zero Suit Samus",
  "Wario",
  "Snake",
  "Ike",
  "Pokémon Trainer",
  "Diddy Kong",
  "Lucas",
  "Sonic",
  "King Dedede",
  "Olimar",
  "Lucario",
  "R.O.B.",
  "Toon Link",
  "Wolf",
  "Villager",
  "Mega Man",
  "Wii Fit Trainer",
  "Rosalina and Luma",
  "Little Mac",
  "Greninja",
  "Palutena",
  "Pac-Man",
  "Robin",
  "Shulk",
  "Bowser Jr.",
  "Duck Hunt",
  "Ryu",
  "Ken",
  "Cloud",
  "Corrin",
  "Bayonetta",
  "Inkling",
  "Ridley",
  "Simon",
  "Richter",
  "King K. Rool",
  "Isabelle",
  "Incineroar",
  "Mii Brawler",
  "Mii Swordfighter",
  "Mii Gunner",
  "Piranha Plant",
  "Joker",
  "Hero",
  "Banjo and Kazooie",
  "Terry",
  "Byleth",
  "Min Min",
  "Steve",
  "Sephiroth",
  "Pyra / Mythra",
  "Kazuya Mishima",
  "Sora",
];

const GAMES_QUERY = gql`
  query EventSets($slug: String!, $page: Int!, $perPage: Int!) {
    event(slug: $slug) {
      id
      name
      tournament {
        id
        name # tournament name
      }
      sets(page: $page, perPage: $perPage, sortType: STANDARD) {
        pageInfo {
          total
        }
        nodes {
          fullRoundText # round
          stream {
            id
          }
          slots {
            id
            entrant {
              id
              participants {
                # this is an array (take 0)
                id
                prefix # prefixes
                gamerTag # gamer tag
                user {
                  id
                  genderPronoun # pronouns
                  authorizations {
                    id
                    type # twitter, twitch, etc
                    externalUsername # username
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function gamesQueryToModel(res: any) {
  const tournamentName = res.event.tournament.name;

  const games: MatchInfoModel[] = res.event.sets.nodes.map((set: any) => {
    const matchID = set.id;
    const roundName = set.fullRoundText;

    const players: PlayerInfoModel[] = set.slots.map((slot: any) => {
      const tag = slot.entrant.participants[0].gamerTag;
      const prefix = slot.entrant.participants[0].prefix ?? undefined;
      const pronouns =
        slot.entrant.participants[0].user.genderPronoun ?? undefined;
      const twitterHandle =
        slot.entrant.participants[0].user.authorizations.find(
          (service: any) => service.type === "TWITTER"
        )?.externalUsername;
      const twitchHandle =
        slot.entrant.participants[0].user.authorizations.find(
          (service: any) => service.type === "TWITCH"
        )?.externalUsername;

      return {
        pronouns,
        prefix,
        tag,
        twitterHandle,
        twitchHandle,
      };
    });

    return {
      id: matchID,
      tournamentName,
      roundName,
      players,
      playerStates: {
        characterID: 0,
        characterAltID: 0,
      },
    };
  });

  return games;
}

export { CHARACTERS, GAMES_QUERY, gamesQueryToModel };
