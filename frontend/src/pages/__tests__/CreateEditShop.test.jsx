/**
 * CreateEditShop Page Tests - Restaurant profile setup
 * 
 * Tests: Form rendering, validation, image upload, create/update
 * Mocks: Axios for API, Redux store for owner data
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateEditShop from '../CreateEditShop';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

vi.mock('axios');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
    return {
        ...await vi.importActual('react-redux'),
        useDispatch: () => mockDispatch,
        useSelector: vi.fn(),
    };
});

global.URL.createObjectURL = vi.fn(() => 'blob:test');

describe('CreateEditShop Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders Create mode initially', () => {
        useSelector.mockReturnValue({
            myShopData: null,
            user: { currentCity: 'Mumbai', currentState: 'MH', currentAddress: 'Test Addr' }
        });

        render(
            <BrowserRouter>
                <CreateEditShop />
            </BrowserRouter>
        );

        expect(screen.getByText('Create Restaurant')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. The Spicy Spoon')).toHaveValue('');
    });

    it('renders Edit mode with existing data', () => {
        useSelector.mockReturnValue({
            myShopData: { 
                name: 'Existing Shop',
                city: 'Delhi',
                state: 'DL',
                address: 'Old Address',
                image: 'old.jpg'
            },
            user: {}
        });

        render(
            <BrowserRouter>
                <CreateEditShop />
            </BrowserRouter>
        );

        expect(screen.getByText('Edit Restaurant')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Shop')).toBeInTheDocument();
    });

    it('handles image upload and form submission', async () => {
        useSelector.mockReturnValue({ myShopData: null, user: {} });
        axios.post.mockResolvedValueOnce({ data: { name: 'New Shop' } });

        render(
            <BrowserRouter>
                <CreateEditShop />
            </BrowserRouter>
        );

        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
        
        const input = screen.getByLabelText((content, element) => {
            return element.tagName.toLowerCase() === 'input' && element.type === 'file';
        }); 
        
        const inputs = document.querySelectorAll('input[type="file"]');
        if(inputs.length > 0)
             fireEvent.change(inputs[0], { target: { files: [file] } });

        fireEvent.change(screen.getByPlaceholderText('e.g. The Spicy Spoon'), { target: { value: 'New Shop' } });
        fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } });
        fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } });
        fireEvent.change(screen.getByPlaceholderText('Complete address including pincode'), { target: { value: 'Address' } });

        const submitBtn = screen.getByText('Save Restaurant Details');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
