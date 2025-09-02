import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showAuthToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
) {
  toast(message, { type });
}

export const AuthToastContainer: React.FC = () => (
  <ToastContainer position="bottom-right" autoClose={4000} />
);
