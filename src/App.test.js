import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';

// Mock axios
const mock = new axiosMockAdapter(axios);

// Test suite
describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mock.reset();
  });

  it('should render the form and table', () => {
    render(<App />);

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Due date')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();

    // Check if table headers are rendered
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should fetch and display todo items', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', due: '2025/03/30', status: 'pending' },
      { id: 2, title: 'Test Todo 2', due: '2025/04/01', status: 'completed' },
    ];

    // Mock API response
    mock.onGet('https://todo-backend-1-g56h.onrender.com/api/todo/list').reply(200, { data: todos });

    render(<App />);

    // Wait for the data to load
    await waitFor(() => expect(screen.getByText('Test Todo 1')).toBeInTheDocument());
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('should add a new todo item', async () => {
    mock.onPost('https://todo-backend-1-g56h.onrender.com/api/todo/create').reply(201, { data: { id: 3, title: 'New Todo', due: '2025/05/01', status: 'pending' } });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value: 'New Todo' } });
    fireEvent.change(screen.getByPlaceholderText('Due date'), { target: { value: '2025/05/01' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => expect(screen.getByText('New Todo')).toBeInTheDocument());
  });

  it('should delete a todo item', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', due: '2025/03/30', status: 'pending' },
    ];

    mock.onGet('https://todo-backend-1-g56h.onrender.com/api/todo/list').reply(200, { data: todos });
    mock.onPost('https://todo-backend-1-g56h.onrender.com/api/todo/delete').reply(200, {});

    render(<App />);

    // Simulate clicking delete button
    fireEvent.click(screen.getByText('Delete'));

    // Mocking Swal.fire
    Swal.fire = jest.fn().mockResolvedValue({ isConfirmed: true });

    await waitFor(() => expect(screen.queryByText('Test Todo 1')).toBeNull());
  });

  it('should update the status of a todo item', async () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', due: '2025/03/30', status: 'pending' },
    ];

    mock.onGet('https://todo-backend-1-g56h.onrender.com/api/todo/list').reply(200, { data: todos });
    mock.onPost('https://todo-backend-1-g56h.onrender.com/api/todo/update').reply(200, {});

    render(<App />);

    fireEvent.click(screen.getByText('Edit'));

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'completed' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => expect(screen.getByText('completed')).toBeInTheDocument());
  });
});
