import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
  MyInput: componentLoader.add('MyInput', './my-input'),
  Dashboard: componentLoader.add('Dashboard', './dashboard'),
};

export { componentLoader, Components };
