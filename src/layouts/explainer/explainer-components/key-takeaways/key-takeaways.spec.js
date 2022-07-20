import React from "react";
import KeyTakeaways from "./key-takeaways";
import { render } from '@testing-library/react';
import {faCoins} from "@fortawesome/free-solid-svg-icons";


describe('Key Takeaways', () => {
  const mockTakeaways = [
    {
      text: 'sample text',
      icon: faCoins
    },
    {
      text: 'more text',
      icon: faCoins
    }
  ]
  it('renders the text and icon for the given takeaways', () => {
    const { getByText,getAllByRole } = render(<KeyTakeaways takeaways={mockTakeaways} /> );
    expect(getByText('sample text')).toBeInTheDocument();
    expect(getByText('more text')).toBeInTheDocument();
    expect(getAllByRole('img', {hidden: true}, {name:'coins'})).toBeDefined();
  })
})
