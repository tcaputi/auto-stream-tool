import {
  PlayerInfoModel,
  PlayerStateModel,
  CHARACTERS,
  CharacterModel,
} from "../shared";
import Dropdown from "./Dropdown";

interface PlayerInfoProps {
  scoreToWin: number;
  player: PlayerInfoModel;
  playerState: PlayerStateModel;
  onCharacterSelected: { (character: CharacterModel): void };
  onCharacterAltSelected: { (characterAltID: number): void };
  onScoreSelected: { (score: number): void };
}

const PlayerInfo: React.FC<PlayerInfoProps> = (props) => {
  const character = CHARACTERS[props.playerState.characterID]!;

  const characterAlts = [];
  for (let i = 0; i < character.numAlts; i++) {
    characterAlts.push({
      id: i,
      url: `/icons/${character.name}/${character.name} (${i + 1}).png`,
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col">
          <div className="text-2xl text-gray-200">{props.player.tag}</div>
          <div className="text-md flex flex-col text-gray-400">
            <div>{`Prefix: ${props.player.prefix ?? "none"}`}</div>
            <div>{`Pronouns: ${props.player.pronouns ?? "none"}`}</div>
          </div>
        </div>
        <div className="w-24">
          <Dropdown
            label="Score"
            options={Array.from(Array(props.scoreToWin + 1).keys())}
            value={props.playerState.score}
            displayValue={(score) => score.toString()}
            displayKey={(score) => score}
            onChange={props.onScoreSelected}
          />
        </div>
      </div>
      <Dropdown
        label="Select Character"
        options={CHARACTERS}
        value={CHARACTERS[props.playerState.characterID]!}
        displayValue={(character) => character.name}
        displayKey={(character) => character.name}
        onChange={props.onCharacterSelected}
      />
      <div className="flex gap-2">
        {characterAlts.map((characterAlt) => (
          <button
            key={characterAlt.id}
            className={`rounded-2xl ${
              characterAlt.id === props.playerState.characterAltID
                ? "bg-green-500"
                : ""
            } `}
            onClick={() => props.onCharacterAltSelected(characterAlt.id)}
          >
            <img src={characterAlt.url} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerInfo;
