import { auth } from "@/firebase";
import { Box, BoxComponentProps, Group } from "@mantine/core";
import { ReactNode } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { RiFileMusicFill } from "react-icons/ri";

export const LayoutPage = ({
  children,
  ...props
}: { children: ReactNode } & BoxComponentProps) => {
  const [signOut] = useSignOut(auth);

  return (
    <Box {...props} mih={"100dvh"}>
      <Group
        gap={5}
        p={"sm"}
        bg={"blue.1"}
        onDoubleClick={() => {
          signOut();
        }}
        fw={"bold"}
        align={"center"}
        justify={"center"}
      >
        <RiFileMusicFill size={24} />
        TUNE NOOK
      </Group>
      {children}
    </Box>
  );
};
