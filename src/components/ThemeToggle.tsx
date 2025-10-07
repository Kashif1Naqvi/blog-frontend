import { useState } from 'react';
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, actualTheme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: LightModeIcon },
    { value: 'dark', label: 'Dark', icon: DarkModeIcon },
    { value: 'system', label: 'System', icon: SettingsBrightnessIcon },
  ];

  const currentIcon = actualTheme === 'light' ? LightModeIcon : DarkModeIcon;
  const CurrentIcon = currentIcon;

  return (
    <div className="theme-toggle-container">
      <Dropdown
        show={showDropdown}
        onToggle={(show) => setShowDropdown(show)}
        align="end"
      >
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Change Theme</Tooltip>}
        >
          <Dropdown.Toggle
            as={Button}
            variant="link"
            className="theme-toggle-btn"
            id="theme-dropdown"
          >
            <CurrentIcon className="theme-icon" />
          </Dropdown.Toggle>
        </OverlayTrigger>

        <Dropdown.Menu className="theme-dropdown-menu">
          <div className="theme-menu-header">
            <h6>Choose Theme</h6>
          </div>
          
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Dropdown.Item
                key={option.value}
                className={`theme-option ${theme === option.value ? 'active' : ''}`}
                onClick={() => setTheme(option.value as any)}
              >
                <IconComponent className="option-icon" />
                <span className="option-label">{option.label}</span>
                {theme === option.value && (
                  <div className="option-check">✓</div>
                )}
              </Dropdown.Item>
            );
          })}
          
          <div className="theme-menu-footer">
            <small>Current: {actualTheme} mode</small>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ThemeToggle;