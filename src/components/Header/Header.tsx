import { Anchor, Box, BoxComponentProps, Group } from "@mantine/core";
import { ReactNode } from "react";
import { RiFileMusicFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export const Header = ({
  leftSection,
  rightSection,
  centerSection,
  ...props
}: {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  centerSection?: ReactNode;
} & BoxComponentProps) => {
  const headerHeight = 50;

  return (
    <Box h={headerHeight} bg={"blue.1"} pos="relative" {...props}>
      {leftSection && (
        <Group
          gap={5}
          pl="xs"
          align={"center"}
          justify={"center"}
          pos={"absolute"}
          left={"0"}
          top={"50%"}
          style={{
            transform: "translate(0, -50%)",
          }}
        >
          {leftSection}
        </Group>
      )}

      {rightSection && (
        <Group
          gap={5}
          pr={"xs"}
          align={"center"}
          justify={"center"}
          pos={"absolute"}
          right={"0"}
          top={"50%"}
          style={{
            transform: "translate(0, -50%)",
          }}
        >
          {rightSection}
        </Group>
      )}

      <Group
        gap={4}
        p={"xs"}
        fw={"bold"}
        align={"center"}
        justify={"center"}
        pos={"absolute"}
        left={"50%"}
        top={"50%"}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        {!centerSection && (
          <Anchor component={Link} to="/">
            <Group gap={4} fw={"bold"}>
              <RiFileMusicFill size={24} />
              TUNE NOOK
            </Group>
          </Anchor>
        )}
        {centerSection}
      </Group>
    </Box>
  );
};
