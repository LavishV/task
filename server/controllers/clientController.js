import Client from '../models/Client.js';
import { unlink } from 'fs/promises';
import path from 'path';

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, designation, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const client = new Client({
      name,
      designation,
      description,
      imageUrl,
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, description } = req.body;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (req.file) {
      if (client.imageUrl) {
        const oldPath = path.join(process.cwd(), 'uploads', client.imageUrl.split('/').pop());
        try {
          await unlink(oldPath);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
      client.imageUrl = `/uploads/${req.file.filename}`;
    }

    client.name = name || client.name;
    client.designation = designation || client.designation;
    client.description = description || client.description;
    await client.save();

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.imageUrl) {
      const filePath = path.join(process.cwd(), 'uploads', client.imageUrl.split('/').pop());
      try {
        await unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await Client.findByIdAndDelete(id);
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
