import { gql } from "@apollo/client";

export interface CommentatorModel {
  name: string;
  twitterHandle: string;
}

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

export interface CharacterModel {
  name: string;
  numAlts: number;
}

export interface ScoreboardInfo {
  commentators: CommentatorModel[];
  players: ScoreboardPlayerInfo[];
  bestOfText: string;
  roundName: string;
  tournamentName: string;
}

const CHARACTERS: CharacterModel[] = [
  { name: "Random", numAlts: 1 },
  { name: "Banjo & Kazooie", numAlts: 8 },
  { name: "Bayonetta", numAlts: 8 },
  { name: "Bowser", numAlts: 8 },
  { name: "Bowser Jr", numAlts: 8 },
  { name: "Byleth", numAlts: 8 },
  { name: "Captain Falcon", numAlts: 8 },
  { name: "Chrom", numAlts: 8 },
  { name: "Cloud", numAlts: 8 },
  { name: "Corrin", numAlts: 8 },
  { name: "Daisy", numAlts: 8 },
  { name: "Dark Pit", numAlts: 8 },
  { name: "Dark Samus", numAlts: 8 },
  { name: "Diddy Kong", numAlts: 8 },
  { name: "Donkey Kong", numAlts: 8 },
  { name: "Dr Mario", numAlts: 8 },
  { name: "Duck Hunt", numAlts: 8 },
  { name: "Falco", numAlts: 8 },
  { name: "Fox", numAlts: 8 },
  { name: "Ganondorf", numAlts: 8 },
  { name: "Greninja", numAlts: 8 },
  { name: "Hero", numAlts: 8 },
  { name: "Ice Climbers", numAlts: 8 },
  { name: "Ike", numAlts: 8 },
  { name: "Incineroar", numAlts: 8 },
  { name: "Inkling", numAlts: 8 },
  { name: "Isabelle", numAlts: 8 },
  { name: "Jigglypuff", numAlts: 8 },
  { name: "Joker", numAlts: 8 },
  { name: "Kazuya", numAlts: 8 },
  { name: "Ken", numAlts: 8 },
  { name: "King Dedede", numAlts: 8 },
  { name: "King K Rool", numAlts: 8 },
  { name: "Kirby", numAlts: 8 },
  { name: "Link", numAlts: 8 },
  { name: "Little Mac", numAlts: 8 },
  { name: "Lucario", numAlts: 8 },
  { name: "Lucas", numAlts: 8 },
  { name: "Lucina", numAlts: 8 },
  { name: "Luigi", numAlts: 8 },
  { name: "Mario", numAlts: 8 },
  { name: "Marth", numAlts: 8 },
  { name: "Mega Man", numAlts: 8 },
  { name: "Meta Knight", numAlts: 8 },
  { name: "Mewtwo", numAlts: 8 },
  { name: "Mii Brawler", numAlts: 8 },
  { name: "Mii Gunner", numAlts: 8 },
  { name: "Mii Swordfighter", numAlts: 8 },
  { name: "Min Min", numAlts: 8 },
  { name: "Mr Game & Watch", numAlts: 8 },
  { name: "Ness", numAlts: 8 },
  { name: "Olimar", numAlts: 8 },
  { name: "Pac Man", numAlts: 8 },
  { name: "Palutena", numAlts: 8 },
  { name: "Peach", numAlts: 8 },
  { name: "Pichu", numAlts: 8 },
  { name: "Pikachu", numAlts: 8 },
  { name: "Piranha Plant", numAlts: 8 },
  { name: "Pit", numAlts: 8 },
  { name: "Pokemon Trainer", numAlts: 8 },
  { name: "Pyra & Mythra", numAlts: 8 },
  { name: "Richter", numAlts: 8 },
  { name: "Ridley", numAlts: 8 },
  { name: "Rob", numAlts: 8 },
  { name: "Robin", numAlts: 8 },
  { name: "Rosalina & Luma", numAlts: 8 },
  { name: "Roy", numAlts: 8 },
  { name: "Ryu", numAlts: 8 },
  { name: "Samus", numAlts: 8 },
  { name: "Sephiroth", numAlts: 8 },
  { name: "Sheik", numAlts: 8 },
  { name: "Shulk", numAlts: 8 },
  { name: "Simon", numAlts: 8 },
  { name: "Snake", numAlts: 8 },
  { name: "Sonic", numAlts: 8 },
  { name: "Sora", numAlts: 8 },
  { name: "Steve", numAlts: 8 },
  { name: "Terry", numAlts: 8 },
  { name: "Toon Link", numAlts: 8 },
  { name: "Villager", numAlts: 8 },
  { name: "Wario", numAlts: 8 },
  { name: "Wii Fit Trainer", numAlts: 8 },
  { name: "Wolf", numAlts: 8 },
  { name: "Yoshi", numAlts: 8 },
  { name: "Young Link", numAlts: 8 },
  { name: "Zelda", numAlts: 8 },
  { name: "Zero Suit Samus", numAlts: 8 },
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
          id
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
        slot.entrant.participants[0].user.genderPronoun
          ?.toLowerCase()
          .replace(/\s/g, "") ?? undefined;
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
