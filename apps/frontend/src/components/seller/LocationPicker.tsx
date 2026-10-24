import { Platform } from 'react-native';

// Component for location picker.
const LocationPicker = Platform.OS === 'web'
    ? require('./LocationPicker.web').LocationPicker
    : require('./LocationPicker.native').LocationPicker;

export { LocationPicker };
