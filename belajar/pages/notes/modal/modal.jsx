import {
  Modal as ChakraModal,  
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CustomModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { title: "", description: "" },
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>  {/* Use ChakraModal */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? "Edit Notes" : "Add Notes"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            mb={4}
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}