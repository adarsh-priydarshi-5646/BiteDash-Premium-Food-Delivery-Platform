/**
 * ForgotPassword Page Tests - Password reset flow
 * 
 * Tests: Email input, OTP verification, new password submission
 * Mocks: Axios for API calls, React Router navigation
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPassword from '../ForgotPassword';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});
vi.mock('react-icons/io', () => ({
    IoIosArrowRoundBack: () => <div>Back</div>
}));

describe('ForgotPassword Component', () => {
    it('flow: sends otp -> verifies otp -> resets password', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        );

        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Enter your Email'), { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByText('Send Otp'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/send-otp'),
                expect.anything(),
                expect.anything()
            );
        });

        await waitFor(() => expect(screen.getByPlaceholderText('Enter OTP')).toBeInTheDocument());
        
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        fireEvent.change(screen.getByPlaceholderText('Enter OTP'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Verify'));

        await waitFor(() => expect(screen.getByPlaceholderText('Enter New Password')).toBeInTheDocument());
        
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        fireEvent.change(screen.getByPlaceholderText('Enter New Password'), { target: { value: 'newpass123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpass123' } });
        fireEvent.click(screen.getByText('Reset Password'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(3);
        });
    });
});
