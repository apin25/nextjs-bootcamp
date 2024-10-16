import dynamic from "next/dynamic";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Notes({ initialData }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const { data: listNotes, mutate } = useSWR("/api/notes", fetcher, {
    initialData,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
  });

  const handleAddNote = () => {
    setIsEditMode(false);
    setNoteData({ title: "", description: "" });
    onOpen();
  };

  const handleEditNote = (note) => {
    setIsEditMode(true);
    setSelectedNote(note);
    setNoteData({
      id: note.id,
      title: note.title,
      description: note.description,
    });
    onOpen();
  };

  const handleDeleteNote = (note) => {
    setSelectedNote(note);
    onDeleteOpen();
  };

  const handleSubmit = async () => {
    let response;

    try {
      if (isEditMode) {
        // Update note
        response = await fetch(`/api/notes/${noteData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) throw new Error("Failed to update note");
        console.log("Note updated successfully:", noteData);
      } else {
        response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) throw new Error("Failed to add new note");
        console.log("New note added successfully:", noteData);
      }

      mutate();
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const confirmDelete = async () => {
    if (selectedNote) {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
        onDeleteClose();
      }
    }
  };

  return (
    <LayoutComponent metaTitle="Notes">
      <Box padding="5">
        <Flex justifyContent="end">
          <Button colorScheme="blue" onClick={handleAddNote}>
            Add Notes
          </Button>
        </Flex>
        <Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            {listNotes?.data?.map((item) => (
              <GridItem key={item.id}>
                <Card>
                  <CardHeader>
                    <Heading>{item?.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{item?.description}</Text>
                  </CardBody>
                  <CardFooter justify="space-between" flexWrap="wrap">
                    <Button
                      onClick={() => handleEditNote(item)}
                      flex="1"
                      variant="ghost"
                    >
                      Edit
                    </Button>
                    <Button
                      flex="1"
                      colorScheme="red"
                      onClick={() => handleDeleteNote(item)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? "Edit Note" : "Add New Note"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Title"
              value={noteData.title}
              onChange={(e) =>
                setNoteData({ ...noteData, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={noteData.description}
              onChange={(e) =>
                setNoteData({ ...noteData, description: e.target.value })
              }
              mt={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete the note{" "}
              <strong>{selectedNote?.title}</strong>?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDelete}>
              Yes, Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutComponent>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://service.pace-unv.cloud/api/notes");
  const data = await res.json();

  return {
    props: {
      initialData: data,
    },
  };
}
