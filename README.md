# Inventory Management App

A simple, lightweight web application for managing inventory, including stock replenishment tracking from the store room.

## Features

- **View Inventory**: See a list of all items with their ID, name, quantity, price, and Person in Charge.
- **Add/Edit Items**: Manage inventory items and assign responsible persons.
- **Delete Items**: Remove items from the system.
- **Stock Replenishment**: Log stock additions from the store room to the kiosk, specifying the person responsible.
- **Replenishment Summary**: A dedicated report page showing monthly contributions to stock replenishment by person.

## Tech Stack

- **Backend**: Node.js, Express, CORS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: Playwright

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Install dependencies:
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
1. Ensure the server is running.
2. Run:
   ```bash
   npm test
   ```

## License

ISC
