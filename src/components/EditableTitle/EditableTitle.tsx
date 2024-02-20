import { ActionIcon, Group, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export const EditableTitle = ({
  value,
  onChange,
  onModeChange,
}: {
  value: string;
  onChange: (value: string) => Promise<void>;
  onModeChange?: (mode: "view" | "edit") => void;
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing) {
    return (
      <TextInput
        size="md"
        placeholder="Playlist Name"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        w="100%"
        rightSection={
          <ActionIcon
            aria-label="Edit Name"
            onClick={async () => {
              setLoading(true);
              await onChange(inputValue);
              setLoading(false);
              setIsEditing(false);
              onModeChange && onModeChange("view");
            }}
            color="green"
            loading={loading}
          >
            <FaCheck size={14} />
          </ActionIcon>
        }
      />
    );
  }

  return (
    <Group align="center" w={"100%"} justify="center">
      <Text size={"md"} maw="calc(100% - 48px)" truncate="end">
        {value}
      </Text>
      <ActionIcon
        c={"dimmed"}
        variant="transparent"
        aria-label="Edit Name"
        onClick={() => {
          setInputValue(value);
          setIsEditing(true);
          onModeChange && onModeChange("edit");
        }}
      >
        <MdEdit size={20} />
      </ActionIcon>
    </Group>
  );
};
