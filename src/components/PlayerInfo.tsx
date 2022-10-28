import { PlayerInfoModel, PlayerStateModel, CHARACTERS } from "../shared";
import Dropdown from "./DropDown";

interface PlayerInfoProps {
  scoreToWin: number;
  player: PlayerInfoModel;
  playerState: PlayerStateModel;
  onCharacterSelected: { (characterName: string): void };
  onCharacterAltSelected: { (characterAltID: number): void };
  onScoreSelected: { (score: number): void };
}

const PlayerInfo: React.FC<PlayerInfoProps> = (props) => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col">
          <div className="text-xl text-gray-200">{props.player.tag}</div>
          <div className="flex flex-col text-sm text-gray-400">
            <div>{`Prefix: ${props.player.prefix ?? "none"}`}</div>
            <div>{`Pronouns: ${props.player.pronouns ?? "none"}`}</div>
          </div>{" "}
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
        displayValue={(characterName) => characterName}
        displayKey={(characterName) => characterName}
        onChange={props.onCharacterSelected}
      />
    </div>
  );
};

export default PlayerInfo;
