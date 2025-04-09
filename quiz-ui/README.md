# Quiz UI

This project is a part of the Adventure Cloud Workshop and contains the Quiz UI component.

## Features

- Interactive quiz interface.
- Dynamic question rendering.
- Score calculation and display.

## File Overview

- **quiz.tsx**: Contains the main logic for rendering the quiz, handling user interactions, and managing state.

## Prerequisites

- Node.js (version 16 or higher recommended)
- pnpm

## Setup and Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yogesh-kumarasamy/cloud-workshop-adventure.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open the application in your browser at `http://localhost:5173/`.
5. Login credential is admin/password123

## Building for Production

To build the application for production, run:
```bash
npm run build
# or
yarn build
```

The production-ready files will be available in the `build` directory.

## Testing

To run tests for the application:
```bash
npm test
# or
yarn test
```

## Folder Structure

- `src/quiz.tsx`: Main component for the quiz functionality.
- `public/`: Static assets for the application.
- `src/`: Contains all React components, styles, and utilities.

## Contribution

Feel free to fork the repository and submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
