import React, { useState, useEffect } from 'react';
import {
  VStack,
  Heading,
  Input,
  Button,
  StackDivider,
  Box,
  Text,
  Grid,
  GridItem,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTodos, setFilteredTodos] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://todo-app-api-gepm.onrender.com/todo');
      setTodos(response.data.allTodo);
      filterTodos(searchTerm);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async () => {
    try {
      await axios.post('https://todo-app-api-gepm.onrender.com/todo/create', newTodo);
      fetchTodos();
      setNewTodo({ title: '', description: '' });
      toast({
        title: 'Todo created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating todo:', error);
      toast({
        title: 'An error occurred.',
        description: 'Failed to create todo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      await axios.patch(`https://todo-app-api-gepm.onrender.com/todo/${id}`, updatedTodo);
      fetchTodos();
      toast({
        title: 'Todo updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: 'An error occurred.',
        description: 'Failed to update todo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteTodo = async (_id) => {
    console.log(_id)
    try {
      await axios.delete(`https://todo-app-api-gepm.onrender.com/todo/${_id}`);
      fetchTodos();
      toast({
        title: 'Todo deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: 'An error occurred.',
        description: 'Failed to delete todo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterTodos(e.target.value);
  };

  const filterTodos = (searchTerm) => {
    const filtered = todos.filter((todo) => {
      const title = todo.title.toLowerCase();
      const description = todo.description.toLowerCase();
      return title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
    });
    setFilteredTodos(filtered);
  };

  const handleEdit = (id) => {
    const updatedTodo = prompt('Enter updated title:');
    if (updatedTodo) {
      updateTodo(id, { title: updatedTodo });
    }
  };

  const handleDelete = (_id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(_id);
    }
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Heading as="h1" size="xl" mb={8}>
        Todo Application
      </Heading>

      {/* Create Todo */}
      <VStack
        spacing={4}
        divider={<StackDivider borderColor="gray.200" />}
        align="stretch"
      >
        <Heading as="h2" size="lg" mb={4}>
          Create Todo
        </Heading>
        <Input
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <Button colorScheme="teal" onClick={createTodo}>
          Create
        </Button>
      </VStack>

      {/* Search */}
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        w="50%"
        mx="auto"
      />

      {/* List of Todos */}
      <VStack
        spacing={4}
        divider={<StackDivider borderColor="gray.200" />}
        align="stretch"
      >
        <Heading as="h2" size="lg" mb={4}>
          Todos
        </Heading>
        {todos.length === 0 ? (
          <Text>No todos found.</Text>
        ) : (
          todos.map((todo) => (
            
            <Box key={todo._id} p={4} borderWidth="1px" borderRadius="md">
              <Grid templateColumns="1fr auto">
                <GridItem>
                  <Text fontSize="xl" fontWeight="bold">
                    {todo.title}
                  </Text>
                  <Text>{todo.description}</Text>
                </GridItem>
                <GridItem>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit Todo"
                    onClick={() => handleEdit(todo.id)}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete Todo"
                    onClick={() => handleDelete(todo._id)}
                  />
                </GridItem>
              </Grid>
            </Box>
          ))
        )}
      </VStack>
    </VStack>
  );
};

export default TodoApp;
