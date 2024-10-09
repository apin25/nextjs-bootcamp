import dynamic from "next/dynamic";
import {
  Grid,
  GridItem,
  Card,
  Heading,
  Text,
  Button,
  Textarea,
  Input
} from "@chakra-ui/react";
import { useState } from "react";
const LayoutComponent = dynamic(() => import("@/layout"));

export default function AddNotes() {
  const [notes, setNotes] = useState({title:"",description:""});
  const HandleSubmit = async () => {
    try{
        const response = await fetch(
          "https://service.pace-unv.cloud/api/notes", {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(notes),
          }
        );
        const result = await response.json()
        console.log("result =>",result)
    } catch (error){

    }
  }
  return (
    <>
      <LayoutComponent metaTitle="Notes">
        <Card margin="5" padding="5">
          <Heading>Add Notes</Heading>
          <Grid gap="5">
            <GridItem>
              <Text>Title</Text>
              <Input
                type="text"
                onChange={(event) =>
                  setNotes({ ...notes, title: event.target.value })
                }
              />
            </GridItem>
            <GridItem>
              <Text>Description</Text>
              <Textarea
                onChange={(event) =>
                  setNotes({ ...notes, description: event.target.value })
                }
              />
            </GridItem>
            <GridItem>
              <Button colorScheme="blue" onClick={() => HandleSubmit()}>Submit</Button>
            </GridItem>
          </Grid>
        </Card>
      </LayoutComponent>
    </>
  );
}