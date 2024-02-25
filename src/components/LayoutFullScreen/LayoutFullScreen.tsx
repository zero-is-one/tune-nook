import { Header } from "@/components/Header/Header";
import { Box, BoxComponentProps, Stack } from "@mantine/core";
import { ReactNode } from "react";

export const LayoutFullScreen = ({
  header,
  children,
  ...props
}: {
  children: ReactNode;
  header?: ReactNode;
} & BoxComponentProps) => {
  return (
    <Stack
      style={{ overflow: "hidden" }}
      gap={0}
      h={"100dvh"}
      bg="gray.1"
      {...props}
    >
      <Box>{header || <Header />}</Box>
      <Box flex={1} w={"100%"} style={{ overflow: "auto" }}>
        {children}
      </Box>
    </Stack>
  );
};
