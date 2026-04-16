# Inventory Management App

A simple, lightweight web application for managing inventory. Built with Node.js, Express, and vanilla JavaScript.

## Features

- **View Inventory**: See a list of all items with their ID, name, quantity, and price.
- **Add Items**: Add new items to the inventory via a simple form.
- **Edit Items**: Update the details of existing items.
- **Delete Items**: Remove items from the inventory.
- **Persistent Backend**: Uses an Express server with an in-memory inventory (data resets on server restart).

## Tech Stack

- **Backend**: Node.js, Express, CORS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: Playwright

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository (if applicable) or copy the files.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### Running Tests

To run the end-to-end Playwright tests:
1. Ensure the server is running (`npm start`).
2. In a separate terminal, run:
   ```bash
   npx playwright test
   ```

## License

ISC
