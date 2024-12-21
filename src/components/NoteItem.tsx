import { FC } from "react";
import AppButton from "./AppButton";

interface Props {
  title?: string;
  description?: string;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onViewClick?: () => void;
}

const NoteItem: FC<Props> = ({
  title,
  description,
  onEditClick,
  onDeleteClick,
  onViewClick,
}) => {
  return (
    <div className="bg-white shadow-md rounded p-5 space-y-6">
      <p className="font-semibold text-gray-700 text-lg">{title}</p>
      {description ? (
        <p className="ml-2 mt-2 text-gray-600 text-pretty">{description}</p>
      ) : null}
      <div className="space-x-4">
        <AppButton
          onClick={onViewClick}
          title={description ? "Hide" : "View"}
          type="regular"
        />
        <AppButton onClick={onEditClick} title="Edit" type="normal" />
        <AppButton onClick={onDeleteClick} title="Delete" type="danger" />
      </div>
    </div>
  );
};
export default NoteItem;
