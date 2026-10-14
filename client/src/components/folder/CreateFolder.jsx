import React, { useState } from "react";
import { useDrive } from "../../hooks/useDrive";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const CreateFolder = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createFolder } = useDrive();

  const handleCreateFolder = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || isLoading) return;

    setIsLoading(true);

    try {
      await createFolder(trimmedName);
      setName("");
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
    >
      <form onSubmit={handleCreateFolder} className="space-y-5">
        <Input
          label="Folder Name"
          placeholder="Untitled Folder"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />

        <div className="flex items-center justify-end gap-3 p-2">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={!name.trim() || isLoading}
            isLoading={isLoading}
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolder;