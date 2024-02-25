import { Group, Paper, PaperProps, Stack, Text } from "@mantine/core";

export const ActionCard = ({
  onClick,
  rightSection,
  leftSection,
  title,
  subtitle,
  ...props
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
  onClick?: () => void;
} & PaperProps) => {
  return (
    <Paper withBorder {...props}>
      <Group justify="space-between">
        <Group
          gap={"xs"}
          p={"md"}
          align="center"
          onClick={() => onClick && onClick()}
          flex={1}
          style={{ cursor: "pointer" }}
        >
          {leftSection && <Group align="center">{leftSection}</Group>}
          <Stack gap={0}>
            <Text size={"sm"}>{title}</Text>
            <Text size={"xs"}>{subtitle}</Text>
          </Stack>
        </Group>
        {rightSection && (
          <Group gap={"xs"} p={"md"} align="center">
            {rightSection}
          </Group>
        )}
      </Group>
    </Paper>
  );
};
