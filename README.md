# TrenchForge

TrenchForge is a WWI top-down hybrid game combining frontline tower defense with light city-builder logistics. This project is currently under development.

## Prerequisites

To run this project, you will need:
- [Node.js](https://nodejs.org/) (v18 or later is recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1.  Clone this repository to your local machine.
2.  Navigate into the project directory:
    ```sh
    cd trench-forge
    ```
3.  Install the required dependencies using npm:
    ```sh
    npm install
    ```

## Scripts

### Development
To run the application in development mode with hot-reloading, use:
```sh
npm run dev
```
The application will typically be available at `http://localhost:5173`.

### Build
To create a production-ready build of the application, run:
```sh
npm run build
```
The output files will be located in the `dist/` directory.

### Preview
To serve the production build locally for testing, use:
```sh
npm run preview
```

## Controls

### Development Controls
The scene currently uses developer-friendly controls for easy inspection:
- **Orbit:** Left-click and drag.
- **Pan:** Right-click and drag.
- **Zoom:** Scroll wheel.

### Planned Game Controls
The final game controls will be:
- **Pan Camera:** `W`, `A`, `S`, `D`
- **Zoom Camera:** `Q`, `E`
- **Orbit/Pan Modifier:** Right Mouse Drag
- **Enter Build Mode:** `B`
- **Trench Brush:** `1`
- **Barbed Wire:** `2`
- **MG Nest:** `3`
- **Bunker:** `4`
- **Cancel Action:** `ESC`
