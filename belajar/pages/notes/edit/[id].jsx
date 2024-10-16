import dynamic from "next/dynamic";
import {
  Grid,
  GridItem,
  Card,
  Heading,
  Text,
  Button,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
const LayoutComponent = dynamic(() => import("@/layout"));
export default function EditNotes() {
  const router = useRouter();
  const [notes, setNotes] = useState({ title: "", description: "" });
  const { id } = router?.query;
  const HandleSubmit = async () => {
    try {
      const response = await fetch(
        `https://service.pace-unv.cloud/api/notes/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: notes?.title,
            description: notes?.description,
          }),
        },
      );
      const result = await response.json();
      if (result?.success) {
        router.push("/notes");
      }
    } catch (error) {}
  };
  useEffect(() => {
    async function fetchingData() {
      const res = await fetch(
        `https://service.pace-unv.cloud/api/notes/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const listNotes = await res.json();
      setNotes(listNotes?.data);
    }
    fetchingData();
  }, [id]);
  return (
    <>
      <LayoutComponent metaTitle="Notes">
        <Card margin="5" padding="5">
          <Heading>Edit Notes</Heading>
          <Grid gap="5">
            <GridItem>
              <Text>Title</Text>
              <Input
                type="text"
                onChange={(event) =>
                  setNotes({ ...notes, title: event.target.value })
                }
                value={notes?.title || ""}
              />
            </GridItem>
            <GridItem>
              <Text>Description</Text>
              <Textarea
                value={notes?.description || ""}
                onChange={(event) =>
                  setNotes({ ...notes, description: event.target.value })
                }
              />
            </GridItem>
            <GridItem>
              <Button colorScheme="blue" onClick={() => HandleSubmit()}>
                Submit
              </Button>
            </GridItem>
          </Grid>
        </Card>
      </LayoutComponent>
    </>
  );
}
