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
  "Banjo & Kazooie",
  "Bayonetta",
  "Bowser",
  "Bowser Jr",
  "Byleth",
  "Captain Falcon",
  "Chrom",
  "Cloud",
  "Corrin",
  "Daisy",
  "Dark Pit",
  "Dark Samus",
  "Diddy Kong",
  "Donkey Kong",
  "Dr Mario",
  "Duck Hunt",
  "Falco",
  "Fox",
  "Ganondorf",
  "Greninja",
  "Hero",
  "Ice Climbers",
  "Ike",
  "Incineroar",
  "Inkling",
  "Isabelle",
  "Jigglypuff",
  "Joker",
  "Kazuya",
  "Ken",
  "King Dedede",
  "King K Rool",
  "Kirby",
  "Link",
  "Little Mac",
  "Lucario",
  "Lucas",
  "Lucina",
  "Luigi",
  "Mario",
  "Marth",
  "Mega Man",
  "Meta Knight",
  "Mewtwo",
  "Mii Brawler",
  "Mii Gunner",
  "Mii Swordfighter",
  "Min Min",
  "Mr Game & Watch",
  "Ness",
  "Olimar",
  "Pac Man",
  "Palutena",
  "Peach",
  "Pichu",
  "Pikachu",
  "Piranha Plant",
  "Pit",
  "Pokemon Trainer",
  "Pyra & Mythra",
  "Random",
  "Random.png",
  "Richter",
  "Ridley",
  "Rob",
  "Robin",
  "Rosalina & Luma",
  "Roy",
  "Ryu",
  "Samus",
  "Sephiroth",
  "Sheik",
  "Shulk",
  "Simon",
  "Snake",
  "Sonic",
  "Sora",
  "Steve",
  "Terry",
  "Toon Link",
  "Villager",
  "Wario",
  "Wii Fit Trainer",
  "Wireframe.png",
  "Wolf",
  "Yoshi",
  "Young Link",
  "Zelda",
  "Zero Suit Samus",
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
