import { LayoutFullScreen } from "@/components/LayoutFullScreen/LayoutFullScreen";
import { Box, Title } from "@mantine/core";

export const PageNotFound = () => {
  return (
    <LayoutFullScreen>
      <Box p={"lg"}>
        <Title ta={"center"}>Page Not Found</Title>
      </Box>
    </LayoutFullScreen>
  );
};
