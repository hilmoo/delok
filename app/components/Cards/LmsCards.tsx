import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router";
import type { Lms } from "~/types/lms";
import classes from "./LmsCards.module.css";

type LmsCardsProps = {
  data: Lms[];
};
export function LmsCards({ data }: LmsCardsProps) {
  const navigate = useNavigate();

  const cards = data.map((lms) => (
    <Card
      key={lms.id}
      p="md"
      radius="md"
      className={classes.card}
      shadow="none"
      w={"100%"}
      onClick={() => {
        navigate(`/app/${lms.id}`);
      }}
    >
      <Title order={3} lineClamp={1}>
        {lms.name}
      </Title>
      <Stack gap={0} mt={"xs"}>
        <Text c={"dimmed"} size="md">
          {lms.url}
        </Text>
      </Stack>
    </Card>
  ));

  return (
    <>
      <Flex gap="md" align="center" direction="row" wrap="wrap">
        {cards}
      </Flex>
    </>
  );
}
