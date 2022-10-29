import { CommentatorModel } from "../shared";
import TextInput from "./TextInput";

interface CommentatorInfoProps {
  idx: number;
  commentator: CommentatorModel;
  onNameChange: { (name: string): void };
  onTwitterHandleChange: { (twitter: string): void };
}

const CommentatorInfo: React.FC<CommentatorInfoProps> = (props) => {
  return (
    <div className="flex gap-4">
      <TextInput
        className="w-1/4"
        label={`Commentator ${props.idx + 1} name`}
        value={props.commentator.name}
        onChange={(event) => props.onNameChange(event.target.value)}
      />
      <TextInput
        className="w-1/4"
        label={`Commentator ${props.idx + 1} twitter`}
        value={props.commentator.twitterHandle}
        onChange={(event) => props.onTwitterHandleChange(event.target.value)}
      />
    </div>
  );
};

export default CommentatorInfo;
