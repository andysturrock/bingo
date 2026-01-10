import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App, { generateNextNumber, getBingoCallName } from './App';

describe('Bingo Logic', () => {
  it('generateNextNumber returns a number within range', () => {
    const next = generateNextNumber([], 90);
    expect(next).toBeGreaterThanOrEqual(1);
    expect(next).toBeLessThanOrEqual(90);
  });

  it('generateNextNumber does not return already called numbers', () => {
    const called = [1, 2, 3];
    for (let i = 0; i < 100; i++) {
      const next = generateNextNumber(called, 5);
      if (next !== null) {
        expect(called).not.toContain(next);
      }
    }
  });

  it('getBingoCallName returns the correct name', () => {
    expect(getBingoCallName(1)).toBe("Kelly's Eye");
    expect(getBingoCallName(88)).toBe("Two Fat Ladies");
    expect(getBingoCallName(99)).toBe("");
  });
});

describe('Bingo Components', () => {
  it('renders the initial state correctly', () => {
    render(<App />);
    expect(screen.getByText(/Number Caller/i)).toBeInTheDocument();
    expect(screen.getByText(/Click "Next Number" to start!/i)).toBeInTheDocument();
  });

  it('generates a number and displays its call name when Next Number is clicked', () => {
    render(<App />);
    const nextButton = screen.getByRole('button', { name: /Next Number/i });

    fireEvent.click(nextButton);

    expect(screen.getByTestId('current-number')).toBeInTheDocument();
    expect(screen.getByTestId('call-name')).toBeInTheDocument();
    expect(screen.queryByText(/Click "Next Number" to start!/i)).not.toBeInTheDocument();
  });

  it('resets the game when Reset is clicked', () => {
    render(<App />);
    const nextButton = screen.getByRole('button', { name: /Next Number/i });

    fireEvent.click(nextButton);
    const resetButton = screen.getByRole('button', { name: /Reset Game/i });
    fireEvent.click(resetButton);

    expect(screen.getByText(/Click "Next Number" to start!/i)).toBeInTheDocument();
  });

  it('switches tabs to Printable Card', () => {
    render(<App />);
    const cardTabButton = screen.getByRole('button', { name: /Printable Card/i });

    fireEvent.click(cardTabButton);

    expect(screen.getByText(/BINGO \(1-/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Card/i })).toBeInTheDocument();
  });
  it('displays all numbers called message when game is complete', () => {
    render(<App />);
    const settingsInput = screen.getByLabelText(/Max Number:/i);
    fireEvent.change(settingsInput, { target: { value: '10' } });
    fireEvent.blur(settingsInput);

    const nextButton = screen.getByRole('button', { name: /Next Number/i });
    for (let i = 0; i < 10; i++) {
      fireEvent.click(nextButton);
    }

    expect(screen.getByRole('heading', { name: /All Numbers Called!/i })).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  it('updates bingo card when max number changes', () => {
    render(<App />);
    const cardTabButton = screen.getByRole('button', { name: /Printable Card/i });
    fireEvent.click(cardTabButton);

    expect(screen.getByText(/BINGO \(1-50\)/i)).toBeInTheDocument();

    const settingsInput = screen.getByLabelText(/Max Number:/i);
    fireEvent.change(settingsInput, { target: { value: '75' } });
    fireEvent.blur(settingsInput);

    expect(screen.getByText(/BINGO \(1-75\)/i)).toBeInTheDocument();
  });
});
