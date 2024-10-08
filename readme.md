# AREAHIIIIII

## Overview
This project aims to implement a software suite that functions similar to that of IFTT and/or Zapier. For now we have built basic pages to showcase the MVP, including login, signup, and workspace pages. We aim to create reusable components (e.g., buttons) for consistency across the app.

## Tech Stack
- **Front End**: React Native with Expo
- **Backend**: Express
- **Other Tools**: Docker for containerization, TypeScript for typed development, Github CI/CD for tests automations

## Folder Structure
- `client/`: Contains the main application (React Native code).
  - `app/`: Pages like login, signup, and workspace.
  - `components/`: Reusable components like buttons, containers, text fields.
  - `constants/`: Stores app-wide constants.
  - `hooks/`: Custom React hooks for state management or other logic.
  - `scripts/`: Helpful scripts (only reset project in there for now).
  - `client_web/` and `client_mobile/`: Platform-specific folders for web and mobile development.
- `server/`: Express backend.
- `SQL/`: Database-related scripts and queries.

## Getting Started

### Prerequisites
- **Node.js** (v18.0.0) and **npm** or **yarn**
- **Expo CLI**
- **Docker** (for containerized environments)

### Setup
1. Clone the repository:
   ```bash
   git clone git@github.com:azermid/AREAHIIIIII.git
   cd AREAHIIIIII
   ```
2. Set your .env values

3. Install dependencies and build the project's docker environment with our custom build
    ```bash
    ./build-dev.sh
   ```

# Everyday Use

For daily development, there are two main scripts to keep in mind:

### 1. `./build-dev.sh`
This script should be run when there are changes to the Docker environment or configuration files like `.env`, `docker-compose.yml`, or if any dependencies have been updated. It ensures the Docker containers are rebuilt with the latest changes.

Run it like this:
```bash
./build-dev.sh
```
### 2. `./run-dev.sh`

If no changes have been made to the Docker environment or configurations, and you're just looking to start the web server for local development, use the run-dev.sh script. This is faster than rebuilding the containers and is used for everyday code iteration.

## Components Overview

To keep the design consistent across the app while respecting light and dark themes, we have a set of themed UI components. These components help create a dynamic and responsive interface that adjusts based on the current theme, providing better user experience. Each component is built to be reusable and customizable, from basic views to input fields, and follows common patterns such as pressable buttons, dropdowns, and floating labels.

### 1. **ThemedBackground**
This component is used to provide a flexible background for the application, adapting to light and dark themes using `useThemeColor`. It adjusts the background and text colors accordingly.

Props:
- `lightColor`: Optional string for light theme background.
- `darkColor`: Optional string for dark theme background.


### 2. **ThemedButton**

This component is a customizable button that adapts to light and dark themes. It uses useThemeColor to adjust its colors based on the theme and provides a pressable interaction with feedback.

Props:
- `title`: The text displayed on the button.
- `lightColor`: Optional string for light theme background.
- `darkColor`: Optional string for dark theme background.
- `onPress`: Function that gets called when the button is pressed.

### 3. **ThemedContainer**

A flexible container component that supports optional borders and drop shadows. It adapts to light and dark themes using useThemeColor.

Props:
- `lightColor`: Optional string for light theme background.
- `darkColor`: Optional string for dark theme background.
- `border`: Boolean to show or hide the border.
- `dropShadow`: Boolean to enable or disable drop shadow.

### 4. **ThemedDropdown**

A dropdown menu that adapts to the current theme. It displays options and allows selection, calling an optional onChange function when an option is selected.

Props:
- `options`: An array of options, where each option has a label, value, and an onChange function.
- `lightColor`: Optional string for light theme background.
- `darkColor`: Optional string for dark theme background.

### 5. **ThemedField**

A themed text input field that adapts its colors based on the current theme. It includes a floating label that moves when the field is focused or has content.

Props:
- `field`: Label for the input field.
- `value`: The current text value of the input field.
- `onChange`: Function to handle changes in the input field.
- `secure`: Boolean to toggle secure text entry for password fields.
- `lightColor`: Optional string for light theme background.
- `darkColor`: Optional string for dark theme background.