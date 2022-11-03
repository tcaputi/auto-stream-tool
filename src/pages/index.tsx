import type { NextPage } from "next";
import Head from "next/head";
import { useState, KeyboardEvent, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import {
  PlayerStateModel,
  GAMES_QUERY,
  gamesQueryToModel,
  MatchInfoModel,
  CHARACTERS,
  ScoreboardInfo,
  CharacterModel,
  CommentatorModel,
} from "../shared";
import PlayerInfo from "../components/PlayerInfo";
import CommentatorInfo from "../components/CommentatorInfo";

const DEFAULT_COMMENTATOR_STATE: CommentatorModel[] = [
  {
    name: "",
    twitterHandle: "",
  },
  {
    name: "",
    twitterHandle: "",
  },
];

const DEFAULT_PLAYER_STATE: PlayerStateModel[] = [
  {
    score: 0,
    characterAltID: 0,
    characterID: 0,
  },
  {
    score: 0,
    characterAltID: 0,
    characterID: 0,
  },
];

const Main: NextPage = () => {
  const [fetchGames, { loading, error, data, fetchMore }] =
    useLazyQuery(GAMES_QUERY);
  const [errorMsg, setErrorMsg] = useState("");
  const [playersSwapped, setPlayersSwapped] = useState(false);
  const [tournamentUrl, setTournamentUrl] = useState("");
  const [scoreToWin, setScoreToWin] = useState(2);
  const [matchIdx, setMatchIdx] = useState(0);
  const [playerStates, setPlayerStates] = useState([...DEFAULT_PLAYER_STATE]);
  const [commentatorStates, setCommentatorStates] = useState([
    ...DEFAULT_COMMENTATOR_STATE,
  ]);
  const gamesList = data ? gamesQueryToModel(data) : undefined;
  const matchInfo = gamesList ? gamesList[matchIdx] : undefined;

  function onTournamentUrlSubmit() {
    const urlMatches = tournamentUrl.match(
      /^https:\/\/www.start.gg\/(tournament\/[a-zA-Z0-9-_]*\/event\/[a-zA-Z0-9-_]*).*$/
    );
    if (!urlMatches) {
      setErrorMsg("Invalid Tournament URL");
      return;
    }

    //TODO: paginated fetch
    fetchGames({ variables: { slug: urlMatches[1], page: 1, perPage: 999 } });
    setErrorMsg("");
  }

  function onCommentatorNameChange(idx: number, name: string): void {
    setCommentatorStates((oldStates) => {
      const newStates = [...oldStates];
      const newState = { ...newStates[idx]!, name };
      newStates[idx] = newState;
      return newStates;
    });
  }

  function onCommentatorTwitterChange(idx: number, twitter: string): void {
    setCommentatorStates((oldStates) => {
      const newStates = [...oldStates];
      const newState = { ...newStates[idx]!, twitterHandle: twitter };
      newStates[idx] = newState;
      return newStates;
    });
  }

  function onMatchSelected(match: MatchInfoModel) {
    setMatchIdx(gamesList!.findIndex((m) => m.id === match.id));
    setPlayerStates([...DEFAULT_PLAYER_STATE]);
    setPlayersSwapped(false);
  }

  function onCharacterSelected(idx: number, character: CharacterModel) {
    setPlayerStates((oldStates) => {
      const newStates = [...oldStates];
      const newState = {
        ...newStates[idx]!,
        characterID: CHARACTERS.findIndex(
          (char) => char.name === character.name
        ),
      };
      newStates[idx] = newState;
      return newStates;
    });
  }

  function onCharacterAltSelected(idx: number, characterAltID: number) {
    setPlayerStates((oldStates) => {
      const newStates = [...oldStates];
      const newState = { ...newStates[idx]!, characterAltID };
      newStates[idx] = newState;
      return newStates;
    });
  }

  function onScoreSelected(idx: number, score: number) {
    setPlayerStates((oldStates) => {
      const newStates = [...oldStates];
      const newState = { ...newStates[idx]!, score };
      newStates[idx] = newState;
      return newStates;
    });
  }

  async function onSubmitUpdate() {
    try {
      if (!matchInfo) throw new Error("Match not selected");

      const scoreboard: ScoreboardInfo = {
        tournamentName: matchInfo.tournamentName,
        roundName: matchInfo.roundName,
        bestOfText: `Best of ${scoreToWin * 2 - 1}`,
        commentators: commentatorStates,
        players: matchInfo.players.map((player, i) => {
          const playerState = playerStates[i]!;
          const characterName = CHARACTERS[playerState.characterID]!.name;

          return {
            name: player.tag,
            pronouns: player.pronouns ?? "",
            team: player.prefix ?? "",
            character: characterName,
            skin: `${characterName} (${playerState.characterAltID})`,
            score: playerState.score,
          };
        }),
      };

      if (playersSwapped) scoreboard.players.reverse();
      console.log(scoreboard);

      const res = await fetch("/api/set-scoreboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreboard),
      });
      if (!res.ok) throw new Error("Failed to update UI");
    } catch (err) {
      setErrorMsg((err as Error).message);
    }
  }

  return (
    <div className="bg-slate-900">
      <Head>
        <title>Auto Stream Tool for Smash Ultimate</title>
        <meta
          name="description"
          content="Automatically Update Smash Ultimate Overlays"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto flex min-h-screen flex-col items-center gap-6 p-4">
        <h1 className="text-4xl font-extrabold leading-normal text-gray-200">
          Auto Stream Tool for Smash Ultimate
        </h1>
        <div className="flex w-3/4 min-w-max max-w-6xl flex-col gap-4">
          {errorMsg || error ? (
            <div className="flex bg-red-500 p-4 text-white">
              {errorMsg || error?.message}
            </div>
          ) : null}
          <div className="flex flex-col gap-12 border p-8">
            <div className="flex gap-4">
              <TextInput
                className="flex-1"
                label="Tournament Url"
                value={tournamentUrl}
                onChange={(event) => setTournamentUrl(event.target.value)}
              />
              <Button onClick={onTournamentUrlSubmit}>Submit / Refresh</Button>
            </div>
            <div className="flex flex-col gap-4">
              <CommentatorInfo
                idx={0}
                commentator={commentatorStates[0]!}
                onNameChange={(name) => onCommentatorNameChange(0, name)}
                onTwitterHandleChange={(twitter) =>
                  onCommentatorTwitterChange(0, twitter)
                }
              />
              <CommentatorInfo
                idx={1}
                commentator={commentatorStates[1]!}
                onNameChange={(name) => onCommentatorNameChange(1, name)}
                onTwitterHandleChange={(twitter) =>
                  onCommentatorTwitterChange(1, twitter)
                }
              />
            </div>
            {loading ? <div className="text-gray-200">Loading...</div> : null}
            {gamesList && matchInfo ? (
              <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <Dropdown
                      label="Game"
                      options={gamesList}
                      displayKey={(match) => match.id}
                      displayValue={(match) => {
                        console.log(match);
                        console.log(0, match.players[0]!.tag);
                        console.log(1, match.players[1]!.tag);
                        return `${match.players[0]!.tag} vs ${
                          match.players[1]!.tag
                        } (${match.roundName})`;
                      }}
                      value={matchInfo}
                      onChange={onMatchSelected}
                    />
                  </div>
                  <div className="w-24">
                    <Dropdown
                      label="Best of"
                      options={[2, 3]}
                      displayKey={(opt) => opt}
                      displayValue={(opt) => (opt * 2 - 1).toString()}
                      value={scoreToWin}
                      onChange={(opt) => setScoreToWin(opt)}
                    />
                  </div>
                </div>
                <div
                  className={`flex gap-10 ${
                    playersSwapped ? "flex-row-reverse" : ""
                  }`}
                >
                  <PlayerInfo
                    scoreToWin={scoreToWin}
                    player={matchInfo?.players[0]!}
                    playerState={playerStates[0]!}
                    onCharacterSelected={(characterName) =>
                      onCharacterSelected(0, characterName)
                    }
                    onCharacterAltSelected={(characterAltID) =>
                      onCharacterAltSelected(0, characterAltID)
                    }
                    onScoreSelected={(score) => onScoreSelected(0, score)}
                  />
                  <Button onClick={() => setPlayersSwapped((x) => !x)}>
                    {"<-->"}
                  </Button>
                  <PlayerInfo
                    scoreToWin={scoreToWin}
                    player={matchInfo?.players[1]!}
                    playerState={playerStates[1]!}
                    onCharacterSelected={(characterName) =>
                      onCharacterSelected(1, characterName)
                    }
                    onCharacterAltSelected={(characterAltID) =>
                      onCharacterAltSelected(1, characterAltID)
                    }
                    onScoreSelected={(score) => onScoreSelected(1, score)}
                  />
                </div>
                <Button className="h-16 text-xl" onClick={onSubmitUpdate}>
                  Update Scoreboard
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
