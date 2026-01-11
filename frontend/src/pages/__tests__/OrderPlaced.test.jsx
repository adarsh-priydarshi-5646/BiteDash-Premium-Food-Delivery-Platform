/**
 * OrderPlaced Page Tests - Order confirmation screen
 * 
 * Tests: Success message, order ID display, Stripe payment verification
 * Mocks: Axios for payment verification, React Router navigation
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderPlaced from '../OrderPlaced';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');
const mockNavigate = vi.fn();

let mockSearchParams = new URLSearchParams();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [mockSearchParams],
    };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
    return {
        ...await vi.importActual('react-redux'),
        useDispatch: () => mockDispatch,
    };
});

describe('OrderPlaced Component', () => {
    it('renders success message (COD/Direct)', () => {
        mockSearchParams = new URLSearchParams(); // No params
        
        render(
            <BrowserRouter>
                <OrderPlaced />
            </BrowserRouter>
        );

        expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
        expect(screen.getByText('View My Orders')).toBeInTheDocument();
    });

    it('verifies payment when query params exist', async () => {
        mockSearchParams = new URLSearchParams('?orderId=123&session_id=abc');
        axios.post.mockResolvedValueOnce({ data: { _id: 'order-123' } });

        render(
            <BrowserRouter>
                <OrderPlaced />
            </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/verify-stripe-payment'),
                { orderId: '123', sessionId: 'abc' },
                expect.anything()
            );
            expect(mockDispatch).toHaveBeenCalledTimes(2); // addMyOrder + clearCart
        });
    });

    it('navigates to My Orders', () => {
        mockSearchParams = new URLSearchParams();
        
        render(
            <BrowserRouter>
                <OrderPlaced />
            </BrowserRouter>
        );
        
        const btn = screen.getByText('View My Orders');
        fireEvent.click(btn);
        
        expect(mockNavigate).toHaveBeenCalledWith('/my-orders');
    });
});
