# Smart Health Assistant

A web-based application designed to provide health-related assistance.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Smart Health Assistant is a web-based application designed to empower users with tools for managing their health and nutrition. This application provides functionalities such as a Recipe Finder, a Calories Calculator, and a feature to capture screenshots of nutrition labels. Built with modern web technologies, it aims to offer a seamless and intuitive user experience for health-conscious individuals.

## Features

- **Recipe Finder**: Allows users to find recipes based on meal type, ingredients, and dietary restrictions.
- **Calories Calculator**: Provides tools to calculate calories from food and determine personal calorie needs.
- **Nutrition Label Screenshot**: Enables users to capture and analyze nutrition information from images.
- **Intuitive User Interface**: Designed with a clean, modern, and health-focused theme for ease of use.
- **Responsive Design**: Ensures optimal viewing and interaction across various devices (mobile, tablet, desktop).
- **Component-Based Architecture**: Utilizes React components for modular and maintainable code.
- **API Integration**: Connects with external services for recipe and nutrition data (e.g., `aiRecipeService.ts`, `foodNutritionService.ts`).

## Installation

Instructions on how to install and set up the project.

### Prerequisites

List any prerequisites here (e.g., Node.js, npm/pnpm).

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-health-assistant.git
   cd smart-health-assistant
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

To run the Smart Health Assistant in development mode, navigate to the root directory of the project and execute the following command:

```bash
pnpm dev
```

This will start the development server, and the application should be accessible in your web browser, typically at `http://localhost:5173/` (or another port if 5173 is in use).

If you are on a Windows system, you can also use the provided batch script to run the application:

```bash
cd scripts
run-health-assistant.bat
```

This script might automate additional setup or environment configurations. For detailed usage of specific features like the Recipe Finder or Calories Calculator, please refer to the application's interface once it is running.

## Project Structure

```
. (root directory)
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── index.css
│   ├── lib/
│   ├── main.tsx
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── vite-env.d.ts
├── scripts/
│   └── run-health-assistant.bat
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── site_structure.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Contributing

We welcome contributions to the Smart Health Assistant project! To contribute, please follow these steps:

1.  **Fork the repository**: Start by forking the main repository to your GitHub account.
2.  **Clone your fork**: Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/your-username/smart-health-assistant.git
    cd smart-health-assistant
    ```
3.  **Create a new branch**: Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4.  **Make your changes**: Implement your changes and ensure they adhere to the project's coding standards.
5.  **Test your changes**: Run tests to ensure your changes haven't introduced any regressions.
6.  **Commit your changes**: Commit your changes with a clear and concise commit message:
    ```bash
    git commit -m "feat: Add new feature" # or "fix: Resolve bug"
    ```
7.  **Push to your branch**: Push your changes to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request**: Go to the original repository on GitHub and open a pull request from your new branch. Provide a detailed description of your changes.

## License

This project is open-source and licensed under the MIT License. You can find the full text of the license in the `LICENSE` file in the root of the repository.


