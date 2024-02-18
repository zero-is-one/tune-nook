import { ActionIcon } from "@mantine/core";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <ActionIcon variant="transparent" onClick={() => navigate(-1)}>
      <IoArrowBack size={"100%"} />
    </ActionIcon>
  );
};
