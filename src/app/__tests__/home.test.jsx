import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../page'
 
describe('Home', () => {
  it('renders two buttons', () => {
    render(<Home />)
     const button = screen.getAllByRole('button')
     expect(button).toHaveLength(2)
  })
})