import dynamic from "next/dynamic";
import { Flex, Grid, GridItem,Card, CardBody, CardHeader, Heading, Text, Button, Box, CardFooter } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const LayoutComponent = dynamic(() => import("@/layout"));

export default function Notes() {
  const [notes, setNotes] = useState();
  const router = useRouter();
  useEffect(() => {
    async function fetchingData(){
      const res = await fetch("https://service.pace-unv.cloud/api/notes");
      const listNotes = await res.json();
      setNotes(listNotes);
    }
    fetchingData();
  }, [])
  console.log("notes =>", notes);
  return (
    <>
      <LayoutComponent metaTitle="Notes">
      <Box padding="5">
      <Flex justifyContent="end">
        <Button colorScheme="blue" onClick={()=> router.push("/notes/add")}>Add Notes</Button>
      </Flex>
        <Flex>
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            {notes?.data?.map((item) => (
              <GridItem>
                <Card>
                  <CardHeader>
                    <Heading>{item?.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{item?.description}</Text>
                  </CardBody>
                  <CardFooter
                    justify="space-between"
                    flexWrap="wrap">
                    <Button flex="1" variant="ghost">
                      Edit
                    </Button>
                    <Button flex="1" variant="ghost" bgColor={"red.500"}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Flex>
        </Box>
      </LayoutComponent>
    </>
  );
}

// export async function getStaticProps() {
//   const res = await fetch("https://service.pace-unv.cloud/api/notes");
//   const notes = await res.json();
//   return { props: { notes }, revalidate:10 };
// }