import { auth } from "@/firebase";
import { Box, BoxComponentProps, Group } from "@mantine/core";
import { ReactNode } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { RiFileMusicFill } from "react-icons/ri";

export const LayoutPage = ({
  children,
  leftSection,
  rightSection,
  centerSection,
  ...props
}: {
  children: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  centerSection?: ReactNode;
} & BoxComponentProps) => {
  const [signOut] = useSignOut(auth);

  const headerHeight = 50;

  return (
    <Box {...props} h={"100dvh"} bg="gray.1">
      <Box h={headerHeight} bg={"blue.1"} pos="relative">
        {leftSection && (
          <Group
            gap={5}
            pl="md"
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
            pr="md"
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
          onDoubleClick={() => {
            signOut();
          }}
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
            <>
              <RiFileMusicFill size={24} />
              TUNE NOOK
            </>
          )}
          {centerSection}
        </Group>
      </Box>
      <Box h={`calc(100% - ${headerHeight}px)`} style={{ overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
};
