const redis = require('redis');
const { promisify } = require('util');
const { Client } = require('@elastic/elasticsearch');

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const elasticClient = new Client({ node: 'http://localhost:9200' });


module.exports = {
    getAllTasks: async (req, res) => {
      try {
        const tasks = await getAsync('tasks');
        res.json(JSON.parse(tasks));
      } catch (error) {
        console.error('Error retrieving tasks from Redis:', error);
        res.status(500).json({ error: 'An error occurred while fetching tasks' });
      }
    },
  
    createTask: async (req, res) => {
      const { title, description } = req.body;
  
      // Validate input
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
  
      try {
        // Create a new task
        const task = {
          title,
          description,
        };
  
        // Store task in Redis
        await setAsync('tasks', JSON.stringify([task]));

         // Index task in ElasticSearch
      await elasticClient.index({
        index: 'tasks',
        body: task,
      });

      res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'An error occurred while creating the task' });
    }
  },

  deleteTask: async (req, res) => {
    const { taskId } = req.params;

    try {
      // Retrieve the current tasks from Redis
      const tasks = JSON.parse(await getAsync('tasks'));

      // Find the index of the task to delete
      const taskIndex = tasks.findIndex((task) => task.id === taskId);

      // Remove the task from the tasks array
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);

        // Update the tasks in Redis
        await setAsync('tasks', JSON.stringify(tasks));


        // Delete the task from ElasticSearch
        await elasticClient.deleteByQuery({
            index: 'tasks',
            body: {
              query: {
                match: { id: taskId },
              },
            },
          });
  
          res.json({ message: 'Task deleted successfully' });
        } else {
          res.status(404).json({ error: 'Task not found' });
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'An error occurred while deleting the task' });
      }
    },
  };