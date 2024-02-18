import { useTune } from "@/hooks/useTune";
import { Tune } from "@/types";
import { Card, Group, Stack, Text } from "@mantine/core";
import { TbStar, TbStarFilled } from "react-icons/tb";

export const TuneCard = ({ tune }: { tune: Tune }) => {
  const { lastPlayedAt } = useTune(tune?.id || "");

  const daysAgoPlayed = lastPlayedAt
    ? Math.floor((Date.now() - lastPlayedAt.toMillis()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card withBorder key={tune.id}>
      <Group justify="space-between">
        <Stack gap={3}>
          <Text>{tune.title}</Text>
          <Text size={"xs"}>
            {!lastPlayedAt
              ? "Never played before."
              : `Played ${daysAgoPlayed} days ago`}
          </Text>
        </Stack>
        {!tune.isFavorited && <TbStar size={20} />}
        {tune.isFavorited && <TbStarFilled size={20} />}
      </Group>
    </Card>
  );
};
