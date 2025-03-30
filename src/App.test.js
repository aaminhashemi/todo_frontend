// App.test.js
import React from 'react'; // Ensure React is imported
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('App Component', () => {
  test('should render the form and table', async () => {
    // Mock the API response
    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Test Todo', due: '2025-03-30', status: 'pending' },
        ],
      },
    });

    // Render the App component
    render(<App />);

    // Wait for the data to be loaded into the table
    await waitFor(() => expect(screen.getByText(/Test Todo/i)).toBeInTheDocument());

    // Check if the 'Edit' button is rendered
    const editButton = screen.getByText(/Edit/i); // Use regex for more flexible matching

    // Ensure the 'Edit' button is visible when editingId is not set
    expect(editButton).toBeInTheDocument();
    expect(editButton).not.toHaveClass('d-none'); // Ensure 'Edit' button is visible

    // Simulate clicking the 'Edit' button
    fireEvent.click(editButton);

    // After the click, the editingId should be set, and the 'Edit' button should become hidden
    await waitFor(() => {
      expect(screen.queryByText(/Edit/i)).toHaveClass('d-none'); // Check that 'Edit' is hidden
    });

    // Check if the 'Update' button becomes visible after clicking 'Edit'
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  test('should update the status of a todo item', async () => {
    // Mock the API response for fetching the todo list
    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Test Todo', due: '2025-03-30', status: 'pending' },
        ],
      },
    });

    // Mock the API response for updating a todo item
    axios.post.mockResolvedValue({
      data: { data: { id: 1, title: 'Test Todo', due: '2025-03-30', status: 'completed' } },
      status: 200,
    });

    // Render the App component
    render(<App />);

    // Wait for the data to be loaded into the table
    await waitFor(() => expect(screen.getByText(/Test Todo/i)).toBeInTheDocument());

    // Find the Edit button and click it
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);

    // Wait for the 'Update' button to be visible after clicking 'Edit'
    await waitFor(() => {
      expect(screen.getByText('Update')).toBeInTheDocument();
    });

    // Select a new status for the todo item
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    // Click the 'Update' button to submit the status change
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    // Wait for the update to complete and check if the status has changed
    await waitFor(() => {
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
});
