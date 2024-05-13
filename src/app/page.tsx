"use client";

import styles from "./page.module.css";
import { useMutation, useQuery } from "react-query";
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Button,
  TextField,
  Modal,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  addGroceryItem,
  deleteGroceryItem,
  getGroceryList,
  GroceryItem,
  updateGroceryItem,
} from "@/api";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [editProduct, setEditProduct] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "" });

  const { data: groceryList, refetch } = useQuery(
    "groceryList",
    getGroceryList,
  );

  const addMutation = useMutation(addGroceryItem, {
    onSuccess: () => {
      refetch();
      setNewProductName("");
    },
  });

  const updateMutation = useMutation(
    (data: { id: number; data: Partial<GroceryItem> }) =>
      updateGroceryItem(data.id, data.data),
    {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false);
      },
    },
  );

  const deleteMutation = useMutation(deleteGroceryItem, {
    onSuccess: () => refetch(),
  });

  const handleDeleteItem = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleMarkAsBought = (id: number, bought: boolean) => {
    updateMutation.mutate({ id, data: { bought } });
  };

  const handleIncrementAmount = (id: number, amount: number) => {
    updateMutation.mutate({ id, data: { amount: amount + 1 } });
  };

  const handleDecrementAmount = (id: number, amount: number) => {
    if (amount <= 1) {
      handleDeleteItem(id);
    } else {
      updateMutation.mutate({ id, data: { amount: amount - 1 } });
    }
  };

  const handleEditItem = (id: number) => {
    const selectedProduct = groceryList!.find((item) => item.id === id);

    if (selectedProduct) {
      setEditProduct({ id, name: selectedProduct.name });
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate({
      id: editProduct.id!,
      data: { name: editProduct.name },
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMutation.mutate({ name: newProductName, amount: 1, bought: false });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <main className={styles.main}>
      <Container>
        <Typography variant="h4" gutterBottom>
          My Grocery List
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Product Name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            aria-label="add product"
            disabled={!newProductName}
          >
            Add Product
          </Button>
        </form>
        <List>
          {groceryList?.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`${item.name} (${item.amount})`}
                style={{
                  textDecoration: item.bought ? "line-through" : "none",
                }}
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={item.bought}
                  onChange={(e) =>
                    handleMarkAsBought(item.id, e.target.checked)
                  }
                />
                <IconButton
                  onClick={() => handleIncrementAmount(item.id, item.amount)}
                  edge="end"
                  aria-label="increment"
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDecrementAmount(item.id, item.amount)}
                  edge="end"
                  aria-label="decrement"
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleEditItem(item.id)}
                  edge="end"
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteItem(item.id)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Container>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Item Title
          </Typography>
          <form onSubmit={handleModalSubmit}>
            <TextField
              label="New Title"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label="save product"
            >
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </main>
  );
}
