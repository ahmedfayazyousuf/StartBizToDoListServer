// admin/components.js
import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

// Register the custom components
const Components = {
  MyInput: componentLoader.add('MyInput', './my-input'), // Ensure correct path
  Dashboard: componentLoader.add('Dashboard', './dashboard'), // Ensure correct path
};

export { componentLoader, Components };
